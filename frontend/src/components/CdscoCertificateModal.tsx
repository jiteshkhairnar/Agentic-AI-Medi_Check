/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Download, Printer, ShieldCheck, CheckCircle, FileText, QrCode } from 'lucide-react';

interface CdscoCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CdscoCertificateModal: React.FC<CdscoCertificateModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#dce9ff] max-h-[90vh] overflow-y-auto">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff] mb-4 print:hidden">
          <span className="text-xs font-bold text-[#00685f] uppercase tracking-wider">
            CDSCO / NPPA Official Compliance Certificate
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] text-xs font-bold rounded-xl flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-[#6d7a77] hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body (Government Format) */}
        <div className="border-4 border-double border-[#00685f]/40 p-6 rounded-xl bg-[#fafcff] relative">
          
          {/* Top Emblem & Header */}
          <div className="text-center space-y-1 pb-4 border-b border-[#dce9ff]">
            <p className="text-[11px] uppercase font-bold tracking-widest text-[#6d7a77]">Government of India</p>
            <h2 className="text-lg font-black text-[#0b1c30] tracking-tight">
              CENTRAL DRUGS STANDARD CONTROL ORGANIZATION (CDSCO)
            </h2>
            <p className="text-xs font-semibold text-[#00685f]">
              Directorate General of Health Services • Ministry of Health &amp; Family Welfare
            </p>
            <p className="text-[10px] text-[#6d7a77] uppercase font-mono mt-1">
              FORM 46 [RULE 122-B] • CERTIFICATE OF BIOEQUIVALENCE &amp; PRICE CEILING REGULATION
            </p>
          </div>

          {/* Certificate Metadata */}
          <div className="grid grid-cols-2 gap-4 my-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#6d7a77] block">Certificate No:</span>
              <span className="font-mono font-bold text-[#0b1c30]">CDSCO/BE-DPCO/2026/04921-A</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#6d7a77] block">Date of Attestation:</span>
              <span className="font-bold text-[#0b1c30]">24 October 2026</span>
            </div>
          </div>

          {/* Content Body */}
          <div className="space-y-3 text-xs text-[#3d4947] leading-relaxed">
            <p>
              This is to certify that the formulation <strong>Amoxicillin (500mg) + Potassium Clavulanate (125mg) Film Coated Tablet (Oral)</strong> marketed under brand <strong>Augmentin 625 Duo</strong> has been audited against the National List of Essential Medicines (NLEM) and Drugs (Prices Control) Order (DPCO), 2013.
            </p>

            <div className="p-3 bg-white rounded-xl border border-[#dce9ff] space-y-1.5 font-metric-tabular">
              <div className="flex justify-between">
                <span className="text-[#6d7a77]">Statutory DPCO Ceiling Price (S.O. 1542(E)):</span>
                <span className="font-bold text-[#00685f]">₹204.35 per strip of 10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6d7a77]">Approved Jan Aushadhi Equivalent:</span>
                <span className="font-bold text-[#0b1c30]">Amoxyclav 625 (BPPI / PMBI) @ ₹58.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6d7a77]">BA/BE Dissolution Ratio:</span>
                <span className="font-bold text-emerald-800">98.4% (Passes US-FDA / IP Criteria)</span>
              </div>
            </div>

            <p>
              Under Section 6 &amp; Section 14 of DPCO 2013, retail chemist markup exceeding ₹204.35 is unlawful. Overcharges are subject to confiscation and punitive recovery under the Essential Commodities Act, 1955.
            </p>
          </div>

          {/* Signatures & Hash Footer */}
          <div className="mt-6 pt-4 border-t border-[#dce9ff] flex items-center justify-between text-xs">
            <div className="space-y-1">
              <p className="font-bold text-[#0b1c30]">Dr. Ananya Sharma</p>
              <p className="text-[10px] text-[#6d7a77]">Lead Clinical Pharmacist &amp; Compliance Officer</p>
              <p className="text-[9px] font-mono text-[#00685f]">Signed with FIDO2 ECDSA P-256</p>
            </div>

            <div className="text-right space-y-1">
              <div className="inline-block p-1 bg-white border border-[#dce9ff] rounded">
                <QrCode className="w-10 h-10 text-[#00685f]" />
              </div>
              <p className="text-[9px] font-mono text-[#6d7a77]">SHA-256: 3c9b...a12df8</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
