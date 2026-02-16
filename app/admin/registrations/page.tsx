// app/admin/registrations/page.tsx - REGISTRATION VIEWER
'use client';

import { useEffect, useState } from 'react';
import { FaDownload, FaFilter, FaCalendar, FaUser, FaDollarSign, FaArrowLeft, FaClipboardList, FaChartBar, FaSync, FaTicket } from 'react-icons/fa';
import Link from 'next/link';

interface Registration {
  id: number;
  eventId: number;
  name: string;
  email: string;
  amountPaid: number;
  status: 'pending' | 'completed' | 'refunded' | 'expired';
  createdAt: string;
  updatedAt: string;
  ticketCode: string | null;
  stripeSessionId: string | null;
  event: {
    id: number;
    title: string;
    slug: string;
    startDate: string;
    location: string;
    venue: string | null;
    cover: string | null;
    isFree: boolean;
    ticketPrice: string | null;
  } | null;
}

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  /* ---------- load data ---------- */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/registrations/all');
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load registrations');
      }
      
      if (Array.isArray(data)) {
        setRegistrations(data);
        console.log(`Loaded ${data.length} registrations`);
      } else {
        console.error('Unexpected data format:', data);
        setError('Unexpected data format from API');
      }
    } catch (e: any) {
      console.error('Failed to load data:', e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- computed ---------- */
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesEvent = selectedEvent === 'all' || reg.eventId === selectedEvent;
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    return matchesEvent && matchesStatus;
  });

  // Convert cents to dollars for display
  const centsToDollars = (cents: number | null) => ((cents || 0) / 100).toFixed(2);

  const stats = {
    total: filteredRegistrations.length,
    totalRevenue: filteredRegistrations
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + (r.amountPaid || 0), 0) / 100,
    pendingRevenue: filteredRegistrations
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + (r.amountPaid || 0), 0) / 100,
    pending: filteredRegistrations.filter(r => r.status === 'pending').length,
    completed: filteredRegistrations.filter(r => r.status === 'completed').length,
    expired: filteredRegistrations.filter(r => r.status === 'expired').length,
    freeCount: filteredRegistrations.filter(r => (r.amountPaid || 0) === 0).length,
  };

  // Get unique events for filter
  const uniqueEvents = Array.from(new Map(registrations.map(r => [r.eventId, r.event])).values());

  /* ---------- export CSV ---------- */
  const exportCSV = () => {
    const headers = ['ID', 'Ticket Code', 'Event', 'Attendee', 'Email', 'Amount ($)', 'Status', 'Created At', 'Stripe Session'];
    const rows = filteredRegistrations.map(r => [
      r.id,
      r.ticketCode ? `NIH-${r.ticketCode}` : '',
      r.event?.title || 'Unknown',
      r.name,
      r.email,
      centsToDollars(r.amountPaid),
      r.status,
      new Date(r.createdAt).toLocaleString(),
      r.stripeSessionId || '',
    ]);
    
    const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- status badge ---------- */
  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      refunded: 'bg-blue-100 text-blue-800 border-blue-200',
      expired: 'bg-red-100 text-red-800 border-red-200',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="h-10 bg-gray-200 rounded mb-8 animate-pulse" />
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-600 font-semibold mb-4">Error: {error}</p>
          <button
            onClick={loadData}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2 mx-auto"
          >
            <FaSync /> Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900">
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black text-gray-900">Event Registrations</h1>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
            {registrations.length} total
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            <FaSync className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={exportCSV}
            disabled={filteredRegistrations.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow p-5">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-black text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-2xl shadow p-5 border border-green-200">
          <p className="text-sm text-green-600">Revenue</p>
          <p className="text-xl font-black text-green-700">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl shadow p-5 border border-yellow-200">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-xl font-black text-yellow-700">${stats.pendingRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-green-100 rounded-2xl shadow p-5">
          <p className="text-sm text-green-700">Completed</p>
          <p className="text-2xl font-black text-green-800">{stats.completed}</p>
        </div>
        <div className="bg-yellow-100 rounded-2xl shadow p-5">
          <p className="text-sm text-yellow-700">Awaiting</p>
          <p className="text-2xl font-black text-yellow-800">{stats.pending}</p>
        </div>
        <div className="bg-purple-100 rounded-2xl shadow p-5">
          <p className="text-sm text-purple-700">Free</p>
          <p className="text-2xl font-black text-purple-800">{stats.freeCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <FaFilter />
            <span className="font-semibold">Filters:</span>
          </div>
          
          {/* Event Filter */}
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-w-[200px]"
          >
            <option value="all">All Events</option>
            {uniqueEvents.map((event) => (
              <option key={event?.id} value={event?.id}>
                {event?.title || `Event #${event?.id}`}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
            <option value="expired">Expired</option>
          </select>

          <button
            onClick={() => { setSelectedEvent('all'); setStatusFilter('all'); }}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">ID</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Ticket Code</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Event</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Attendee</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">#{reg.id}</td>
                    <td className="px-4 py-3">
                      {reg.ticketCode ? (
                        <span className="inline-flex items-center px-2 py-1 rounded bg-cyan-100 text-cyan-800 font-mono text-sm font-bold">
                          <FaTicket className="mr-1 text-xs" />
                          NIH-{reg.ticketCode}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{reg.event?.title || `Event #${reg.eventId}`}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400 text-xs" />
                        <span className="font-medium text-gray-900">{reg.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{reg.email}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${reg.status === 'completed' ? 'text-green-600' : 'text-gray-600'}`}>
                        ${centsToDollars(reg.amountPaid)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={reg.status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-gray-400 text-xs" />
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FaClipboardList className="text-4xl text-gray-300" />
                      <p className="font-semibold">No registrations found</p>
                      <p className="text-sm text-gray-400">
                        {registrations.length === 0 
                          ? "Database is empty - no registrations yet" 
                          : "Try adjusting your filters"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredRegistrations.length} of {registrations.length} registrations
          </p>
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-600 font-mono">
          <p>Debug: {registrations.length} records loaded from API</p>
          <p>API Endpoint: /api/registrations/all</p>
        </div>
      )}
    </div>
  );
}
