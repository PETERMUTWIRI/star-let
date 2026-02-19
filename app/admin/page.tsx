// app/admin/page.tsx - ENTERPRISE ADMIN DASHBOARD
import { Suspense } from 'react';
import DashboardContent from './DashboardContent';

export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="h-10 bg-slate-700 rounded mb-8 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-10">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-700 rounded animate-pulse" />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4 md:gap-8">
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
}