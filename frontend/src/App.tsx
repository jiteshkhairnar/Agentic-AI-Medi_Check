/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ConsumerCompareView } from './components/ConsumerCompareView';
import { DiscrepancyQueueView } from './components/DiscrepancyQueueView';
import { AuditLogsView } from './components/AuditLogsView';
import { CatalogGovernanceView } from './components/CatalogGovernanceView';
import { SystemArchitectureView } from './components/SystemArchitectureView';
import { ConsumerExtraViews } from './components/ConsumerExtraViews';
import { ReportPriceDiscrepancyModal } from './components/ReportPriceDiscrepancyModal';
import { SavingsCalculatorModal } from './components/SavingsCalculatorModal';
import { CdscoCertificateModal } from './components/CdscoCertificateModal';
import { RegisterCanonicalDrugModal } from './components/RegisterCanonicalDrugModal';
import { SavedMedicinesDrawer } from './components/SavedMedicinesDrawer';
import { MEDICINES_DATA } from '../../shared/data/mockData';
import { AppViewMode, MedicineSubstitute, AuthUser } from '../../shared/types';
import { PharmacistPortalView } from './components/PharmacistPortalView';
import { AdminPortalView } from './components/AdminPortalView';
import { AuthModal } from './components/AuthModal';
import { DEMO_USERS } from '../../shared/data/portalMockData';
import { ShieldCheck, Heart, FileText, CheckCircle2, Lock, Store, Key } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppViewMode>('consumer-compare');
  const [savedSubstituteIds, setSavedSubstituteIds] = useState<string[]>(['SUB-01', 'SUB-02']);
  
  // Active Authenticated User Context (Multi-Tenant JWT simulation)
  const [currentUser, setCurrentUser] = useState<AuthUser>(DEMO_USERS.pharmacist);

  // Automatically log in to set the token for the default mock user
  React.useEffect(() => {
    import('./api/client').then(({ api }) => {
      api.login(DEMO_USERS.pharmacist.email).catch(err => {
        console.error('Failed auto-login:', err);
      });
    });
  }, []);

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [isCdscoModalOpen, setIsCdscoModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'pharmacist' | 'admin' | 'consumer' | 'jwt-inspector'>('pharmacist');

  // Tracking recent resolved actions to propagate to audit ledger
  const [recentResolvedAction, setRecentResolvedAction] = useState<{
    ticketId: string;
    rationale: string;
    price: number;
  } | null>(null);

  // Flattened list of all substitutes for saved drawer
  const allSubstitutes: MedicineSubstitute[] = MEDICINES_DATA.flatMap(m => m.substitutes);
  const savedSubstitutesList = allSubstitutes.filter(s => savedSubstituteIds.includes(s.id));

  const handleToggleSaveSubstitute = (id: string) => {
    if (savedSubstituteIds.includes(id)) {
      setSavedSubstituteIds(prev => prev.filter(item => item !== id));
    } else {
      setSavedSubstituteIds(prev => [...prev, id]);
    }
  };

  const handleRemoveSavedSubstitute = (id: string) => {
    setSavedSubstituteIds(prev => prev.filter(item => item !== id));
  };

  const handleResolveTicketSuccess = (ticketId: string, rationale: string, price: number) => {
    setRecentResolvedAction({ ticketId, rationale, price });
  };

  const handleSelectMedicineFromDirectory = (brandName: string) => {
    setCurrentView('consumer-compare');
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col justify-between selection:bg-[#00685f]/20 selection:text-[#00685f]">
      
      {/* Top Universal Header */}
      <Header
        currentView={currentView}
        onSelectView={(view) => {
          if (view === 'consumer-savings-calc') {
            setIsSavingsModalOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        savedCount={savedSubstituteIds.length}
        onOpenSavedModal={() => setIsSavedDrawerOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={(tab) => {
          setAuthModalInitialTab(tab || 'pharmacist');
          setIsAuthModalOpen(true);
        }}
        onSelectDemoUser={(userKey) => {
          if (DEMO_USERS[userKey]) {
            setCurrentUser(DEMO_USERS[userKey]);
          }
        }}
      />

      {/* Main Content Router */}
      <main className="flex-1 w-full">
        {/* Pharmacist Interface (Architecture Section 1 & 4) */}
        {currentView === 'pharmacist-portal' && (
          <PharmacistPortalView
            currentUser={currentUser}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onNavigateToCompare={() => setCurrentView('consumer-compare')}
          />
        )}

        {/* Admin Interface (Architecture Section 1 & 4) */}
        {currentView === 'admin-portal' && (
          <AdminPortalView
            currentUser={currentUser}
            onNavigateToView={(view) => setCurrentView(view)}
            onOpenComplianceCert={() => setIsCdscoModalOpen(true)}
          />
        )}

        {currentView === 'consumer-compare' && (
          <ConsumerCompareView
            onOpenReportModal={() => setIsReportModalOpen(true)}
            savedSubstitutes={savedSubstituteIds}
            onToggleSaveSubstitute={handleToggleSaveSubstitute}
            onOpenPdfModal={() => setIsCdscoModalOpen(true)}
            onOpenStoreModal={(storeId) => setCurrentView('consumer-stores')}
          />
        )}

        {currentView === 'consumer-salt-directory' && (
          <ConsumerExtraViews
            activeSubView="salt-directory"
            onSelectMedicine={handleSelectMedicineFromDirectory}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {currentView === 'consumer-stores' && (
          <ConsumerExtraViews
            activeSubView="stores"
            onSelectMedicine={handleSelectMedicineFromDirectory}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {currentView === 'consumer-clinical-trust' && (
          <ConsumerExtraViews
            activeSubView="clinical-trust"
            onSelectMedicine={handleSelectMedicineFromDirectory}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {currentView === 'consumer-history' && (
          <ConsumerExtraViews
            activeSubView="history"
            onSelectMedicine={handleSelectMedicineFromDirectory}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {currentView === 'admin-discrepancy-queue' && (
          <DiscrepancyQueueView
            onResolveTicketSuccess={handleResolveTicketSuccess}
            onOpenAuditLogs={() => setCurrentView('admin-audit-logs')}
            onOpenComplianceCert={() => setIsCdscoModalOpen(true)}
          />
        )}

        {currentView === 'admin-audit-logs' && (
          <AuditLogsView
            onOpenComplianceCert={() => setIsCdscoModalOpen(true)}
            recentResolvedAction={recentResolvedAction}
          />
        )}

        {currentView === 'admin-catalog-governance' && (
          <CatalogGovernanceView
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onSelectMedicineForInspection={(id) => setCurrentView('admin-discrepancy-queue')}
          />
        )}

        {currentView === 'admin-system-architecture' && (
          <SystemArchitectureView />
        )}
      </main>

      {/* Global Modals */}
      <ReportPriceDiscrepancyModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={(report) => {
          // report submitted
        }}
      />

      <SavingsCalculatorModal
        isOpen={isSavingsModalOpen}
        onClose={() => setIsSavingsModalOpen(false)}
        onApplySavingsMed={(med) => setCurrentView('consumer-compare')}
      />

      <CdscoCertificateModal
        isOpen={isCdscoModalOpen}
        onClose={() => setIsCdscoModalOpen(false)}
      />

      <RegisterCanonicalDrugModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onDrugRegistered={(drug) => {
          // registered
        }}
      />

      <SavedMedicinesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedSubstitutes={savedSubstitutesList}
        onRemoveSubstitute={handleRemoveSavedSubstitute}
        onSelectSubstituteForCompare={(name) => {
          setIsSavedDrawerOpen(false);
          setCurrentView('consumer-compare');
        }}
      />

      {/* Role-Based Authentication & JWT Inspector Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        initialTab={authModalInitialTab}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.role === 'medical_store') {
            setCurrentView('pharmacist-portal');
          } else if (user.role === 'super_admin' || user.role === 'platform_admin') {
            setCurrentView('admin-portal');
          } else {
            setCurrentView('consumer-compare');
          }
        }}
      />

      {/* Production Grade Footer */}
      <footer className="bg-white border-t border-[#e5eeff] py-8 px-4 md:px-6 text-xs text-[#6d7a77]">
        <div className="max-w-[76rem] mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#00685f] text-white flex items-center justify-center font-bold text-xs">
                  ☤
                </div>
                <span className="font-bold text-sm text-[#0b1c30]">medicine_check</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#3d4947]">
                India&apos;s independent medicine comparison and DPCO price transparency engine. Empowering citizens with bioequivalent Jan Aushadhi and generic options.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setAuthModalInitialTab('jwt-inspector');
                    setIsAuthModalOpen(true);
                  }}
                  className="text-[11px] font-mono text-[#00685f] hover:underline flex items-center gap-1 font-bold"
                >
                  <Key className="w-3 h-3" />
                  <span>Inspect Active JWT &amp; Claims</span>
                </button>
              </div>
            </div>

            <div>
              <p className="font-bold text-[#0b1c30] text-xs uppercase mb-2">Consumer Access</p>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button onClick={() => setCurrentView('consumer-compare')} className="hover:text-[#00685f]">
                    Compare Medicines Matrix
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('consumer-salt-directory')} className="hover:text-[#00685f]">
                    Salt &amp; Active Formulation Index
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsSavingsModalOpen(true)} className="hover:text-[#00685f]">
                    Prescription Savings Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('consumer-stores')} className="hover:text-[#00685f]">
                    Jan Aushadhi Kendra Locator
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-[#0b1c30] text-xs uppercase mb-2">Store &amp; Governance Portals</p>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  <button onClick={() => setCurrentView('pharmacist-portal')} className="hover:text-[#00685f] font-semibold text-[#00685f] flex items-center gap-1">
                    <Store className="w-3 h-3" />
                    <span>Medical Store Pharmacist Portal</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('admin-portal')} className="hover:text-[#00685f] font-semibold text-[#0b1c30]">
                    Platform Administration Console
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('admin-discrepancy-queue')} className="hover:text-[#00685f]">
                    Discrepancy Triage Workbench (14)
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('admin-audit-logs')} className="hover:text-[#00685f]">
                    SHA-256 Cryptographic Audit Ledger
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('admin-catalog-governance')} className="hover:text-[#00685f]">
                    Catalog Governance &amp; Canonical Registry
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('admin-system-architecture')} className="hover:text-[#00685f]">
                    System Architecture Blueprint (Image 1)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('pharmacist');
                      setIsAuthModalOpen(true);
                    }}
                    className="hover:text-[#00685f] text-[#00685f] font-bold"
                  >
                    Pharmacist / Admin Login &amp; RBAC →
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-[#0b1c30] text-xs uppercase mb-2">Statutory Transparency</p>
              <p className="text-[11px] leading-relaxed text-[#3d4947]">
                Ceiling prices verified in compliance with the Drugs (Prices Control) Order, 2013 and Central Drugs Standard Control Organization (CDSCO) guidelines.
              </p>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="mt-2 text-xs font-bold text-[#ba1a1a] hover:underline block"
              >
                Report Chemist Price Violation →
              </button>
            </div>

          </div>

          <div className="pt-4 border-t border-[#f0f4ff] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p>© 2026 medicine_check. All rights reserved. Not a substitute for registered medical practitioner diagnosis.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-[#006b2c] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CDSCO Verified Data</span>
              </span>
              <span>•</span>
              <span>NPPA DPCO 2013</span>
              <span>•</span>
              <span className="font-mono text-[#00685f]">Block #88190</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
