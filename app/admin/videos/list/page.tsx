// app/admin/videos/list/page.tsx - Videos Management List
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaVideo, FaEye, FaEyeSlash, FaYoutube } from 'react-icons/fa';

interface Video {
  id: number;
  title: string;
  category: string;
  youtubeId: string;
  thumbnail?: string;
  published: boolean;
  order: number;
  createdAt: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) return [];
  return res.json();
};

const categories = ['All', 'Music Video', 'Live Performance', 'Behind the Scenes', 'Interview', 'Lyric Video'];

export default function VideosListPage() {
  const { data: videos, mutate, isLoading } = useSWR<Video[]>('/api/videos?limit=100', fetcher);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filteredVideos = videos?.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.youtubeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || video.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && video.published) ||
                         (statusFilter === 'draft' && !video.published);
    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => (a.order - b.order) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const deleteVideo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    try {
      const res = await fetch(`/api/videos?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        mutate(videos?.filter(v => v.id !== id), false);
      } else {
        alert('Failed to delete video');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete video');
    }
  };

  const getThumbnailUrl = (youtubeId: string) => {
    return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
  };

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
          <h1 className="text-3xl font-black text-slate-900">Videos</h1>
          <p className="text-slate-500 mt-1">Manage all your video content</p>
        </div>
        <Link
          href="/admin/videos"
          className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          <FaPlus /> Add Video
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
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {(['all', 'published', 'draft'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  statusFilter === status
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Videos Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Video</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">YouTube ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Order</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredVideos?.map((video) => (
                <tr key={video.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={video.thumbnail || getThumbnailUrl(video.youtubeId)}
                          alt=""
                          className="w-20 h-12 rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FaYoutube className="text-white text-2xl drop-shadow-lg" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 line-clamp-1">{video.title}</h3>
                        <a 
                          href={`https://youtube.com/watch?v=${video.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          View on YouTube
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                      {video.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{video.youtubeId}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{video.order}</td>
                  <td className="px-6 py-4">
                    {video.published ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <FaEye className="text-xs" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        <FaEyeSlash className="text-xs" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/videos?id=${video.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => deleteVideo(video.id)}
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

        {filteredVideos?.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No videos found</h3>
            <p className="text-slate-500 mb-6">Add your first video to get started</p>
            <Link
              href="/admin/videos"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              <FaPlus /> Add Video
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      {videos && (
        <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
          <p>Showing {filteredVideos?.length || 0} of {videos.length} videos</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {videos.filter(v => v.published).length} Published
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              {videos.filter(v => !v.published).length} Drafts
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
