"use client";
import { useState } from 'react';
import { PencilIcon, TrashIcon, EnvelopeIcon, PhoneIcon, UserCircleIcon, PlusIcon, FunnelIcon, MagnifyingGlassIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

type UserRole = 'admin' | 'yönetici' | 'çalışan';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: UserRole;
  status: 'aktif' | 'pasif';
  lastLogin: string;
};

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const router = useRouter();
  
  const handleAddUser = () => {
    router.push('/users/new');
  };

  // Örnek kullanıcı verileri
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet.yilmaz@example.com',
      phone: '+90 555 123 45 67',
      department: 'Bilgi Teknolojileri',
      position: 'Frontend Geliştirici',
      role: 'admin',
      status: 'aktif',
      lastLogin: '2023-11-05T14:30:00',
    },
    {
      id: 2,
      name: 'Ayşe Kaya',
      email: 'ayse.kaya@example.com',
      phone: '+90 555 234 56 78',
      department: 'İnsan Kaynakları',
      position: 'İK Uzmanı',
      role: 'yönetici',
      status: 'aktif',
      lastLogin: '2023-11-06T09:15:00',
    },
    {
      id: 3,
      name: 'Mehmet Demir',
      email: 'mehmet.demir@example.com',
      phone: '+90 555 345 67 89',
      department: 'Satış',
      position: 'Satış Temsilcisi',
      role: 'çalışan',
      status: 'aktif',
      lastLogin: '2023-11-04T16:45:00',
    },
    {
      id: 4,
      name: 'Zeynep Şahin',
      email: 'zeynep.sahin@example.com',
      phone: '+90 555 456 78 90',
      department: 'Muhasebe',
      position: 'Muhasebe Uzmanı',
      role: 'çalışan',
      status: 'pasif',
      lastLogin: '2023-10-28T11:20:00',
    },
  ]);

  // Filtreleme işlevi
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       user.phone.includes(searchTerm);
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const roleStyles = {
      'admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'yönetici': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'çalışan': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    };
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyles[role]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === 'aktif' ? (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300">
        Aktif
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        Pasif
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            title="Ana Sayfaya Dön"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kullanıcı Yönetimi</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Sistem kullanıcılarını yönetin ve izinleri düzenleyin
            </p>
          </div>
        </div>
        <button
          onClick={handleAddUser}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Yeni Kullanıcı Ekle
        </button>
      </div>

      {/* Filtreleme ve Arama */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:flex sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-md border-gray-300 bg-white pl-10 pr-3 py-2 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mt-4 flex space-x-3 sm:mt-0">
          <div className="w-full sm:w-40">
            <select
              id="role"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">Tüm Roller</option>
              <option value="admin">Admin</option>
              <option value="yönetici">Yönetici</option>
              <option value="çalışan">Çalışan</option>
            </select>
          </div>
          <div className="w-full sm:w-32">
            <select
              id="status"
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tümü</option>
              <option value="aktif">Aktif</option>
              <option value="pasif">Pasif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kullanıcı Listesi */}
      <div className="overflow-hidden bg-white shadow sm:rounded-lg dark:bg-gray-800">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Kullanıcı
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    İletişim
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Departman / Pozisyon
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Rol / Durum
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                    Son Giriş
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">İşlemler</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <EnvelopeIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="mt-1 flex items-center">
                          <PhoneIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{user.department}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.position}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="space-y-1">
                        {getRoleBadge(user.role)}
                        <div className="mt-1">
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.lastLogin)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => router.push(`/users/edit/${user.id}`)}
                          className="rounded-md p-1.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
                          title="Düzenle"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="rounded-md p-1.5 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                          title="Sil"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              Kullanıcı bulunamadı
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Arama kriterlerinize uygun kullanıcı bulunamadı.
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('all');
                  setSelectedStatus('all');
                }}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                <FunnelIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                Filtreleri Temizle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* İstatistikler */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Toplam Kullanıcı
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {users.length}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Aktif Kullanıcı
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600 dark:text-green-400">
            {users.filter(u => u.status === 'aktif').length}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Yönetici
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-purple-600 dark:text-purple-400">
            {users.filter(u => u.role === 'yönetici' || u.role === 'admin').length}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow dark:bg-gray-800 sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
            Son Eklenen
          </dt>
          <dd className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
            {users.length > 0 ? users[users.length - 1].name : 'Yok'}
          </dd>
          <dd className="text-sm text-gray-500 dark:text-gray-400">
            {users.length > 0 ? users[users.length - 1].department : ''}
          </dd>
        </div>
      </div>
    </div>
  );
}