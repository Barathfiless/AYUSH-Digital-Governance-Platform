import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  MessageSquare,
  Download,
  TrendingUp,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function TrackApplication() {
  usePageTitle('Track Application');
  const [trackingId, setTrackingId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get('id');

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
    const userId = userData?._id || userData?.id;

    const fetchApps = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/applications/user/${userId}`);
        const data = await response.json();
        if (response.ok) {
          setUserApplications(data);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApps();
  }, []);

  useEffect(() => {
    if (idParam) {
      setTrackingId(idParam);
      const autoTrack = async () => {
        setIsTracking(true);
        try {
          const response = await fetch(`/api/applications/${idParam}`);
          const data = await response.json();
          if (response.ok) {
            setApplicationData(data);
          }
        } catch (error) {
          console.error("Auto tracking error:", error);
        }
      };
      autoTrack();
    }
  }, [idParam]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsTracking(true);
    try {
      const response = await fetch(`/api/applications/${trackingId}`);
      const data = await response.json();
      if (response.ok) {
        setApplicationData(data);
      } else {
        setApplicationData(null);
      }
    } catch (error) {
      console.error("Tracking error:", error);
      setApplicationData(null);
    }
  };

  return (
    <DashboardLayout>


      {/* Search Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
      >
        <form onSubmit={handleTrack} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Application ID (e.g., APP-2024-001)"
              className="pl-12 h-10 text-xs bg-slate-50 border-slate-200/60 rounded-lg focus:ring-blue-500 shadow-sm"
            />
          </div>
          <Button type="submit" size="lg" className="h-10 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold shadow-md shadow-blue-200">
            Check Status
          </Button>
        </form>
      </motion.div>

      {/* Results Area */}
      {isTracking && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          {!applicationData ? (
            <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-rose-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Application Not Found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                We couldn't find any record matching "<span className="font-bold text-slate-700">{trackingId}</span>".
                Please double-check your ID or contact support.
              </p>
              <Button variant="outline" className="mt-8 rounded-xl border-slate-200" onClick={() => setIsTracking(false)}>
                Try Different ID
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#002b5b] to-[#1e3a8a] p-5 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Application Details</span>
                    <h3 className="text-xl font-bold mt-0.5">{applicationData.companyName}</h3>
                  </div>
                  <div className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold border",
                    applicationData.status === 'Pending' ? "bg-amber-500/20 text-amber-200 border-amber-500/30" :
                      applicationData.status === 'Approved' ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/30" :
                        "bg-rose-500/20 text-rose-200 border-rose-500/30"
                  )}>
                    {applicationData.status}
                  </div>
                </div>
              </div>
              <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Submission Date</p>
                    <p className="text-slate-800 font-bold text-sm">{new Date(applicationData.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Founder</p>
                    <p className="text-slate-800 font-bold text-sm">{applicationData.founderName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">License Type</p>
                    <p className="text-slate-800 font-bold text-sm">Manufacturing License (Form 25D)</p>
                  </div>
                </div>
                {applicationData.status === 'Rejected' && applicationData.rejectionReason && (
                  <div className="lg:col-span-3 flex items-start gap-2.5 bg-rose-50 p-3 rounded-lg border border-rose-100">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 border border-rose-200">
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Rejection Reason</p>
                      <p className="text-rose-800 font-bold text-xs mt-0.5">{applicationData.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Tracked Application History List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">Your Submitted Applications</h3>
          <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 uppercase tracking-widest leading-none">
            {userApplications.length} Total
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Application ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company / Entity</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Submitted</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason / Remarks</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {userApplications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                      {app.applicationId || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800 text-sm whitespace-nowrap">{app.companyName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">
                        {new Date(app.submittedAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex border",
                      app.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        app.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                          "bg-rose-50 text-rose-600 border-rose-100"
                    )}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-500 font-medium">
                      {app.rejectionReason || app.remarks || '--'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right"></td>
                </tr>
              ))}
              {userApplications.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="max-w-xs mx-auto">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <FileText className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="text-slate-400 text-sm font-medium">No submitted applications found for your account.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
