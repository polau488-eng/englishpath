import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/stripe — create checkout session
export async function POST(req: NextRequest) {
  try {
    const { userId, plan, email } = await req.json();

    // Dynamic import Stripe to avoid build issues when key not set
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });

    const PLANS: Record<string, { price: string; name: string }> = {
      premium: { price: process.env.STRIPE_PREMIUM_PRICE_ID!, name: "EnglishPath Premium" },
      pro:     { price: process.env.STRIPE_PRO_PRICE_ID!,     name: "EnglishPath Pro" },
    };

    const planConfig = PLANS[plan];
    if (!planConfig) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    // Get or create Stripe customer
    let customerId: string | undefined;
    const { data: sub } = await supabase.from("subscriptions").select("stripe_customer_id").eq("user_id", userId).single();
    if (sub?.stripe_customer_id) {
      customerId = sub.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({ email, metadata: { supabase_user_id: userId } });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: planConfig.price, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&plan=${plan}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: { user_id: userId, plan },
      subscription_data: { metadata: { user_id: userId, plan } },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

// Webhook handler (mount at /api/stripe/webhook separately if needed)
export async function PUT(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature")!;

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-04-10" });
    const event  = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as { metadata?: { user_id?: string; plan?: string }; customer?: string; subscription?: string };
      const userId  = session.metadata?.user_id;
      const plan    = session.metadata?.plan ?? "premium";
      if (!userId) return NextResponse.json({ received: true });

      // Upsert subscription
      await supabase.from("subscriptions").upsert({
        user_id: userId,
        stripe_customer_id: session.customer as string,
        stripe_sub_id: session.subscription as string,
        plan, status: "active",
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: "user_id" });

      // Mark user as premium
      await supabase.from("users").update({
        is_premium: true,
        premium_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }).eq("id", userId);
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as { metadata?: { user_id?: string } };
      const userId = sub.metadata?.user_id;
      if (userId) {
        await supabase.from("users").update({ is_premium: false, premium_until: null }).eq("id", userId);
        await supabase.from("subscriptions").update({ status: "canceled", plan: "free" }).eq("user_id", userId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
