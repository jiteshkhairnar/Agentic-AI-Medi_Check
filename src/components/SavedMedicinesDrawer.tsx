/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Bookmark, Share2, Trash2, ArrowRight, Building2, Check, MapPin } from 'lucide-react';
import { MedicineSubstitute } from '../types';

interface SavedMedicinesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedSubstitutes: MedicineSubstitute[];
  onRemoveSubstitute: (id: string) => void;
  onSelectSubstituteForCompare: (name: string) => void;
}

export const SavedMedicinesDrawer: React.FC<SavedMedicinesDrawerProps> = ({
  isOpen,
  onClose,
  savedSubstitutes,
  onRemoveSubstitute,
  onSelectSubstituteForCompare
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between border-l border-[#dce9ff] animate-in slide-in-from-right duration-200">
        
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#e5eeff] mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00685f] text-white flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0b1c30]">Saved Formulations ({savedSubstitutes.length})</h3>
                <p className="text-xs text-[#6d7a77]">Personal Medicine Substitutes List</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg text-[#6d7a77] hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          {savedSubstitutes.length === 0 ? (
            <div className="text-center py-16 text-xs text-[#6d7a77] space-y-2">
              <Bookmark className="w-8 h-8 text-gray-300 mx-auto" />
              <p className="font-bold text-[#0b1c30]">No medicines saved yet</p>
              <p>Bookmark generics during comparison to review with your physician.</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
              {savedSubstitutes.map(sub => (
                <div key={sub.id} className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dce9ff] space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        sub.isJanAushadhi ? 'bg-[#00685f] text-white' : 'bg-[#eff4ff] text-[#00685f]'
                      }`}>
                        {sub.isJanAushadhi ? 'Jan Aushadhi Generic' : 'Branded Generic'}
                      </span>
                      <h4 className="text-sm font-bold text-[#0b1c30] mt-1">{sub.name}</h4>
                      <p className="text-[11px] text-[#3d4947] flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#6d7a77]" />
                        {sub.manufacturer}
                      </p>
                    </div>

                    <button
                      onClick={() => onRemoveSubstitute(sub.id)}
                      className="text-[#6d7a77] hover:text-[#ba1a1a] p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-[#e5eeff]">
                    <div>
                      <span className="text-base font-black text-[#00685f]">₹{sub.price.toFixed(2)}</span>
                      <span className="text-[10px] text-[#6d7a77] ml-1">({sub.packSize})</span>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                      Save ₹{sub.savingsVsReference.toFixed(2)} ({sub.savingsPercentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#e5eeff] space-y-2 text-xs">
          <button
            onClick={() => {
              alert('Copied summary of saved generics to clipboard. You can send this directly to your family physician.');
            }}
            className="w-full py-2.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Share List with Doctor</span>
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 bg-[#eff4ff] text-[#3d4947] font-bold rounded-xl hover:bg-[#dce9ff]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
