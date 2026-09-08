/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  FileText, 
  Download, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ChevronRight, 
  Lock, 
  Building2, 
  MapPin, 
  FileWarning, 
  ExternalLink, 
  Check, 
  Zap, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  Database,
  Radio,
  Send,
  Eye
} from 'lucide-react';
import { DISCREPANCY_TICKETS } from '../data/mockData';
import { DiscrepancyTicket, DiscrepancySeverity, DiscrepancyCategory } from '../types';

interface DiscrepancyQueueViewProps {
  onResolveTicketSuccess: (ticketId: string, rationale: string, capPrice: number) => void;
  onOpenAuditLogs: () => void;
  onOpenComplianceCert: () => void;
}

export const DiscrepancyQueueView: React.FC<DiscrepancyQueueViewProps> = ({
  onResolveTicketSuccess,
  onOpenAuditLogs,
  onOpenComplianceCert
}) => {
  const [tickets, setTickets] = useState<DiscrepancyTicket[]>(DISCREPANCY_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(DISCREPANCY_TICKETS[0].ticketId);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'breach' | 'newest' | 'searches'>('breach');

  // Form states for active resolution drawer
  const [generateFormIV, setGenerateFormIV] = useState(true);
  const [quarantineStores, setQuarantineStores] = useState(true);
  const [rationaleText, setRationaleText] = useState(
    'Verified against NPPA Gazette Notification S.O. 1542(E). Retailers claimed distributor transport surcharge, which violates Section 6 of DPCO 2013. Capped retail price forced to ₹204.35.'
  );
  const [isSubmittingResolution, setIsSubmittingResolution] = useState(false);
  const [resolutionToast, setResolutionToast] = useState<string | null>(null);

  // Active selected ticket
  const selectedTicket = useMemo(() => {
    return tickets.find(t => t.ticketId === selectedTicketId) || tickets[0];
  }, [tickets, selectedTicketId]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      // Category filter
      if (activeCategoryFilter !== 'all') {
        if (activeCategoryFilter === 'dpco' && ticket.category !== 'dpco_ceiling_violation') return false;
        if (activeCategoryFilter === 'bioequivalence' && ticket.category !== 'bioequivalence_mismatch') return false;
        if (activeCategoryFilter === 'feed' && ticket.category !== 'partner_feed_corruption') return false;
        if (activeCategoryFilter === 'resolved' && ticket.category !== 'auto_resolved') return false;
      }
      // Text search
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const match = 
          ticket.ticketId.toLowerCase().includes(query) ||
          ticket.medicineName.toLowerCase().includes(query) ||
          ticket.brandManufacturer.toLowerCase().includes(query) ||
          ticket.composition.toLowerCase().includes(query);
        if (!match) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'breach') return b.overchargePercentage - a.overchargePercentage;
      if (sortBy === 'searches') return b.dailyPatientSearches - a.dailyPatientSearches;
      return 0;
    });
  }, [tickets, activeCategoryFilter, searchFilter, sortBy]);

  const handleConfirmResolution = () => {
    setIsSubmittingResolution(true);
    setTimeout(() => {
      setTickets(prev => prev.map(t => {
        if (t.ticketId === selectedTicket.ticketId) {
          return {
            ...t,
            status: 'resolved',
            category: 'auto_resolved',
            categoryLabel: 'STATUTORY CAP ENFORCED',
            overchargePercentage: 0,
            reportedPrice: t.statutoryCapPrice,
            subCategoryTag: 'RESOLVED BY PHARMACIST'
          };
        }
        return t;
      }));

      onResolveTicketSuccess(selectedTicket.ticketId, rationaleText, selectedTicket.statutoryCapPrice);
      setIsSubmittingResolution(false);
      setResolutionToast(`Statutory cap enforced for ${selectedTicket.medicineName}. Block committed with SHA-256 signature.`);
      setTimeout(() => setResolutionToast(null), 4000);
    }, 600);
  };

  return (
    <div className="w-full pb-20 pt-28 bg-[#f8f9ff] min-h-screen">
      
      {/* Toast Notification */}
      {resolutionToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#00685f] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{resolutionToast}</span>
        </div>
      )}

      <div className="max-w-[76rem] mx-auto px-4 md:px-6">
        
        {/* Header Breadcrumb & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#e5eeff]">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-[#6d7a77] uppercase tracking-wider font-semibold">
              <span>Operations Desk</span>
              <span>/</span>
              <span>Catalog Governance</span>
              <span>/</span>
              <span className="text-[#00685f] font-bold">Discrepancy Queue &amp; Active Triage</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#0b1c30] tracking-tight mt-1 flex items-center gap-2.5">
              <span>Discrepancy Queue &amp; Active Triage Workbench</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#e5eeff] text-[#00685f] px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00685f] animate-ping"></span>
                Live Triage Stream
              </span>
            </h1>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setResolutionToast('Batch auto-triage engine v4.2 evaluated 14 tickets in 380ms.');
                setTimeout(() => setResolutionToast(null), 3000);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#dce9ff] hover:border-[#00685f] text-[#0b1c30] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-[#00685f]" />
              <span className="hidden sm:inline">Batch Auto-Triage (Rule Engine v4.2)</span>
              <span className="sm:hidden">Auto-Triage</span>
            </button>

            <button
              onClick={onOpenComplianceCert}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#dce9ff] hover:border-[#00685f] text-[#0b1c30] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#3d4947]" />
              <span>Export Compliance (PDF)</span>
            </button>

            <button
              onClick={() => {
                setResolutionToast('Emergency SKU Freeze activated for Indiranagar postal zone.');
                setTimeout(() => setResolutionToast(null), 3000);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Emergency SKU Freeze</span>
            </button>
          </div>
        </div>

        {/* SLA & Operational KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#6d7a77] mb-1">
              <span className="font-semibold">Active Queue Backlog</span>
              <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-bold px-1.5 py-0.5 rounded">3 Critical</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#0b1c30] font-metric-tabular">14</span>
              <span className="text-xs text-[#6d7a77] font-medium">Flagged SKUs</span>
            </div>
            <div className="mt-2 text-[10px] text-[#6d7a77] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
              <span>5 High, 6 Mid/Low</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#6d7a77] mb-1">
              <span className="font-semibold">MTTR (Mean Time to Resolution)</span>
              <Clock className="w-3.5 h-3.5 text-[#00685f]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#00685f] font-metric-tabular">18.4m</span>
              <span className="text-xs text-[#006b2c] font-bold">-4.2m vs SLA</span>
            </div>
            <div className="mt-2 text-[10px] text-[#6d7a77]">
              SLA Target: &lt; 30 mins for Critical Tier
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#6d7a77] mb-1">
              <span className="font-semibold">Overcharge Prevented (7D)</span>
              <TrendingUp className="w-3.5 h-3.5 text-[#006b2c]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#006b2c] font-metric-tabular">₹1,42,800</span>
            </div>
            <div className="mt-2 text-[10px] text-[#6d7a77]">
              Across 28,400+ patient searches
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#6d7a77] mb-1">
              <span className="font-semibold">CDSCO/DPCO Auto-Validation</span>
              <ShieldCheck className="w-3.5 h-3.5 text-[#00685f]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#0b1c30] font-metric-tabular">99.82%</span>
              <span className="text-xs text-[#006b2c] font-bold">Passing</span>
            </div>
            <div className="mt-2 text-[10px] text-[#6d7a77]">
              Last automated ingest: 14m ago
            </div>
          </div>
        </div>

        {/* Filter Toolbar & Slicing Tabs */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#e5eeff] mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f0f4ff]">
            {/* Slicing Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeCategoryFilter === 'all'
                    ? 'bg-[#00685f] text-white shadow-xs'
                    : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
                }`}
              >
                All Discrepancies (14)
              </button>
              <button
                onClick={() => setActiveCategoryFilter('dpco')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                  activeCategoryFilter === 'dpco'
                    ? 'bg-[#ba1a1a] text-white'
                    : 'bg-[#ffdad6] text-[#93000a] hover:bg-red-200'
                }`}
              >
                <span>DPCO Price Ceiling Violations</span>
                <span className="bg-white/30 text-[10px] px-1 rounded">3 Critical</span>
              </button>
              <button
                onClick={() => setActiveCategoryFilter('bioequivalence')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeCategoryFilter === 'bioequivalence'
                    ? 'bg-[#00685f] text-white'
                    : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
                }`}
              >
                Bioequivalence &amp; Salt Inconsistencies (4)
              </button>
              <button
                onClick={() => setActiveCategoryFilter('feed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeCategoryFilter === 'feed'
                    ? 'bg-[#00685f] text-white'
                    : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
                }`}
              >
                Partner Feed &amp; MRP Breaches (4)
              </button>
              <button
                onClick={() => setActiveCategoryFilter('resolved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeCategoryFilter === 'resolved'
                    ? 'bg-[#006b2c] text-white'
                    : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
                }`}
              >
                Auto-Resolved (3)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6d7a77] font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#eff4ff] text-xs font-bold text-[#0b1c30] rounded-xl px-2.5 py-1.5 border border-[#dce9ff] focus:outline-none"
              >
                <option value="breach">Highest Price Risk / Breach Magnitude</option>
                <option value="searches">Daily Patient Searches</option>
                <option value="newest">Most Recent Incident</option>
              </select>
            </div>
          </div>

          {/* Search input & bulk select strip */}
          <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-[#6d7a77] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search ticket ID, medicine, brand, salt, store..."
                className="w-full pl-9 pr-3 py-2 bg-[#eff4ff] text-xs rounded-xl border border-transparent focus:border-[#00685f] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
              <span className="text-[#6d7a77] font-medium">Assignee:</span>
              <select 
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="bg-[#eff4ff] text-xs font-semibold text-[#0b1c30] rounded-xl px-2.5 py-1.5 border border-[#dce9ff]"
              >
                <option value="All">All Triage Pharmacists</option>
                <option value="Dr. Ananya Sharma">Dr. Ananya Sharma (Lead)</option>
                <option value="Dr. Rajesh Nair">Dr. Rajesh Nair (Critical)</option>
                <option value="Automated Daemon">Automated Daemons</option>
              </select>
            </div>
          </div>
        </div>

        {/* Split Screen Workbench: Left Queue List (7 cols) vs Right Investigation Drawer (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Ticket Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#6d7a77] px-1 font-semibold">
              <span>Showing {filteredTickets.length} Flagged Incidents</span>
              <span>Click a ticket to inspect evidence &amp; enforce statutory cap</span>
            </div>

            {filteredTickets.map((ticket) => {
              const isSelected = ticket.ticketId === selectedTicket.ticketId;
              const isCritical = ticket.severity === 'critical';
              const isHigh = ticket.severity === 'high';
              const isResolved = ticket.status === 'resolved';

              return (
                <div
                  key={ticket.ticketId}
                  onClick={() => setSelectedTicketId(ticket.ticketId)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white relative ${
                    isSelected
                      ? 'border-2 border-[#00685f] shadow-[0_4px_16px_rgba(0,104,95,0.12)] ring-1 ring-[#00685f]/20'
                      : 'border-[#e5eeff] hover:border-[#00685f]/40 hover:shadow-xs'
                  }`}
                >
                  {/* Top Bar: Ticket ID & Severity Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#00685f] bg-[#eff4ff] px-2 py-0.5 rounded">
                        {ticket.ticketId}
                      </span>
                      
                      {isCritical ? (
                        <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {ticket.categoryLabel}
                        </span>
                      ) : isHigh ? (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {ticket.categoryLabel}
                        </span>
                      ) : isResolved ? (
                        <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          RESOLVED
                        </span>
                      ) : (
                        <span className="bg-[#eff4ff] text-[#3d4947] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {ticket.categoryLabel}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-[#6d7a77] font-medium">
                      {ticket.createdTimeAgo}
                    </span>
                  </div>

                  {/* Title & Medicine Details */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-[#0b1c30] flex items-center gap-2">
                        <span>{ticket.medicineName}</span>
                        {isCritical && (
                          <span className="text-[11px] font-extrabold text-[#ba1a1a] bg-[#ffdad6] px-1.5 py-0.2 rounded">
                            {ticket.subCategoryTag}
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-[#3d4947] font-medium flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-[#6d7a77]" />
                        {ticket.brandManufacturer}
                      </p>
                      <p className="text-xs text-[#6d7a77] mt-1">
                        <strong className="text-[#0b1c30]">Salt:</strong> {ticket.composition}
                      </p>
                    </div>

                    {/* Price Discrepancy Callout */}
                    <div className="text-right shrink-0 bg-[#eff4ff] p-2.5 rounded-xl border border-[#dce9ff]">
                      <div className="text-[10px] text-[#6d7a77] font-bold uppercase">Reported Chemist MRP</div>
                      <div className="text-base font-black text-[#ba1a1a]">
                        ₹{ticket.reportedPrice.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-[#3d4947] font-medium">
                        Cap: ₹{ticket.statutoryCapPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Location & Trigger Footnote */}
                  <div className="mt-3 pt-2.5 border-t border-[#f0f4ff] flex flex-wrap items-center justify-between gap-2 text-xs text-[#3d4947]">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#6d7a77]">
                      <Radio className="w-3 h-3 text-[#00685f]" />
                      <span>{ticket.triggerDescription}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="font-semibold text-[#00685f]">
                        Assignee: {ticket.assignedTo}
                      </span>
                      <span className="text-[#6d7a77]">
                        {ticket.dailyPatientSearches} searches/day
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Panel: Deep Investigation & Resolution Drawer (5 cols) */}
          <div className="lg:col-span-5 sticky top-36 space-y-4">
            
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border-2 border-[#dce9ff]">
              
              {/* Top Banner in Drawer */}
              <div className="flex items-center justify-between pb-3 border-b border-[#f0f4ff] mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                  <span className="text-xs font-black text-[#ba1a1a] uppercase tracking-wider">
                    Urgent Critical Resolution
                  </span>
                </div>
                <span className="text-xs font-mono text-[#6d7a77] font-bold">
                  {selectedTicket.ticketId}
                </span>
              </div>

              {/* Drug Identification */}
              <div className="mb-4">
                <h3 className="text-lg font-black text-[#0b1c30]">
                  {selectedTicket.medicineName}
                </h3>
                <p className="text-xs text-[#3d4947] font-medium">
                  {selectedTicket.composition}
                </p>
                <p className="text-[11px] text-[#6d7a77] mt-0.5">
                  Manufacturer: {selectedTicket.brandManufacturer}
                </p>
              </div>

              {/* Statutory Price Discrepancy Breakdown */}
              <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dce9ff] mb-4">
                <span className="text-[10px] uppercase font-bold text-[#6d7a77] tracking-wider block mb-2">
                  Statutory Price Discrepancy Breakdown
                </span>

                <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                  <div className="p-2.5 bg-white rounded-lg border border-[#dce9ff]">
                    <span className="text-[10px] text-[#6d7a77] font-medium block">NPPA DPCO Statutory Cap</span>
                    <span className="text-lg font-black text-[#00685f]">
                      ₹{selectedTicket.statutoryCapPrice.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-[#00685f] block font-bold">Gazette S.O. 1542(E)</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-[#dce9ff]">
                    <span className="text-[10px] text-[#6d7a77] font-medium block">Reported Chemist MRP</span>
                    <span className="text-lg font-black text-[#ba1a1a]">
                      ₹{selectedTicket.reportedPrice.toFixed(2)}
                    </span>
                    <span className="text-[9px] text-[#ba1a1a] block font-bold">
                      +{selectedTicket.overchargePercentage}% Markup
                    </span>
                  </div>
                </div>

                {/* Price Delta Spark Comparison */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-[#00685f]">Allowable Ceiling (₹{selectedTicket.statutoryCapPrice.toFixed(2)})</span>
                    <span className="text-[#ba1a1a]">Unlawful Breach (+₹{(selectedTicket.reportedPrice - selectedTicket.statutoryCapPrice).toFixed(2)})</span>
                  </div>
                  <div className="w-full h-3 bg-red-200 rounded-full overflow-hidden flex">
                    <div className="bg-[#00685f] h-full" style={{ width: '85%' }}></div>
                    <div className="bg-[#ba1a1a] h-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>

              {/* Audit Evidence & Telemetry */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-[#6d7a77] uppercase tracking-wider block mb-2">
                  Audit Evidence &amp; Telemetry
                </span>

                <div className="space-y-2">
                  {selectedTicket.evidenceTelemetry.map((ev, i) => (
                    <div key={i} className="p-2.5 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="p-1 bg-[#eff4ff] text-[#00685f] rounded">
                          <FileText className="w-3.5 h-3.5" />
                        </span>
                        <span className="font-semibold text-[#0b1c30] text-[11px]">{ev.title}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ev.statusColor === 'tertiary' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : ev.statusColor === 'error'
                          ? 'bg-[#ffdad6] text-[#93000a]'
                          : 'bg-[#eff4ff] text-[#00685f]'
                      }`}>
                        {ev.statusBadge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical Resolution Protocol */}
              <div className="space-y-3 text-xs mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4 text-[#00685f]" />
                    <span>Recommended Protocol</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {selectedTicket.recommendedProtocol}
                  </p>
                </div>

                {/* Toggles */}
                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[#0b1c30] font-medium text-xs">
                    <input
                      type="checkbox"
                      checked={generateFormIV}
                      onChange={(e) => setGenerateFormIV(e.target.checked)}
                      className="w-4 h-4 text-[#00685f] rounded"
                    />
                    <span>Generate Automated NPPA Form IV Statutory Overcharge Notice</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-[#0b1c30] font-medium text-xs">
                    <input
                      type="checkbox"
                      checked={quarantineStores}
                      onChange={(e) => setQuarantineStores(e.target.checked)}
                      className="w-4 h-4 text-[#00685f] rounded"
                    />
                    <span>Quarantine offending retailer feeds until price compliance certificate filed</span>
                  </label>
                </div>

                {/* Rationale Input */}
                <div>
                  <label className="block text-[11px] font-bold text-[#6d7a77] uppercase mb-1">
                    Pharmacist Clinical Rationale &amp; Audit Justification:
                  </label>
                  <textarea
                    rows={3}
                    value={rationaleText}
                    onChange={(e) => setRationaleText(e.target.value)}
                    className="w-full p-2.5 bg-[#eff4ff] rounded-xl text-xs text-[#0b1c30] font-medium border border-[#dce9ff] focus:border-[#00685f] focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#f0f4ff]">
                <button
                  disabled={isSubmittingResolution || selectedTicket.status === 'resolved'}
                  onClick={handleConfirmResolution}
                  className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                    selectedTicket.status === 'resolved'
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-[#00685f] hover:bg-[#008378] text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isSubmittingResolution
                      ? 'Signing Cryptographic Block...'
                      : selectedTicket.status === 'resolved'
                      ? 'DPCO Price Cap Already Enforced'
                      : 'Confirm Resolution & Enforce DPCO Price'}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setResolutionToast(`Escalated ticket ${selectedTicket.ticketId} to Central Drug Legal Counsel.`);
                      setTimeout(() => setResolutionToast(null), 3000);
                    }}
                    className="py-2 bg-white border border-[#dce9ff] hover:bg-gray-50 text-xs font-bold text-[#3d4947] rounded-xl transition-colors"
                  >
                    Escalate Legal
                  </button>

                  <button
                    onClick={() => {
                      setResolutionToast(`Snoozed ticket ${selectedTicket.ticketId} for 4 hours.`);
                      setTimeout(() => setResolutionToast(null), 3000);
                    }}
                    className="py-2 bg-white border border-[#dce9ff] hover:bg-gray-50 text-xs font-bold text-[#3d4947] rounded-xl transition-colors"
                  >
                    Snooze (4h)
                  </button>
                </div>
              </div>

              {/* Ticket Audit Trace */}
              <div className="mt-5 pt-4 border-t border-[#f0f4ff]">
                <span className="text-[10px] uppercase font-bold text-[#6d7a77] tracking-wider block mb-2">
                  Ticket Audit Trace (Cryptographically Hashed)
                </span>
                <div className="space-y-1.5 text-[11px]">
                  {selectedTicket.auditTrace.map((tr, i) => (
                    <div key={i} className="flex items-start gap-2 text-[#6d7a77]">
                      <span className="font-mono text-[#00685f] font-semibold shrink-0">{tr.time}</span>
                      <span className={tr.isHighlight ? 'font-bold text-[#0b1c30]' : ''}>{tr.event}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Quick Navigation to Full Audit Logs */}
            <div className="p-4 bg-[#eff4ff] rounded-2xl border border-[#dce9ff] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#00685f]" />
                <span className="font-bold text-[#0b1c30]">View Full SHA-256 Ledger</span>
              </div>
              <button
                onClick={onOpenAuditLogs}
                className="text-[#00685f] font-bold hover:underline flex items-center gap-1"
              >
                <span>Audit Logs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
