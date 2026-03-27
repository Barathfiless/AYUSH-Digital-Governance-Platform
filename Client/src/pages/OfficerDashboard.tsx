import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Calendar,
  Shield,
  FileSearch,
  Download,
  RefreshCw,
  Zap,
  MapPin,
  Beaker,
  Package,
  PlusCircle,
  Activity,
  Search,
  Filter,
  ArrowRight,
  ClipboardCheck,
  Truck,
  TrendingUp,
  FlaskConical,
  MoreVertical,
  Camera,
  Loader2,
  ChevronLeft,
  ShieldCheck,
  Eye,
  MessageSquare,
  MessageCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';

// Refactored INDIAN_STATES outside
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry"
];

// Refactored ApplicationsModule outside to prevent re-renders losing focus
const ApplicationsModule = ({ status, applications, searchQuery, setSearchQuery, navigate, selectedState, setSelectedState }: {
  status: string;
  applications: any[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  navigate: (path: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'review';

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const isMainReviewPage = status === 'Pending';

  const filteredApps = applications
    .filter(app => {
      // If we're on the main review page, use tab-based filtering
      if (isMainReviewPage) {
        const tabMatch = activeTab === 'review'
          ? app.status === 'Pending'
          : app.status === 'SiteInspection';

        const appStateSlug = app.state?.toLowerCase().replace(/\s+/g, '-');
        const matchesState = selectedState === 'all' || appStateSlug === selectedState;

        const query = searchQuery.toLowerCase();
        const matchesSearch =
          (app.companyName?.toLowerCase() || '').includes(query) ||
          (app.gstin?.toLowerCase() || '').includes(query) ||
          (app.founderName?.toLowerCase() || '').includes(query) ||
          (app.applicationId?.toLowerCase() || '').includes(query);

        return tabMatch && matchesState && matchesSearch;
      }

      const matchesStatus = app.status === status;
      const appStateSlug = app.state?.toLowerCase().replace(/\s+/g, '-');
      const matchesState = selectedState === 'all' || appStateSlug === selectedState;

      const query = searchQuery.toLowerCase();
      const matchesSearch =
        (app.companyName?.toLowerCase() || '').includes(query) ||
        (app.gstin?.toLowerCase() || '').includes(query) ||
        (app.founderName?.toLowerCase() || '').includes(query) ||
        (app.applicationId?.toLowerCase() || '').includes(query);

      return matchesStatus && matchesState && matchesSearch;
    })
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  return (
    <div className="space-y-4">
      {isMainReviewPage && (
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit mx-auto mb-4 shadow-inner">
          <button
            onClick={() => setActiveTab('review')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-200",
              activeTab === 'review'
                ? "bg-white text-[#002b5b] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Review
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-200",
              activeTab === 'status'
                ? "bg-white text-[#002b5b] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Status
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full text-slate-400 focus-within:text-blue-600 transition-colors">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <Input
            placeholder="Search by company, GSTIN, or founder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 rounded-xl border-none bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-100 placeholder:text-slate-400 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 min-w-[200px]">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white text-[11px] font-bold uppercase w-full">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs font-bold">ALL STATES</SelectItem>
              {INDIAN_STATES.map(state => (
                <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '-')} className="text-xs font-bold uppercase">
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredApps.length > 0 ? filteredApps.map((app) => (
            <div key={app._id} className="p-4 hover:bg-slate-50/50 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform overflow-hidden">
                    {app.documents?.find((d: any) => d.title === "Company photo") ? (
                      <img
                        src={app.documents.find((d: any) => d.title === "Company photo").url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{app.companyName || 'Draft Submission'}</h4>
                      {app.status !== 'SiteInspection' && (
                        <span className={cn(
                          "text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                          app.status === 'Pending' ? "bg-amber-100 text-amber-700" :
                            app.status === 'Approved' ? "bg-emerald-100 text-emerald-700" :
                              "bg-rose-100 text-rose-700"
                        )}>
                          {app.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3 mt-1">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3 text-slate-400" /> {app.founderName}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> {new Date(app.submittedAt).toLocaleDateString()}</span>
                      {app.applicationId && (
                        <span className="flex items-center gap-1 text-blue-600 font-bold bg-blue-50/50 px-1.5 py-0.5 rounded border border-blue-100">
                          <Shield className="w-3 h-3" /> {app.applicationId}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    className="rounded-lg h-9 font-bold bg-slate-900 hover:bg-black text-white px-4 gap-1 text-xs"
                    onClick={() => navigate(`/officer/review/${app._id}`)}
                  >
                    {['Pending', 'SiteInspection'].includes(app.status) ? 'Review' : 'View'}
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-slate-100">
                <FileSearch className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="font-bold text-slate-700 text-sm">No {status === 'all' ? '' : status.toLowerCase()} applications</h3>
              <p className="text-slate-400 text-xs mt-1">Matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ApprovalDocsModule = ({ applications, onPostCertificate }: { applications: any[], onPostCertificate: (app: any) => void }) => {
  const [certTab, setCertTab] = useState<'awaiting' | 'posted'>('awaiting');
  const [localSearch, setLocalSearch] = useState("");
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleAutoGenerate = async (appId: string) => {
    setIsGenerating(appId);
    try {
      const res = await fetch(`/api/admin/generate-certificate/${appId}`, { method: 'POST' });
      if (res.ok) {
        toast.success("Verifiable license generated successfully!");
        window.location.reload(); 
      }
    } catch (e) { toast.error("Generation failed"); }
    finally { setIsGenerating(null); }
  };

  const approvedApps = applications.filter(app => app.status === 'Approved');
  const filteredApps = approvedApps.filter(app => {
    const matchesTab = certTab === 'awaiting' ? !app.certificateUrl : !!app.certificateUrl;
    const query = localSearch.toLowerCase();
    const matchesSearch =
      (app.companyName?.toLowerCase() || '').includes(query) ||
      (app.applicationId?.toLowerCase() || '').includes(query) ||
      (app.founderName?.toLowerCase() || '').includes(query);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder={`Search ${certTab} certs...`}
            className="pl-9 h-9 rounded-xl border-slate-200 text-xs focus:ring-blue-500 focus:border-blue-500 bg-white"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 flex justify-center">
          <div className="flex bg-slate-100/50 p-1 rounded-xl w-fit border border-slate-200 shadow-sm">
            <button
              onClick={() => setCertTab('awaiting')}
              className={cn(
                "px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 flex items-center gap-2",
                certTab === 'awaiting'
                  ? "bg-white text-[#002b5b] shadow-md scale-[1.02]"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              Awaiting
            </button>
            <button
              onClick={() => setCertTab('posted')}
              className={cn(
                "px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 flex items-center gap-2",
                certTab === 'posted'
                  ? "bg-white text-emerald-600 shadow-md scale-[1.02]"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Posted
            </button>
          </div>
        </div>

        <div className="w-72 hidden md:block"></div> {/* Spacer to keep tabs centered */}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="pl-6 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Company Name</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">License ID</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Renewal Date</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Cert Status</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-[10px] text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApps.length > 0 ? filteredApps.map((app) => (
              <TableRow key={app._id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell className="pl-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform shadow-sm">
                      <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <span className="font-black text-slate-800 uppercase tracking-tight text-[13px] block">{app.companyName}</span>
                      <span className="text-[9px] font-bold text-emerald-600/70 uppercase">Verified Entity</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-[10px] font-bold text-slate-400">{app.applicationId || 'Pending'}</TableCell>
                <TableCell className="text-[11px] font-bold text-slate-600">
                  {app.renewalDate ? new Date(app.renewalDate).toLocaleDateString() : 'Not Set'}
                </TableCell>
                <TableCell>
                  {app.certificateUrl ? (
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                      <CheckCircle className="w-3 h-3" />
                      Posted
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                      <Clock className="w-3 h-3" />
                      Awaiting
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => onPostCertificate(app)}
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-lg font-black text-[10px] uppercase tracking-widest text-[#002b5b] hover:text-blue-700 hover:bg-blue-50 gap-2 border border-slate-100 shadow-sm"
                    >
                      {app.certificateUrl ? 'Edit URL' : 'Manual Link'}
                      <PlusCircle className="w-3 h-3" />
                    </Button>
                    {!app.certificateUrl && (
                       <Button
                        onClick={() => handleAutoGenerate(app._id)}
                        disabled={!!isGenerating}
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-lg font-black text-[10px] uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 gap-2 border border-blue-100 shadow-sm"
                      >
                        {isGenerating === app._id ? <RefreshCw className="w-3 h-3 animate-spin"/> : <Zap className="w-3 h-3 text-amber-300 fill-amber-300/20" />}
                        Auto-Generate
                      </Button>
                    )}
                    {app.certificateUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-lg font-black text-[10px] uppercase tracking-widest text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-2 border border-slate-100 shadow-sm"
                        onClick={() => window.open(app.certificateUrl, '_blank')}
                      >
                        <Download className="w-3 h-3" />
                        View
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <FileText className="w-6 h-6 text-slate-200" />
                  </div>
                  <h3 className="font-bold text-slate-700 text-sm">No {certTab} applications</h3>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Ready for certification</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const InspectionsModule = ({ applications, setInspectApp, setIsInspectModalOpen, setCapturedImage, setLocationData, navigate }: any) => {
  const [localSearch, setLocalSearch] = useState("");

  const query = localSearch.toLowerCase();
  const inspectionApps = applications.filter((app: any) =>
    app.status === 'SiteInspection' && (
      (app.companyName?.toLowerCase() || '').includes(query) ||
      (app.applicationId?.toLowerCase() || '').includes(query) ||
      (app.founderName?.toLowerCase() || '').includes(query) ||
      (app.gstin?.toLowerCase() || '').includes(query)
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Field Inspections</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Monitor site verifications</p>
          </div>
        </div>

        <div className="w-full md:w-80 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            placeholder="Search inspections..."
            className="w-full pl-9 h-9 rounded-lg border border-slate-200 text-xs focus:ring-blue-500 focus:border-blue-500 bg-slate-50 shadow-inner font-medium"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-right">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-2">Pending</span>
              <span className="text-sm font-black text-blue-600">{inspectionApps.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inspectionApps.length > 0 ? inspectionApps.map((app: any) => (
          <div key={app._id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm transition-all hover:border-blue-100 group relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
                {app.documents?.find((d: any) => d.title === "Company photo") ? (
                  <img
                    src={app.documents.find((d: any) => d.title === "Company photo").url}
                    className="w-full h-full object-cover"
                    alt={app.companyName}
                  />
                ) : (
                  <Building2 className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 text-sm truncate">{app.companyName}</h4>
                <span className={cn(
                  "text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border",
                  app.verifiedBy
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-amber-50 text-amber-600 border-amber-100"
                )}>
                  {app.verifiedBy ? 'Verified' : 'Visit Pending'}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-[10px] bg-slate-50 p-2 rounded-lg">
                <span className="text-slate-500 font-bold uppercase">App ID</span>
                <span className="font-black text-slate-900">{app.applicationId}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium px-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Requested: {new Date(app.submittedAt).toLocaleDateString()}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                className={cn(
                  "w-full rounded-xl h-9 gap-2 font-bold text-white text-xs",
                  app.verifiedBy
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                    : "bg-[#002b5b] hover:bg-blue-900 shadow-blue-100"
                )}
                onClick={() => {
                  setInspectApp(app);
                  setIsInspectModalOpen(true);
                  setCapturedImage(null);
                  setLocationData(null);
                }}
              >
                {app.verifiedBy ? <ClipboardCheck className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                {app.verifiedBy ? 'Verified' : 'Verify Site'}
              </Button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center bg-white rounded-lg border border-slate-200 border-dashed">
            <MapPin className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-sm">No pending inspections</h3>
            <p className="text-slate-400 text-xs mt-1">Applications approved for inspection will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const InventoryModule = ({ applications, selectedState, setSelectedState, selectedInventoryApp, setSelectedInventoryApp, searchQuery, setSearchQuery }: any) => {
  const [productSearch, setProductSearch] = useState("");

  // Filtered apps for the list
  const inventoryApps = applications.filter((app: any) => {
    const matchesStatus = app.status === 'Approved';
    const appStateSlug = app.state?.toLowerCase().replace(/\s+/g, '-');
    const matchesState = selectedState === 'all' || appStateSlug === selectedState;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (app.companyName?.toLowerCase() || '').includes(query) ||
      (app.applicationId?.toLowerCase() || '').includes(query) ||
      (app.founderName?.toLowerCase() || '').includes(query);

    return matchesStatus && matchesState && matchesSearch;
  });

  if (selectedInventoryApp) {
    const products = selectedInventoryApp.products || [];
    const filteredProducts = products.filter((p: any) =>
      (p.name?.toLowerCase() || '').includes(productSearch.toLowerCase()) ||
      (p.category?.toLowerCase() || '').includes(productSearch.toLowerCase()) ||
      (p.type?.toLowerCase() || '').includes(productSearch.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedInventoryApp(null);
              setProductSearch("");
            }}
            className="p-0 hover:bg-transparent text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Registry
          </Button>

          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Search products..."
              className="pl-9 h-9 rounded-xl border-slate-200 text-xs focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">{selectedInventoryApp.companyName}</h2>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                ID: <span className="font-mono text-blue-600 font-bold">{selectedInventoryApp.applicationId}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Items</p>
            <p className="text-2xl font-black text-slate-800">{(selectedInventoryApp.products || []).length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="pl-6 font-bold text-slate-700">Product Name</TableHead>
                <TableHead className="font-bold text-slate-700">Category</TableHead>
                <TableHead className="font-bold text-slate-700">Type</TableHead>
                <TableHead className="font-bold text-slate-700">Strength</TableHead>
                <TableHead className="font-bold text-slate-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-400 font-medium text-xs">
                    {productSearch ? `No products matching "${productSearch}"` : "No products in this company's inventory."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell className="pl-6 font-bold text-slate-800">{product.name}</TableCell>
                    <TableCell className="text-slate-600 font-medium">{product.category}</TableCell>
                    <TableCell>
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter border border-blue-100">
                        {product.type}
                      </span>
                    </TableCell>
                    <TableCell className="font-bold text-slate-600 text-xs">{product.strength}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                        <CheckCircle className="w-4 h-4" />
                        Certified
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-[-1.5rem]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all">
        <div className="flex items-center gap-6 flex-1">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">Inventory</h3>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input
              placeholder="Search company or app ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 rounded-xl border-none bg-slate-50 focus-visible:ring-1 focus-visible:ring-blue-100 placeholder:text-slate-400 text-[11px] font-bold shadow-inner"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 min-w-[280px]">
          <span className="text-[10px] font-black text-slate-400 uppercase shrink-0">Filter by State:</span>
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-none w-full text-[11px] font-black uppercase ring-0 focus:ring-0">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all" className="text-xs font-bold">ALL STATES</SelectItem>
              {INDIAN_STATES.map(state => (
                <SelectItem key={state} value={state.toLowerCase().replace(/\s+/g, '-')} className="text-xs font-bold uppercase">
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="pl-6 font-bold text-slate-700">Company Name</TableHead>
              <TableHead className="font-bold text-slate-700">App ID</TableHead>
              <TableHead className="font-bold text-slate-700">Region</TableHead>
              <TableHead className="font-bold text-slate-700">Stock Capacity</TableHead>
              <TableHead className="font-bold text-slate-700 text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryApps.length > 0 ? inventoryApps.map((app: any) => (
              <TableRow key={app._id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell className="pl-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-black text-slate-800 uppercase tracking-tight text-[13px]">{app.companyName}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-[10px] font-bold text-slate-400">{app.applicationId}</TableCell>
                <TableCell>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-md text-[9px] font-black uppercase tracking-widest">
                    {app.state?.replace(/-/g, ' ')}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 w-32">
                    <div className="flex items-center justify-between text-[9px] font-black text-slate-500">
                      <span>{(app.products || []).length} ITEMS</span>
                      <span>{Math.round(Math.min(((app.products || []).length / 20) * 100, 100))}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${Math.min(((app.products || []).length / 20) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button
                    onClick={() => setSelectedInventoryApp(app)}
                    variant="ghost"
                    size="sm"
                    className="rounded-lg font-black text-[10px] uppercase tracking-widest text-[#002b5b] hover:text-blue-700 hover:bg-blue-50 gap-2 border border-slate-100"
                  >
                    View Products
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="py-20 text-center">
                  <Package className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No inventory data found</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const QueriesModule = ({ applications, onResolve }: { applications: any[], onResolve: (app: any) => void }) => {
  const [localSearch, setLocalSearch] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const query = localSearch.toLowerCase();
  const queryApps = applications.filter(app =>
    app.certificateAppeal &&
    app.certificateAppeal.reason &&
    app.certificateAppeal.status === 'Pending' &&
    ((app.companyName?.toLowerCase() || '').includes(query) ||
      (app.applicationId?.toLowerCase() || '').includes(query) ||
      (app.certificateAppeal.reason?.toLowerCase() || '').includes(query))
  );

  const openPreview = (url: string) => {
    setPreviewUrl(url);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-4 mt-[-1rem]">
      <div className="flex flex-col md:flex-row md:items-center gap-6 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100">
            <MessageSquare className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Queries</h2>
          </div>
        </div>

        <div className="w-full md:w-80 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder="Search queries..."
            className="pl-9 h-9 rounded-lg border-slate-200 text-xs focus:ring-rose-500 focus:border-rose-500 bg-slate-50/50"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-100 text-right">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-2">Pending</span>
              <span className="text-sm font-black text-rose-600">{queryApps.length}</span>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl h-[85vh] p-0 bg-white border-none shadow-2xl rounded-2xl overflow-hidden flex flex-col">
          <DialogHeader className="p-4 border-b bg-slate-50/50 flex flex-row items-center justify-between">
            <DialogTitle className="text-sm font-black text-slate-800 uppercase tracking-tight">Certificate Preview</DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-slate-100 relative">
            {previewUrl ? (
              <iframe
                src={previewUrl}
                className="w-full h-full border-none"
                title="Certificate Preview"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                <FileText className="w-10 h-10 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">Unable to load preview</p>
              </div>
            )}
          </div>
          <DialogFooter className="p-3 bg-white border-t flex justify-end">
            <Button
              onClick={() => setIsPreviewOpen(false)}
              className="bg-slate-900 text-white font-bold text-xs px-6 h-9 rounded-lg"
            >
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="pl-6 font-bold text-slate-700 uppercase tracking-wider text-[10px]">Company Name</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Appeal Reason</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Appeal Date</TableHead>
              <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-[10px] text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queryApps.length > 0 ? queryApps.map((app) => (
              <TableRow key={app._id} className="group hover:bg-slate-50/50 transition-colors">
                <TableCell className="pl-6 py-4 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center border border-rose-100 group-hover:scale-110 transition-transform shadow-sm">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                    </div>
                    <div>
                      <span className="font-black text-slate-800 uppercase tracking-tight text-[13px] block">{app.companyName}</span>
                      <span className="text-[9px] font-bold text-rose-600/70 uppercase">Certificate Query</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-md py-4 border-b border-slate-50">
                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100 text-[11px] text-slate-600 leading-relaxed font-medium">
                    "{app.certificateAppeal.reason}"
                  </div>
                </TableCell>
                <TableCell className="text-[11px] font-bold text-slate-600 py-4 border-b border-slate-50">
                  {app.certificateAppeal.date ? new Date(app.certificateAppeal.date).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell className="text-right pr-6 py-4 border-b border-slate-50">
                  <div className="flex items-center justify-end gap-2">
                    {app.certificateUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-lg font-black text-[10px] uppercase tracking-widest text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-2 border border-slate-100 shadow-sm"
                        onClick={() => openPreview(app.certificateUrl)}
                      >
                        View Cert
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 rounded-lg font-black text-[10px] uppercase tracking-widest text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-2 border border-slate-100 shadow-sm"
                      onClick={() => onResolve(app)}
                    >
                      Resolve Status
                      <CheckCircle className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="py-24 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <MessageSquare className="w-8 h-8 text-slate-200" />
                  </div>
                  <h3 className="font-extrabold text-slate-700 text-base">No pending queries</h3>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">All certificate issues have been resolved</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default function OfficerDashboard() {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();
  const isPanelHome = path === '/officer';
  const userData = JSON.parse(sessionStorage.getItem('user') || '{}');
  const officerName = userData?.name || userData?.username || 'Officer';

  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { label: 'Pending Reviews', value: '0', icon: Clock, color: 'bg-amber-100 text-amber-600' },
    { label: 'Approved', value: '0', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Rejected', value: '0', icon: AlertCircle, color: 'bg-rose-100 text-rose-600' },
    { label: 'Total Dossiers', value: '0', icon: FileText, color: 'bg-blue-100 text-blue-600' },
  ]);

  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [inspectApp, setInspectApp] = useState<any>(null);
  const [isSubmittingInspection, setIsSubmittingInspection] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<{ lat: number; lng: number } | null>(null);
  const [isCapturingLocation, setIsCapturingLocation] = useState(false);

  // Inventory State
  const [selectedInventoryApp, setSelectedInventoryApp] = useState<any>(null);
  const [selectedState, setSelectedState] = useState('all');

  // Certificate State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certApp, setCertApp] = useState<any>(null);
  const [certBase64, setCertBase64] = useState<string | null>(null);
  const [isUploadingCert, setIsUploadingCert] = useState(false);

  const fetchApplications = async () => {
    try {
      let response = await fetch('/api/applications/all');
      if (!response.ok && response.status === 404) {
        response = await fetch('http://localhost:5000/api/applications/all');
      }
      const data = await response.json();
      if (response.ok) {
        setApplications(data);
        setStats([
          { label: 'Pending Reviews', value: data.filter((app: any) => app.status === 'Pending').length.toString(), icon: Clock, color: 'bg-amber-100 text-amber-600' },
          { label: 'Inspections', value: data.filter((app: any) => app.status === 'SiteInspection').length.toString(), icon: MapPin, color: 'bg-blue-100 text-blue-600' },
          { label: 'Approved', value: data.filter((app: any) => app.status === 'Approved').length.toString(), icon: CheckCircle, color: 'bg-emerald-100 text-emerald-600' },
          { label: 'Rejected', value: data.filter((app: any) => app.status === 'Rejected').length.toString(), icon: AlertCircle, color: 'bg-rose-100 text-rose-600' },
          { label: 'Total Dossiers', value: data.length.toString(), icon: FileText, color: 'bg-blue-100 text-blue-600' },
        ]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const captureLocation = () => {
    setIsCapturingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsCapturingLocation(false);
          toast.success("Location captured successfully");
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsCapturingLocation(false);
          toast.error("Failed to capture location. Please ensure GPS is enabled.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
      setIsCapturingLocation(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitInspection = async () => {
    if (!capturedImage || !locationData) {
      toast.error("Please capture both photo and location");
      return;
    }

    setIsSubmittingInspection(true);
    try {
      const response = await fetch(`/api/applications/${inspectApp._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'SiteInspection',
          inspectionImage: capturedImage,
          inspectionLocation: locationData,
          verifiedBy: officerName
        })
      });

      if (response.ok) {
        toast.success("Verification report saved. Review Status updated.");
        setIsInspectModalOpen(false);

        // Navigate to Review Applications page with the Status tab active
        navigate('/officer/reviews?tab=status');
      } else {
        toast.error("Failed to submit verification");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error submitting verification");
    } finally {
      setIsSubmittingInspection(false);
    }
  };

  const pathTitles: Record<string, string> = {
    '/officer': 'Officer Dashboard',
    '/officer/reviews': 'Review Applications',
    '/officer/inspections': 'Field Inspections',
    '/officer/inventory': 'Inventory Oversight',
    '/officer/approved': 'Approved Applications',
    '/officer/rejected': 'Rejected Applications',
    '/officer/approval-docs': 'Approval Documents'
  };

  usePageTitle(pathTitles[path] || 'Officer Dashboard');

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size too large (max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitCertificate = async () => {
    if (!certBase64 || !certApp) {
      toast.error("Please upload a certificate first");
      return;
    }

    setIsUploadingCert(true);
    try {
      const response = await fetch(`/api/applications/${certApp._id}/certificate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateUrl: certBase64 })
      });

      if (response.ok) {
        toast.success("Certificate posted successfully");
        setIsCertModalOpen(false);
        setCertBase64(null);
        fetchApplications();
      } else {
        toast.error("Failed to post certificate");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Connection error");
    } finally {
      setIsUploadingCert(false);
    }
  };



  const resolveAppeal = async (app: any) => {
    try {
      const response = await fetch(`/api/applications/${app._id}/certificate-appeal/resolve`, {
        method: 'PATCH'
      });
      if (response.ok) {
        toast.success("Query marked as resolved");
        fetchApplications();
      } else {
        toast.error("Failed to resolve query");
      }
    } catch (error) {
      console.error("Resolve error:", error);
      toast.error("Connection error");
    }
  };

  const renderModule = () => {
    const appsProps = { applications, searchQuery, setSearchQuery, navigate, selectedState, setSelectedState };

    if (path === '/officer/reviews') return <ApplicationsModule status="Pending" {...appsProps} />;
    if (path === '/officer/inspections') return (
      <InspectionsModule
        applications={applications}
        setInspectApp={setInspectApp}
        setIsInspectModalOpen={setIsInspectModalOpen}
        setCapturedImage={setCapturedImage}
        setLocationData={setLocationData}
        navigate={navigate}
      />
    );
    if (path === '/officer/inventory') return (
      <InventoryModule
        applications={applications}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedInventoryApp={selectedInventoryApp}
        setSelectedInventoryApp={setSelectedInventoryApp}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    );

    if (path === '/officer/approval-docs') return (
      <ApprovalDocsModule
        applications={applications}
        onPostCertificate={(app) => {
          setCertApp(app);
          setIsCertModalOpen(true);
          setCertBase64(null);
        }}
      />
    );

    if (path === '/officer/queries') return (
      <QueriesModule
        applications={applications}
        onResolve={resolveAppeal}
      />
    );

    if (path === '/officer/approved') return <ApplicationsModule status="Approved" {...appsProps} />;
    if (path === '/officer/rejected') return <ApplicationsModule status="Rejected" {...appsProps} />;

    return null;
  };

  return (
    <DashboardLayout>
      <div className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4",
        isPanelHome ? "mb-8" : "mb-4"
      )}>
        {/* Actions removed */}
      </div>

      {isPanelHome && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10"
        >
          {stats.map((stat, idx) => (
            <div key={stat.label} className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md group flex flex-col justify-between min-h-[160px]">
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.color} shadow-sm`}>
                {(() => {
                  const Icon = stat.icon;
                  return <Icon className="w-5 h-5" />;
                })()}
              </div>
              <div>
                <p className="text-4xl font-black text-slate-800 tracking-tight mb-2">{stat.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {isPanelHome && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8"
        >
          {[
            {
              to: '/officer/reviews',
              label: 'Review Apps',
              desc: 'Pending & Inspections',
              icon: ClipboardCheck,
              gradient: 'bg-orange-600',
              badge: applications.filter((a: any) => a.status === 'Pending').length,
            },
            {
              to: '/officer/inspections',
              label: 'Inspections',
              desc: 'Field site visits',
              icon: MapPin,
              gradient: 'bg-blue-600',
              badge: applications.filter((a: any) => a.status === 'SiteInspection').length,
            },
            {
              to: '/officer/inventory',
              label: 'Inventory',
              desc: 'Product oversight',
              icon: Package,
              gradient: 'bg-[#00796b]',
              badge: applications.filter((a: any) => a.status === 'Approved').length,
            },
            {
              to: '/officer/approval-docs',
              label: 'Approval Docs',
              desc: 'Post certificates',
              icon: FileSearch,
              gradient: 'bg-violet-600',
              badge: applications.filter((a: any) => a.status === 'Approved' && !a.certificateUrl).length,
            },
            {
              to: '/officer/queries',
              label: 'Queries',
              desc: 'Certificate appeals',
              icon: MessageCircle,
              gradient: 'bg-rose-600',
              badge: applications.filter((a: any) => a.certificateAppeal?.status === 'Pending').length,
            },
            {
              to: '/officer/approved',
              label: 'Reports',
              desc: 'Approved & Rejected',
              icon: TrendingUp,
              gradient: 'bg-emerald-600',
              badge: applications.filter((a: any) => a.status === 'Approved' || a.status === 'Rejected').length,
            },
          ].map((action, i) => (
            <motion.button
              key={action.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => navigate(action.to)}
              className="group relative flex flex-col items-center justify-center p-8 bg-white rounded-[24px] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:border-blue-100 cursor-pointer text-center gap-4 min-h-[180px]"
            >
              {action.badge > 0 && (
                <span className="absolute top-4 right-4 text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full bg-teal-100 text-teal-700 border border-teal-200">
                  {action.badge}
                </span>
              )}
              <div className={`w-14 h-14 rounded-[20px] ${action.gradient} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
                {(() => {
                  const Icon = action.icon;
                  return <Icon className="w-7 h-7" />;
                })()}
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-black text-slate-800 uppercase tracking-widest">{action.label}</p>
                <p className="text-[10px] text-slate-400 font-bold">{action.desc}</p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={path}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderModule()}
        </motion.div>
      </AnimatePresence>

      <Dialog open={isInspectModalOpen} onOpenChange={setIsInspectModalOpen}>
        <DialogContent className="max-w-sm bg-white rounded-xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-4 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              Site Verification
            </DialogTitle>
          </DialogHeader>
          <div className="p-5 space-y-4">
            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
              <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">Company</p>
              <h4 className="font-bold text-slate-800 text-sm">{inspectApp?.companyName}</h4>
              <p className="text-[9px] text-slate-500 font-medium">{inspectApp?.applicationId}</p>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">1. Evidence Photo</Label>
              {capturedImage ? (
                <div className="relative rounded-lg overflow-hidden border border-slate-200">
                  <img src={capturedImage} alt="Captured" className="w-full aspect-video object-cover" />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2 rounded-lg bg-white/90 backdrop-blur-sm h-7 px-3 font-bold text-[9px] uppercase tracking-wider shadow-sm"
                    onClick={() => setCapturedImage(null)}
                  >
                    Retake
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-slate-200 rounded-lg aspect-video flex flex-col items-center justify-center bg-slate-50 group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer overflow-hidden relative"
                  onClick={() => document.getElementById('camera-input')?.click()}
                >
                  <Camera className="w-6 h-6 text-slate-300 group-hover:text-blue-500 mb-2" />
                  <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600">Click to capture site photo</p>
                  <input
                    id="camera-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">2. Geo-Tagging</Label>
              {locationData ? (
                <div className="flex items-center gap-2.5 p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] font-bold text-emerald-600 uppercase">GPS Authenticated</p>
                    <p className="text-[10px] font-mono font-bold text-slate-700">
                      {locationData.lat.toFixed(5)}, {locationData.lng.toFixed(5)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[9px] font-bold text-emerald-600 hover:bg-emerald-100"
                    onClick={captureLocation}
                  >
                    Refresh
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-10 rounded-lg border-slate-200 border-2 gap-2 text-xs font-bold group hover:border-blue-400 hover:text-blue-600"
                  onClick={captureLocation}
                  disabled={isCapturingLocation}
                >
                  {isCapturingLocation ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Acquiring GPS...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3 h-3" />
                      Tag Geolocation
                    </>
                  )}
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">3. Verified by</Label>
              <div className="flex items-center gap-2.5 p-2.5 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-bold text-blue-600 uppercase">Authorized Official</p>
                  <p className="text-[10px] font-bold text-slate-800 uppercase leading-none">{officerName}</p>
                </div>
                <div className="px-2 py-0.5 bg-blue-600 text-[7px] font-bold text-white rounded-full uppercase tracking-tighter">
                  Verified
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
            <Button
              variant="outline"
              className="rounded-lg flex-1 font-bold h-10 text-xs border-slate-200"
              onClick={() => setIsInspectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-lg flex-1 font-bold h-10 text-xs bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
              onClick={submitInspection}
              disabled={isSubmittingInspection || !capturedImage || !locationData}
            >
              {isSubmittingInspection ? 'Processing...' : 'Verified'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isCertModalOpen} onOpenChange={setIsCertModalOpen}>
        <DialogContent className="max-w-sm bg-white rounded-xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-4 bg-slate-50 border-b border-slate-100">
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Post Digital Certificate
            </DialogTitle>
          </DialogHeader>
          <div className="p-5 space-y-4">
            <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">Approved Entity</p>
              <h4 className="font-bold text-slate-800 text-sm">{certApp?.companyName}</h4>
              <p className="text-[11px] font-mono font-bold text-slate-500">{certApp?.applicationId}</p>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Certificate File (PDF/Image)</Label>
              {certBase64 ? (
                <div className="relative rounded-lg overflow-hidden border border-emerald-200 bg-emerald-50/30 p-4 flex flex-col items-center">
                  <FileText className="w-12 h-12 text-emerald-500 mb-2" />
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">File Selected</p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-7 px-3 font-black text-[9px] uppercase tracking-wider text-blue-600 hover:bg-blue-50 border border-blue-100 flex items-center gap-1.5"
                      onClick={() => {
                        const win = window.open();
                        win?.document.write(`<iframe src="${certBase64}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                      }}
                    >
                      <Eye className="w-3 h-3" />
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-7 px-3 font-black text-[9px] uppercase tracking-wider text-rose-600 hover:bg-rose-50 border border-rose-100"
                      onClick={() => setCertBase64(null)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-slate-200 rounded-lg h-32 flex flex-col items-center justify-center bg-slate-50 group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
                  onClick={() => document.getElementById('cert-upload')?.click()}
                >
                  <PlusCircle className="w-6 h-6 text-slate-300 group-hover:text-blue-500 mb-2" />
                  <p className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600">Click to upload certificate</p>
                  <input
                    id="cert-upload"
                    type="file"
                    accept=".pdf,image/*"
                    className="hidden"
                    onChange={handleCertUpload}
                  />
                </div>
              )}
            </div>

            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex gap-3">
              <div className="shrink-0 pt-0.5 text-blue-500">
                <AlertCircle className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] text-blue-700 font-medium leading-relaxed">
                Posting this certificate will make it instantly visible to the startup in their portal for downloading.
              </p>
            </div>
          </div>
          <DialogFooter className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
            <Button
              variant="outline"
              className="rounded-lg flex-1 font-bold h-10 text-xs border-slate-200"
              onClick={() => setIsCertModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-lg flex-1 font-bold h-10 text-xs bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
              onClick={submitCertificate}
              disabled={isUploadingCert || !certBase64}
            >
              {isUploadingCert ? 'Posting...' : 'Post Certificate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
