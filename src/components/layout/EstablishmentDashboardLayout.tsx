import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Menu,
  X,
  LogOut,
  Home,
  Calendar,
  Users,
  FileText,
  Settings,
  Bell,
  Search,
  ChevronDown
} from "lucide-react";

interface EstablishmentDashboardLayoutProps {
  children: React.ReactNode;
  userRole: 'doctor' | 'nurse' | 'admin';
  userName: string;
  userEmail: string;
  establishmentName: string;
}

export default function EstablishmentDashboardLayout({
  children,
  userRole,
  userName,
  userEmail,
  establishmentName
}: EstablishmentDashboardLayoutProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const getRoleLabel = () => {
    switch (userRole) {
      case 'doctor':
        return 'Médecin du Travail';
      case 'nurse':
        return 'Infirmière';
      case 'admin':
        return 'Administrateur';
      default:
        return 'Utilisateur';
    }
  };

  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: 'Tableau de Bord', href: '#dashboard' },
      { icon: Calendar, label: 'Rendez-vous', href: '#appointments' },
      { icon: Users, label: 'Patients', href: '#patients' },
    ];

    if (userRole === 'doctor') {
      return [
        ...baseItems,
        { icon: FileText, label: 'Prescriptions', href: '#prescriptions' },
        { icon: FileText, label: 'Dossiers Médicaux', href: '#medical-files' },
      ];
    } else if (userRole === 'nurse') {
      return [
        ...baseItems,
        { icon: FileText, label: 'Soins', href: '#care' },
        { icon: FileText, label: 'Observations', href: '#observations' },
      ];
    } else {
      return [
        { icon: Home, label: 'Tableau de Bord', href: '#dashboard' },
        { icon: Users, label: 'Utilisateurs', href: '#users' },
        { icon: Calendar, label: 'Planification', href: '#planning' },
        { icon: FileText, label: 'Rapports', href: '#reports' },
      ];
    }
  };

  const handleLogout = async () => {
    navigate('/establishments/unclaimed');
  };

  const menuItems = getMenuItems();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'hidden'}`}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
              🏥
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">CMST</p>
              <p className="text-xs text-gray-600">SOGARA</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.href.startsWith('#')) {
                    const element = document.querySelector(item.href);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate(item.href);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  sidebarOpen
                    ? 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                    : 'hover:bg-gray-100 justify-center'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 px-3 py-4 space-y-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Paramètres</span>}
          </button>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className={`w-full ${!sidebarOpen && 'p-2'}`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="ml-2">Déconnexion</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  {userName.charAt(0)}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{userName}</p>
                    <p className="text-sm text-gray-600">{getRoleLabel()}</p>
                    <p className="text-xs text-gray-500 mt-1">{userEmail}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/establishments/unclaimed');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header du contenu */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Bienvenue, {userName.split(' ')[0]}
              </h1>
              <p className="text-gray-600 mt-2">
                {establishmentName} • {getRoleLabel()}
              </p>
            </div>

            {/* Contenu principal */}
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
