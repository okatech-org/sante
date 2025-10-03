import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import RegisterChoice from "./pages/RegisterChoice";
import RegisterPatient from "./pages/RegisterPatient";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import AppointmentConfirmation from "./pages/AppointmentConfirmation";
import Prescriptions from "./pages/Prescriptions";
import Results from "./pages/Results";
import Providers from "./pages/Providers";
import Reimbursements from "./pages/Reimbursements";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import AdminUsers from "./pages/AdminUsers";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import AdminDemo from "./pages/AdminDemo";
import AdminProject from "./pages/AdminProject";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/superadmin" element={<SuperAdminLogin />} />
            <Route path="/register" element={<RegisterChoice />} />
            <Route path="/register/patient" element={<RegisterPatient />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/appointments" element={
              <ProtectedRoute>
                <Appointments />
              </ProtectedRoute>
            } />
            <Route path="/appointments/confirmation/:id" element={
              <ProtectedRoute>
                <AppointmentConfirmation />
              </ProtectedRoute>
            } />
            <Route path="/prescriptions" element={
              <ProtectedRoute>
                <Prescriptions />
              </ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } />
            <Route path="/providers" element={
              <ProtectedRoute>
                <Providers />
              </ProtectedRoute>
            } />
            <Route path="/reimbursements" element={
              <ProtectedRoute>
                <Reimbursements />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/demo" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminDemo />
              </ProtectedRoute>
            } />
            <Route path="/admin/project" element={
              <ProtectedRoute requiredRoles={['super_admin']}>
                <AdminProject />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
