"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock, Users as UsersIcon, CalendarCheck, Users, CalendarRange, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Shift {
  id: number;
  date: string;
  start: string;
  end: string;
  type: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);

  const navigateTo = (path: string) => router.push(path);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await fetch('/api/v1/shifts');
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || 'Vardiyalar yüklenirken bir hata oluştu');
        }
        const data = await res.json();
        
        // Format the shifts data to match the expected structure
        const formattedShifts = data.map((shift: any) => ({
          id: shift.id,
          date: new Date(shift.start_time).toLocaleDateString('tr-TR'),
          start: new Date(shift.start_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          end: new Date(shift.end_time).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
          type: getShiftType(shift.start_time)
        }));

        // Filter for upcoming shifts in the next 7 days
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const next7Days = new Date();
        next7Days.setDate(today.getDate() + 7);
        next7Days.setHours(23, 59, 59, 999);

        const upcoming = formattedShifts.filter((shift: any) => {
          const shiftDate = new Date(shift.date);
          return new Date(shiftDate) >= today && new Date(shiftDate) <= next7Days;
        });

        setShifts(upcoming);
      } catch (err) {
        console.error('Vardiya yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, []);

  const getShiftType = (startTime: string) => {
    const hours = new Date(startTime).getHours();
    if (hours >= 6 && hours < 14) return 'Sabah';
    if (hours >= 14 && hours < 22) return 'Akşam';
    return 'Gece';
  };

  const stats = [
    { name: "Bu Hafta Çalışma Saati", value: "32 saat", icon: Clock },
    { name: "Aktif Çalışan", value: "24", icon: Users },
    { name: "Bu Ayki Vardiyalar", value: "12", icon: CalendarDays, path: "/shifts" },
    { name: "Bekleyen İzinler", value: "5", icon: CalendarCheck },
    { name: "Vardiya Değişim İstekleri", value: "3", icon: CalendarRange, path: "/shift-swaps" },
  ];

  return (
    <div className="p-6">
      {/* Başlık */}
      <div className="mb-8 flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          title="Geri Dön"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Genel Bakış</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Son aktiviteleriniz ve istatistikleriniz
          </p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              onClick={() => stat.path && navigateTo(stat.path)}
              className={`overflow-hidden rounded-lg bg-white px-4 py-5 shadow transition-colors duration-200 ${
                stat.path ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""
              } dark:bg-gray-800 sm:p-6`}
            >
              <dt className="flex items-center">
                <div className="rounded-md bg-blue-500 p-3">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-4 truncate text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                {stat.path && <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">Görüntüle →</span>}
              </dd>
            </div>
          );
        })}
      </div>

      {/* Hızlı Erişim Butonları */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <button
          onClick={() => navigateTo("/users")}
          className="group relative overflow-hidden rounded-lg bg-white p-6 shadow transition-all duration-200 hover:shadow-md dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Kullanıcılar</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kullanıcıları yönetin</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigateTo("/shifts")}
          className="group relative overflow-hidden rounded-lg bg-white p-6 shadow transition-all duration-200 hover:shadow-md dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <div className="flex items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <CalendarRange className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vardiyalar</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Vardiyaları yönetin</p>
            </div>
          </div>
        </button>
      </div>

      {/* Yaklaşan Vardiyalar */}
      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Yaklaşan Vardiyalar</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Önümüzdeki 7 gün içindeki vardiyalarınız</p>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          {loading ? (
            <p className="p-4 text-center text-gray-500 dark:text-gray-400">Yükleniyor...</p>
          ) : shifts.length === 0 ? (
            <p className="p-4 text-center text-gray-500 dark:text-gray-400">Yaklaşan vardiya yok</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {shifts.map((shift) => (
                <li key={shift.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{shift.date}</p>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {shift.start} - {shift.end} • {shift.type}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                  >
                    Detay
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
