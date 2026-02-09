// app/admin/DashboardContent.tsx - STARLET MUSIC ADMIN DASHBOARD
'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaCalendar, FaFileAlt, FaPen, FaVideo, FaTicketAlt, FaMusic, FaDollarSign } from 'react-icons/fa';

/* ---------- types ---------- */
interface Post {
  id: number;
  title: string;
  category: string;
  publishedAt: string;
  cover?: string;
  published?: boolean;
}

interface Event {
  id: number;
  title: string;
  category: string;
  startDate: string;
  cover?: string;
  location?: string;
}

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

interface Registration {
  id: number;
  eventId: number;
  eventName: string;
  attendeeName: string;
  email: string;
  amountPaid: number;
  status: 'pending' | 'completed' | 'refunded' | 'expired';
  registrationDate: string;
}

// Safe fetcher that returns empty array on error
const fetcher = async (url: string) => {
  try {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) {
      console.warn(`API error: ${url} returned ${res.status}`);
      return [];
    }
    const data = await res.json();
    // Ensure we return an array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    return [];
  }
};

export default function DashboardContent() {
  const { data: posts, mutate: mutatePosts } = useSWR<Post[]>('/api/blog', fetcher);
  const { data: events, mutate: mutateEvents } = useSWR<Event[]>('/api/events', fetcher);
  const { data: videos, mutate: mutateVideos } = useSWR<Video[]>('/api/videos', fetcher);
  const { data: registrations } = useSWR<Registration[]>('/api/registrations', fetcher);

  const deletePost = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
    mutatePosts(posts?.filter((p) => p.id !== id) ?? [], false);
  };

  const deleteEvent = async (id: number) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
    mutateEvents(events?.filter((e) => e.id !== id) ?? [], false);
  };

  const deleteVideo = async (id: number) => {
    if (!confirm('Delete this video?')) return;
    await fetch(`/api/videos?id=${id}`, { method: 'DELETE' });
    mutateVideos(videos?.filter((v) => v.id !== id) ?? [], false);
  };

  /* ---------- computed stats ---------- */
  const totalRevenue = registrations
    ?.filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.amountPaid, 0) || 0;

  const upcomingEvents = events
    ?.filter(e => new Date(e.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) || [];

  const recentVideos = videos
    ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];

  const recentRegistrations = registrations
    ?.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
    .slice(0, 5) || [];

  /* ---------- skeleton while loading ---------- */
  if (!posts || !events || !videos || !registrations)
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="h-10 bg-slate-700 rounded mb-8 animate-pulse" />
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-700 rounded animate-pulse" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-2xl shadow p-6 h-64 border border-white/10">
              <div className="h-6 bg-slate-700 rounded mb-4 animate-pulse" />
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-12 bg-slate-700 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  /* ---------- dashboard ---------- */
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <FaMusic className="text-blue-600" /> Rahab Kinity Music Admin
        </h1>
        <div className="text-sm text-gray-400">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <MetricCard label="Blog Posts" value={posts.length} icon={<FaPen />} href="/admin/blog" color="blue" />
        <MetricCard label="Events" value={events.length} icon={<FaCalendar />} href="/admin/events" color="green" />
        <MetricCard label="Videos" value={videos.length} icon={<FaVideo />} href="/admin/videos" color="purple" />
        <MetricCard label="Registrations" value={registrations.length} icon={<FaTicketAlt />} href="/admin/registrations" color="orange" />
      </div>

      {/* Quick Stats Row */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <QuickStatCard 
          label="Total Revenue" 
          value={`$${totalRevenue.toFixed(2)}`} 
          icon={<FaDollarSign />}
          trend="From completed registrations"
          color="green"
        />
        <QuickStatCard 
          label="Upcoming Events" 
          value={upcomingEvents.length} 
          icon={<FaCalendar />}
          trend={`Next: ${upcomingEvents[0]?.title || 'None'}`}
          color="blue"
        />
        <QuickStatCard 
          label="Published Videos" 
          value={videos.filter(v => v.published).length} 
          icon={<FaVideo />}
          trend={`${videos.filter(v => !v.published).length} drafts`}
          color="purple"
        />
      </div>

      {/* CONTENT GRID */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* BLOG SECTION */}
        <SectionCard
          title="Recent Blog Posts"
          href="/admin/blog"
          onNew="/admin/blog"
          items={posts.slice(0, 5)}
          render={(p) => (
            <ItemRow
              id={p.id}
              title={p.title}
              subtitle={`${p.category} • ${new Date(p.publishedAt).toLocaleDateString()}`}
              cover={p.cover}
              editLink={`/admin/blog?id=${p.id}`}
              onDelete={() => deletePost(p.id)}
              status={p.published === false ? 'Draft' : undefined}
            />
          )}
        />

        {/* EVENTS SECTION */}
        <SectionCard
          title="Upcoming Events"
          href="/admin/events"
          onNew="/admin/events"
          items={upcomingEvents.slice(0, 5)}
          render={(e) => (
            <ItemRow
              id={e.id}
              title={e.title}
              subtitle={`${new Date(e.startDate).toLocaleDateString()} • ${e.location || 'TBA'}`}
              cover={e.cover}
              editLink={`/admin/events?id=${e.id}`}
              onDelete={() => deleteEvent(e.id)}
            />
          )}
        />

        {/* VIDEOS SECTION */}
        <SectionCard
          title="Recent Videos"
          href="/admin/videos"
          onNew="/admin/videos"
          items={recentVideos.slice(0, 5)}
          render={(v) => (
            <ItemRow
              id={v.id}
              title={v.title}
              subtitle={`${v.category} • Order: ${v.order}`}
              cover={v.thumbnail}
              editLink={`/admin/videos?id=${v.id}`}
              onDelete={() => deleteVideo(v.id)}
              status={v.published ? undefined : 'Draft'}
            />
          )}
        />

        {/* REGISTRATIONS SECTION */}
        <div className="bg-slate-800 rounded-2xl shadow p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-white">Recent Registrations</h2>
            <Link href="/admin/registrations" className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1">
              <FaTicketAlt /> View All
            </Link>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {recentRegistrations.length ? (
              recentRegistrations.map((r) => (
                <div key={r.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{r.attendeeName}</p>
                    <p className="text-xs text-gray-400">{r.eventName}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${r.status === 'completed' ? 'text-green-600' : 'text-gray-600'}`}>
                      ${(r.amountPaid ?? 0).toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      r.status === 'completed' ? 'bg-green-100 text-green-800' :
                      r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      r.status === 'refunded' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No registrations yet</p>
            )}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Link href="/admin/registrations" className="text-sm text-blue-600 hover:underline font-semibold">View all registrations →</Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow p-6">
        <h2 className="text-xl font-black text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <QuickActionButton href="/admin/blog" icon={<FaFileAlt />} label="New Blog Post" />
          <QuickActionButton href="/admin/events" icon={<FaCalendar />} label="New Event" />
          <QuickActionButton href="/admin/videos" icon={<FaVideo />} label="Add Video" />
          <QuickActionButton href="/admin/registrations" icon={<FaTicketAlt />} label="View Registrations" />
        </div>
      </div>
    </div>
  );
}

/* ---------- re-usable components ---------- */
function MetricCard({ label, value, icon, href, color = 'blue' }: { label: string; value: string | number; icon: React.ReactNode; href: string; color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' }) {
  const colorClasses = {
    blue: 'group-hover:text-blue-600',
    green: 'group-hover:text-green-600',
    purple: 'group-hover:text-purple-600',
    orange: 'group-hover:text-orange-600',
    red: 'group-hover:text-red-600',
  };
  
  return (
    <Link href={href} className="group bg-slate-800 rounded-2xl shadow p-6 hover:shadow-xl transition border border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-3xl font-black text-white mt-1">{value}</p>
        </div>
        <div className={`text-3xl text-gray-400 transition ${colorClasses[color]}`}>{icon}</div>
      </div>
    </Link>
  );
}

function QuickStatCard({ label, value, icon, trend, color = 'blue' }: { label: string; value: string | number; icon: React.ReactNode; trend: string; color?: 'blue' | 'green' | 'purple' | 'orange' }) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
  };
  
  return (
    <div className="bg-slate-800 rounded-2xl shadow p-6 border border-white/10">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-2xl font-black text-white">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{trend}</p>
        </div>
      </div>
    </div>
  );
}

function SectionCard<T>({
  title,
  href,
  onNew,
  items,
  render,
}: {
  title: string;
  href: string;
  onNew: string;
  items: T[];
  render: (item: T) => React.ReactNode;
}) {
  return (
    <div className="bg-slate-800 rounded-2xl shadow p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-white">{title}</h2>
        <Link href={onNew} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1">
          <FaPlus /> New
        </Link>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {items.length ? (
          items.map(render)
        ) : (
          <p className="text-sm text-gray-400">No items yet</p>
        )}
      </div>
      <div className="mt-4 border-t pt-4">
        <Link href={href} className="text-sm text-blue-600 hover:underline font-semibold">View all →</Link>
      </div>
    </div>
  );
}

function ItemRow({ id, title, subtitle, cover, editLink, onDelete, status }: { id: number; title: string; subtitle: string; cover?: string; editLink: string; onDelete: () => void; status?: string }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border group hover:bg-gray-100 transition">
      {cover && <img src={cover} alt="" className="w-12 h-12 object-cover rounded" />}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{title}</p>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>
      {status && (
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
          {status}
        </span>
      )}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <Link href={editLink} className="text-blue-600 hover:text-blue-800 p-1" title="Edit">
          <FaEdit />
        </Link>
        <button onClick={onDelete} className="text-red-600 hover:text-red-800 p-1" title="Delete">
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

function QuickActionButton({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition backdrop-blur-sm">
      {icon}
      <span>{label}</span>
    </Link>
  );
}
