/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Building2, Layers, Settings, FileCheck, Activity, Search, Plus, CheckCircle2, AlertTriangle, ShieldAlert, History, Cpu, Database, Server, Lock, Sparkles, X, ExternalLink, ChevronRight, TrendingUp, RefreshCw, Key, UserCheck
} from 'lucide-react';
import { 
  AuthUser, TenantOrganization, PlatformUserItem, UserRole, AppViewMode
} from '../types';
import { INITIAL_TENANTS, INITIAL_PLATFORM_USERS } from '../data/portalMockData';
import { api } from '../api/client';

interface AdminPortalViewProps {
  currentUser: AuthUser;
  onNavigateToView: (view: AppViewMode) => void;
  onOpenComplianceCert: () => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  currentUser,
  onNavigateToView,
  onOpenComplianceCert
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'users' | 'moderation' | 'system'>('overview');

  // Tenant state
  const [tenants, setTenants] = useState<TenantOrganization[]>(INITIAL_TENANTS);
  const [tenantSearch, setTenantSearch] = useState('');
  const [tenantFilter, setTenantFilter] = useState<'all' | 'medical_store' | 'pharma_company'>('all');
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);

  // New Tenant Form
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgType, setNewOrgType] = useState<'medical_store' | 'pharma_company'>('medical_store');
  const [newOwner, setNewOwner] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [newLicense, setNewLicense] = useState('');
  const [newCity, setNewCity] = useState('Bengaluru 560001');
  const [newPlan, setNewPlan] = useState<'Free Community' | 'Chemist Pro' | 'Enterprise Multi-Store'>('Chemist Pro');

  // User management state
  const [users, setUsers] = useState<PlatformUserItem[]>([]);
  const [userSearch, setUserSearch] = useState('');

  // Load platform users via API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await api.getPlatformUsers();
        // The API returns AuthUser[], while the view uses PlatformUserItem[]
        // We'll map them appropriately
        const platformUsers = usersData.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          tenantName: u.tenantName,
          tenantId: u.tenantId,
          mfaEnabled: true,
          status: 'active' as const,
          lastActive: 'Just now',
          permissions: u.permissions
        }));
        setUsers(platformUsers);
      } catch (err) {
        console.error('Failed to fetch platform users', err);
      }
    };
    fetchUsers();
  }, []);
  const [showInviteUserModal, setShowInviteUserModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('catalog_ops');
  const [inviteTenant, setInviteTenant] = useState('National Drug Transparency Mission');

  // System config state
  const [dpcoThreshold, setDpcoThreshold] = useState(5.0);
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [cronInterval, setCronInterval] = useState('Every 15 minutes');
  const [configSavedToast, setConfigSavedToast] = useState(false);

  // Add Tenant
  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName) return;

    const tenantId = `tenant-${newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.floor(100 + Math.random() * 900)}`;
    const newTenant: TenantOrganization = {
      id: tenantId,
      name: newOrgName,
      type: newOrgType,
      plan: newPlan,
      ownerName: newOwner || 'Store Admin',
      ownerEmail: newOwnerEmail || `${tenantId}@medicinecheck.org`,
      licenseNumber: newLicense || 'DL-KA-BNG-2026-REG',
      cityPincode: newCity,
      status: 'active',
      monthlySearches: 0,
      inventoryItemsCount: 1,
      joinedDate: 'Today',
      dbSchema: `tenant_${tenantId.replace(/-/g, '_')}`
    };

    setTenants([newTenant, ...tenants]);
    setShowAddTenantModal(false);
    setNewOrgName('');
    setNewOwner('');
    setNewOwnerEmail('');
  };

  // Toggle Tenant Status
  const handleToggleTenantStatus = (id: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'active' ? 'suspended' : 'active'
        };
      }
      return t;
    }));
  };

  // Invite User
  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    const newUser: PlatformUserItem = {
      id: `USR-INV-${Date.now().toString().slice(-4)}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      tenantName: inviteTenant,
      tenantId: 'tenant-platform-ops',
      mfaEnabled: true,
      status: 'invited',
      lastActive: 'Pending Acceptance',
      permissions: ['catalog:read', 'catalog:brand_mapping']
    };

    setUsers([newUser, ...users]);
    setShowInviteUserModal(false);
    setInviteName('');
    setInviteEmail('');
  };

  // Filtered tenants
  const filteredTenants = tenants.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.licenseNumber.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      t.ownerName.toLowerCase().includes(tenantSearch.toLowerCase());
    const matchesType = tenantFilter === 'all' || t.type === tenantFilter;
    return matchesSearch && matchesType;
  });

  // Filtered users
  const filteredUsers = users.filter(u => {
    return (
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.tenantName.toLowerCase().includes(userSearch.toLowerCase())
    );
  });

  return (
    <div className="w-full pb-20 pt-28 bg-[#f8f9ff] min-h-screen">
      <div className="max-w-[76rem] mx-auto px-4 md:px-6">

        {/* Admin Header & Identity Context */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#e5eeff] mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#0b1c30] text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-[#008378]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-[#00685f] bg-[#e5eeff] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {currentUser.role === 'super_admin' ? 'Super Admin Portal' : 'Platform Administration Portal'}
                  </span>
                  <span className="text-[11px] text-[#006b2c] font-bold flex items-center gap-1 bg-[#d6f5df] px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Central Government / CDSCO Gateway Online
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#0b1c30] tracking-tight">
                  National Medicine Price &amp; Catalog Governance Console
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#3d4947] mt-1">
                  <span>Authorized Operator: <strong>{currentUser.name}</strong></span>
                  <span>•</span>
                  <span>Role (RBAC): <strong className="font-mono text-[#00685f]">{currentUser.role}</strong></span>
                  <span>•</span>
                  <span>Isolation: <strong>Multi-Tenant Shared DB + Separate Schemas</strong></span>
                </div>
              </div>
            </div>

            {/* Direct shortcuts to critical operational views */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onNavigateToView('admin-discrepancy-queue')}
                className="px-3.5 py-2 bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#93000a] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Discrepancy Triage (14)</span>
              </button>

              <button
                onClick={() => onNavigateToView('admin-audit-logs')}
                className="px-3.5 py-2 bg-[#d6f5df] hover:bg-[#bbf0cb] text-[#00521f] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <History className="w-4 h-4 text-[#006b2c]" />
                <span>Audit Ledger</span>
              </button>

              <button
                onClick={() => onNavigateToView('admin-system-architecture')}
                className="px-3.5 py-2 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-[#dce9ff]"
              >
                <Cpu className="w-4 h-4 text-[#00685f]" />
                <span>Architecture Diagram</span>
              </button>
            </div>
          </div>

          {/* Quick Platform KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-4 border-t border-[#f0f4ff]">
            <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff]">
              <span className="text-[11px] text-[#6d7a77] uppercase font-bold block">Active Tenants</span>
              <span className="text-lg font-black text-[#0b1c30] mt-0.5 block">{tenants.length} Organizations</span>
              <span className="text-[10px] text-[#00685f] font-semibold">Medical Stores &amp; Pharma</span>
            </div>

            <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff]">
              <span className="text-[11px] text-[#6d7a77] uppercase font-bold block">Canonical Formulations</span>
              <span className="text-lg font-black text-[#0b1c30] mt-0.5 block">45,210 Drugs</span>
              <span className="text-[10px] text-[#006b2c] font-semibold">100% DPCO Synced</span>
            </div>

            <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff]">
              <span className="text-[11px] text-[#6d7a77] uppercase font-bold block">Cache Hit Rate (Redis)</span>
              <span className="text-lg font-black text-[#006b2c] mt-0.5 block">98.4%</span>
              <span className="text-[10px] text-[#3d4947] font-semibold">18.4k req/min traffic</span>
            </div>

            <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff]">
              <span className="text-[11px] text-[#6d7a77] uppercase font-bold block">Security &amp; Audit</span>
              <span className="text-lg font-black text-[#00685f] mt-0.5 block">SHA-256 Merkle</span>
              <span className="text-[10px] text-[#006b2c] font-semibold">Tamper-evident logs</span>
            </div>
          </div>
        </div>

        {/* Config Saved Toast */}
        {configSavedToast && (
          <div className="mb-4 bg-[#d6f5df] border border-[#7ae39d] text-[#00521f] px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#006b2c]" />
              <span>Platform configuration updated and broadcast to all API Gateway worker nodes!</span>
            </div>
            <button onClick={() => setConfigSavedToast(false)} className="text-[#00521f] hover:text-black">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Sub-Tabs */}
        <div className="flex border-b border-[#e5eeff] bg-white rounded-t-2xl px-4 pt-3 gap-2 overflow-x-auto shadow-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#eff4ff] text-[#00685f] border-b-2 border-[#00685f]'
                : 'text-[#6d7a77] hover:text-[#0b1c30]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Platform Dashboard &amp; Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('tenants')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'tenants'
                ? 'bg-[#eff4ff] text-[#00685f] border-b-2 border-[#00685f]'
                : 'text-[#6d7a77] hover:text-[#0b1c30]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Tenant Management (SaaS Multi-Tenancy)</span>
            <span className="bg-[#e5eeff] text-[#00685f] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {tenants.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-[#eff4ff] text-[#00685f] border-b-2 border-[#00685f]'
                : 'text-[#6d7a77] hover:text-[#0b1c30]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management &amp; RBAC</span>
            <span className="bg-[#e5eeff] text-[#00685f] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'moderation'
                ? 'bg-[#eff4ff] text-[#00685f] border-b-2 border-[#00685f]'
                : 'text-[#6d7a77] hover:text-[#0b1c30]'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Content &amp; Catalog Moderation</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'system'
                ? 'bg-[#eff4ff] text-[#00685f] border-b-2 border-[#00685f]'
                : 'text-[#6d7a77] hover:text-[#0b1c30]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>System Configuration &amp; Async Workers</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & TELEMETRY */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-b-2xl p-5 sm:p-6 shadow-sm border-x border-b border-[#e5eeff] space-y-6">
            
            {/* Real-time Services Map (from Section 4 & 5 of Diagram) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dce9ff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0b1c30] flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#00685f]" />
                    <span>PostgreSQL Primary Database</span>
                  </span>
                  <span className="text-[10px] bg-[#d6f5df] text-[#006b2c] px-2 py-0.5 rounded font-bold">
                    Connected
                  </span>
                </div>
                <p className="text-[11px] text-[#3d4947]">
                  Shared platform tables (`users`, `tenants`, `subscriptions`) + isolated PostgreSQL schemas per tenant organization.
                </p>
                <div className="text-[10px] font-mono text-[#6d7a77] pt-1">
                  Active Connections: 48/200 • Latency: 4ms
                </div>
              </div>

              <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dce9ff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0b1c30] flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#00685f]" />
                    <span>Redis Session &amp; Price Cache</span>
                  </span>
                  <span className="text-[10px] bg-[#d6f5df] text-[#006b2c] px-2 py-0.5 rounded font-bold">
                    98.4% Hit Rate
                  </span>
                </div>
                <p className="text-[11px] text-[#3d4947]">
                  Caches active formulations, statutory ceiling prices, and tenant token sessions to handle consumer search bursts.
                </p>
                <div className="text-[10px] font-mono text-[#6d7a77] pt-1">
                  Memory Used: 1.4 GB / 8 GB • Keys: 242,190
                </div>
              </div>

              <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dce9ff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0b1c30] flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-[#00685f]" />
                    <span>Async Workers (RabbitMQ)</span>
                  </span>
                  <span className="text-[10px] bg-[#d6f5df] text-[#006b2c] px-2 py-0.5 rounded font-bold">
                    16 Nodes Active
                  </span>
                </div>
                <p className="text-[11px] text-[#3d4947]">
                  Processes automated price scraping, discrepancy detection algorithms, and NPPA Gazette sync jobs.
                </p>
                <div className="text-[10px] font-mono text-[#6d7a77] pt-1">
                  Queue Length: 0 • Daily Tasks: 1.8M
                </div>
              </div>
            </div>

            {/* Architecture Multi-Tenant Isolation Status Box */}
            <div className="border border-[#e5eeff] rounded-xl p-5 bg-[#f0fbf9] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#00685f]" />
                  <h3 className="font-bold text-sm text-[#0b1c30]">
                    SaaS Multi-Tenancy Architecture (Diagram Blueprint)
                  </h3>
                </div>
                <span className="bg-[#00685f] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Active Enforcement
                </span>
              </div>
              <p className="text-xs text-[#2c4e47] leading-relaxed">
                As detailed in the architecture diagram, <strong>medicine_check</strong> runs an <em>Isolation Strategy</em> using a shared PostgreSQL cluster with separate schema partitioning per medical store and pharma tenant. JWT tokens injected by the API Gateway enforce strict Row-Level Security (RLS) and cryptographic tenant boundary isolation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                <div className="bg-white p-3 rounded-lg border border-[#a2ecd8]">
                  <span className="font-bold text-[#00514a] block">Tenant Context in JWT</span>
                  <span className="text-[11px] text-[#3d4947]">`tenant_id`, `role`, `license_no` verified on every API request.</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#a2ecd8]">
                  <span className="font-bold text-[#00514a] block">Statutory DPCO Guardrails</span>
                  <span className="text-[11px] text-[#3d4947]">Automated triggers prevent chemist price hikes beyond DPCO ceiling.</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#a2ecd8]">
                  <span className="font-bold text-[#00514a] block">SHA-256 Audit Trail</span>
                  <span className="text-[11px] text-[#3d4947]">Every ceiling price update or listing freeze is signed and verifiable.</span>
                </div>
              </div>
            </div>

            {/* Quick Operational Shortcuts */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#3d4947] mb-3">
                Administrative Operations Modules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => onNavigateToView('admin-discrepancy-queue')}
                  className="p-4 rounded-xl border border-[#e5eeff] hover:border-[#ba1a1a] bg-[#f8f9ff] text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#0b1c30] group-hover:text-[#ba1a1a]">
                      Discrepancy Triage Workbench
                    </span>
                    <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-1.5 py-0.5 rounded">
                      14 Tickets
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6d7a77]">
                    Investigate retail chemists selling above statutory ceiling caps. Quarantine rogue feeds.
                  </p>
                </button>

                <button
                  onClick={() => onNavigateToView('admin-audit-logs')}
                  className="p-4 rounded-xl border border-[#e5eeff] hover:border-[#00685f] bg-[#f8f9ff] text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#0b1c30] group-hover:text-[#00685f]">
                      Tamper-Evident Audit Ledger
                    </span>
                    <span className="bg-[#d6f5df] text-[#006b2c] text-[10px] font-bold px-1.5 py-0.5 rounded">
                      Merkle Tree
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6d7a77]">
                    Cryptographic block ledger tracing regulatory gazette updates and administrative overrides.
                  </p>
                </button>

                <button
                  onClick={() => onNavigateToView('admin-catalog-governance')}
                  className="p-4 rounded-xl border border-[#e5eeff] hover:border-[#00685f] bg-[#f8f9ff] text-left transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-[#0b1c30] group-hover:text-[#00685f]">
                      Catalog Governance
                    </span>
                    <span className="bg-[#e5eeff] text-[#00685f] text-[10px] font-bold px-1.5 py-0.5 rounded">
                      45k+ Drugs
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6d7a77]">
                    Active ingredient formulation index, Schedule M approvals, and Jan Aushadhi substitution mappings.
                  </p>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: TENANT MANAGEMENT */}
        {activeTab === 'tenants' && (
          <div className="bg-white rounded-b-2xl p-5 sm:p-6 shadow-sm border-x border-b border-[#e5eeff] space-y-4">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6d7a77]" />
                <input
                  type="text"
                  placeholder="Search tenant organization, license #, owner, or tenant ID..."
                  value={tenantSearch}
                  onChange={(e) => setTenantSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-[#f8f9ff] border border-[#dce9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={tenantFilter}
                  onChange={(e) => setTenantFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-medium focus:outline-none"
                >
                  <option value="all">All Tenant Types</option>
                  <option value="medical_store">Medical Stores / Chemists</option>
                  <option value="pharma_company">Pharma Companies</option>
                </select>

                <button
                  onClick={() => setShowAddTenantModal(true)}
                  className="px-3.5 py-2 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Onboard New Tenant</span>
                </button>
              </div>
            </div>

            {/* Tenant Table */}
            <div className="overflow-x-auto rounded-xl border border-[#e5eeff]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9ff] text-[#3d4947] uppercase font-bold border-b border-[#e5eeff]">
                  <tr>
                    <th className="p-3">Organization &amp; Tenant ID</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Drug License #</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3">DB Schema</th>
                    <th className="p-3">Monthly Traffic</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f4ff]">
                  {filteredTenants.map((t) => (
                    <tr key={t.id} className="hover:bg-[#f8f9ff]/70 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-[#0b1c30]">{t.name}</div>
                        <div className="font-mono text-[10px] text-[#00685f]">{t.id}</div>
                        <div className="text-[10px] text-[#6d7a77]">{t.ownerName} • {t.cityPincode}</div>
                      </td>

                      <td className="p-3">
                        <span className="bg-[#eff4ff] text-[#0b1c30] text-[10px] font-bold px-2 py-0.5 rounded">
                          {t.type.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="p-3 font-mono text-[11px] text-[#3d4947]">
                        {t.licenseNumber}
                      </td>

                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.plan.includes('Enterprise')
                            ? 'bg-[#dae2fd] text-[#131b2e]'
                            : 'bg-[#e5eeff] text-[#00685f]'
                        }`}>
                          {t.plan}
                        </span>
                      </td>

                      <td className="p-3 font-mono text-[11px] text-[#6d7a77]">
                        {t.dbSchema}
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-[#0b1c30]">{t.monthlySearches.toLocaleString()} reqs</div>
                        <div className="text-[10px] text-[#6d7a77]">{t.inventoryItemsCount} SKUs</div>
                      </td>

                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.status === 'active'
                            ? 'bg-[#d6f5df] text-[#006b2c]'
                            : 'bg-[#ffdad6] text-[#93000a]'
                        }`}>
                          {t.status.toUpperCase()}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleToggleTenantStatus(t.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            t.status === 'active'
                              ? 'text-[#ba1a1a] hover:bg-[#ffdad6]'
                              : 'text-[#006b2c] hover:bg-[#d6f5df]'
                          }`}
                        >
                          {t.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: USER MANAGEMENT & RBAC */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-b-2xl p-5 sm:p-6 shadow-sm border-x border-b border-[#e5eeff] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6d7a77]" />
                <input
                  type="text"
                  placeholder="Search user by name, email, or role..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-[#f8f9ff] border border-[#dce9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                />
              </div>

              <button
                onClick={() => setShowInviteUserModal(true)}
                className="px-3.5 py-2 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Invite Team Member</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#e5eeff]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9ff] text-[#3d4947] uppercase font-bold border-b border-[#e5eeff]">
                  <tr>
                    <th className="p-3">User &amp; Email</th>
                    <th className="p-3">Assigned Role (RBAC)</th>
                    <th className="p-3">Tenant Organization</th>
                    <th className="p-3">MFA</th>
                    <th className="p-3">Last Active</th>
                    <th className="p-3">Permissions Scope</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f4ff]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#f8f9ff]/70 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-[#0b1c30]">{u.name}</div>
                        <div className="text-[11px] text-[#6d7a77]">{u.email}</div>
                        <div className="text-[10px] font-mono text-[#00685f]">{u.id}</div>
                      </td>

                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          u.role === 'super_admin'
                            ? 'bg-[#ffdad6] text-[#93000a]'
                            : u.role === 'platform_admin'
                            ? 'bg-[#dae2fd] text-[#131b2e]'
                            : 'bg-[#d6f5df] text-[#006b2c]'
                        }`}>
                          {u.role}
                        </span>
                      </td>

                      <td className="p-3 text-[#3d4947]">{u.tenantName}</td>

                      <td className="p-3">
                        {u.mfaEnabled ? (
                          <span className="text-[10px] text-[#006b2c] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#6d7a77]">Disabled</span>
                        )}
                      </td>

                      <td className="p-3 text-[#3d4947]">{u.lastActive}</td>

                      <td className="p-3">
                        <div className="text-[10px] text-[#3d4947] max-w-xs truncate">
                          {u.permissions.join(', ')}
                        </div>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={() => alert(`JWT session for ${u.email} revoked.`)}
                          className="text-[10px] text-[#ba1a1a] hover:underline font-bold"
                        >
                          Revoke Session
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CONTENT & CATALOG MODERATION */}
        {activeTab === 'moderation' && (
          <div className="bg-white rounded-b-2xl p-5 sm:p-6 shadow-sm border-x border-b border-[#e5eeff] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
              <div>
                <h3 className="font-bold text-sm text-[#0b1c30]">National Medicine Catalog Moderation</h3>
                <p className="text-xs text-[#6d7a77]">
                  Approve brand-to-generic mappings, verify therapeutic equivalence certificates, and enforce DPCO 2013 Gazette price caps.
                </p>
              </div>
              <button
                onClick={onOpenComplianceCert}
                className="px-3.5 py-2 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00685f] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-[#dce9ff]"
              >
                <FileCheck className="w-4 h-4" />
                <span>View CDSCO Gazette Certificate</span>
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'MOD-9912',
                  medicine: 'Augmentin 625 Duo',
                  salt: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
                  issue: 'Statutory Cap breach flagged by 14 consumers in Bengaluru',
                  status: 'Quarantine Recommended',
                  statusColor: 'bg-[#ffdad6] text-[#93000a]'
                },
                {
                  id: 'MOD-9913',
                  medicine: 'Telma 40 vs Telmisartan 40mg Jan Aushadhi',
                  salt: 'Telmisartan (40mg)',
                  issue: 'Bioequivalence study verified (100% dissolution match)',
                  status: 'Approved for Direct Substitution',
                  statusColor: 'bg-[#d6f5df] text-[#006b2c]'
                },
                {
                  id: 'MOD-9914',
                  medicine: 'Rosuvas 10 vs Rosuvastatin 10mg Jan Aushadhi',
                  salt: 'Rosuvastatin Calcium (10mg)',
                  issue: 'Pharmacist inventory feed sync updated with batch EXP-2028',
                  status: 'Catalog Verified',
                  statusColor: 'bg-[#eff4ff] text-[#00685f]'
                }
              ].map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-[#e5eeff] bg-[#f8f9ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#0b1c30]">{item.medicine}</span>
                      <span className="text-xs text-[#6d7a77]">({item.salt})</span>
                      <span className="font-mono text-[10px] text-[#00685f]">{item.id}</span>
                    </div>
                    <p className="text-xs text-[#3d4947] mt-1">{item.issue}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${item.statusColor}`}>
                      {item.status}
                    </span>
                    <button
                      onClick={() => onNavigateToView('admin-discrepancy-queue')}
                      className="px-3 py-1.5 bg-white border border-[#dce9ff] text-xs font-bold rounded-lg text-[#00685f] hover:bg-[#eff4ff]"
                    >
                      Inspect →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SYSTEM CONFIG & ASYNC WORKERS */}
        {activeTab === 'system' && (
          <div className="bg-white rounded-b-2xl p-5 sm:p-6 shadow-sm border-x border-b border-[#e5eeff] space-y-6">
            <div>
              <h3 className="font-bold text-sm text-[#0b1c30]">Platform Automation &amp; Async Workers Configuration</h3>
              <p className="text-xs text-[#6d7a77]">
                Configure price anomaly thresholds, CDSCO sync schedules, and API Gateway rate limiting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 rounded-xl border border-[#e5eeff] bg-[#f8f9ff]">
                <h4 className="font-bold text-xs uppercase text-[#0b1c30]">Price Discrepancy Engine</h4>

                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                    Statutory Cap Deviation Alert Threshold (%):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={dpcoThreshold}
                    onChange={(e) => setDpcoThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#dce9ff] rounded-xl font-bold"
                  />
                  <span className="text-[10px] text-[#6d7a77]">
                    Any chemist selling price exceeding DPCO ceiling by this percentage triggers automated review.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-xs font-bold text-[#0b1c30] block">Automated Quarantine</span>
                    <span className="text-[10px] text-[#6d7a77]">Instantly hide rogue chemist pricing above 15%</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoQuarantine}
                    onChange={(e) => setAutoQuarantine(e.target.checked)}
                    className="w-5 h-5 accent-[#00685f]"
                  />
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-xl border border-[#e5eeff] bg-[#f8f9ff]">
                <h4 className="font-bold text-xs uppercase text-[#0b1c30]">Scheduled Cron &amp; Telemetry</h4>

                <div>
                  <label className="block text-xs font-bold text-[#0b1c30] mb-1">
                    CDSCO &amp; NPPA Gazette Sync Cadence:
                  </label>
                  <select
                    value={cronInterval}
                    onChange={(e) => setCronInterval(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#dce9ff] rounded-xl font-semibold"
                  >
                    <option value="Every 5 minutes">Every 5 minutes (Aggressive)</option>
                    <option value="Every 15 minutes">Every 15 minutes (Standard Production)</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                  <span className="text-[10px] text-[#6d7a77]">
                    Asynchronous background worker updates statutory price caps from national regulatory endpoints.
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setConfigSavedToast(true);
                      setTimeout(() => setConfigSavedToast(false), 3000);
                    }}
                    className="w-full py-2.5 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Platform Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Onboard New Tenant */}
      {showAddTenantModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dce9ff]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff] mb-4">
              <h3 className="text-base font-bold text-[#0b1c30] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00685f]" />
                <span>Onboard New Tenant Organization</span>
              </h3>
              <button onClick={() => setShowAddTenantModal(false)} className="text-[#6d7a77] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTenant} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Organization / Chemist Store Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apollo Pharmacy Indiranagar Central"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Tenant Type</label>
                  <select
                    value={newOrgType}
                    onChange={(e) => setNewOrgType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl"
                  >
                    <option value="medical_store">Medical Store / Pharmacy</option>
                    <option value="pharma_company">Pharma Company</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Subscription Plan</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl"
                  >
                    <option value="Free Community">Free Community</option>
                    <option value="Chemist Pro">Chemist Pro</option>
                    <option value="Enterprise Multi-Store">Enterprise Multi-Store</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Owner / Lead Pharmacist Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sunil Nair, D.Pharm"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Owner Email</label>
                  <input
                    type="email"
                    placeholder="owner@store.com"
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Drug License Number</label>
                  <input
                    type="text"
                    placeholder="DL-KA-BNG-2026-XXXX"
                    value={newLicense}
                    onChange={(e) => setNewLicense(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">City &amp; Pincode</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#e5eeff] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTenantModal(false)}
                  className="px-4 py-2 bg-[#eff4ff] text-[#3d4947] rounded-xl font-bold hover:bg-[#dce9ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00685f] text-white rounded-xl font-bold hover:bg-[#008378]"
                >
                  Provision Isolated Tenant Schema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Invite User */}
      {showInviteUserModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#dce9ff]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff] mb-4">
              <h3 className="text-base font-bold text-[#0b1c30] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#00685f]" />
                <span>Invite Platform Team Member</span>
              </h3>
              <button onClick={() => setShowInviteUserModal(false)} className="text-[#6d7a77] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Priya Rao"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="priya.rao@medicinecheck.gov.in"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Assigned Role (RBAC)</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl"
                >
                  <option value="platform_admin">Platform Admin (Operations)</option>
                  <option value="catalog_ops">Catalog Operations Specialist</option>
                  <option value="security_officer">Security &amp; Compliance Officer</option>
                  <option value="medical_store">Lead Pharmacist</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Tenant Organization</label>
                <input
                  type="text"
                  value={inviteTenant}
                  onChange={(e) => setInviteTenant(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-[#e5eeff] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteUserModal(false)}
                  className="px-4 py-2 bg-[#eff4ff] text-[#3d4947] rounded-xl font-bold hover:bg-[#dce9ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00685f] text-white rounded-xl font-bold hover:bg-[#008378]"
                >
                  Send Invitation Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
