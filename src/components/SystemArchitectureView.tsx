/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Database, 
  Server, 
  Activity, 
  GitBranch, 
  Globe, 
  Lock, 
  ArrowRight, 
  ChevronRight, 
  Key, 
  Radio, 
  Share2, 
  Workflow, 
  Zap, 
  CheckCircle2, 
  Sparkles,
  Terminal,
  Clock,
  HardDrive,
  Users,
  Building,
  CreditCard,
  Bell,
  Search,
  FileCheck
} from 'lucide-react';

export const SystemArchitectureView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string>('app-layer');
  const [activeTab, setActiveTab] = useState<'overview' | 'multitenancy' | 'pipeline' | 'security'>('overview');

  return (
    <div className="w-full pb-20 pt-28 bg-[#f8f9ff] min-h-screen">
      <div className="max-w-[76rem] mx-auto px-4 md:px-6">
        
        {/* Title Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff] mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-[#6d7a77] uppercase tracking-wider font-semibold">
                <span>System Architecture Blueprint</span>
                <span>/</span>
                <span className="text-[#00685f] font-bold">Multi-Tenant Healthcare Platform</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-[#0b1c30] tracking-tight mt-1 flex items-center gap-2">
                <span>medicine_check – System Architecture</span>
                <span className="bg-[#e5eeff] text-[#00685f] text-xs px-2.5 py-0.5 rounded-full font-bold">
                  v4.2 Production Ready
                </span>
              </h1>
              <p className="text-xs text-[#3d4947] mt-1">
                A Multi-Tenant SaaS Platform for Active Ingredient Medicine Comparison, Jan Aushadhi Discovery, and DPCO Price Transparency.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#006b2c]" />
                <span>Statutory DPCO &amp; CDSCO Compliant</span>
              </span>
            </div>
          </div>

          {/* Subtabs */}
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#f0f4ff] overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#00685f] text-white'
                  : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
              }`}
            >
              Architectural Layers (8 Tiers)
            </button>
            <button
              onClick={() => setActiveTab('multitenancy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'multitenancy'
                  ? 'bg-[#00685f] text-white'
                  : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
              }`}
            >
              Multi-Tenancy Isolation Strategy
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-[#00685f] text-white'
                  : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
              }`}
            >
              Real-time Ingestion &amp; Price Scraper Pipeline
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'security'
                  ? 'bg-[#00685f] text-white'
                  : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
              }`}
            >
              Cryptographic Audit &amp; Data Integrity
            </button>
          </div>
        </div>

        {/* Blueprint Interactive Diagram: Matches Image 1.png Structure */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* 1. Client Layer */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-[#0b1c30] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#00685f] text-white text-xs flex items-center justify-center font-bold">1</span>
                  <span>Client Layer (Multi-Persona Ingress)</span>
                </h3>
                <span className="text-[11px] text-[#6d7a77]">Responsive SPA &amp; Mobile Web</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                  <p className="font-bold text-[#0b1c30]">Patients &amp; Consumers</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Brand vs Salt Search, Geolocation, Savings Matrix</p>
                </div>
                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                  <p className="font-bold text-[#0b1c30]">Medical Stores &amp; Kendras</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Inventory POS Sync, Stock Upload, DPCO Alerts</p>
                </div>
                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                  <p className="font-bold text-[#0b1c30]">Pharma Companies</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Product Verification, Schedule M Certificates</p>
                </div>
                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                  <p className="font-bold text-[#0b1c30]">Operations Desk</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Clinical Pharmacists, Triage &amp; Discrepancy Queue</p>
                </div>
                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                  <p className="font-bold text-[#0b1c30]">Super Admin</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Platform Governance, Tenant Config, FIDO2 Keys</p>
                </div>
              </div>
            </div>

            {/* 2. Edge & Security Layer */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-[#0b1c30] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#00685f] text-white text-xs flex items-center justify-center font-bold">2</span>
                  <span>Edge Layer &amp; Gateway Protection</span>
                </h3>
                <span className="text-[11px] text-[#6d7a77]">Global CDN &amp; WAF Shield</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
                  <p className="font-bold text-[#0b1c30]">DNS &amp; Global CDN</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Route 53 / Cloudflare Edge Caching</p>
                </div>
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
                  <p className="font-bold text-[#0b1c30]">WAF &amp; Rate Limiting</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">DDoS mitigation, Scraper mitigation, Token bucket</p>
                </div>
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
                  <p className="font-bold text-[#0b1c30]">TLS 1.3 Termination</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Hardware HSM offload, Strict HSTS</p>
                </div>
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
                  <p className="font-bold text-[#0b1c30]">API Gateway Reverse Proxy</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Nginx / Kong: Request Routing &amp; Tenant Resolution</p>
                </div>
              </div>
            </div>

            {/* 3. Identity & Access Management */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-[#0b1c30] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#00685f] text-white text-xs flex items-center justify-center font-bold">3</span>
                  <span>Identity &amp; Access Management (IAM)</span>
                </h3>
                <span className="text-[11px] text-[#6d7a77]">RBAC + TBAC Multi-Tenant Context</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                  <p className="font-bold text-[#0b1c30]">JWT &amp; Refresh Tokens</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Stateless auth, RS256 signing, Token blacklisting in Redis</p>
                </div>
                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                  <p className="font-bold text-[#0b1c30]">Multi-Tenant RBAC/TBAC</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Role + Organization Scope enforcement</p>
                </div>
                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                  <p className="font-bold text-[#0b1c30]">FIDO2 / WebAuthn MFA</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Mandatory hardware keys for clinical cap overrides</p>
                </div>
                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                  <p className="font-bold text-[#0b1c30]">SSO &amp; Federation</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">OAuth 2.0 / SAML for hospital retail chains</p>
                </div>
              </div>
            </div>

            {/* 4. Application Layer: Core Modular Services */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-[#00685f]/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-[#0b1c30] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#00685f] text-white text-xs flex items-center justify-center font-bold">4</span>
                  <span>Application Layer (Modular Monolith / Services)</span>
                </h3>
                <span className="text-[11px] text-[#00685f] font-bold">High Performance Node.js Core</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs mb-4">
                <div className="p-3 bg-white rounded-xl border border-[#dce9ff] shadow-2xs">
                  <p className="font-bold text-[#00685f] flex items-center gap-1">
                    <Search className="w-3.5 h-3.5" />
                    Comparison Engine
                  </p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Bioequivalence matching, Stoichiometric 4:1 validation</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#dce9ff] shadow-2xs">
                  <p className="font-bold text-[#00685f] flex items-center gap-1">
                    <Database className="w-3.5 h-3.5" />
                    Medicine &amp; Catalog
                  </p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Canonical registry, Salt synonyms, Schedule H flags</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#dce9ff] shadow-2xs">
                  <p className="font-bold text-[#00685f] flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" />
                    DPCO Enforcement
                  </p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">NPPA Gazette ceiling scraper &amp; overcharge detection</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#dce9ff] shadow-2xs">
                  <p className="font-bold text-[#00685f] flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    Tenant &amp; Store Mgmt
                  </p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Jan Aushadhi Kendras, Apollo, MedPlus inventories</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#dce9ff] shadow-2xs">
                  <p className="font-bold text-[#00685f] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Audit &amp; Compliance
                  </p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">SHA-256 Merkle chain, CDSCO Form 46 generator</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#dce9ff] shadow-2xs">
                  <p className="font-bold text-[#00685f] flex items-center gap-1">
                    <Bell className="w-3.5 h-3.5" />
                    Notification Service
                  </p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">DPCO Section 6 notices, Stock intake webhook alerts</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#dce9ff] shadow-2xs">
                  <p className="font-bold text-[#00685f] flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    Reporting &amp; Telemetry
                  </p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Savings metrics, MTTR tracking, Search velocity</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#dce9ff] shadow-2xs">
                  <p className="font-bold text-[#00685f] flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" />
                    Subscription &amp; Billing
                  </p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Multi-tier pharmacy SaaS plans (Free, Kendra, Pro)</p>
                </div>
              </div>
            </div>

            {/* 5. Data Layer */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-black text-[#0b1c30] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#00685f] text-white text-xs flex items-center justify-center font-bold">5</span>
                  <span>Data Layer (Multi-Tier Storage &amp; Search)</span>
                </h3>
                <span className="text-[11px] text-[#6d7a77]">PostgreSQL + Redis + Elasticsearch</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                  <p className="font-bold text-[#0b1c30]">PostgreSQL Cluster</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">ACID primary store, Shared schemas + Tenant schemas, Row Level Security</p>
                </div>
                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                  <p className="font-bold text-[#0b1c30]">Redis 7 In-Memory Cache</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Sub-5ms comparison cache, Geohash spatial index, Session storage</p>
                </div>
                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                  <p className="font-bold text-[#0b1c30]">Elasticsearch 8.x</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Typo-tolerant fuzzy brand &amp; salt search, Phonetic phonetic matching</p>
                </div>
                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                  <p className="font-bold text-[#0b1c30]">AWS S3 / Immutable Ledger</p>
                  <p className="text-[11px] text-[#6d7a77] mt-0.5">Receipt scans, CDSCO XML certs, WORM (Write Once Read Many) logs</p>
                </div>
              </div>
            </div>

            {/* 6. Async & External Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff]">
                <h3 className="text-sm font-black text-[#0b1c30] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#00685f] text-white text-[10px] flex items-center justify-center font-bold">6</span>
                  <span>Async Workers &amp; Message Queue</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#e5eeff]">
                    <p className="font-bold text-[#0b1c30]">RabbitMQ / BullMQ Message Broker</p>
                    <p className="text-[11px] text-[#6d7a77]">Asynchronous crowd report OCR, EDI partner payload validation</p>
                  </div>
                  <div className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#e5eeff]">
                    <p className="font-bold text-[#0b1c30]">Cron Scheduler</p>
                    <p className="text-[11px] text-[#6d7a77]">DPCO gazette scraper, Kendra inventory daily reconciliation</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff]">
                <h3 className="text-sm font-black text-[#0b1c30] uppercase tracking-wider mb-2 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#00685f] text-white text-[10px] flex items-center justify-center font-bold">7</span>
                  <span>External Regulatory &amp; Cloud Integrations</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#e5eeff]">
                    <p className="font-bold text-[#0b1c30]">CDSCO / NPPA Price Feed Gateway</p>
                    <p className="text-[11px] text-[#6d7a77]">Direct mutual TLS sync with National Pharmaceutical Pricing Authority</p>
                  </div>
                  <div className="p-2.5 bg-[#f8f9ff] rounded-lg border border-[#e5eeff]">
                    <p className="font-bold text-[#0b1c30]">Google Maps &amp; Geocoding API</p>
                    <p className="text-[11px] text-[#6d7a77]">Jan Aushadhi Kendra radius search &amp; delivery pincode clustering</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Multi-Tenancy Isolation Strategy */}
        {activeTab === 'multitenancy' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff] space-y-6">
            <div>
              <h2 className="text-lg font-black text-[#0b1c30]">SaaS Multi-Tenancy Architecture</h2>
              <p className="text-xs text-[#6d7a77] mt-0.5">
                How medicine_check provides clean tenant isolation across independent pharmacy chains and retail stores.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                <span className="text-[10px] uppercase font-bold text-[#00685f] tracking-wider block mb-1">
                  Isolation Pattern
                </span>
                <h4 className="text-sm font-bold text-[#0b1c30]">Shared Database + Schema Isolation</h4>
                <p className="text-xs text-[#3d4947] mt-2 leading-relaxed">
                  Canonical medicine formulations and DPCO price ceilings reside in a shared, read-optimized schema. Partner store inventories and private price feeds are isolated in tenant schemas or secured with PostgreSQL Row-Level Security (RLS).
                </p>
              </div>

              <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                <span className="text-[10px] uppercase font-bold text-[#00685f] tracking-wider block mb-1">
                  Tenant Context Middleware
                </span>
                <h4 className="text-sm font-bold text-[#0b1c30]">Tenant ID Extraction &amp; Binding</h4>
                <p className="text-xs text-[#3d4947] mt-2 leading-relaxed">
                  Every incoming API request resolves the tenant context via subdomain, custom domain, or JWT claims. The tenant context is bound to the async execution scope, automatically scoping all ORM queries.
                </p>
              </div>

              <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                <span className="text-[10px] uppercase font-bold text-[#00685f] tracking-wider block mb-1">
                  Subscription Tiers
                </span>
                <h4 className="text-sm font-bold text-[#0b1c30]">Feature Gating &amp; Rate Limits</h4>
                <p className="text-xs text-[#3d4947] mt-2 leading-relaxed">
                  SaaS tiers (Free Kendra, Standard Retailer, Enterprise Pharmacy Chain) are enforced at the API gateway layer with customized burst limits and POS synchronization webhooks.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#0b1c30] text-white rounded-xl font-mono text-xs overflow-x-auto">
              <p className="text-emerald-400 font-bold mb-1">// Sample PostgreSQL RLS Policy for Tenant Inventory Isolation</p>
              <p className="text-gray-300">CREATE POLICY tenant_isolation_policy ON store_inventory</p>
              <p className="text-gray-300">FOR ALL USING (tenant_id = current_setting(&apos;app.current_tenant_id&apos;)::uuid);</p>
              <p className="text-gray-400 mt-2">// Ensures one pharmacy chain cannot read or overwrite another chain&apos;s physical stock levels</p>
            </div>
          </div>
        )}

        {/* Tab 3: Real-time Ingestion & Price Scraper */}
        {activeTab === 'pipeline' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff] space-y-6">
            <div>
              <h2 className="text-lg font-black text-[#0b1c30]">Real-time Ingestion &amp; Price Scraper Pipeline</h2>
              <p className="text-xs text-[#6d7a77] mt-0.5">
                End-to-end data pipeline from government gazette publications to consumer search indices.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#00685f] text-white flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-[#0b1c30]">Gazette Ingestion &amp; OCR Verification</h4>
                  <p className="text-[#3d4947] mt-1">
                    NPPA publishes revised DPCO ceiling orders as PDF gazettes (e.g. S.O. 1542(E)). Our automated ingest workers extract tabular price records, cross-check against Indian Pharmacopoeia monographs, and compute cryptographic hashes.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#00685f] text-white flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-[#0b1c30]">Retail Chemist Feed Reconciliation</h4>
                  <p className="text-[#3d4947] mt-1">
                    Partner pharmacy EDI feeds (Apollo, MedPlus, Netmeds) sync inventory prices via webhooks. If any retail SKU exceeds the statutory DPCO cap + 0%, a critical discrepancy ticket is automatically created in the Triage Workbench.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#00685f] text-white flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-[#0b1c30]">Crowdsourced Patient Verification</h4>
                  <p className="text-[#3d4947] mt-1">
                    Patients upload pharmacy receipt photos. Our machine learning OCR extracts the printed MRP and tax details, correlating them with verified physical store GPS coordinates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Cryptographic Audit & Integrity */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff] space-y-6">
            <div>
              <h2 className="text-lg font-black text-[#0b1c30]">Cryptographic Audit &amp; Data Integrity</h2>
              <p className="text-xs text-[#6d7a77] mt-0.5">
                Every price adjustment and equivalence decision is cryptographically anchored.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                <h4 className="font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-[#00685f]" />
                  ECDSA P-256 Hardware Signatures
                </h4>
                <p className="text-[#3d4947] mt-2 leading-relaxed">
                  Lead Clinical Pharmacists sign price enforcement actions using FIDO2 hardware security tokens. The signature is recorded with the block hash in the immutable audit ledger.
                </p>
              </div>

              <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                <h4 className="font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00685f]" />
                  Merkle Root Chain Proof
                </h4>
                <p className="text-[#3d4947] mt-2 leading-relaxed">
                  Audit events are batched into hourly Merkle trees. Any attempt to modify historic price compliance logs invalidates the Merkle root, guaranteeing forensic tamper-evidence for CDSCO inspections.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
