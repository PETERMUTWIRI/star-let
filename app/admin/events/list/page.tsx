// app/admin/events/list/page.tsx - Events Management List
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';

interface Event {
  id: number;
  title: string;
  category: string;
  startDate: string;
  cover?: string;
  location?: string;
  venue?: string;
  description?: string;
  isSoldOut?: boolean;
  registrationCount?: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) return [];
  return res.json();
};

export default function EventsListPage() {
  const { data: events, mutate, isLoading } = useSWR<Event[]>('/api/events?limit=100', fetcher);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  const deleteEvent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        mutate(events?.filter(e => e.id !== id), false);
      } else {
        alert('Failed to delete event');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete event');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) > new Date();
  };

  const categories = ['All', 'Upcoming', 'Past'];

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="h-10 bg-slate-200 rounded mb-8 animate-pulse" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Events</h1>
          <p className="text-slate-500 mt-1">Manage all your events and performances</p>
        </div>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <FaPlus /> New Event
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Event</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredEvents?.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {event.cover ? (
                        <img
                          src={event.cover}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                          <FaCalendar className="text-slate-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-slate-900 line-clamp-1">{event.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-1">
                          {event.registrationCount ? `${event.registrationCount} registered` : 'No registrations'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaCalendar className="text-blue-500" />
                      {formatDate(event.startDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span className="truncate max-w-[150px]">{event.venue || event.location || 'TBA'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {isUpcoming(event.startDate) ? (
                      event.isSoldOut ? (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                          Sold Out
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          Upcoming
                        </span>
                      )
                    ) : (
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        Past
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/events?id=${event.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEvents?.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No events found</h3>
            <p className="text-slate-500 mb-6">Create your first event to get started</p>
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <FaPlus /> Create Event
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      {events && (
        <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
          <p>Showing {filteredEvents?.length || 0} of {events.length} events</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {events.filter(e => isUpcoming(e.startDate)).length} Upcoming
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              {events.filter(e => !isUpcoming(e.startDate)).length} Past
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
