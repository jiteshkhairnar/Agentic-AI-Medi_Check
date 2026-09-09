/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

interface RegisterCanonicalDrugModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDrugRegistered: (drug: any) => void;
}

export const RegisterCanonicalDrugModal: React.FC<RegisterCanonicalDrugModalProps> = ({
  isOpen,
  onClose,
  onDrugRegistered
}) => {
  const [brandName, setBrandName] = useState('');
  const [genericSalt, setGenericSalt] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [dpcoCap, setDpcoCap] = useState('');
  const [mrp, setMrp] = useState('');
  const [dosageForm, setDosageForm] = useState('Tablet');
  const [scheduleCategory, setScheduleCategory] = useState('Schedule H');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDrug = {
      id: `CAN-DRUG-${Math.floor(10000 + Math.random() * 90000)}`,
      brandName,
      genericSalt,
      compositionDetails: `${genericSalt} oral formulation`,
      manufacturer,
      dosageForm,
      packSize: 'Strip of 10',
      scheduleCategory,
      dpcoStatutoryCap: parseFloat(dpcoCap) || 0,
      currentChemistMRP: parseFloat(mrp) || 0,
      hasPriceBreach: (parseFloat(mrp) || 0) > (parseFloat(dpcoCap) || 0),
      excessMarginPercentage: 0,
      excessMarkupAmount: 0,
      referenceCode: `Ref #${brandName.substring(0, 4).toUpperCase()}`,
      searchesPerDay: 120,
      substitutes: []
    };

    onDrugRegistered(newDrug);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#dce9ff] max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00685f] text-white flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0b1c30]">Register Canonical Drug</h3>
              <p className="text-xs text-[#6d7a77]">Central CDSCO Formulation Registry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#6d7a77] hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-8 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-[#00685f] mx-auto" />
            <h4 className="text-base font-bold text-[#0b1c30]">Drug Registered in Canonical Index</h4>
            <p className="text-xs text-[#6d7a77]">Synchronized across all replica nodes.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-[#3d4947] mb-1">Brand Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Dolo 650 Tablet"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-[#0b1c30] font-semibold focus:outline-none focus:border-[#00685f]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3d4947] mb-1">Active Chemical Salt (API)</label>
              <input
                type="text"
                required
                placeholder="e.g. Paracetamol IP 650mg"
                value={genericSalt}
                onChange={(e) => setGenericSalt(e.target.value)}
                className="w-full p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-[#0b1c30] font-semibold focus:outline-none focus:border-[#00685f]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#3d4947] mb-1">Manufacturer</label>
              <input
                type="text"
                required
                placeholder="e.g. Micro Labs Ltd."
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-[#0b1c30] font-semibold focus:outline-none focus:border-[#00685f]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#3d4947] mb-1">NPPA DPCO Cap (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="30.50"
                  value={dpcoCap}
                  onChange={(e) => setDpcoCap(e.target.value)}
                  className="w-full p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-[#00685f] font-bold focus:outline-none focus:border-[#00685f]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3d4947] mb-1">Retail MRP (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="33.50"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  className="w-full p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-[#0b1c30] font-bold focus:outline-none focus:border-[#00685f]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e5eeff]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#eff4ff] text-[#3d4947] font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#00685f] hover:bg-[#008378] text-white font-bold rounded-xl shadow-xs"
              >
                Register &amp; Index
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
