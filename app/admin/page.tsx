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
    <div className="max-w-7xl mx-auto p-8">
      <div className="h-10 bg-slate-700 rounded mb-8 animate-pulse" />
      <div className="grid md:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-2xl shadow p-6 border border-white/10">
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