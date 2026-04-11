import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import '@/i18n/config';

import { lazy, Suspense } from 'react';

const Index = lazy(() => import("@/pages/Index"));
const Register = lazy(() => import("@/pages/Register"));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const TrackApplication = lazy(() => import("@/pages/TrackApplication"));
const OfficerDashboard = lazy(() => import("@/pages/OfficerDashboard"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Store = lazy(() => import("@/pages/Store"));
const NewLicense = lazy(() => import("@/pages/NewLicense"));
const ReviewApplication = lazy(() => import("@/pages/ReviewApplication"));
const ViewApplication = lazy(() => import("@/pages/ViewApplication"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const SearchStores = lazy(() => import("@/pages/SearchStores"));
const MyOrders = lazy(() => import("@/pages/MyOrders"));
const HealthTracker = lazy(() => import("@/pages/HealthTracker"));
const Documents = lazy(() => import("@/pages/Documents"));
const Inventory = lazy(() => import("@/pages/Inventory"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Cart = lazy(() => import("@/pages/Cart"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const SearchProducts = lazy(() => import("@/pages/SearchProducts"));
const Loans = lazy(() => import("@/pages/Loans"));
const OfficerLoans = lazy(() => import("@/pages/OfficerLoans"));
const OfficerLoanRequests = lazy(() => import("@/pages/OfficerLoanRequests"));
const StateStatistics = lazy(() => import("@/pages/StateStatistics"));
const ActsAndRules = lazy(() => import("@/pages/ActsAndRules"));
const Notifications = lazy(() => import("@/pages/Notifications"));
import { Chatbot } from "@/components/common/Chatbot";
const LicenseVerification = lazy(() => import("@/pages/LicenseVerification"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Chatbot />
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/startup/dashboard" element={<Navigate to="/dashboard" replace />} />
            <Route path="/application/:id" element={<ViewApplication />} />
            <Route path="/track" element={<TrackApplication />} />
            <Route path="/officer" element={<OfficerDashboard />} />
            <Route path="/officer/reviews" element={<OfficerDashboard />} />
            <Route path="/officer/inspections" element={<OfficerDashboard />} />
            <Route path="/officer/inventory" element={<OfficerDashboard />} />
            <Route path="/officer/qc" element={<OfficerDashboard />} />
            <Route path="/officer/approved" element={<OfficerDashboard />} />
            <Route path="/officer/rejected" element={<OfficerDashboard />} />
            <Route path="/officer/approval-docs" element={<OfficerDashboard />} />
            <Route path="/officer/queries" element={<OfficerDashboard />} />
            <Route path="/officer/review/:id" element={<ReviewApplication />} />
            <Route path="/officer/loans" element={<OfficerLoans />} />
            <Route path="/officer/loans/requests" element={<OfficerLoanRequests />} />
            <Route path="/store" element={<Store />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/apply" element={<NewLicense />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/stores" element={<SearchStores />} />
            <Route path="/products" element={<SearchProducts />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/tracker" element={<HealthTracker />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout/:id?" element={<Checkout />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/stats" element={<StateStatistics />} />
            <Route path="/acts" element={<ActsAndRules />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/verify/license/:id" element={<LicenseVerification />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
