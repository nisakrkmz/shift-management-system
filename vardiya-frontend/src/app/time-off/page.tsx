import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon, ClockIcon, PlusIcon, CalendarIcon } from '@heroicons/react/24/outline';

type TimeOffRequest = {
  id: number;
  employee: string;
  type: 'yıllık izin' | 'ücretsiz izin' | 'hastalık' | 'diğer';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  reason?: string;
};

export default function TimeOffPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    type: 'yıllık izin',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Örnek izin talepleri
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([
    {
      id: 1,
      employee: 'Ahmet Yılmaz',
      type: 'yıllık izin',
      startDate: '2023-12-15',
      endDate: '2023-12-22',
      days: 7,
      status: 'pending',
      submittedDate: '2023-11-01',
      reason: 'Tatil planı'
    },
    {
      id: 2,
      employee: 'Ayşe Kaya',
      type: 'hastalık',
      startDate: '2023-11-10',
      endDate: '2023-11-12',
      days: 2,
      status: 'approved',
      submittedDate: '2023-10-28'
    },
    {
      id: 3,
      employee: 'Mehmet Demir',
      type: 'ücretsiz izin',
      startDate: '2023-12-01',
      endDate: '2023-12-01',
      days: 1,
      status: 'rejected',
      submittedDate: '2023-10-25',
      reason: 'Özel gün'
    },
  ]);

  const filteredRequests = activeTab === 'all' 
    ? timeOffRequests 
    : timeOffRequests.filter(req => req.status === activeTab);

  const handleApprove = (id: number) => {
    setTimeOffRequests(requests => 
      requests.map(req => 
        req.id === id ? { ...req, status: 'approved' as const } : req
      )
    );
  };

  const handleReject = (id: number) => {
    setTimeOffRequests(requests => 
      requests.map(req => 
        req.id === id ? { ...req, status: 'rejected' as const } : req
      )
    );
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Burada API çağrısı yapılacak
    const newRequest: TimeOffRequest = {
      id: timeOffRequests.length + 1,
      employee: 'Mevcut Kullanıcı', // Gerçek kullanıcı adı ile değiştirilecek
      type: formData.type as any,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      reason: formData.reason
    };
    
    setTimeOffRequests([newRequest, ...timeOffRequests]);
    setFormData({ type: 'yıllık izin', startDate: '', endDate: '', reason: '' });
    setShowNewRequestForm(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <ClockIcon className="mr-1 h-3 w-3" />
            Bekliyor
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircleIcon className="mr-1 h-3 w-3" />
            Onaylandı
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <XCircleIcon className="mr-1 h-3 w-3" />
            Reddedildi
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeStyles = {
      'yıllık izin': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'ücretsiz izin': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'hastalık': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
      'diğer': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeStyles[type as keyof typeof typeStyles] || ''}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">İzin Yönetimi</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            İzin taleplerinizi yönetin ve takip edin
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewRequestForm(!showNewRequestForm)}
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
          Yeni İzin Talebi
        </button>
      </div>

      {/* Yeni İzin Talebi Formu */}
      {showNewRequestForm && (
        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Yeni İzin Talebi</h3>
            <form onSubmit={handleSubmitRequest} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    İzin Türü
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  >
                    <option value="yıllık izin">Yıllık İzin</option>
                    <option value="ücretsiz izin">Ücretsiz İzin</option>
                    <option value="hastalık">Hastalık</option>
                    <option value="diğer">Diğer</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Başlangıç Tarihi
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="date"
                      id="startDate"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      required
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bitiş Tarihi
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <input
                      type="date"
                      id="endDate"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      min={formData.startDate}
                      className="block w-full rounded-md border-gray-300 pl-3 pr-10 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                      required
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Açıklama (İsteğe Bağlı)
                  </label>
                  <textarea
                    id="reason"
                    rows={3}
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                    placeholder="İzin talebinizin sebebini kısaca açıklayın..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewRequestForm(false)}
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Talep Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filtreleme sekmeleri */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { name: 'Tümü', value: 'all', count: timeOffRequests.length },
            { 
              name: 'Bekleyen', 
              value: 'pending', 
              count: timeOffRequests.filter(req => req.status === 'pending').length 
            },
            { 
              name: 'Onaylanan', 
              value: 'approved', 
              count: timeOffRequests.filter(req => req.status === 'approved').length 
            },
            { 
              name: 'Reddedilen', 
              value: 'rejected', 
              count: timeOffRequests.filter(req => req.status === 'rejected').length 
            },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as any)}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === tab.value
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300'
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* İzin talepleri listesi */}
      <div className="overflow-hidden bg-white shadow dark:bg-gray-800 sm:rounded-lg">
        {filteredRequests.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRequests.map((request) => (
              <li key={request.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.employee}
                      </p>
                      <div className="ml-2 flex flex-shrink-0">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        <span>
                          {new Date(request.startDate).toLocaleDateString('tr-TR')} - {new Date(request.endDate).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <span>•</span>
                      <div>
                        {request.days} gün
                      </div>
                      <span>•</span>
                      <div>
                        {getTypeBadge(request.type)}
                      </div>
                    </div>
                    {request.reason && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Açıklama:</span> {request.reason}
                      </p>
                    )}
                  </div>
                  {request.status === 'pending' && (
                    <div className="ml-4 flex flex-shrink-0 space-x-2">
                      <button
                        type="button"
                        onClick={() => handleApprove(request.id)}
                        className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-1.5 text-sm font-medium text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/50"
                      >
                        <CheckCircleIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                        Onayla
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(request.id)}
                        className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50"
                      >
                        <XCircleIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                        Reddet
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-right text-xs text-gray-500 dark:text-gray-400">
                  Talep Tarihi: {new Date(request.submittedDate).toLocaleDateString('tr-TR')}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              İzin talebi bulunamadı
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {activeTab === 'all'
                ? 'Henüz hiç izin talebi oluşturulmamış.'
                : `Hiç ${activeTab === 'pending' ? 'bekleyen' : activeTab} izin talebi bulunmuyor.`}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowNewRequestForm(true)}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" />
                Yeni İzin Talebi
              </button>
            </div>
          </div>
        )}
      </div>

      {/* İzin Durumu Özeti */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Toplam Kullanılan İzin
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            12 gün
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Kalan Yıllık İzin
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600 dark:text-green-400">
            8 gün
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Onay Bekleyen
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-yellow-600 dark:text-yellow-400">
            2 talep
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Gelecek İzin
          </dt>
          <dd className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
            15-22 Ara 2023
          </dd>
          <dd className="text-sm text-gray-500 dark:text-gray-400">7 gün</dd>
        </div>
      </div>
    </div>
  );
}