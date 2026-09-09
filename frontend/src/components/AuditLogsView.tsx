/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  Download, 
  FileText, 
  Search, 
  Filter, 
  Lock, 
  ExternalLink, 
  Hash, 
  UserCheck, 
  History, 
  ChevronRight, 
  AlertTriangle,
  FileCheck,
  Check,
  RefreshCw,
  Copy,
  Calendar,
  Layers,
  Terminal,
  Clock
} from 'lucide-react';
import { AUDIT_LOG_EVENTS } from '../../../shared/data/mockData';
import { AuditLogEvent } from '../../../shared/types';

interface AuditLogsViewProps {
  onOpenComplianceCert: () => void;
  recentResolvedAction?: { ticketId: string; rationale: string; price: number } | null;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  onOpenComplianceCert,
  recentResolvedAction
}) => {
  const [events, setEvents] = useState<AuditLogEvent[]>(() => {
    // If a recent action occurred, dynamically prepend it
    if (recentResolvedAction) {
      const dynamicEvent: AuditLogEvent = {
        id: `AUD-2026-${Math.floor(88191 + Math.random() * 100)}`,
        timestamp: 'Just now (10:44 AM IST)',
        dateTag: 'Today, 24 Oct 2026',
        actorName: 'Dr. Ananya Sharma',
        actorEmail: 'ananya.s@medcheck.in',
        actorRole: 'Lead Clinical Pharmacist',
        actorIp: '103.21.14.88',
        actorSignatureAlg: 'ECDSA P-256 (Hardware Security Module)',
        sessionToken: 'sess_99812_fido2_active_blr01',
        actionType: 'PRICE_CAP_ENFORCE',
        targetEntityId: 'CAN-DRUG-04921',
        targetEntityName: 'Augmentin 625 Duo Tab',
        targetCategory: 'Statutory Price Enforcement (NPPA DPCO)',
        verificationBadge: 'Anchored & Valid',
        shaShort: '4f8a...c99',
        shaFull: '4f8ac99d1283019238bc09123891029381029381',
        prevHash: '3c9ba12df8821098cbef9a718cb1902f3a88001e',
        blockHash: '4f8ac99d1283...c99',
        merkleRoot: 'd891b002ac192841bc9018234912bb01239840192',
        beforeSnapshotJson: `// Prior State\n- { "mrp": 220.00, "status": "flagged_breach" }`,
        afterSnapshotJson: `// Enforced Statutory Cap\n+ { "mrp": ${recentResolvedAction.price.toFixed(2)}, "rationale": "${recentResolvedAction.rationale}", "status": "enforced" }`,
        operationalNotes: `Enforced NPPA statutory cap at ₹${recentResolvedAction.price.toFixed(2)}. ${recentResolvedAction.rationale}`,
        isTamperEvident: true
      };
      return [dynamicEvent, ...AUDIT_LOG_EVENTS];
    }
    return AUDIT_LOG_EVENTS;
  });

  const [selectedEventId, setSelectedEventId] = useState<string>(events[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState('ALL');
  const [timeRange, setTimeRange] = useState('24h');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedEvent = useMemo(() => {
    return events.find(e => e.id === selectedEventId) || events[0];
  }, [events, selectedEventId]);

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      if (activeCategoryTab !== 'ALL') {
        if (activeCategoryTab === 'PRICE' && e.actionType !== 'PRICE_CAP_ENFORCE') return false;
        if (activeCategoryTab === 'ALGO' && e.actionType !== 'ALGORITHM_UPDATE') return false;
        if (activeCategoryTab === 'MERGE' && e.actionType !== 'MERGE_DUPLICATE') return false;
        if (activeCategoryTab === 'SYNC' && e.actionType !== 'BULK_STOCK_SYNC') return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          e.id.toLowerCase().includes(q) ||
          e.actorName.toLowerCase().includes(q) ||
          e.targetEntityName.toLowerCase().includes(q) ||
          e.shaFull.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [events, activeCategoryTab, searchQuery]);

  const handleVerifySig = () => {
    setToastMessage(`ECDSA P-256 signature for ${selectedEvent.id} verified mathematically against Indian Health Public Key Infrastructure.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExport = (format: string) => {
    setToastMessage(`Exported ${events.length} cryptographic audit records as ${format.toUpperCase()}.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="w-full pb-20 pt-28 bg-[#f8f9ff] min-h-screen">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#00685f] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-[76rem] mx-auto px-4 md:px-6">
        
        {/* Header Breadcrumb & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#e5eeff]">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-[#6d7a77] uppercase tracking-wider font-semibold">
              <span>MEDICINE_CHECK</span>
              <span>/</span>
              <span>OPERATIONS DESK</span>
              <span>/</span>
              <span className="text-[#00685f] font-bold">AUDIT LOGS &amp; TRACEABILITY</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#0b1c30] tracking-tight mt-1 flex items-center gap-2.5">
              <span>Audit Logs &amp; Regulatory Compliance Traceability</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006b2c]" />
                SHA-256 Ledger Intact
              </span>
            </h1>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative inline-block">
              <button
                onClick={() => handleExport('json')}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#dce9ff] hover:border-[#00685f] text-[#0b1c30] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#3d4947]" />
                <span>Export Audit Log (JSON/CSV)</span>
              </button>
            </div>

            <button
              onClick={onOpenComplianceCert}
              className="px-3.5 py-1.5 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Generate CDSCO Form 46 Certificate</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-xs">
            <span className="text-xs text-[#6d7a77] font-semibold block mb-1">Total Audited Events</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#0b1c30] font-metric-tabular">184,920</span>
              <span className="text-xs text-[#006b2c] font-bold">+342 today</span>
            </div>
            <span className="text-[10px] text-[#6d7a77] mt-1 block">Immutable write-once log</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-xs">
            <span className="text-xs text-[#6d7a77] font-semibold block mb-1">Regulatory Price Actions</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#00685f] font-metric-tabular">1,248</span>
              <span className="text-xs text-[#6d7a77]">DPCO Gazette</span>
            </div>
            <span className="text-[10px] text-[#6d7a77] mt-1 block">Section 6 DPCO Enforcements</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-xs">
            <span className="text-xs text-[#6d7a77] font-semibold block mb-1">Algorithmic Bioequivalence Tweaks</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#0b1c30] font-metric-tabular">86</span>
              <span className="text-xs text-[#6d7a77]">v4.2 Engine</span>
            </div>
            <span className="text-[10px] text-[#6d7a77] mt-1 block">Clinical threshold signoffs</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-xs">
            <span className="text-xs text-[#6d7a77] font-semibold block mb-1">Ledger Cryptographic Health</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#006b2c] font-metric-tabular">100%</span>
              <span className="text-xs text-[#006b2c] font-bold">Valid</span>
            </div>
            <span className="text-[10px] text-[#6d7a77] mt-1 block">Prev-hash chain verified 0 errors</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#e5eeff] mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f0f4ff]">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveCategoryTab('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeCategoryTab === 'ALL'
                    ? 'bg-[#00685f] text-white'
                    : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
                }`}
              >
                All Events ({events.length})
              </button>
              <button
                onClick={() => setActiveCategoryTab('PRICE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeCategoryTab === 'PRICE'
                    ? 'bg-[#00685f] text-white'
                    : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
                }`}
              >
                Price Cap Overrides
              </button>
              <button
                onClick={() => setActiveCategoryTab('ALGO')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeCategoryTab === 'ALGO'
                    ? 'bg-[#00685f] text-white'
                    : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
                }`}
              >
                Bioequivalence Engine
              </button>
              <button
                onClick={() => setActiveCategoryTab('MERGE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeCategoryTab === 'MERGE'
                    ? 'bg-[#00685f] text-white'
                    : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
                }`}
              >
                Catalog Merges &amp; Deletes
              </button>
              <button
                onClick={() => setActiveCategoryTab('SYNC')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeCategoryTab === 'SYNC'
                    ? 'bg-[#00685f] text-white'
                    : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
                }`}
              >
                Automated Ingestion
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#6d7a77] font-semibold">Time:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-[#eff4ff] text-xs font-bold text-[#0b1c30] rounded-xl px-2.5 py-1.5 border border-[#dce9ff]"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="all">All Time (Q4 2026)</option>
              </select>
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#6d7a77] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by Actor name, Entity ID, or SHA-256 block hash..."
                className="w-full pl-9 pr-3 py-2 bg-[#eff4ff] text-xs rounded-xl border border-transparent focus:border-[#00685f] focus:outline-none"
              />
            </div>

            <button
              onClick={() => { setSearchQuery(''); setActiveCategoryTab('ALL'); }}
              className="px-3 py-2 text-xs font-semibold text-[#6d7a77] hover:text-[#0b1c30] bg-[#eff4ff] rounded-xl"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Split Screen: Left Ledger Feed (7 cols) vs Right Event Dossier Inspector (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Ledger Table Feed */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6d7a77] px-1 font-semibold">
              <span>Displaying Cryptographic Ledger Blocks ({filteredEvents.length})</span>
              <span>Click to inspect merkle root &amp; state diff</span>
            </div>

            <div className="space-y-2.5">
              {filteredEvents.map(event => {
                const isSelected = event.id === selectedEvent.id;

                return (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white relative ${
                      isSelected
                        ? 'border-2 border-[#00685f] shadow-md ring-1 ring-[#00685f]/20'
                        : 'border-[#e5eeff] hover:border-[#00685f]/40 hover:shadow-xs'
                    }`}
                  >
                    {/* Top line: Event ID, Date & Hash */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#00685f] bg-[#eff4ff] px-2 py-0.5 rounded">
                          {event.id}
                        </span>
                        <span className="text-[10px] font-bold text-[#3d4947] bg-[#eff4ff] px-2 py-0.5 rounded-full uppercase">
                          {event.actionType}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#6d7a77]">
                        <span className="font-mono text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded">
                          {event.shaShort}
                        </span>
                        <span>{event.timestamp}</span>
                      </div>
                    </div>

                    {/* Actor & Action Description */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0b1c30]">
                          <UserCheck className="w-3.5 h-3.5 text-[#00685f]" />
                          <span>{event.actorName}</span>
                          <span className="text-[10px] text-[#6d7a77] font-medium">({event.actorRole})</span>
                        </div>
                        <p className="text-xs text-[#3d4947] mt-1 font-medium">
                          Target: <strong className="text-[#0b1c30]">{event.targetEntityName}</strong> ({event.targetEntityId})
                        </p>
                        <p className="text-[11px] text-[#6d7a77] mt-0.5">
                          {event.operationalNotes}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {event.verificationBadge}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Event Dossier Inspector (5 cols) */}
          <div className="lg:col-span-5 sticky top-36 space-y-4">
            
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border-2 border-[#dce9ff]">
              
              {/* Dossier Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#f0f4ff] mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#006b2c]" />
                  <span className="text-xs font-black text-[#006b2c] uppercase tracking-wider">
                    Cryptographically Valid Event Dossier
                  </span>
                </div>
                <span className="text-xs font-mono text-[#6d7a77] font-bold">
                  {selectedEvent.id}
                </span>
              </div>

              {/* Actor & Hardware Signature Metadata */}
              <div className="p-3.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] mb-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-[#6d7a77]">Authorizing Actor</span>
                  <span className="text-[10px] text-[#00685f] font-bold">FIDO2 WebAuthn Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#00685f] text-white flex items-center justify-center font-bold text-xs">
                    AS
                  </div>
                  <div>
                    <p className="font-bold text-[#0b1c30]">{selectedEvent.actorName}</p>
                    <p className="text-[11px] text-[#6d7a77]">{selectedEvent.actorEmail} • {selectedEvent.actorRole}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#dce9ff] grid grid-cols-2 gap-2 text-[11px] text-[#3d4947]">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#6d7a77] block">Network IP</span>
                    <span className="font-mono text-[#0b1c30]">{selectedEvent.actorIp}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#6d7a77] block">Key Alg</span>
                    <span className="font-mono text-[#0b1c30] text-[10px]">ECDSA P-256</span>
                  </div>
                </div>
              </div>

              {/* Target Entity */}
              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold text-[#6d7a77] tracking-wider block mb-1">
                  Target Regulatory Formulation
                </span>
                <p className="text-sm font-bold text-[#0b1c30]">
                  {selectedEvent.targetEntityName}
                </p>
                <p className="text-xs text-[#6d7a77]">
                  Canonical ID: <span className="font-mono text-[#00685f]">{selectedEvent.targetEntityId}</span> • {selectedEvent.targetCategory}
                </p>
              </div>

              {/* State Diff Payload (RFC 6902 JSON-Patch Format) */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-bold text-[#6d7a77] tracking-wider flex items-center gap-1">
                    <Terminal className="w-3.5 h-3.5" />
                    State Diff Payload (RFC 6902 JSON-Patch)
                  </span>
                  <span className="text-[10px] font-mono text-[#6d7a77]">utf-8</span>
                </div>

                <div className="p-3 bg-[#0b1c30] rounded-xl text-white font-mono text-[11px] leading-relaxed overflow-x-auto">
                  <pre className="text-red-400">{selectedEvent.beforeSnapshotJson}</pre>
                  <pre className="text-emerald-400 mt-1">{selectedEvent.afterSnapshotJson}</pre>
                </div>
              </div>

              {/* Merkle Root & Hash Chain Proof */}
              <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] mb-4 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-[#6d7a77] tracking-wider block">
                  Merkle Root &amp; Hash Chain Proof
                </span>
                <div className="space-y-1.5 font-mono text-[10px]">
                  <div>
                    <span className="text-[#6d7a77] block">Prev Block Hash:</span>
                    <span className="text-[#0b1c30] break-all bg-white p-1 rounded border border-[#e5eeff] block">
                      {selectedEvent.prevHash}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6d7a77] block">Current Block SHA-256:</span>
                    <span className="text-[#00685f] font-bold break-all bg-white p-1 rounded border border-[#00685f]/30 block">
                      {selectedEvent.shaFull}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6d7a77] block">Merkle Root:</span>
                    <span className="text-[#3d4947] break-all bg-white p-1 rounded border border-[#e5eeff] block">
                      {selectedEvent.merkleRoot}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dossier Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#f0f4ff]">
                <button
                  onClick={handleVerifySig}
                  className="w-full py-2.5 bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-Verify Cryptographic Signature</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setToastMessage(`Downloaded Certified Event XML for ${selectedEvent.id}.`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="py-2 bg-white border border-[#dce9ff] hover:bg-gray-50 text-xs font-bold text-[#3d4947] rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-[#6d7a77]" />
                    <span>Download XML</span>
                  </button>

                  <button
                    onClick={() => {
                      setToastMessage(`Flagged event ${selectedEvent.id} to Chief CDSCO Auditor for secondary scrutiny.`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="py-2 bg-white border border-[#dce9ff] hover:bg-gray-50 text-xs font-bold text-[#ba1a1a] rounded-xl transition-colors"
                  >
                    Flag to Auditor
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
