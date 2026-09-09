/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Database, 
  ShieldAlert, 
  CheckCircle, 
  RefreshCw, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Check, 
  FileText, 
  ArrowRight,
  ExternalLink,
  Lock,
  Sparkles,
  Zap,
  Tag,
  Building2,
  ListFilter
} from 'lucide-react';
import { MEDICINES_DATA } from '../../../shared/data/mockData';
import { MedicineProduct } from '../../../shared/types';

interface CatalogGovernanceViewProps {
  onOpenRegisterModal: () => void;
  onSelectMedicineForInspection: (medicineId: string) => void;
}

export const CatalogGovernanceView: React.FC<CatalogGovernanceViewProps> = ({
  onOpenRegisterModal,
  onSelectMedicineForInspection
}) => {
  const [activeTab, setActiveTab] = useState<'discrepancies' | 'canonical' | 'feeds'>('discrepancies');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrugId, setSelectedDrugId] = useState<string>(MEDICINES_DATA[0].id);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedDrug = MEDICINES_DATA.find(m => m.id === selectedDrugId) || MEDICINES_DATA[0];

  const handleForceFetch = () => {
    setToastMessage('Forced real-time DPCO scrape against NPPA Central Gazette S.O. 1542(E). 0 variances found.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRunEquivalence = () => {
    setToastMessage('Rule Engine v4.2 evaluated 328,109 active equivalence links across Indian Pharmacopoeia monographs.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleKillSwitch = () => {
    setToastMessage('EMERGENCY KILL-SWITCH: Offending overcharge SKUs temporarily de-listed from patient search results.');
    setTimeout(() => setToastMessage(null), 4000);
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
        
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#e5eeff]">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-[#6d7a77] uppercase tracking-wider font-semibold">
              <span>Catalog Governance</span>
              <span>/</span>
              <span className="text-[#00685f] font-bold">Canonical Registry &amp; DPCO Dual-Verification</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#0b1c30] tracking-tight mt-1">
              Catalog Governance &amp; Discrepancy Queue
            </h1>
            <p className="text-xs text-[#3d4947] mt-0.5">
              Dual-verification control plane for DPCO price caps, bio-equivalence salts, and Jan Aushadhi substitution links.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleForceFetch}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#dce9ff] hover:border-[#00685f] text-[#0b1c30] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#00685f]" />
              <span>Force DPCO Fetch</span>
            </button>

            <button
              onClick={handleRunEquivalence}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#dce9ff] hover:border-[#00685f] text-[#0b1c30] text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00685f]" />
              <span>Run Equivalence Check</span>
            </button>

            <button
              onClick={onOpenRegisterModal}
              className="px-3.5 py-1.5 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Canonical Drug</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-xs">
            <span className="text-xs text-[#6d7a77] font-semibold block mb-1">Canonical Medicines</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#0b1c30] font-metric-tabular">45,892</span>
              <span className="text-xs text-[#006b2c] font-bold">+12 today</span>
            </div>
            <span className="text-[10px] text-[#6d7a77] mt-1 block">Active across India registry</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-xs">
            <span className="text-xs text-[#6d7a77] font-semibold block mb-1">Discrepancy Queue</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#ba1a1a] font-metric-tabular">14 Active</span>
            </div>
            <span className="text-[10px] text-[#ba1a1a] mt-1 block font-bold">3 Critical DPCO Breaches</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-xs">
            <span className="text-xs text-[#6d7a77] font-semibold block mb-1">CDSCO/DPCO Freshness</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#00685f] font-metric-tabular">99.2%</span>
            </div>
            <span className="text-[10px] text-[#6d7a77] mt-1 block">Synced: 14 mins ago</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e5eeff] shadow-xs">
            <span className="text-xs text-[#6d7a77] font-semibold block mb-1">Equivalence Engine</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#006b2c] font-metric-tabular">328,109</span>
            </div>
            <span className="text-[10px] text-[#6d7a77] mt-1 block">Algorithm v4.2 links</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab('discrepancies')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'discrepancies'
                ? 'bg-[#00685f] text-white'
                : 'bg-white text-[#3d4947] border border-[#dce9ff] hover:bg-[#eff4ff]'
            }`}
          >
            Discrepancies &amp; Reports (14)
          </button>
          <button
            onClick={() => setActiveTab('canonical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'canonical'
                ? 'bg-[#00685f] text-white'
                : 'bg-white text-[#3d4947] border border-[#dce9ff] hover:bg-[#eff4ff]'
            }`}
          >
            Canonical Catalog (45.8k)
          </button>
          <button
            onClick={() => setActiveTab('feeds')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'feeds'
                ? 'bg-[#00685f] text-white'
                : 'bg-white text-[#3d4947] border border-[#dce9ff] hover:bg-[#eff4ff]'
            }`}
          >
            Partner Price Feeds (28)
          </button>
        </div>

        {/* Split Screen: Left Table (7 cols) vs Right Active Inspector (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Table Panel */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-xs border border-[#e5eeff]">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0f4ff] mb-3">
              <div className="relative w-72">
                <Search className="w-3.5 h-3.5 text-[#6d7a77] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter by drug name or salt..."
                  className="w-full pl-8 pr-3 py-1.5 bg-[#eff4ff] text-xs rounded-lg border border-transparent focus:border-[#00685f] focus:outline-none"
                />
              </div>

              <span className="text-xs text-[#6d7a77] font-semibold">
                Showing {MEDICINES_DATA.length} Formulations
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e5eeff] text-[#6d7a77] text-[10px] uppercase tracking-wider">
                    <th className="py-2 px-2">Canonical Drug</th>
                    <th className="py-2 px-2">DPCO Cap</th>
                    <th className="py-2 px-2">Chemist MRP</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f4ff]">
                  {MEDICINES_DATA.map(med => {
                    const isSelected = med.id === selectedDrug.id;

                    return (
                      <tr
                        key={med.id}
                        onClick={() => setSelectedDrugId(med.id)}
                        className={`hover:bg-[#f8f9ff] cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#eff4ff]' : ''
                        }`}
                      >
                        <td className="py-3 px-2">
                          <p className="font-bold text-[#0b1c30]">{med.brandName}</p>
                          <p className="text-[10px] text-[#6d7a77] truncate max-w-xs">{med.genericSalt}</p>
                        </td>
                        <td className="py-3 px-2 font-bold text-[#00685f]">
                          ₹{med.dpcoStatutoryCap.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 font-bold text-[#ba1a1a]">
                          ₹{med.currentChemistMRP.toFixed(2)}
                        </td>
                        <td className="py-3 px-2">
                          {med.hasPriceBreach ? (
                            <span className="bg-[#ffdad6] text-[#93000a] text-[10px] font-extrabold px-2 py-0.5 rounded">
                              +{med.excessMarginPercentage}% Breach
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded">
                              Compliant
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedDrugId(med.id); }}
                            className="text-[#00685f] font-bold hover:underline text-[11px]"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Inspector Drawer */}
          <div className="lg:col-span-5 sticky top-36 space-y-4">
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border-2 border-[#dce9ff]">
              <div className="flex items-center justify-between pb-3 border-b border-[#f0f4ff] mb-4">
                <span className="text-xs font-bold uppercase text-[#6d7a77]">
                  Active Inspector: {selectedDrug.id}
                </span>
                <span className="text-xs font-bold text-[#00685f] bg-[#e5eeff] px-2 py-0.5 rounded">
                  Dual Verified
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-black text-[#0b1c30]">
                  {selectedDrug.brandName}
                </h3>
                <p className="text-xs text-[#3d4947] font-medium mt-0.5">
                  {selectedDrug.genericSalt}
                </p>
                <p className="text-xs text-[#6d7a77] mt-1">
                  Manufacturer: {selectedDrug.manufacturer}
                </p>
              </div>

              {/* DPCO Ceiling Alert */}
              <div className="p-3.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] mb-4 text-xs">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[#6d7a77] font-medium">Statutory Ceiling Price</span>
                  <span className="text-base font-black text-[#00685f]">
                    ₹{selectedDrug.dpcoStatutoryCap.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1 border-t border-[#dce9ff]">
                  <span className="text-[#6d7a77] font-medium">Reported Chemist MRP</span>
                  <span className="text-base font-black text-[#ba1a1a]">
                    ₹{selectedDrug.currentChemistMRP.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Linked Generic Equivalents */}
              <div className="mb-4">
                <span className="text-[11px] font-bold text-[#6d7a77] uppercase tracking-wider block mb-2">
                  Linked Generic Equivalents ({selectedDrug.substitutes.length})
                </span>

                <div className="space-y-2">
                  {selectedDrug.substitutes.map(sub => (
                    <div key={sub.id} className="p-2.5 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#0b1c30]">{sub.name}</p>
                        <p className="text-[10px] text-[#6d7a77]">{sub.manufacturer}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black text-[#00685f]">₹{sub.price.toFixed(2)}</span>
                        <span className="text-[10px] text-emerald-800 font-bold block">Save {sub.savingsPercentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Governance Operations */}
              <div className="space-y-2 pt-2 border-t border-[#f0f4ff]">
                <button
                  onClick={() => {
                    setToastMessage(`Overwrote DPCO Cap to ₹${selectedDrug.dpcoStatutoryCap.toFixed(2)} across live search index.`);
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="w-full py-2.5 bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Force Overwrite DPCO Cap (₹{selectedDrug.dpcoStatutoryCap.toFixed(2)})
                </button>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#3d4947]">
                  <button
                    onClick={() => {
                      setToastMessage(`Elasticsearch index refreshed for ${selectedDrug.brandName}.`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="py-2 bg-white border border-[#dce9ff] hover:bg-gray-50 rounded-xl"
                  >
                    Re-index Elastic
                  </button>

                  <button
                    onClick={() => {
                      setToastMessage(`Suspended ${selectedDrug.brandName} from public suggestions.`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="py-2 bg-white border border-[#dce9ff] hover:bg-gray-50 text-[#ba1a1a] rounded-xl"
                  >
                    Suspend from Search
                  </button>
                </div>
              </div>
            </div>

            {/* Emergency Listing Kill-Switch button at bottom */}
            <button
              onClick={handleKillSwitch}
              className="w-full p-3.5 bg-red-50 hover:bg-red-100 border border-red-200 text-[#ba1a1a] rounded-2xl text-xs font-black transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>EMERGENCY LISTING KILL-SWITCH (ZONE 560001)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
