import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import '@/i18n/config';

import Index from "@/pages/Index";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Checkout from "@/pages/Checkout";
import TrackApplication from "@/pages/TrackApplication";
import OfficerDashboard from "@/pages/OfficerDashboard";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Store from "@/pages/Store";
import NewLicense from "@/pages/NewLicense";
import ReviewApplication from "@/pages/ReviewApplication";
import ViewApplication from "@/pages/ViewApplication";
import AdminDashboard from "@/pages/AdminDashboard";
import SearchStores from "@/pages/SearchStores";
import MyOrders from "@/pages/MyOrders";
import HealthTracker from "@/pages/HealthTracker";
import Documents from "@/pages/Documents";
import Inventory from "@/pages/Inventory";
import NotFound from "@/pages/NotFound";
import Cart from "@/pages/Cart";
import ProductDetail from "@/pages/ProductDetail";
import SearchProducts from "@/pages/SearchProducts";
import Loans from "@/pages/Loans";
import OfficerLoans from "@/pages/OfficerLoans";
import OfficerLoanRequests from "@/pages/OfficerLoanRequests";
import StateStatistics from "@/pages/StateStatistics";
import ActsAndRules from "@/pages/ActsAndRules";
import Notifications from "@/pages/Notifications";
import { Chatbot } from "@/components/common/Chatbot";
import LicenseVerification from "@/pages/LicenseVerification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Chatbot />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
