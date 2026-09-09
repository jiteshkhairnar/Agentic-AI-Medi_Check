/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FlaskConical, 
  Store, 
  ShieldCheck, 
  History, 
  MapPin, 
  Phone, 
  CheckCircle, 
  ExternalLink, 
  Search, 
  Building2, 
  Award, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { NEARBY_STORES, MEDICINES_DATA } from '../../../shared/data/mockData';

interface ConsumerExtraViewsProps {
  activeSubView: 'salt-directory' | 'stores' | 'clinical-trust' | 'history';
  onSelectMedicine: (name: string) => void;
  onOpenReportModal: () => void;
}

export const ConsumerExtraViews: React.FC<ConsumerExtraViewsProps> = ({
  activeSubView,
  onSelectMedicine,
  onOpenReportModal
}) => {
  const [storeFilter, setStoreFilter] = useState<'all' | 'kendra' | 'retail'>('all');
  const [saltSearch, setSaltSearch] = useState('');

  // 1. Salt / Composition Directory View
  if (activeSubView === 'salt-directory') {
    const salts = [
      {
        name: 'Amoxicillin + Potassium Clavulanate',
        ratio: '4:1 and 7:1 formulations',
        class: 'Beta-lactam Antibiotic + Beta-lactamase Inhibitor',
        atcCode: 'J01CR02',
        dpcoRegulated: true,
        brands: ['Augmentin 625', 'Amoxyclav 625', 'Moxikind-CV 625', 'Clavam 625'],
        ceilingPerTab: '₹20.44 / tab',
        genericPrice: '₹5.85 / tab'
      },
      {
        name: 'Pantoprazole + Domperidone SR',
        ratio: '40mg + 30mg Sustained Release',
        class: 'Proton Pump Inhibitor + Prokinetic Antiemetic',
        atcCode: 'A02BC02',
        dpcoRegulated: true,
        brands: ['Pan-D', 'Pantocid D-SR', 'Jan Aushadhi Pantoprazole-D'],
        ceilingPerTab: '₹10.96 / cap',
        genericPrice: '₹2.40 / cap'
      },
      {
        name: 'Telmisartan',
        ratio: '20mg, 40mg, 80mg',
        class: 'Angiotensin II Receptor Blocker (ARB)',
        atcCode: 'C09CA07',
        dpcoRegulated: true,
        brands: ['Telma 40', 'Telmikind 40', 'Jan Aushadhi Telmisartan 40mg'],
        ceilingPerTab: '₹4.16 / tab',
        genericPrice: '₹1.65 / tab'
      },
      {
        name: 'Paracetamol',
        ratio: '500mg, 650mg',
        class: 'Analgesic & Antipyretic',
        atcCode: 'N02BE01',
        dpcoRegulated: true,
        brands: ['Dolo 650', 'Calpol 650', 'PMBI Generic Paracetamol 650mg'],
        ceilingPerTab: '₹2.03 / tab',
        genericPrice: '₹0.98 / tab'
      }
    ];

    const filtered = salts.filter(s => 
      s.name.toLowerCase().includes(saltSearch.toLowerCase()) ||
      s.class.toLowerCase().includes(saltSearch.toLowerCase())
    );

    return (
      <div className="w-full pb-20 pt-28 bg-[#f8f9ff]">
        <div className="max-w-[76rem] mx-auto px-4 md:px-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff] mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#00685f] uppercase tracking-wider">
                  Active Formulation Index
                </span>
                <h1 className="text-xl md:text-2xl font-black text-[#0b1c30] mt-1">
                  Salt &amp; Active Chemical Composition Directory
                </h1>
                <p className="text-xs text-[#3d4947] mt-0.5">
                  Browse Indian Pharmacopoeia monographs, stoichiometric ratios, and official statutory DPCO price ceilings.
                </p>
              </div>

              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#6d7a77] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={saltSearch}
                  onChange={(e) => setSaltSearch(e.target.value)}
                  placeholder="Search chemical salt (e.g. Amoxicillin, Paracetamol)..."
                  className="w-full pl-9 pr-3 py-2 bg-[#eff4ff] text-xs rounded-xl border border-transparent focus:border-[#00685f] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((salt, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff] space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-[#eff4ff] text-[#00685f] px-2 py-0.5 rounded">
                      ATC: {salt.atcCode}
                    </span>
                    <h3 className="text-base font-bold text-[#0b1c30] mt-1">{salt.name}</h3>
                    <p className="text-xs text-[#6d7a77]">{salt.class}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                    DPCO Scheduled
                  </span>
                </div>

                <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#dce9ff] grid grid-cols-2 gap-2 text-xs font-metric-tabular">
                  <div>
                    <span className="text-[10px] text-[#6d7a77] block">DPCO Statutory Cap</span>
                    <span className="text-sm font-black text-[#00685f]">{salt.ceilingPerTab}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6d7a77] block">Jan Aushadhi Generic</span>
                    <span className="text-sm font-black text-[#006b2c]">{salt.genericPrice}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-[#6d7a77] uppercase tracking-wider block mb-1">
                    Marketed Brand Substitutes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {salt.brands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => onSelectMedicine(brand)}
                        className="px-2.5 py-1 bg-[#f8f9ff] hover:bg-[#eff4ff] hover:text-[#00685f] text-[11px] font-semibold text-[#0b1c30] rounded-lg border border-[#e5eeff] transition-colors"
                      >
                        {brand} →
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Partner Medical Stores View
  if (activeSubView === 'stores') {
    const filteredStores = NEARBY_STORES.filter(s => {
      if (storeFilter === 'kendra') return s.type === 'Jan Aushadhi Kendra';
      if (storeFilter === 'retail') return s.type === 'Retail Pharmacy';
      return true;
    });

    return (
      <div className="w-full pb-20 pt-28 bg-[#f8f9ff]">
        <div className="max-w-[76rem] mx-auto px-4 md:px-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff] mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#00685f] uppercase tracking-wider">
                  Verified Physical Chemist Network
                </span>
                <h1 className="text-xl md:text-2xl font-black text-[#0b1c30] mt-1">
                  Partner Medical Stores &amp; Jan Aushadhi Kendras
                </h1>
                <p className="text-xs text-[#3d4947] mt-0.5">
                  Real-time stock availability, physical GPS verification, and DPCO statutory pricing audit status.
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-[#eff4ff] p-1 rounded-xl border border-[#dce9ff]">
                <button
                  onClick={() => setStoreFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    storeFilter === 'all' ? 'bg-[#00685f] text-white' : 'text-[#3d4947]'
                  }`}
                >
                  All (4)
                </button>
                <button
                  onClick={() => setStoreFilter('kendra')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    storeFilter === 'kendra' ? 'bg-[#00685f] text-white' : 'text-[#3d4947]'
                  }`}
                >
                  Jan Aushadhi Kendras
                </button>
                <button
                  onClick={() => setStoreFilter('retail')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    storeFilter === 'retail' ? 'bg-[#00685f] text-white' : 'text-[#3d4947]'
                  }`}
                >
                  Retail Pharmacies
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStores.map(store => (
              <div key={store.id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e5eeff] space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      store.type === 'Jan Aushadhi Kendra' 
                        ? 'bg-[#00685f] text-white' 
                        : 'bg-[#eff4ff] text-[#00685f]'
                    }`}>
                      {store.type}
                    </span>
                    <h3 className="text-base font-bold text-[#0b1c30] mt-1">{store.name}</h3>
                    <p className="text-xs text-[#6d7a77] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#00685f]" />
                      {store.address}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#00685f] bg-[#e5eeff] px-2 py-1 rounded-lg shrink-0">
                    {store.distance}
                  </span>
                </div>

                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6d7a77]">Stock Verification:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {store.stockLastVerified}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6d7a77]">DPCO Price Audit:</span>
                    <span className={`font-bold ${store.dpcoCompliant ? 'text-emerald-700' : 'text-[#ba1a1a]'}`}>
                      {store.dpcoCompliant ? '100% Compliant' : 'Flagged for Audit Review'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6d7a77]">Contact Desk:</span>
                    <span className="font-mono text-[#0b1c30]">{store.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => alert(`Directions to ${store.name} routed via OpenStreetMap.`)}
                    className="text-xs font-bold text-[#00685f] hover:underline flex items-center gap-1"
                  >
                    <span>Get GPS Directions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {!store.dpcoCompliant && (
                    <button
                      onClick={onOpenReportModal}
                      className="text-xs font-bold text-[#ba1a1a] hover:underline"
                    >
                      Report Overcharge
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Clinical Trust & Safety View
  if (activeSubView === 'clinical-trust') {
    return (
      <div className="w-full pb-20 pt-28 bg-[#f8f9ff]">
        <div className="max-w-[76rem] mx-auto px-4 md:px-6 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff]">
            <span className="text-xs font-bold text-[#00685f] uppercase tracking-wider">
              Safety Protocols &amp; Regulatory Framework
            </span>
            <h1 className="text-xl md:text-2xl font-black text-[#0b1c30] mt-1">
              Clinical Trust, Bioequivalence &amp; Patient Safety
            </h1>
            <p className="text-xs text-[#3d4947] mt-1 max-w-3xl leading-relaxed">
              How the medicine_check clinical engine cross-validates active pharmaceutical ingredients (APIs), excipients, and release profiles against Central Drugs Standard Control Organization (CDSCO) mandates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-5 rounded-2xl border border-[#e5eeff] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#00685f] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0b1c30]">Schedule M Compliance</h3>
              <p className="text-[#3d4947] leading-relaxed">
                Good Manufacturing Practices (GMP) and plant inspection requirements under Drugs and Cosmetics Rules ensure batch-to-batch sterility and purity.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e5eeff] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#00685f] flex items-center justify-center font-bold">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0b1c30]">BA/BE Dissolution Proof</h3>
              <p className="text-[#3d4947] leading-relaxed">
                Bioavailability and bioequivalence studies verify that generic blood concentration profiles match branded innovators within the 80%-125% scientific window.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e5eeff] space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#00685f] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#0b1c30]">Jan Aushadhi PMBI Rigor</h3>
              <p className="text-[#3d4947] leading-relaxed">
                Every generic medicine procured under Pradhan Mantri Bhartiya Janaushadhi Pariyojana is tested at NABL-accredited government laboratories before release.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. My Medicine History
  return (
    <div className="w-full pb-20 pt-28 bg-[#f8f9ff]">
      <div className="max-w-[76rem] mx-auto px-4 md:px-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5eeff] mb-6">
          <span className="text-xs font-bold text-[#00685f] uppercase tracking-wider">
            Patient Activity History
          </span>
          <h1 className="text-xl md:text-2xl font-black text-[#0b1c30] mt-1">
            My Medicine Comparisons &amp; Searches
          </h1>
          <p className="text-xs text-[#3d4947] mt-0.5">
            Your recent comparisons are saved locally in your browser for fast clinical consultations.
          </p>
        </div>

        <div className="space-y-3">
          {MEDICINES_DATA.map(med => (
            <div key={med.id} className="bg-white p-4 rounded-2xl border border-[#e5eeff] flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-[#0b1c30] text-sm">{med.brandName}</h4>
                <p className="text-[11px] text-[#6d7a77]">{med.genericSalt} • {med.manufacturer}</p>
              </div>
              <button
                onClick={() => onSelectMedicine(med.brandName)}
                className="px-3.5 py-1.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold rounded-xl shadow-xs"
              >
                Re-Compare
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
