// app/admin/blog/list/page.tsx - Blog Posts Management List
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  category: string;
  publishedAt: string;
  cover?: string;
  published?: boolean;
  excerpt?: string;
  author?: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) return [];
  return res.json();
};

export default function BlogListPage() {
  const router = useRouter();
  const { data: posts, mutate, isLoading } = useSWR<Post[]>('/api/blog?limit=100', fetcher);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filteredPosts = posts?.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || post.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && post.published !== false) ||
                         (statusFilter === 'draft' && post.published === false);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const deletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        mutate(posts?.filter(p => p.id !== id), false);
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete post');
    }
  };

  const categories = ['All', 'News', 'Impact Story', 'Event Recap', 'Advocacy', 'Opinion'];

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
          <h1 className="text-3xl font-black text-slate-900">Blog Posts</h1>
          <p className="text-slate-500 mt-1">Manage all your blog content</p>
        </div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <FaPlus /> New Post
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
              placeholder="Search posts..."
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

          {/* Status Filter */}
          <div className="flex gap-2">
            {(['all', 'published', 'draft'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Post</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Author</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredPosts?.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {post.cover ? (
                        <img
                          src={post.cover}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                          <span className="text-xl">📄</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-slate-900 line-clamp-1">{post.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-1">{post.excerpt?.slice(0, 60)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{post.author || 'Staff'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not set'}
                  </td>
                  <td className="px-6 py-4">
                    {post.published === false ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        <FaEyeSlash className="text-xs" /> Draft
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <FaEye className="text-xs" /> Published
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blog?id=${post.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
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

        {filteredPosts?.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No posts found</h3>
            <p className="text-slate-500 mb-6">Create your first blog post to get started</p>
            <Link
              href="/admin/blog"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <FaPlus /> Create Post
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      {posts && (
        <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
          <p>Showing {filteredPosts?.length || 0} of {posts.length} posts</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {posts.filter(p => p.published !== false).length} Published
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              {posts.filter(p => p.published === false).length} Drafts
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
