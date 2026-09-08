/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lock, 
  Key, 
  Store, 
  ShieldCheck, 
  UserCheck, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Code2, 
  FileText, 
  Building2, 
  Smartphone,
  ArrowRight,
  Sparkles,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';
import { AuthUser, UserRole } from '../types';
import { DEMO_USERS } from '../data/portalMockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser;
  onLoginSuccess: (user: AuthUser) => void;
  initialTab?: 'pharmacist' | 'admin' | 'consumer' | 'jwt-inspector';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  initialTab = 'pharmacist'
}) => {
  const [activeTab, setActiveTab] = useState<'pharmacist' | 'admin' | 'consumer' | 'jwt-inspector'>(initialTab);
  
  // Pharmacist form inputs
  const [pharmEmail, setPharmEmail] = useState('rajesh.patel@janaushadhi-1084.in');
  const [pharmPass, setPharmPass] = useState('••••••••••••');
  const [pharmLicense, setPharmLicense] = useState('DL-KA-BNG-2024-9128');

  // Admin form inputs
  const [adminEmail, setAdminEmail] = useState('dr.sharma@medicinecheck.gov.in');
  const [adminPass, setAdminPass] = useState('••••••••••••');
  const [adminMfa, setAdminMfa] = useState('884 912');
  const [adminRoleType, setAdminRoleType] = useState<'super_admin' | 'platform_admin'>('super_admin');

  // Consumer inputs
  const [consumerPhone, setConsumerPhone] = useState('+91 98450 88219');
  const [consumerOtp, setConsumerOtp] = useState('440 918');

  // Status feedback
  const [loginStatus, setLoginStatus] = useState<'idle' | 'authenticating' | 'success'>('idle');

  if (!isOpen) return null;

  const handleSimulateLogin = (userKey: string) => {
    setLoginStatus('authenticating');
    setTimeout(() => {
      const selected = DEMO_USERS[userKey] || DEMO_USERS.pharmacist;
      onLoginSuccess(selected);
      setLoginStatus('success');
      setTimeout(() => {
        setLoginStatus('idle');
        onClose();
      }, 500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#dce9ff] overflow-hidden my-auto flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00685f] to-[#008378] text-white p-5 sm:p-6 flex items-start justify-between relative">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#b8f5ea] uppercase tracking-wider font-bold mb-1">
              <Key className="w-4 h-4" />
              <span>Identity &amp; Access Management (Section 3)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>medicine_check Unified Auth</span>
              <span className="text-[11px] bg-white/20 text-white px-2 py-0.5 rounded font-mono">
                RBAC + Multi-Tenant
              </span>
            </h2>
            <p className="text-xs text-[#defafe] mt-1">
              Authenticate into your authorized tenant portal: Medical Store, Platform Admin, or Consumer.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#e5eeff] bg-[#eff4ff] px-4 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pharmacist')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'pharmacist'
                ? 'bg-white text-[#00685f] shadow-xs border-t-2 border-[#00685f]'
                : 'text-[#6d7a77] hover:text-[#0b1c30]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Medical Store / Pharmacist</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'admin'
                ? 'bg-white text-[#00685f] shadow-xs border-t-2 border-[#00685f]'
                : 'text-[#6d7a77] hover:text-[#0b1c30]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin / Super Admin</span>
          </button>

          <button
            onClick={() => setActiveTab('consumer')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'consumer'
                ? 'bg-white text-[#00685f] shadow-xs border-t-2 border-[#00685f]'
                : 'text-[#6d7a77] hover:text-[#0b1c30]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Consumer / Patient</span>
          </button>

          <button
            onClick={() => setActiveTab('jwt-inspector')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'jwt-inspector'
                ? 'bg-white text-[#00685f] shadow-xs border-t-2 border-[#00685f]'
                : 'text-[#6d7a77] hover:text-[#0b1c30]'
            }`}
          >
            <Code2 className="w-4 h-4 text-[#00685f]" />
            <span>JWT &amp; Claims Inspector</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: PHARMACIST / MEDICAL STORE LOGIN */}
          {activeTab === 'pharmacist' && (
            <div className="space-y-4">
              <div className="bg-[#effaf8] border border-[#a2ecd8] rounded-xl p-3 flex items-start gap-3 text-xs text-[#00514a]">
                <Store className="w-5 h-5 text-[#00685f] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Medical Store Portal (Architecture Section 1 &amp; 4):</span>
                  <p className="mt-0.5 text-[#2c4e47]">
                    Enables verified retail pharmacists and Jan Aushadhi Kendra operators to manage store stock availability, update DPCO-compliant prices, dispense prescriptions, and place PMBI depot reorders.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                    Registered Store Email or Chemist Phone
                  </label>
                  <input
                    type="text"
                    value={pharmEmail}
                    onChange={(e) => setPharmEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                      Drug Retail License Number (Form 20 / 21)
                    </label>
                    <input
                      type="text"
                      value={pharmLicense}
                      onChange={(e) => setPharmLicense(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                      Password / Chemist PIN
                    </label>
                    <input
                      type="password"
                      value={pharmPass}
                      onChange={(e) => setPharmPass(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#6d7a77] pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-[#00685f]" />
                    <span>Stay signed in on this dispensing terminal</span>
                  </label>
                  <button type="button" className="text-[#00685f] hover:underline font-semibold">
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="button"
                  disabled={loginStatus === 'authenticating'}
                  onClick={() => handleSimulateLogin('pharmacist')}
                  className="w-full py-3 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {loginStatus === 'authenticating' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Issuing Pharmacist JWT &amp; Initializing Tenant Schema...</span>
                    </>
                  ) : (
                    <>
                      <Store className="w-4 h-4" />
                      <span>Sign In to Pharmacist Store Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Quick 1-Click Demo Profiles */}
              <div className="pt-4 border-t border-[#e5eeff]">
                <p className="text-[11px] uppercase font-bold text-[#6d7a77] tracking-wider mb-2">
                  ⚡ Quick 1-Click Demo Pharmacist Logins:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSimulateLogin('pharmacist')}
                    className="p-2.5 rounded-xl border border-[#b2e5dc] bg-[#f0fbf9] hover:bg-[#e1f7f3] text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#00514a] group-hover:text-[#00685f]">
                        Jan Aushadhi Kendra #1084
                      </span>
                      <span className="text-[10px] bg-[#00685f] text-white px-1.5 py-0.5 rounded font-bold">
                        Govt PMBI
                      </span>
                    </div>
                    <p className="text-[10px] text-[#3d4947] mt-0.5">
                      Rajesh Patel, D.Pharm • Domlur BDA Complex
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      const apollo = {
                        ...DEMO_USERS.pharmacist,
                        name: 'Pooja Deshmukh, B.Pharm',
                        email: 'pooja@apollo-indiranagar.in',
                        tenantId: 'tenant-apollo-blr-04',
                        tenantName: 'Apollo Pharmacy 24/7 - HAL 2nd Stage',
                        licenseNumber: 'DL-KA-BNG-2022-7789'
                      };
                      onLoginSuccess(apollo);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-[#dce9ff] bg-[#f8f9ff] hover:bg-[#eff4ff] text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0b1c30] group-hover:text-[#00685f]">
                        Apollo Pharmacy 24/7
                      </span>
                      <span className="text-[10px] bg-[#eff4ff] text-[#3d4947] px-1.5 py-0.5 rounded font-bold">
                        Retail Chemist
                      </span>
                    </div>
                    <p className="text-[10px] text-[#3d4947] mt-0.5">
                      Pooja Deshmukh • HAL 2nd Stage, Indiranagar
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADMIN & SUPER ADMIN LOGIN */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="bg-[#eff4ff] border border-[#bed8ff] rounded-xl p-3 flex items-start gap-3 text-xs text-[#0a3161]">
                <ShieldCheck className="w-5 h-5 text-[#00685f] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Admin Portal &amp; Super Admin (Architecture Section 1 &amp; 4):</span>
                  <p className="mt-0.5 text-[#2c496f]">
                    Platform management interface for NPPA, CDSCO officers, and central operations: Tenant onboarding, user invitations, catalog governance, discrepancy enforcement, and system telemetry.
                  </p>
                </div>
              </div>

              {/* Persona switch toggle */}
              <div className="flex items-center gap-2 p-1 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                <button
                  type="button"
                  onClick={() => {
                    setAdminRoleType('super_admin');
                    setAdminEmail('dr.sharma@medicinecheck.gov.in');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    adminRoleType === 'super_admin'
                      ? 'bg-white text-[#00685f] shadow-xs'
                      : 'text-[#6d7a77]'
                  }`}
                >
                  Super Admin (System Management)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdminRoleType('platform_admin');
                    setAdminEmail('vikram.ops@medicinecheck.gov.in');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    adminRoleType === 'platform_admin'
                      ? 'bg-white text-[#00685f] shadow-xs'
                      : 'text-[#6d7a77]'
                  }`}
                >
                  Platform Admin (Operations)
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                    Official Admin Email (@medicinecheck.gov.in)
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                      Platform Master Password
                    </label>
                    <input
                      type="password"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#0b1c30] mb-1 flex items-center justify-between">
                      <span>MFA / TOTP Security Code</span>
                      <span className="text-[10px] text-[#006b2c] font-bold">2FA Required</span>
                    </label>
                    <input
                      type="text"
                      value={adminMfa}
                      onChange={(e) => setAdminMfa(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-mono text-center tracking-wider focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={loginStatus === 'authenticating'}
                  onClick={() => handleSimulateLogin(adminRoleType)}
                  className="w-full py-3 bg-[#0b1c30] hover:bg-[#132d4e] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {loginStatus === 'authenticating' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Validating MFA Token &amp; Generating Privileged JWT...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#008378]" />
                      <span>Authenticate as {adminRoleType === 'super_admin' ? 'Super Admin' : 'Platform Admin'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Quick 1-Click Demo Profiles */}
              <div className="pt-4 border-t border-[#e5eeff]">
                <p className="text-[11px] uppercase font-bold text-[#6d7a77] tracking-wider mb-2">
                  ⚡ Quick 1-Click Admin Demo Logins:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSimulateLogin('super_admin')}
                    className="p-2.5 rounded-xl border border-[#dce9ff] bg-[#f8f9ff] hover:bg-[#eff4ff] text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0b1c30] group-hover:text-[#00685f]">
                        Dr. Ananya Sharma
                      </span>
                      <span className="text-[10px] bg-[#ffdad6] text-[#93000a] px-1.5 py-0.5 rounded font-bold">
                        Super Admin
                      </span>
                    </div>
                    <p className="text-[10px] text-[#3d4947] mt-0.5">
                      CDSCO Clinical Director • All Capabilities (*)
                    </p>
                  </button>

                  <button
                    onClick={() => handleSimulateLogin('admin')}
                    className="p-2.5 rounded-xl border border-[#dce9ff] bg-[#f8f9ff] hover:bg-[#eff4ff] text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0b1c30] group-hover:text-[#00685f]">
                        Vikram Malhotra
                      </span>
                      <span className="text-[10px] bg-[#dae2fd] text-[#131b2e] px-1.5 py-0.5 rounded font-bold">
                        Platform Ops
                      </span>
                    </div>
                    <p className="text-[10px] text-[#3d4947] mt-0.5">
                      Tenant Provisioning, User RBAC &amp; Catalog Moderation
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONSUMER / PATIENT LOGIN */}
          {activeTab === 'consumer' && (
            <div className="space-y-4">
              <div className="bg-[#f0fbf9] border border-[#a2ecd8] rounded-xl p-3 flex items-start gap-3 text-xs text-[#00514a]">
                <UserCheck className="w-5 h-5 text-[#00685f] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Consumer Portal (Architecture Section 1):</span>
                  <p className="mt-0.5 text-[#2c4e47]">
                    Free public patient access for active salt comparisons, prescription savings calculations, nearest Jan Aushadhi locator, and reporting chemist overcharge breaches.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                    Mobile Number (India)
                  </label>
                  <input
                    type="text"
                    value={consumerPhone}
                    onChange={(e) => setConsumerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                    6-Digit SMS OTP
                  </label>
                  <input
                    type="text"
                    value={consumerOtp}
                    onChange={(e) => setConsumerOtp(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-mono text-center tracking-wider focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleSimulateLogin('consumer')}
                  className="w-full py-3 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Continue as Patient / Consumer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: JWT & CLAIMS INSPECTOR */}
          {activeTab === 'jwt-inspector' && (
            <div className="space-y-4">
              <div className="bg-[#111827] text-white rounded-xl p-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-gray-300 font-bold">Active Token Telemetry</span>
                  </div>
                  <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px] border border-emerald-800">
                    RS256 • Verified
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider block mb-1">
                      Decoded Payload Claims (Subject &amp; Tenant Isolation):
                    </span>
                    <pre className="bg-black/50 p-3 rounded-lg text-[11px] text-emerald-300 overflow-x-auto leading-relaxed border border-gray-800">
{JSON.stringify(currentUser.jwtPayload, null, 2)}
                    </pre>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-gray-800">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Active Role (RBAC):</span>
                      <span className="font-bold text-white">{currentUser.role}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Tenant ID:</span>
                      <span className="font-bold text-amber-400 font-mono">{currentUser.tenantId}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dce9ff] text-xs space-y-1">
                <div className="font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#00685f]" />
                  <span>Architecture Box 3: Identity &amp; Access Management Standards</span>
                </div>
                <p className="text-[11px] text-[#3d4947] leading-relaxed">
                  Every API gateway request includes a cryptographically signed JSON Web Token carrying the user&apos;s authenticated role, verified chemist license number, and organization tenant ID to enforce PostgreSQL schema isolation and Row-Level Security (RLS).
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Current Session Status */}
        <div className="bg-[#f8f9ff] border-t border-[#e5eeff] px-5 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#6d7a77]">Current Active Session:</span>
            <span className="font-bold text-[#0b1c30]">{currentUser.name}</span>
            <span className="bg-[#e5eeff] text-[#00685f] text-[10px] px-2 py-0.5 rounded-full font-bold">
              {currentUser.role}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] font-bold rounded-lg text-xs transition-colors"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
