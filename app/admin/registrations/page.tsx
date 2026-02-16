// app/admin/registrations/page.tsx - REGISTRATION VIEWER
'use client';

import { useEffect, useState } from 'react';
import { FaDownload, FaFilter, FaCalendar, FaUser, FaDollarSign, FaArrowLeft, FaClipboardList, FaChartBar } from 'react-icons/fa';
import Link from 'next/link';

/* ---------- types ---------- */
interface Event {
  id: number;
  title: string;
  startDate: string;
}

interface Registration {
  id: number;
  eventId: number;
  eventName: string;
  attendeeName: string;
  email: string;
  amountPaid: number;
  status: 'pending' | 'completed' | 'refunded' | 'expired';
  registrationDate: string;
  phone?: string;
  tickets?: number;
  ticketCode?: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<number | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  /* ---------- load data ---------- */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [regsData, eventsData] = await Promise.all([
        fetcher('/api/registrations'),
        fetcher('/api/events'),
      ]);
      setRegistrations(regsData || []);
      setEvents(eventsData || []);
    } catch (e) {
      console.error('Failed to load data:', e);
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
  const centsToDollars = (cents: number) => (cents || 0) / 100;

  const stats = {
    total: filteredRegistrations.length,
    totalRevenue: filteredRegistrations
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + centsToDollars(r.amountPaid), 0),
    pendingRevenue: filteredRegistrations
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + centsToDollars(r.amountPaid), 0),
    projectedRevenue: filteredRegistrations
      .filter(r => r.status === 'completed' || r.status === 'pending')
      .reduce((sum, r) => sum + centsToDollars(r.amountPaid), 0),
    pending: filteredRegistrations.filter(r => r.status === 'pending').length,
    completed: filteredRegistrations.filter(r => r.status === 'completed').length,
    refunded: filteredRegistrations.filter(r => r.status === 'refunded').length,
  };

  /* ---------- export CSV ---------- */
  const exportCSV = () => {
    const headers = ['Registration ID', 'Ticket Code', 'Event Name', 'Attendee Name', 'Email', 'Phone', 'Tickets', 'Amount Paid', 'Status', 'Registration Date'];
    const rows = filteredRegistrations.map(r => [
      r.id,
      r.ticketCode ? `NIH-${r.ticketCode}` : '',
      r.eventName,
      r.attendeeName,
      r.email,
      r.phone || '',
      r.tickets || 1,
      centsToDollars(r.amountPaid).toFixed(2),
      r.status,
      new Date(r.registrationDate).toLocaleString(),
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
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      refunded: 'bg-blue-100 text-blue-800',
      expired: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  /* ---------- skeleton ---------- */
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

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-600 hover:text-gray-900">
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black text-gray-900">Event Registrations</h1>
        </div>
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
        >
          <FaDownload /> Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Registrations</p>
              <p className="text-3xl font-black text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="text-3xl text-blue-500"><FaClipboardList /></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed Revenue</p>
              <p className="text-2xl font-black text-green-600 mt-1">${stats.totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.completed} paid registrations</p>
            </div>
            <div className="text-3xl text-green-500"><FaDollarSign /></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Revenue</p>
              <p className="text-2xl font-black text-yellow-600 mt-1">${stats.pendingRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">{stats.pending} awaiting payment</p>
            </div>
            <div className="text-3xl text-yellow-500"><FaDollarSign /></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Projected Total</p>
              <p className="text-2xl font-black text-blue-600 mt-1">${stats.projectedRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">Confirmed + Pending</p>
            </div>
            <div className="text-3xl text-blue-500"><FaChartBar /></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Free Registrations</p>
              <p className="text-3xl font-black text-purple-600 mt-1">
                {filteredRegistrations.filter(r => r.amountPaid === 0).length}
              </p>
            </div>
            <div className="text-3xl text-purple-500"><FaUser /></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <FaFilter />
            <span className="font-semibold">Filters:</span>
          </div>
          
          {/* Event Filter */}
          <div className="flex-1 min-w-[200px]">
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Events</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex-1 min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="refunded">Refunded</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <button
            onClick={() => { setSelectedEvent('all'); setStatusFilter('all'); }}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Reg ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Ticket Code</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Event</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Attendee</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-600">#{reg.id}</td>
                    <td className="px-6 py-4">
                      {reg.ticketCode ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-sm font-semibold">
                          NIH-{reg.ticketCode}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{reg.eventName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400 text-xs" />
                        <span className="font-medium text-gray-900">{reg.attendeeName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{reg.email}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${reg.status === 'completed' ? 'text-green-600' : 'text-gray-600'}`}>
                        ${centsToDollars(reg.amountPaid).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={reg.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-gray-400 text-xs" />
                        {new Date(reg.registrationDate).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FaClipboardList className="text-4xl text-gray-300" />
                      <p>No registrations found</p>
                      <p className="text-sm text-gray-400">Try adjusting your filters</p>
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
          {selectedEvent !== 'all' && (
            <p className="text-sm text-blue-600">
              Filtered by: {events.find(e => e.id === selectedEvent)?.title}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
