/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { X, Calculator, Percent, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface SavingsCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySavingsMed: (medName: string) => void;
}

export const SavingsCalculatorModal: React.FC<SavingsCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplySavingsMed
}) => {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([
    'hypertension',
    'diabetes',
    'antibiotics'
  ]);
  const [familyMembers, setFamilyMembers] = useState(2);

  const toggleCondition = (id: string) => {
    if (selectedConditions.includes(id)) {
      setSelectedConditions(selectedConditions.filter(c => c !== id));
    } else {
      setSelectedConditions([...selectedConditions, id]);
    }
  };

  const calculation = useMemo(() => {
    let monthlyBranded = 0;
    let monthlyGeneric = 0;

    if (selectedConditions.includes('hypertension')) {
      // Telma 40 vs Jan Aushadhi Telmisartan
      monthlyBranded += 142 * familyMembers;
      monthlyGeneric += 16.50 * familyMembers;
    }
    if (selectedConditions.includes('diabetes')) {
      // Glycomet GP2 vs Jan Aushadhi
      monthlyBranded += 148 * familyMembers;
      monthlyGeneric += 24.00 * familyMembers;
    }
    if (selectedConditions.includes('cardiac')) {
      // Rosuvas 10 vs Jan Aushadhi
      monthlyBranded += 195 * familyMembers;
      monthlyGeneric += 28.00 * familyMembers;
    }
    if (selectedConditions.includes('gastric')) {
      // Pan-D vs Jan Aushadhi
      monthlyBranded += 198 * familyMembers;
      monthlyGeneric += 24.00 * familyMembers;
    }
    if (selectedConditions.includes('antibiotics')) {
      // Augmentin 625 vs Amoxyclav 625
      monthlyBranded += 204.35;
      monthlyGeneric += 58.50;
    }

    const monthlySaved = monthlyBranded - monthlyGeneric;
    const yearlySaved = monthlySaved * 12;
    const pctSaved = monthlyBranded > 0 ? Math.round((monthlySaved / monthlyBranded) * 100) : 0;

    return { monthlyBranded, monthlyGeneric, monthlySaved, yearlySaved, pctSaved };
  }, [selectedConditions, familyMembers]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-[#dce9ff] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00685f] text-white flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0b1c30]">Family Prescription Savings Calculator</h3>
              <p className="text-xs text-[#6d7a77]">Based on official Jan Aushadhi &amp; DPCO benchmark differentials</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#6d7a77] hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Big Savings Output Banner */}
        <div className="p-4 bg-gradient-to-r from-[#00685f] to-[#008378] text-white rounded-2xl mb-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-200 font-bold uppercase tracking-wider block">Estimated Annual Savings</span>
            <span className="text-3xl font-black text-white font-metric-tabular">
              ₹{calculation.yearlySaved.toFixed(0)} / year
            </span>
            <p className="text-xs text-emerald-100 mt-0.5 font-medium">
              Save ₹{calculation.monthlySaved.toFixed(0)} every single month ({calculation.pctSaved}% reduction)
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center font-black text-lg">
            {calculation.pctSaved}%
          </div>
        </div>

        {/* Condition Checkboxes */}
        <div className="space-y-3 text-xs mb-5">
          <label className="block font-bold text-[#3d4947] text-[11px] uppercase tracking-wider">
            Select Active Family Prescriptions &amp; Therapies:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'hypertension', label: 'Hypertension (e.g. Telma 40)', saving: 'Save ~₹1,500/yr' },
              { id: 'diabetes', label: 'Type 2 Diabetes (e.g. Glycomet-GP 2)', saving: 'Save ~₹1,480/yr' },
              { id: 'cardiac', label: 'Cholesterol / Statin (e.g. Rosuvas 10)', saving: 'Save ~₹2,000/yr' },
              { id: 'gastric', label: 'Acidity / GERD (e.g. Pan-D Capsule)', saving: 'Save ~₹2,080/yr' },
              { id: 'antibiotics', label: 'Acute Antibiotic (e.g. Augmentin 625)', saving: 'Save ~₹145/course' }
            ].map(cond => {
              const isChecked = selectedConditions.includes(cond.id);
              return (
                <div
                  key={cond.id}
                  onClick={() => toggleCondition(cond.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isChecked 
                      ? 'bg-[#eff4ff] border-[#00685f] shadow-xs' 
                      : 'bg-white border-[#dce9ff] hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <p className="font-bold text-[#0b1c30]">{cond.label}</p>
                    <p className="text-[10px] text-[#00685f] font-semibold">{cond.saving}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                    isChecked ? 'bg-[#00685f] border-[#00685f] text-white' : 'border-[#dce9ff]'
                  }`}>
                    {isChecked && <CheckCircle className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Family Size Slider */}
        <div className="mb-5 text-xs">
          <div className="flex items-center justify-between mb-1.5 font-bold text-[#3d4947]">
            <span>Family Members on Regular Medications:</span>
            <span className="text-[#00685f] font-black">{familyMembers} {familyMembers === 1 ? 'person' : 'people'}</span>
          </div>
          <input
            type="range"
            min="1"
            max="6"
            value={familyMembers}
            onChange={(e) => setFamilyMembers(parseInt(e.target.value))}
            className="w-full h-2 bg-[#eff4ff] rounded-lg appearance-none cursor-pointer accent-[#00685f]"
          />
        </div>

        {/* Breakdown Card */}
        <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] text-xs space-y-2 mb-4">
          <div className="flex justify-between text-[#3d4947]">
            <span>Branded Retail Chemist Cost:</span>
            <span className="line-through text-[#ba1a1a] font-bold">₹{calculation.monthlyBranded.toFixed(2)}/mo</span>
          </div>
          <div className="flex justify-between text-[#3d4947]">
            <span>Equivalent Jan Aushadhi Cost:</span>
            <span className="text-[#00685f] font-black">₹{calculation.monthlyGeneric.toFixed(2)}/mo</span>
          </div>
          <div className="pt-2 border-t border-[#e5eeff] flex justify-between font-bold text-[#0b1c30]">
            <span>Monthly Net Savings:</span>
            <span className="text-emerald-700">₹{calculation.monthlySaved.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e5eeff]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#eff4ff] text-[#3d4947] font-bold text-xs rounded-xl hover:bg-[#dce9ff]"
          >
            Close
          </button>
          <button
            onClick={() => {
              onApplySavingsMed('Augmentin 625 Duo Tablet');
              onClose();
            }}
            className="px-5 py-2 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <span>Compare Generic Formulations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
