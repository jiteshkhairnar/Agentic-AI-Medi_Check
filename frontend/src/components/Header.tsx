/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CheckCircle, 
  MapPin, 
  Bookmark, 
  Flag, 
  Search, 
  Layers, 
  ShieldAlert, 
  History, 
  Database, 
  Cpu, 
  ChevronDown, 
  UserCheck, 
  Sparkles,
  ExternalLink,
  Store,
  Calculator,
  FileText
} from 'lucide-react';
import { AppViewMode, UserRole, AuthUser } from '../../../shared/types';

interface HeaderProps {
  currentView: AppViewMode;
  onSelectView: (view: AppViewMode) => void;
  onOpenReportModal: () => void;
  savedCount: number;
  onOpenSavedModal: () => void;
  currentUser: AuthUser;
  onOpenAuthModal: (tab?: 'pharmacist' | 'admin' | 'consumer' | 'jwt-inspector') => void;
  onSelectDemoUser: (userKey: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  onOpenReportModal,
  savedCount,
  onOpenSavedModal,
  currentUser,
  onOpenAuthModal,
  onSelectDemoUser
}) => {
  const [selectedPincode, setSelectedPincode] = useState('Bengaluru 560001');
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const isAdminView = currentView.startsWith('admin-') || currentView === 'admin-portal';
  const isPharmacistView = currentView === 'pharmacist-portal';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.05)] border-b border-[#e5eeff]">
      {/* Live Sync Banner */}
      <div className="w-full bg-[#eff4ff] px-4 md:px-6 py-1.5 border-b border-[#dce9ff]">
        <div className="max-w-[76rem] mx-auto flex items-center justify-between text-[#3d4947] text-[11px]">
          <div className="flex items-center gap-2">
            <span className="flex items-center text-[#00685f] font-semibold">
              <CheckCircle className="w-3.5 h-3.5 mr-1 text-[#00685f]" />
              Government Jan Aushadhi &amp; verified retail chemist prices updated 14 mins ago across 45,000+ formulations.
            </span>
            <span className="hidden lg:inline text-[#6d7a77]">• 100% independent &amp; unbiased</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span className="font-medium text-[#0b1c30]">CDSCO Sync: <strong className="text-[#006b2c]">Active</strong></span>
            <span className="flex items-center gap-1.5 text-[#00685f] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#00685f] animate-pulse"></span>
              Real-time Telemetry (18.4k req/m)
            </span>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="h-16 px-4 md:px-6">
        <div className="max-w-[76rem] mx-auto h-full flex items-center justify-between gap-4">
          
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectView('consumer-compare')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              {/* Modern minimalist medical check logo */}
              <div className="w-9 h-9 rounded-lg bg-[#00685f] text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-[#008378] transition-colors">
                <span className="text-xl leading-none">☤</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[17px] font-bold text-[#0b1c30] tracking-tight leading-none group-hover:text-[#00685f] transition-colors">
                    medicine_check
                  </span>
                  <span className="bg-[#e5eeff] text-[#00685f] text-[10px] font-bold px-1.5 py-0.5 rounded">
                    IN
                  </span>
                </div>
                <span className="text-[10px] text-[#3d4947] font-medium leading-tight">
                  Find Same Medicine. Pay Less. Live Healthier.
                </span>
              </div>
            </button>

            <div className="h-6 w-px bg-[#dce9ff] hidden md:block"></div>

            {/* Pincode Selector */}
            <button 
              onClick={() => setShowPincodeModal(true)}
              className="hidden md:flex items-center gap-1.5 bg-[#eff4ff] hover:bg-[#e5eeff] px-2.5 py-1 rounded-lg text-[#0b1c30] text-xs font-semibold transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#00685f]" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] text-[#6d7a77] uppercase font-bold leading-none">Pincode</span>
                <span className="text-[11px] leading-tight font-bold">{selectedPincode}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#6d7a77] ml-0.5" />
            </button>
          </div>

          {/* Center Navigation: Multi-Role Portals & Workbench Switcher */}
          <div className="flex items-center gap-1 bg-[#eff4ff] p-1 rounded-xl border border-[#dce9ff] overflow-x-auto max-w-full">
            <button
              onClick={() => onSelectView('consumer-compare')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                !isAdminView && !isPharmacistView
                  ? 'bg-[#ffffff] text-[#00685f] shadow-sm' 
                  : 'text-[#3d4947] hover:text-[#0b1c30]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Consumer</span>
            </button>

            {/* Pharmacist Portal Tab (Architecture Section 1 & 4) */}
            <button
              onClick={() => onSelectView('pharmacist-portal')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                isPharmacistView
                  ? 'bg-[#ffffff] text-[#00685f] shadow-sm'
                  : 'text-[#3d4947] hover:text-[#0b1c30]'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-[#00685f]" />
              <span>Pharmacist Portal</span>
              <span className="hidden sm:inline bg-[#d6f5df] text-[#006b2c] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                Kendra #1084
              </span>
            </button>

            {/* Admin Console Tab (Architecture Section 1 & 4) */}
            <button
              onClick={() => onSelectView('admin-portal')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentView === 'admin-portal'
                  ? 'bg-[#ffffff] text-[#00685f] shadow-sm'
                  : 'text-[#3d4947] hover:text-[#0b1c30]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#00685f]" />
              <span>Admin Console</span>
            </button>

            {/* Discrepancy Triage */}
            <button
              onClick={() => onSelectView('admin-discrepancy-queue')}
              className={`hidden md:flex px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all items-center gap-1.5 whitespace-nowrap ${
                currentView === 'admin-discrepancy-queue'
                  ? 'bg-[#ffffff] text-[#00685f] shadow-sm'
                  : 'text-[#3d4947] hover:text-[#0b1c30]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#ba1a1a]" />
              <span>Discrepancy Triage</span>
              <span className="bg-[#ffdad6] text-[#93000a] text-[10px] px-1.5 py-0.2 rounded-full font-bold">14</span>
            </button>

            <button
              onClick={() => onSelectView('admin-audit-logs')}
              className={`hidden lg:flex px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all items-center gap-1.5 whitespace-nowrap ${
                currentView === 'admin-audit-logs'
                  ? 'bg-[#ffffff] text-[#00685f] shadow-sm'
                  : 'text-[#3d4947] hover:text-[#0b1c30]'
              }`}
            >
              <History className="w-3.5 h-3.5 text-[#006b2c]" />
              <span>Audit Ledger</span>
            </button>

            <button
              onClick={() => onSelectView('admin-system-architecture')}
              className={`hidden xl:flex px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all items-center gap-1.5 whitespace-nowrap ${
                currentView === 'admin-system-architecture'
                  ? 'bg-[#ffffff] text-[#00685f] shadow-sm'
                  : 'text-[#3d4947] hover:text-[#0b1c30]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#00685f]" />
              <span>Architecture</span>
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Report Discrepancy Button */}
            <button
              onClick={onOpenReportModal}
              className="hidden sm:flex items-center gap-1.5 bg-[#eff4ff] hover:bg-[#ffdad6] text-[#3d4947] hover:text-[#93000a] px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <Flag className="w-3.5 h-3.5 text-[#ba1a1a]" />
              <span className="hidden md:inline">Report Overcharge</span>
            </button>

            {/* Saved Medicines Drawer Trigger */}
            <button
              onClick={onOpenSavedModal}
              className="flex items-center gap-1.5 bg-[#ffffff] border border-[#dce9ff] hover:border-[#00685f] px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#0b1c30] shadow-sm transition-all"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#00685f]" />
              <span className="hidden md:inline">Saved</span>
              <span className="bg-[#dae2fd] text-[#131b2e] text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {savedCount}
              </span>
            </button>

            {/* JWT Inspector Trigger Button */}
            <button
              onClick={() => onOpenAuthModal('jwt-inspector')}
              title="Inspect Active JWT & RBAC Claims"
              className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[11px] font-mono font-bold text-[#00685f] border border-[#dce9ff]"
            >
              <span>JWT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#006b2c]"></span>
            </button>

            <div className="h-6 w-px bg-[#dce9ff] hidden sm:block"></div>

            {/* User Profile / Role Badge */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 pl-1 text-left focus:outline-none group"
              >
                <img
                  src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80"}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00685f]/30 group-hover:ring-[#00685f] transition-all"
                />
                <div className="hidden xl:flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-[#0b1c30] leading-none">
                      {currentUser.name}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006b2c]"></span>
                  </div>
                  <span className="text-[10px] text-[#3d4947] font-medium leading-tight">
                    {currentUser.role === 'medical_store' 
                      ? 'Registered Chemist / Pharmacist' 
                      : currentUser.role === 'super_admin' 
                      ? 'Super Admin (System)' 
                      : currentUser.role === 'platform_admin'
                      ? 'Platform Admin'
                      : 'Consumer / Patient'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#6d7a77] group-hover:text-black hidden sm:block" />
              </button>

              {/* Role & Auth Switcher Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-[#dce9ff] p-3 z-50">
                  <div className="px-2 py-1.5 border-b border-[#e5eeff] mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#0b1c30]">{currentUser.name}</span>
                      <span className="text-[10px] uppercase font-bold text-[#00685f] bg-[#e5eeff] px-2 py-0.5 rounded">
                        {currentUser.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6d7a77] mt-0.5 font-mono truncate">
                      {currentUser.email}
                    </p>
                    {currentUser.tenantName && (
                      <div className="text-[10px] text-[#3d4947] bg-[#f8f9ff] p-1.5 rounded-lg border border-[#e5eeff] mt-1.5">
                        <span className="font-bold text-[#00685f]">Tenant:</span> {currentUser.tenantName}
                      </div>
                    )}
                  </div>

                  <p className="text-[10px] font-bold text-[#6d7a77] uppercase px-2 mb-1">
                    Quick Perspective Switcher
                  </p>

                  <button
                    onClick={() => {
                      onSelectDemoUser('pharmacist');
                      onSelectView('pharmacist-portal');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-xl transition-all ${
                      currentUser.role === 'medical_store' ? 'bg-[#e5eeff] text-[#00685f] font-bold' : 'hover:bg-[#f8f9ff] text-[#0b1c30]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#00685f]" />
                      <div className="text-left">
                        <div className="leading-tight">Rajesh Patel, D.Pharm</div>
                        <div className="text-[10px] text-[#6d7a77]">Jan Aushadhi Kendra #1084</div>
                      </div>
                    </div>
                    {currentUser.role === 'medical_store' && <CheckCircle className="w-3.5 h-3.5 text-[#00685f]" />}
                  </button>

                  <button
                    onClick={() => {
                      onSelectDemoUser('admin');
                      onSelectView('admin-portal');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-xl transition-all ${
                      currentUser.role === 'super_admin' || currentUser.role === 'platform_admin' ? 'bg-[#e5eeff] text-[#00685f] font-bold' : 'hover:bg-[#f8f9ff] text-[#0b1c30]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#ba1a1a]" />
                      <div className="text-left">
                        <div className="leading-tight">Dr. Ananya Sharma</div>
                        <div className="text-[10px] text-[#6d7a77]">Super Admin / CDSCO</div>
                      </div>
                    </div>
                    {(currentUser.role === 'super_admin' || currentUser.role === 'platform_admin') && (
                      <CheckCircle className="w-3.5 h-3.5 text-[#00685f]" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onSelectDemoUser('consumer');
                      onSelectView('consumer-compare');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded-xl transition-all ${
                      currentUser.role === 'consumer' ? 'bg-[#e5eeff] text-[#00685f] font-bold' : 'hover:bg-[#f8f9ff] text-[#0b1c30]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-[#00685f]" />
                      <div className="text-left">
                        <div className="leading-tight">Kavita Nambiar</div>
                        <div className="text-[10px] text-[#6d7a77]">Patient / Citizen User</div>
                      </div>
                    </div>
                    {currentUser.role === 'consumer' && <CheckCircle className="w-3.5 h-3.5 text-[#00685f]" />}
                  </button>

                  <div className="pt-2 mt-2 border-t border-[#e5eeff] space-y-1">
                    <button
                      onClick={() => {
                        onOpenAuthModal('jwt-inspector');
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-[#00685f] hover:bg-[#eff4ff] rounded-lg font-semibold flex items-center gap-2"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Inspect Live JWT Claims</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenAuthModal('pharmacist');
                        setShowRoleMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg font-semibold flex items-center gap-2"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Sign In / Switch Tenant</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Secondary Context Sub-Bar (When on Consumer view) */}
      {!isAdminView && (
        <div className="w-full bg-[#ffffff] border-t border-[#e5eeff] px-4 md:px-6">
          <div className="max-w-[76rem] mx-auto flex items-center gap-1 overflow-x-auto py-1">
            <button
              onClick={() => onSelectView('consumer-compare')}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-semibold transition-colors ${
                currentView === 'consumer-compare'
                  ? 'bg-[#008378] text-[#f4fffc]'
                  : 'text-[#3d4947] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              Compare Medicines
            </button>
            <button
              onClick={() => onSelectView('consumer-salt-directory')}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition-colors ${
                currentView === 'consumer-salt-directory'
                  ? 'bg-[#008378] text-[#f4fffc]'
                  : 'text-[#3d4947] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              Salt/Composition Directory
            </button>
            <button
              onClick={() => onSelectView('consumer-savings-calc')}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition-colors ${
                currentView === 'consumer-savings-calc'
                  ? 'bg-[#008378] text-[#f4fffc]'
                  : 'text-[#3d4947] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              Savings Calculator
            </button>
            <button
              onClick={() => onSelectView('consumer-stores')}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition-colors ${
                currentView === 'consumer-stores'
                  ? 'bg-[#008378] text-[#f4fffc]'
                  : 'text-[#3d4947] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              Partner Medical Stores
            </button>
            <button
              onClick={() => onSelectView('consumer-clinical-trust')}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition-colors ${
                currentView === 'consumer-clinical-trust'
                  ? 'bg-[#008378] text-[#f4fffc]'
                  : 'text-[#3d4947] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              Clinical Trust &amp; Safety
            </button>
            <button
              onClick={() => onSelectView('consumer-history')}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition-colors ${
                currentView === 'consumer-history'
                  ? 'bg-[#008378] text-[#f4fffc]'
                  : 'text-[#3d4947] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
              }`}
            >
              My Medicine History
            </button>
          </div>
        </div>
      )}

      {/* Pincode Modal */}
      {showPincodeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#dce9ff]">
            <h3 className="text-base font-bold text-[#0b1c30] mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#00685f]" />
              Select Delivery / Chemist Pincode
            </h3>
            <p className="text-xs text-[#3d4947] mb-4">
              Real-time prices and Jan Aushadhi stock verification are calculated according to your nearest drug distribution circle.
            </p>
            <div className="space-y-2">
              {['Bengaluru 560001 (Indiranagar/Central)', 'Bengaluru 560071 (Domlur & HAL)', 'Mumbai 400001 (Fort/South)', 'Delhi 110001 (Connaught Place)', 'Hyderabad 500081 (HITEC City)'].map((pin) => (
                <button
                  key={pin}
                  onClick={() => { setSelectedPincode(pin); setShowPincodeModal(false); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl border border-[#dce9ff] hover:border-[#00685f] hover:bg-[#eff4ff] text-xs font-semibold text-[#0b1c30] transition-colors flex items-center justify-between"
                >
                  <span>{pin}</span>
                  {selectedPincode === pin && <CheckCircle className="w-4 h-4 text-[#00685f]" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowPincodeModal(false)}
              className="mt-5 w-full py-2 bg-[#eff4ff] text-[#3d4947] font-bold text-xs rounded-xl hover:bg-[#dce9ff]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
