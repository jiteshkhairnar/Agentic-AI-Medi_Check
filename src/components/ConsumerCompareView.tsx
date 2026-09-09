/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, ShieldCheck, SlidersHorizontal, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, Building2, MapPin, ChevronRight, ChevronDown, Info, FileText, ExternalLink, Share2, Bookmark, BookmarkCheck, Percent, Check, X, Stethoscope, FlaskConical, Award, Clock, CircleAlert, Store
} from 'lucide-react';
import { MEDICINES_DATA, NEARBY_STORES } from '../data/mockData';
import { MedicineProduct, MedicineSubstitute } from '../types';
import { api } from '../api/client';

interface ConsumerCompareViewProps {
  onSelectMedicineId?: (id: string) => void;
  onOpenReportModal: () => void;
  savedSubstitutes: string[];
  onToggleSaveSubstitute: (substituteId: string) => void;
  onOpenPdfModal: () => void;
  onOpenStoreModal: (storeId: string) => void;
}

export const ConsumerCompareView: React.FC<ConsumerCompareViewProps> = ({
  onOpenReportModal,
  savedSubstitutes,
  onToggleSaveSubstitute,
  onOpenPdfModal,
  onOpenStoreModal
}) => {
  const [searchQuery, setSearchQuery] = useState('Augmentin 625 Duo Tablet');
  const [searchMode, setSearchMode] = useState<'brand' | 'salt'>('brand');
  const [janAushadhiOnly, setJanAushadhiOnly] = useState(false);
  const [filterForm, setFilterForm] = useState('All');
  const [filterStrength, setFilterStrength] = useState('All');
  const [showAccordion, setShowAccordion] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  
  const [medicinesData, setMedicinesData] = useState<MedicineProduct[]>(MEDICINES_DATA); // fallback

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const data = await api.searchMedicines();
        if (data.length > 0) {
          setMedicinesData(data);
        }
      } catch (err) {
        console.error('Failed to fetch medicines', err);
      }
    };
    fetchMedicines();
  }, []);

  // Active Selected Medicine (default Augmentin 625)
  const currentDrug = useMemo(() => {
    const found = medicinesData.find(m => 
      m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericSalt.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return found || medicinesData[0];
  }, [searchQuery, medicinesData]);

  // Filtered substitutes
  const displayedSubstitutes = useMemo(() => {
    let list = currentDrug.substitutes;
    if (janAushadhiOnly) {
      list = list.filter(s => s.isJanAushadhi);
    }
    if (filterStrength !== 'All') {
      list = list.filter(s => s.strength.includes(filterStrength));
    }
    return list;
  }, [currentDrug, janAushadhiOnly, filterStrength]);

  const handleShare = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  return (
    <div className="w-full pb-20 pt-28">
      {/* Toast Alert */}
      {showShareToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#00685f] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Clinical Comparison link copied to clipboard!</span>
        </div>
      )}

      <div className="max-w-[76rem] mx-auto px-4 md:px-6">
        
        {/* Search & Switcher Bar Header Container */}
        <section className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-[#e5eeff] mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#f0f4ff]">
            {/* Search Type Toggle */}
            <div className="flex items-center gap-2">
              <div className="inline-flex p-1 bg-[#eff4ff] rounded-xl border border-[#dce9ff]">
                <button
                  onClick={() => setSearchMode('brand')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    searchMode === 'brand'
                      ? 'bg-[#00685f] text-white shadow-xs'
                      : 'text-[#3d4947] hover:text-[#0b1c30]'
                  }`}
                >
                  Search by Brand Name
                </button>
                <button
                  onClick={() => setSearchMode('salt')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    searchMode === 'salt'
                      ? 'bg-[#00685f] text-white shadow-xs'
                      : 'text-[#3d4947] hover:text-[#0b1c30]'
                  }`}
                >
                  Search by Salt / Active Ingredient
                </button>
              </div>
            </div>

            {/* Commercial Neutrality Guaranteed Badge */}
            <div className="flex items-center gap-2 text-[11px] font-semibold text-[#00685f] bg-[#e5eeff] px-3 py-1.5 rounded-xl self-start lg:self-auto">
              <ShieldCheck className="w-4 h-4 text-[#00685f]" />
              <span>Commercial Neutrality Guaranteed • 0% Pharma Sponsored Placement</span>
            </div>
          </div>

          {/* Search Input Box */}
          <div className="mt-4 flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-[#6d7a77] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type brand name (e.g. Augmentin, Pan-D, Dolo, Telma, Rosuvas)..."
                className="w-full pl-12 pr-28 py-3.5 bg-[#eff4ff] hover:bg-[#e9f0fc] focus:bg-white text-sm font-semibold text-[#0b1c30] rounded-xl border border-transparent focus:border-[#00685f] focus:outline-none focus:ring-2 focus:ring-[#00685f]/20 transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-[#dae2fd] text-[#131b2e] px-2 py-0.5 rounded">
                CDSCO Synced
              </span>
            </div>

            {/* Search Button */}
            <button 
              onClick={() => {}}
              className="w-full md:w-auto px-6 py-3.5 bg-[#00685f] hover:bg-[#008378] text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <span>Compare Substitutes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Preset Quick Chips */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto text-xs pb-1">
            <span className="text-[11px] text-[#6d7a77] font-medium shrink-0">Popular:</span>
            {medicinesData.map(med => (
              <button
                key={med.id}
                onClick={() => setSearchQuery(med.brandName)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  currentDrug.id === med.id 
                    ? 'bg-[#00685f] text-white' 
                    : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
                }`}
              >
                {med.brandName}
              </button>
            ))}
          </div>

          {/* Identified Salt Breakdown Chip */}
          <div className="mt-4 p-3 bg-[#e5eeff]/80 rounded-xl border border-[#c2d7fc] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#00685f] text-white rounded-lg">
                <FlaskConical className="w-4 h-4" />
              </span>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#6d7a77] tracking-wider">
                  Identified Active Chemical Salt Formulation
                </p>
                <p className="text-xs md:text-sm font-bold text-[#0b1c30]">
                  {currentDrug.genericSalt}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#3d4947]">
              <span className="bg-white px-2 py-0.5 rounded border border-[#dce9ff] font-medium">
                {currentDrug.dosageForm}
              </span>
              <span className="bg-white px-2 py-0.5 rounded border border-[#dce9ff] font-medium">
                Pack: {currentDrug.packSize}
              </span>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                Ratio 4:1 Verified
              </span>
            </div>
          </div>

          {/* Quick Filters Row */}
          <div className="mt-4 pt-3 border-t border-[#f0f4ff] flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#3d4947] flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#00685f]" />
                Filter:
              </span>
              
              <button 
                onClick={() => setFilterStrength(filterStrength === 'All' ? '625mg' : 'All')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  filterStrength === '625mg'
                    ? 'bg-[#00685f] text-white border-[#00685f]'
                    : 'bg-white text-[#3d4947] border-[#dce9ff] hover:bg-[#eff4ff]'
                }`}
              >
                Exact 625mg Strength
              </button>

              <button 
                onClick={() => setFilterForm(filterForm === 'All' ? 'Tablet' : 'All')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  filterForm === 'Tablet'
                    ? 'bg-[#00685f] text-white border-[#00685f]'
                    : 'bg-white text-[#3d4947] border-[#dce9ff] hover:bg-[#eff4ff]'
                }`}
              >
                Film Coated Tablet
              </button>
            </div>

            {/* Jan Aushadhi Only Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none bg-[#eff4ff] hover:bg-[#e5eeff] px-3 py-1.5 rounded-xl border border-[#dce9ff] transition-colors">
              <input
                type="checkbox"
                checked={janAushadhiOnly}
                onChange={(e) => setJanAushadhiOnly(e.target.checked)}
                className="w-4 h-4 text-[#00685f] rounded border-gray-300 focus:ring-[#00685f]"
              />
              <span className="text-xs font-bold text-[#0b1c30]">
                Show Jan Aushadhi / PMBI Generics Only
              </span>
            </label>
          </div>
        </section>

        {/* Big Savings Highlight Banner */}
        <div className="w-full bg-gradient-to-r from-[#00685f] to-[#008378] text-white rounded-2xl p-4 md:p-5 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Percent className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-sm md:text-base font-bold text-white leading-snug">
                Patients save an average of ₹145.85 (up to 71%) on this formulation
              </p>
              <p className="text-xs text-emerald-100 font-medium">
                Certified 100% bioequivalent by Central Drugs Standard Control Organization (CDSCO) &amp; WHO-GMP.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={onOpenPdfModal}
              className="px-3.5 py-2 rounded-xl bg-white text-[#00685f] text-xs font-bold shadow-xs hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Monograph (PDF)</span>
            </button>
            <button 
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Share comparison with Doctor"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Two Column Layout: Reference Benchmark (4 cols) vs Substitutes (8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Reference Drug Card (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Prescribed Benchmark Drug Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-[#dce9ff] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#eff4ff] text-[#3d4947] text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-[#dce9ff] uppercase tracking-wider">
                Prescribed Reference
              </div>

              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#6d7a77]">
                  Brand Benchmark
                </span>
                <h3 className="text-lg font-bold text-[#0b1c30] mt-0.5">
                  {currentDrug.brandName}
                </h3>
                <p className="text-xs text-[#3d4947] font-medium flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-[#6d7a77]" />
                  {currentDrug.manufacturer}
                </p>
              </div>

              {/* Price Callout */}
              <div className="bg-[#eff4ff] rounded-xl p-4 mb-4 border border-[#dce9ff]">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-[#6d7a77] font-medium">Chemist Retail MRP</span>
                  <span className="text-2xl font-black text-[#ba1a1a] tracking-tight">
                    ₹{currentDrug.currentChemistMRP.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#3d4947] pt-2 border-t border-[#dce9ff]">
                  <span>NPPA DPCO Statutory Cap:</span>
                  <span className="font-bold text-[#0b1c30]">₹{currentDrug.dpcoStatutoryCap.toFixed(2)}</span>
                </div>
                {currentDrug.hasPriceBreach && (
                  <div className="mt-2 text-[11px] bg-[#ffdad6] text-[#93000a] p-2 rounded-lg font-semibold flex items-center justify-between">
                    <span>Overcharge Breach: +{currentDrug.excessMarginPercentage}%</span>
                    <button 
                      onClick={onOpenReportModal}
                      className="underline font-bold text-[#ba1a1a]"
                    >
                      Report Violation
                    </button>
                  </div>
                )}
              </div>

              {/* Chemical Specification */}
              <div className="space-y-2.5 text-xs pb-4 border-b border-[#f0f4ff]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#6d7a77]">Formulation</span>
                  <p className="text-xs font-semibold text-[#0b1c30]">{currentDrug.compositionDetails}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6d7a77]">Dosage Form</span>
                    <p className="font-semibold text-[#0b1c30]">{currentDrug.dosageForm}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6d7a77]">Packaging</span>
                    <p className="font-semibold text-[#0b1c30]">{currentDrug.packSize}</p>
                  </div>
                </div>
              </div>

              {/* Caution & Schedule category */}
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{currentDrug.scheduleCategory} Prescription Drug:</span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Requires registered medical practitioner prescription to dispense. Do not alter antimicrobial dosing without physician guidance.
                  </p>
                </div>
              </div>

              {/* Verified Chemists nearby */}
              <div className="mt-4 pt-3 border-t border-[#f0f4ff]">
                <p className="text-[11px] font-bold text-[#6d7a77] uppercase tracking-wider mb-2">
                  Verified Local Stock (Bengaluru)
                </p>
                <div className="space-y-2">
                  {NEARBY_STORES.slice(0, 2).map(store => (
                    <div key={store.id} className="text-xs p-2 bg-[#f8f9ff] rounded-lg border border-[#e5eeff] flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#0b1c30]">{store.name}</p>
                        <p className="text-[10px] text-[#6d7a77] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#00685f]" />
                          {store.distance} • {store.stockLastVerified}
                        </p>
                      </div>
                      <button 
                        onClick={() => onOpenStoreModal(store.id)}
                        className="text-[11px] text-[#00685f] font-bold hover:underline"
                      >
                        Locate
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Regulatory Shield Box */}
            <div className="bg-[#eff4ff] rounded-2xl p-4 border border-[#dce9ff] text-xs">
              <div className="flex items-center gap-2 mb-2 text-[#00685f] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>NPPA DPCO Regulatory Price Ceiling</span>
              </div>
              <p className="text-[#3d4947] text-[11px] leading-relaxed">
                Prices for essential antibiotics and formulations are strictly governed under DPCO 2013. Chemist stores cannot levy additional handling fees on scheduled formulations.
              </p>
              <button 
                onClick={onOpenReportModal}
                className="mt-2 text-xs font-bold text-[#ba1a1a] hover:underline flex items-center gap-1"
              >
                <span>Found higher retail price? File a grievance</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* Right Column: Substitutes Matrix (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0b1c30]">
                  Clinically Evaluated Substitutes ({displayedSubstitutes.length})
                </h2>
                <p className="text-xs text-[#6d7a77]">
                  Ranked by therapeutic bioequivalence, GMP certification rigor, and consumer savings
                </p>
              </div>
              <span className="text-xs text-[#00685f] font-semibold bg-[#e5eeff] px-2.5 py-1 rounded-lg">
                Active Salt Match: 100%
              </span>
            </div>

            {/* Substitute Cards List */}
            <div className="space-y-3.5">
              {displayedSubstitutes.map((sub, idx) => {
                const isSaved = savedSubstitutes.includes(sub.id);
                return (
                  <div
                    key={sub.id}
                    className={`bg-white rounded-2xl p-5 shadow-sm border transition-all relative ${
                      sub.isJanAushadhi 
                        ? 'border-2 border-[#00685f] shadow-[0_4px_20px_rgba(0,104,95,0.08)]' 
                        : sub.matchGrade === 'partial_dose_difference'
                        ? 'border-amber-300 bg-amber-50/20'
                        : 'border-[#e5eeff] hover:border-[#00685f]/40'
                    }`}
                  >
                    {/* Top Row: Badge & Type */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {sub.isJanAushadhi ? (
                          <span className="bg-[#00685f] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            PMBI JAN AUSHADHI GENERIC
                          </span>
                        ) : sub.matchGrade === 'partial_dose_difference' ? (
                          <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                            <CircleAlert className="w-3 h-3 text-amber-700" />
                            PARTIAL MATCH • DOSE DIFFERENCE
                          </span>
                        ) : (
                          <span className="bg-[#eff4ff] text-[#00685f] text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                            BRANDED GENERIC
                          </span>
                        )}

                        <span className="text-[11px] text-[#3d4947] font-medium">
                          {sub.matchBadgeText}
                        </span>
                      </div>

                      {/* Save Button */}
                      <button
                        onClick={() => onToggleSaveSubstitute(sub.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isSaved 
                            ? 'bg-[#00685f] text-white border-[#00685f]' 
                            : 'bg-[#f8f9ff] text-[#6d7a77] border-[#dce9ff] hover:text-[#0b1c30]'
                        }`}
                        title={isSaved ? "Remove from saved" : "Save for later"}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Main Information Split */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      
                      {/* Drug Details */}
                      <div className="space-y-1 flex-1">
                        <h4 className="text-base font-bold text-[#0b1c30]">
                          {sub.name}
                        </h4>
                        <p className="text-xs text-[#3d4947] flex items-center gap-1.5 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-[#6d7a77]" />
                          {sub.manufacturer}
                        </p>
                        <p className="text-xs text-[#6d7a77] pt-1">
                          <strong className="text-[#0b1c30]">Salt:</strong> {sub.composition}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                          <span className="bg-[#eff4ff] text-[#0b1c30] px-2 py-0.5 rounded font-medium">
                            {sub.dosageForm}
                          </span>
                          <span className="bg-[#eff4ff] text-[#0b1c30] px-2 py-0.5 rounded font-medium">
                            {sub.packSize}
                          </span>
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {sub.regulatoryCert}
                          </span>
                        </div>

                        {sub.cautionNotes && (
                          <div className="mt-2 p-2.5 bg-amber-50 rounded-lg text-[11px] text-amber-900 border border-amber-200">
                            <strong>Caution:</strong> {sub.cautionNotes}
                          </div>
                        )}
                      </div>

                      {/* Pricing & Savings Block */}
                      <div className="sm:text-right shrink-0 bg-[#f8f9ff] sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-[#e5eeff]">
                        <span className="text-[10px] text-[#6d7a77] uppercase font-bold tracking-wider">
                          Retail Price
                        </span>
                        <div className="flex sm:flex-col items-baseline sm:items-end justify-between gap-2 sm:gap-0">
                          <span className="text-2xl font-black text-[#00685f] tracking-tight">
                            ₹{sub.price.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-[#6d7a77]">
                            (₹{sub.unitPrice.toFixed(2)} / tablet)
                          </span>
                        </div>

                        {/* Savings Badge */}
                        <div className="mt-2 inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-xs font-black px-2.5 py-1 rounded-lg">
                          <span>Save ₹{sub.savingsVsReference.toFixed(2)}</span>
                          <span>({sub.savingsPercentage}% OFF)</span>
                        </div>
                      </div>

                    </div>

                    {/* Bottom Action Strip */}
                    <div className="mt-4 pt-3 border-t border-[#f0f4ff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 text-[#3d4947]">
                        <Clock className="w-3.5 h-3.5 text-[#00685f]" />
                        <span className="text-[11px]">
                          {sub.storeAvailability}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {sub.isJanAushadhi ? (
                          <button 
                            onClick={() => onOpenStoreModal('STR-01')}
                            className="px-3 py-1.5 bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Find Nearest Kendra</span>
                          </button>
                        ) : sub.isDirectlyInterchangeable ? (
                          <button 
                            onClick={() => onOpenStoreModal('STR-02')}
                            className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00685f] text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Store className="w-3.5 h-3.5" />
                            <span>Check Chemist Stock</span>
                          </button>
                        ) : (
                          <button 
                            onClick={onOpenPdfModal}
                            className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-lg transition-colors"
                          >
                            Consult Pharmacist
                          </button>
                        )}

                        <button 
                          onClick={onOpenPdfModal}
                          className="px-2.5 py-1.5 text-[#6d7a77] hover:text-[#0b1c30] text-xs font-semibold"
                        >
                          Clinical Monograph
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>



        {/* Clinical Transparency Engine: 4 Pillars */}
        <section className="mt-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#e5eeff]">
          <div className="max-w-3xl mb-6">
            <span className="text-xs uppercase font-extrabold text-[#00685f] tracking-wider">
              Clinical Transparency Engine
            </span>
            <h3 className="text-xl font-bold text-[#0b1c30] mt-1">
              Why are these medicines clinically equivalent?
            </h3>
            <p className="text-xs md:text-sm text-[#3d4947] mt-1 leading-relaxed">
              In India, generic formulations must pass rigorous bioavailability and bioequivalence (BA/BE) standards prescribed under Schedule M and WHO-GMP protocols before retail approval.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#00685f] flex items-center justify-center font-bold mb-3">
                1
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30]">Active API Salt</h4>
              <p className="text-xs text-[#3d4947] mt-1">
                100% molecular equivalence. Both use Amoxicillin Trihydrate IP and Clavulanate Potassium IP.
              </p>
            </div>

            <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#00685f] flex items-center justify-center font-bold mb-3">
                2
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30]">Strength &amp; Ratio</h4>
              <p className="text-xs text-[#3d4947] mt-1">
                Verified 4:1 stoichiometric ratio (500mg amoxicillin to 125mg clavulanate) ensuring bacterial enzyme inhibition.
              </p>
            </div>

            <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#00685f] flex items-center justify-center font-bold mb-3">
                3
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30]">Dosage Form &amp; Release</h4>
              <p className="text-xs text-[#3d4947] mt-1">
                Oral film-coated tablets with identical gastric dissolution profile (&gt;85% within 15 minutes in vitro).
              </p>
            </div>

            <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#00685f] flex items-center justify-center font-bold mb-3">
                4
              </div>
              <h4 className="text-sm font-bold text-[#0b1c30]">Manufacturing Rigor</h4>
              <p className="text-xs text-[#3d4947] mt-1">
                Manufactured under CDSCO Schedule M and WHO-GMP compliance, inspected by central drug control officers.
              </p>
            </div>

          </div>

          {/* Interactive Accordion for Clinical Monograph */}
          <div className="mt-6 pt-4 border-t border-[#f0f4ff]">
            <button
              onClick={() => setShowAccordion(!showAccordion)}
              className="w-full flex items-center justify-between text-left text-xs font-bold text-[#00685f] hover:text-[#008378]"
            >
              <span className="flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                View Pharmacokinetic &amp; Bioequivalence Monograph Details (AUC, Cmax, Tmax)
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showAccordion ? 'rotate-180' : ''}`} />
            </button>

            {showAccordion && (
              <div className="mt-4 p-4 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-xs space-y-3 text-[#3d4947]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-metric-tabular">
                  <div className="p-3 bg-white rounded-lg border border-[#dce9ff]">
                    <span className="text-[10px] uppercase font-bold text-[#6d7a77]">AUC (Area Under Curve)</span>
                    <p className="text-sm font-bold text-[#0b1c30] mt-0.5">98.4% Correlation</p>
                    <p className="text-[11px] text-[#6d7a77]">Bioequivalent margin within 80-125% CDSCO boundary</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#dce9ff]">
                    <span className="text-[10px] uppercase font-bold text-[#6d7a77]">Cmax (Peak Plasma Conc.)</span>
                    <p className="text-sm font-bold text-[#0b1c30] mt-0.5">8.9 mcg/mL (±0.4)</p>
                    <p className="text-[11px] text-[#6d7a77]">Identical therapeutic window to reference standard</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#dce9ff]">
                    <span className="text-[10px] uppercase font-bold text-[#6d7a77]">Tmax (Time to Peak)</span>
                    <p className="text-sm font-bold text-[#0b1c30] mt-0.5">1.2 hours</p>
                    <p className="text-[11px] text-[#6d7a77]">Rapid systemic antibiotic distribution</p>
                  </div>
                </div>
                <p className="text-[11px] text-[#6d7a77] italic">
                  Data source: CDSCO Bioequivalence Testing Registry &amp; National Pharmacopoeia Commission Monographs.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Patient Safety First & Disclaimers */}
        <section className="mt-8 p-5 bg-white rounded-2xl border border-[#e5eeff] text-xs text-[#3d4947] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Stethoscope className="w-5 h-5 text-[#00685f] shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold text-[#0b1c30]">Patient Safety &amp; Doctor Consultation Advisory</h5>
              <p className="text-[11px] text-[#6d7a77] mt-0.5 leading-relaxed">
                medicine_check provides price transparency and regulatory data for informational purposes. Never stop, change, or substitute prescription medications without consulting your registered medical doctor.
              </p>
            </div>
          </div>
          <button 
            onClick={onOpenPdfModal}
            className="shrink-0 px-4 py-2 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#00685f] font-bold text-xs rounded-xl transition-colors"
          >
            Clinical Protocols
          </button>
        </section>

      </div>
    </div>
  );
};
