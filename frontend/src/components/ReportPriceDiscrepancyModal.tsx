/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Flag, CheckCircle2, AlertTriangle, Upload, Receipt, Store, MapPin } from 'lucide-react';

interface ReportPriceDiscrepancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMedicineName?: string;
  onSubmitReport: (ticketData: any) => void;
}

export const ReportPriceDiscrepancyModal: React.FC<ReportPriceDiscrepancyModalProps> = ({
  isOpen,
  onClose,
  defaultMedicineName = 'Augmentin 625 Duo Tablet',
  onSubmitReport
}) => {
  const [medName, setMedName] = useState(defaultMedicineName);
  const [storeName, setStoreName] = useState('Apollo Pharmacy Indiranagar');
  const [storePincode, setStorePincode] = useState('560038');
  const [chargedPrice, setChargedPrice] = useState('220.00');
  const [printedMrp, setPrintedMrp] = useState('204.35');
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [userNotes, setUserNotes] = useState('Store charged ₹220 claiming transport surcharge not covered under DPCO.');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = `#DISC-2026-0${Math.floor(892 + Math.random() * 50)}`;
    setGeneratedTicketId(ticketId);
    setIsSubmitted(true);
    
    onSubmitReport({
      ticketId,
      medicineName: medName,
      storeName,
      chargedPrice: parseFloat(chargedPrice) || 0,
      printedMrp: parseFloat(printedMrp) || 0,
      userNotes,
      pincode: storePincode
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dce9ff] max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0b1c30]">Report Price Discrepancy / Overcharge</h3>
              <p className="text-xs text-[#6d7a77]">DPCO 2013 Statutory Enforcement Grievance</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#6d7a77] hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#00685f] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#0b1c30]">Grievance Registered Successfully</h4>
            <p className="text-xs text-[#3d4947] max-w-sm mx-auto">
              Ticket <strong className="text-[#00685f] font-mono">{generatedTicketId}</strong> has been created and routed to the Operations Triage Desk for pharmacist verification.
            </p>
            <div className="p-3 bg-[#eff4ff] rounded-xl text-xs text-[#3d4947] text-left max-w-sm mx-auto space-y-1 border border-[#dce9ff]">
              <p><strong>Medicine:</strong> {medName}</p>
              <p><strong>Store:</strong> {storeName} (Pin: {storePincode})</p>
              <p><strong>Overcharge:</strong> ₹{(parseFloat(chargedPrice) - parseFloat(printedMrp)).toFixed(2)}</p>
            </div>
            <button
              onClick={() => { setIsSubmitted(false); onClose(); }}
              className="mt-4 px-6 py-2.5 bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Back to Portal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#3d4947] mb-1">Medicine Brand Name</label>
              <input
                type="text"
                required
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                className="w-full p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-[#0b1c30] font-semibold focus:outline-none focus:border-[#00685f]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#3d4947] mb-1">Pharmacy / Store Name</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-[#0b1c30] font-semibold focus:outline-none focus:border-[#00685f]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3d4947] mb-1">Store Pincode</label>
                <input
                  type="text"
                  required
                  value={storePincode}
                  onChange={(e) => setStorePincode(e.target.value)}
                  className="w-full p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-[#0b1c30] font-semibold focus:outline-none focus:border-[#00685f]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#3d4947] mb-1">Actual Charged Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={chargedPrice}
                  onChange={(e) => setChargedPrice(e.target.value)}
                  className="w-full p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-[#ba1a1a] font-bold focus:outline-none focus:border-[#00685f]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3d4947] mb-1">Statutory Cap / Printed MRP (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={printedMrp}
                  onChange={(e) => setPrintedMrp(e.target.value)}
                  className="w-full p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-[#00685f] font-bold focus:outline-none focus:border-[#00685f]"
                />
              </div>
            </div>

            {/* Receipt Upload Box */}
            <div>
              <label className="block font-bold text-[#3d4947] mb-1">Receipt or Medicine Strip Photo</label>
              <div 
                onClick={() => setReceiptUploaded(!receiptUploaded)}
                className={`p-4 rounded-xl border-2 border-dashed cursor-pointer text-center transition-colors ${
                  receiptUploaded 
                    ? 'border-[#00685f] bg-emerald-50 text-[#00685f]' 
                    : 'border-[#dce9ff] bg-[#eff4ff] text-[#6d7a77] hover:border-[#00685f]'
                }`}
              >
                <Receipt className="w-6 h-6 mx-auto mb-1 text-[#00685f]" />
                <p className="font-bold text-xs text-[#0b1c30]">
                  {receiptUploaded ? 'apollo_bill_scan_24oct.jpg (OCR Verified)' : 'Click to attach bill / photo'}
                </p>
                <p className="text-[10px] text-[#6d7a77]">Supports JPG, PNG, PDF up to 10MB</p>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#3d4947] mb-1">Details &amp; Reason Given by Retailer</label>
              <textarea
                rows={2}
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                className="w-full p-2.5 bg-[#eff4ff] rounded-xl border border-[#dce9ff] text-[#0b1c30] focus:outline-none focus:border-[#00685f]"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Reports are forwarded under Section 6 of DPCO to state drug controllers. Chemist identity is confidential.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e5eeff]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#eff4ff] text-[#3d4947] font-bold rounded-xl hover:bg-[#dce9ff]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold rounded-xl shadow-xs"
              >
                Submit Discrepancy Ticket
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
