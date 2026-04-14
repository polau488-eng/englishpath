"use client";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { user, setUser } = useAppStore();
  const [dailyGoal, setDailyGoal] = useState(15);
  const [notifications, setNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState("20:00");

  function save() {
    toast.success("Đã lưu cài đặt!");
  }

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Cài đặt" />
      <div className="p-6 max-w-2xl mx-auto w-full space-y-5">

        {/* Account */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Tài khoản</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Tên hiển thị</label>
              <input type="text" defaultValue={user.name} className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
              <input type="email" defaultValue={user.email} className="input-field" />
            </div>
          </div>
        </div>

        {/* Learning goals */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Mục tiêu học tập</h3>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">Thời gian học mỗi ngày</label>
            <div className="flex gap-2">
              {[5, 10, 15, 20, 30].map((m) => (
                <button key={m} onClick={() => setDailyGoal(m)}
                  className={cn("px-4 py-2 rounded-xl text-sm font-medium border transition-all",
                    dailyGoal === m ? "bg-brand-600 text-white border-brand-600" : "bg-white text-gray-600 border-gray-200"
                  )}>
                  {m}p
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Thông báo</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-gray-800 text-sm">Nhắc nhở học hàng ngày</p>
              <p className="text-xs text-gray-500">Nhận thông báo để duy trì streak</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={cn("w-12 h-6 rounded-full transition-all relative", notifications ? "bg-brand-600" : "bg-gray-200")}
            >
              <span className={cn("absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all", notifications ? "left-6.5" : "left-0.5")} />
            </button>
          </div>
          {notifications && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Giờ nhắc nhở</label>
              <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} className="input-field w-auto" />
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="card p-5 border-red-100">
          <h3 className="font-semibold text-red-700 mb-3">Vùng nguy hiểm</h3>
          <button className="btn-secondary text-red-600 border-red-200 hover:bg-red-50 text-sm">
            Đặt lại tiến độ học
          </button>
        </div>

        <button onClick={save} className="btn-primary w-full justify-center py-3">
          Lưu cài đặt
        </button>
      </div>
    </div>
  );
}
