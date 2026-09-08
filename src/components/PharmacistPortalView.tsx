/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  FileText, 
  Truck, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  Filter, 
  Clock, 
  Phone, 
  MapPin, 
  Sparkles, 
  Check, 
  X, 
  ArrowUpRight, 
  RotateCcw,
  IndianRupee,
  Layers,
  Building2,
  Calendar,
  Zap,
  Info
} from 'lucide-react';
import { 
  AuthUser, 
  StoreInventoryItem, 
  PrescriptionDispenseRequest, 
  SupplierReorderItem 
} from '../types';
import { 
  INITIAL_STORE_INVENTORY, 
  INITIAL_PRESCRIPTION_REQUESTS, 
  INITIAL_SUPPLIER_ORDERS 
} from '../data/portalMockData';

interface PharmacistPortalViewProps {
  currentUser: AuthUser;
  onOpenReportModal: () => void;
  onNavigateToCompare?: () => void;
}

export const PharmacistPortalView: React.FC<PharmacistPortalViewProps> = ({
  currentUser,
  onOpenReportModal,
  onNavigateToCompare
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'prescriptions' | 'supplier' | 'analytics'>('inventory');

  // Inventory state
  const [inventory, setInventory] = useState<StoreInventoryItem[]>(INITIAL_STORE_INVENTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Jan Aushadhi' | 'Branded Original'>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  // New item modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newGenericSalt, setNewGenericSalt] = useState('');
  const [newCategory, setNewCategory] = useState<'Jan Aushadhi' | 'Branded Generic' | 'Branded Original'>('Jan Aushadhi');
  const [newQty, setNewQty] = useState(100);
  const [newPrice, setNewPrice] = useState(45.00);
  const [newCap, setNewCap] = useState(120.00);
  const [newBatch, setNewBatch] = useState('JA-2026-NEW01');
  const [newExpiry, setNewExpiry] = useState('12/2028');

  // Prescriptions state
  const [prescriptions, setPrescriptions] = useState<PrescriptionDispenseRequest[]>(INITIAL_PRESCRIPTION_REQUESTS);
  const [selectedRx, setSelectedRx] = useState<PrescriptionDispenseRequest | null>(INITIAL_PRESCRIPTION_REQUESTS[0]);

  // Supplier reorders state
  const [orders, setOrders] = useState<SupplierReorderItem[]>(INITIAL_SUPPLIER_ORDERS);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [reorderSalt, setReorderSalt] = useState('Amoxyclav 625 (Jan Aushadhi)');
  const [reorderQty, setReorderQty] = useState(50);
  const [reorderSuccessToast, setReorderSuccessToast] = useState(false);

  // Toggle in-stock
  const handleToggleInStock = (id: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, inStock: !item.inStock, lastUpdated: 'Just now' };
      }
      return item;
    }));
  };

  // Update quick price
  const handleUpdatePrice = (id: string, newChemistPrice: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          chemistMrp: newChemistPrice,
          isWithinDpcoCap: newChemistPrice <= item.dpcoCeiling,
          lastUpdated: 'Just now'
        };
      }
      return item;
    }));
  };

  // Add new medicine to store inventory
  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName) return;

    const newItem: StoreInventoryItem = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      medicineName: newMedName,
      genericSalt: newGenericSalt || newMedName,
      brandOrGeneric: newCategory,
      dosageForm: 'Film Coated Tablet',
      packSize: '10 Tablets',
      stockQuantity: Number(newQty),
      minThreshold: 25,
      chemistMrp: Number(newPrice),
      dpcoCeiling: Number(newCap),
      isWithinDpcoCap: Number(newPrice) <= Number(newCap),
      batchNumber: newBatch,
      expiryDate: newExpiry,
      inStock: true,
      lastUpdated: 'Just now',
      demandCategory: 'Essential'
    };

    setInventory([newItem, ...inventory]);
    setShowAddModal(false);
    setNewMedName('');
    setNewGenericSalt('');
  };

  // Update prescription status
  const handleUpdateRxStatus = (rxId: string, status: PrescriptionDispenseRequest['status']) => {
    setPrescriptions(prev => prev.map(rx => rx.id === rxId ? { ...rx, status } : rx));
    if (selectedRx && selectedRx.id === rxId) {
      setSelectedRx(prev => prev ? { ...prev, status } : null);
    }
  };

  // Submit reorder
  const handleCreateReorder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: SupplierReorderItem = {
      id: `PO-PMBI-2026-${Math.floor(100 + Math.random() * 900)}`,
      genericSalt: reorderSalt,
      productName: reorderSalt,
      supplierSource: 'PMBI Central Depot',
      quantityOrdered: Number(reorderQty),
      unitCost: 65.00,
      totalCost: Number(reorderQty) * 65.00,
      status: 'Order Placed',
      expectedDelivery: 'In 2 Business Days',
      trackingNo: `EXP-PMBI-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setOrders([newOrder, ...orders]);
    setShowReorderModal(false);
    setReorderSuccessToast(true);
    setTimeout(() => setReorderSuccessToast(false), 4000);
  };

  // Filtered inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genericSalt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.brandOrGeneric === categoryFilter;

    const matchesStock = 
      stockFilter === 'all' ||
      (stockFilter === 'in_stock' && item.inStock && item.stockQuantity > item.minThreshold) ||
      (stockFilter === 'low_stock' && item.stockQuantity <= item.minThreshold && item.stockQuantity > 0) ||
      (stockFilter === 'out_of_stock' && (!item.inStock || item.stockQuantity === 0));

    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalInStock = inventory.filter(i => i.inStock).length;
  const lowStockCount = inventory.filter(i => i.stockQuantity <= i.minThreshold).length;

  return (
    <div className="w-full pb-20 pt-28 bg-[#f8f9ff] min-h-screen">
      <div className="max-w-[76rem] mx-auto px-4 md:px-6">

        {/* Store Profile & Tenant Header */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-[#e5eeff] mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00685f] to-[#008378] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-[#00685f] bg-[#e5eeff] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Medical Store Portal (Architecture Section 1 &amp; 4)
                  </span>
                  <span className="text-[11px] text-[#006b2c] font-bold flex items-center gap-1 bg-[#d6f5df] px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    CDSCO Verified Chemist License
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#0b1c30] tracking-tight">
                  {currentUser.tenantName || 'Jan Aushadhi Kendra #1084 (Domlur BDA)'}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#3d4947] mt-1">
                  <span>License: <strong className="font-mono text-[#0b1c30]">{currentUser.licenseNumber || 'DL-KA-BNG-2024-9128'}</strong></span>
                  <span>•</span>
                  <span>Pharmacist: <strong>{currentUser.name}</strong></span>
                  <span>•</span>
                  <span>Tenant ID: <strong className="font-mono text-[#00685f]">{currentUser.tenantId}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medicine to Store</span>
              </button>

              <button
                onClick={() => setShowReorderModal(true)}
                className="px-3.5 py-2 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-[#dce9ff]"
              >
                <Truck className="w-4 h-4 text-[#00685f]" />
                <span>Reorder PMBI Stock</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-4 border-t border-[#f0f4ff]">
            <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff]">
              <span className="text-[11px] text-[#6d7a77] uppercase font-bold block">Active Inventory</span>
              <span className="text-lg font-black text-[#0b1c30] mt-0.5 block">{totalInStock} Formulations</span>
              <span className="text-[10px] text-[#006b2c] font-semibold">Live in Consumer Search</span>
            </div>

            <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff]">
              <span className="text-[11px] text-[#6d7a77] uppercase font-bold block">Low Stock Alerts</span>
              <span className="text-lg font-black text-[#ba1a1a] mt-0.5 block">{lowStockCount} Items</span>
              <span className="text-[10px] text-[#ba1a1a] font-semibold">Restock before stockout</span>
            </div>

            <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff]">
              <span className="text-[11px] text-[#6d7a77] uppercase font-bold block">Patient Prescriptions</span>
              <span className="text-lg font-black text-[#00685f] mt-0.5 block">
                {prescriptions.filter(p => p.status === 'pending_pharmacist_review').length} Pending
              </span>
              <span className="text-[10px] text-[#3d4947] font-semibold">Substitution review</span>
            </div>

            <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#e5eeff]">
              <span className="text-[11px] text-[#6d7a77] uppercase font-bold block">Patient Savings Facilitated</span>
              <span className="text-lg font-black text-[#006b2c] mt-0.5 block">₹1,48,250</span>
              <span className="text-[10px] text-[#006b2c] font-semibold">This month via Generics</span>
            </div>
          </div>
        </div>

        {/* Toast alert */}
        {reorderSuccessToast && (
          <div className="mb-4 bg-[#d6f5df] border border-[#7ae39d] text-[#00521f] px-4 py-3 rounded-xl text-xs flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#006b2c]" />
              <span>Purchase order sent to Central PMBI Depot! Order tracking code generated.</span>
            </div>
            <button onClick={() => setReorderSuccessToast(false)} className="text-[#00521f] hover:text-black">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Pharmacist Interface Sub-Tabs */}
        <div className="flex border-b border-[#e5eeff] bg-white rounded-t-2xl px-4 pt-3 gap-2 overflow-x-auto shadow-xs">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-[#eff4ff] text-[#00685f] border-b-2 border-[#00685f]'
                : 'text-[#6d7a77] hover:text-[#0b1c30]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Store Stock &amp; DPCO Compliance ({inventory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap relative ${
              activeTab === 'prescriptions'
                ? 'bg-[#eff4ff] text-[#00685f] border-b-2 border-[#00685f]'
                : 'text-[#6d7a77] hover:text-[#0b1c30]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Prescription Dispensing &amp; Substitution</span>
            {prescriptions.filter(p => p.status === 'pending_pharmacist_review').length > 0 && (
              <span className="bg-[#ba1a1a] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {prescriptions.filter(p => p.status === 'pending_pharmacist_review').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('supplier')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'supplier'
                ? 'bg-[#eff4ff] text-[#00685f] border-b-2 border-[#00685f]'
                : 'text-[#6d7a77] hover:text-[#0b1c30]'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Supplier &amp; PMBI Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-[#eff4ff] text-[#00685f] border-b-2 border-[#00685f]'
                : 'text-[#6d7a77] hover:text-[#0b1c30]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Local Pincode Search Demand</span>
          </button>
        </div>

        {/* TAB 1: INVENTORY & STOCK MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-b-2xl p-5 shadow-sm border-x border-b border-[#e5eeff] space-y-4">
            
            {/* Search and Filters Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6d7a77]" />
                <input
                  type="text"
                  placeholder="Search medicine brand, active salt, or batch number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-[#f8f9ff] border border-[#dce9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-medium focus:outline-none"
                >
                  <option value="all">All Formulations</option>
                  <option value="Jan Aushadhi">Govt Jan Aushadhi Only</option>
                  <option value="Branded Original">Branded Original Drugs</option>
                </select>

                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-medium focus:outline-none"
                >
                  <option value="all">All Stock Status</option>
                  <option value="in_stock">In Stock (&gt; Min Threshold)</option>
                  <option value="low_stock">Low Stock (≤ Threshold)</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto rounded-xl border border-[#e5eeff]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9ff] text-[#3d4947] uppercase font-bold border-b border-[#e5eeff]">
                  <tr>
                    <th className="p-3">Medicine &amp; Salt Composition</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Batch &amp; Expiry</th>
                    <th className="p-3">Current Selling Price</th>
                    <th className="p-3">DPCO Ceiling Cap</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3 text-center">Availability</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f4ff]">
                  {filteredInventory.map((item) => {
                    const isLow = item.stockQuantity <= item.minThreshold && item.stockQuantity > 0;
                    const isOut = !item.inStock || item.stockQuantity === 0;

                    return (
                      <tr key={item.id} className="hover:bg-[#f8f9ff]/70 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-[#0b1c30]">{item.medicineName}</div>
                          <div className="text-[11px] text-[#6d7a77]">{item.genericSalt}</div>
                          <div className="text-[10px] text-[#00685f]">{item.packSize} • {item.dosageForm}</div>
                        </td>

                        <td className="p-3">
                          {item.brandOrGeneric === 'Jan Aushadhi' ? (
                            <span className="bg-[#d6f5df] text-[#006b2c] font-bold text-[10px] px-2 py-0.5 rounded">
                              Jan Aushadhi
                            </span>
                          ) : (
                            <span className="bg-[#eff4ff] text-[#0b1c30] font-medium text-[10px] px-2 py-0.5 rounded">
                              Branded
                            </span>
                          )}
                        </td>

                        <td className="p-3 font-mono text-[11px]">
                          <div>{item.batchNumber}</div>
                          <div className="text-[#6d7a77] text-[10px]">Exp: {item.expiryDate}</div>
                        </td>

                        <td className="p-3">
                          <div className="flex items-center gap-1 font-bold text-sm text-[#0b1c30]">
                            <span>₹{item.chemistMrp.toFixed(2)}</span>
                          </div>
                          <div className="text-[10px] text-[#6d7a77]">Synced: {item.lastUpdated}</div>
                        </td>

                        <td className="p-3">
                          <div className="font-mono text-xs text-[#3d4947]">₹{item.dpcoCeiling.toFixed(2)}</div>
                          {item.isWithinDpcoCap ? (
                            <span className="text-[10px] text-[#006b2c] font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" />
                              DPCO Compliant
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#ba1a1a] font-bold flex items-center gap-0.5">
                              <AlertTriangle className="w-3 h-3" />
                              Breaches Cap!
                            </span>
                          )}
                        </td>

                        <td className="p-3">
                          <div className={`font-bold text-xs ${isOut ? 'text-[#ba1a1a]' : isLow ? 'text-amber-600' : 'text-[#0b1c30]'}`}>
                            {item.stockQuantity} strips
                          </div>
                          {isLow && <span className="text-[10px] text-amber-600 font-semibold">Low Stock</span>}
                          {isOut && <span className="text-[10px] text-[#ba1a1a] font-semibold">Out of Stock</span>}
                        </td>

                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleInStock(item.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                              item.inStock
                                ? 'bg-[#d6f5df] text-[#006b2c] hover:bg-[#bbf0cb]'
                                : 'bg-[#ffdad6] text-[#93000a] hover:bg-[#ffb4ab]'
                            }`}
                          >
                            {item.inStock ? '● In Stock' : '○ Out of Stock'}
                          </button>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                const newP = prompt(`Update selling price for ${item.medicineName} (DPCO Cap: ₹${item.dpcoCeiling}):`, item.chemistMrp.toString());
                                if (newP && !isNaN(Number(newP))) {
                                  handleUpdatePrice(item.id, Number(newP));
                                }
                              }}
                              className="p-1 text-[#00685f] hover:bg-[#eff4ff] rounded text-[11px] font-bold underline"
                            >
                              Edit Price
                            </button>
                            <button
                              onClick={() => {
                                setReorderSalt(item.medicineName);
                                setShowReorderModal(true);
                              }}
                              className="px-2 py-1 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0b1c30] rounded text-[10px] font-bold"
                            >
                              + Reorder
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#dce9ff] flex items-center justify-between text-xs text-[#3d4947]">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#00685f]" />
                <span>
                  All price changes update the real-time API Gateway and Nearest Chemist availability feed for consumers within your pincode circle.
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#6d7a77]">CDSCO Sync Active</span>
            </div>
          </div>
        )}

        {/* TAB 2: PRESCRIPTION DISPENSING & PATIENT SUBSTITUTION WORKBENCH */}
        {activeTab === 'prescriptions' && (
          <div className="bg-white rounded-b-2xl p-5 shadow-sm border-x border-b border-[#e5eeff]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Prescriptions Queue List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
                  <h3 className="font-bold text-xs text-[#0b1c30] uppercase tracking-wider">
                    Patient Prescription Inquiries
                  </h3>
                  <span className="text-[11px] font-bold text-[#00685f]">
                    {prescriptions.length} Total
                  </span>
                </div>

                <div className="space-y-2">
                  {prescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      onClick={() => setSelectedRx(rx)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        selectedRx?.id === rx.id
                          ? 'border-[#00685f] bg-[#f0fbf9] shadow-xs'
                          : 'border-[#e5eeff] hover:border-[#dce9ff] bg-[#f8f9ff]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-xs text-[#0b1c30]">{rx.patientName}</div>
                          <div className="text-[10px] text-[#6d7a77]">{rx.patientAgeGender} • {rx.uploadedAt}</div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          rx.status === 'pending_pharmacist_review'
                            ? 'bg-[#ffdad6] text-[#93000a]'
                            : rx.status === 'ready_for_pickup'
                            ? 'bg-[#d6f5df] text-[#006b2c]'
                            : 'bg-[#e5eeff] text-[#0b1c30]'
                        }`}>
                          {rx.status === 'pending_pharmacist_review' ? 'Needs Review' : rx.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="mt-2 text-xs flex items-center justify-between">
                        <span className="text-[11px] text-[#3d4947]">
                          {rx.prescribedMedicines.length} Medicines Prescribed
                        </span>
                        <span className="font-bold text-[#006b2c] text-xs">
                          Saves ₹{rx.totalSavings.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescription Detail & Dispense Substitution Calculator */}
              {selectedRx ? (
                <div className="lg:col-span-2 bg-[#f8f9ff] rounded-2xl p-5 border border-[#dce9ff] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e5eeff]">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-[#0b1c30]">{selectedRx.patientName}</h2>
                        <span className="text-xs text-[#6d7a77]">({selectedRx.patientAgeGender})</span>
                        <span className="font-mono text-xs text-[#00685f]">{selectedRx.id}</span>
                      </div>
                      <p className="text-xs text-[#3d4947] mt-0.5">
                        Prescribing Doctor: <strong>{selectedRx.doctorName}</strong> ({selectedRx.hospitalClinic})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${selectedRx.patientPhone}`}
                        className="px-2.5 py-1.5 bg-white border border-[#dce9ff] rounded-lg text-xs font-bold text-[#0b1c30] flex items-center gap-1 hover:bg-[#eff4ff]"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#00685f]" />
                        <span>Call Patient</span>
                      </a>
                    </div>
                  </div>

                  {/* Medicines Comparison & Substitution Matrix */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#3d4947] mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#00685f]" />
                      <span>Pharmacist Generic Substitution &amp; Savings Matrix</span>
                    </h4>

                    <div className="space-y-2">
                      {selectedRx.prescribedMedicines.map((med, idx) => (
                        <div key={idx} className="bg-white p-3.5 rounded-xl border border-[#e5eeff] space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#ba1a1a] bg-[#ffdad6] px-1.5 py-0.2 rounded mr-2">
                                Prescribed Brand
                              </span>
                              <strong className="text-xs text-[#0b1c30]">{med.brandName}</strong>
                              <span className="text-xs text-[#6d7a77] ml-2">({med.genericSalt})</span>
                            </div>
                            <div className="text-xs font-mono text-[#ba1a1a] font-bold">
                              Branded MRP: ₹{med.brandedCost.toFixed(2)}
                            </div>
                          </div>

                          <div className="bg-[#f0fbf9] p-2.5 rounded-lg border border-[#a2ecd8] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-[#006b2c] bg-[#d6f5df] px-1.5 py-0.2 rounded mr-2">
                                Bioequivalent Jan Aushadhi
                              </span>
                              <strong className="text-xs text-[#00514a]">{med.genericSubstituteName}</strong>
                              <div className="text-[10px] text-[#2c4e47] mt-0.5">
                                Dosage instruction: {med.dosage}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xs font-bold text-[#006b2c]">
                                Generic Cost: ₹{med.genericCost.toFixed(2)}
                              </div>
                              <div className="text-[11px] font-bold text-[#006b2c]">
                                Patient Saves: ₹{med.savings.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary & Dispense Action */}
                  <div className="bg-white p-4 rounded-xl border border-[#dce9ff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-[#6d7a77]">Prescription Bill Comparison:</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs line-through text-[#6d7a77]">
                          Branded: ₹{selectedRx.totalBrandedCost.toFixed(2)}
                        </span>
                        <span className="text-sm font-bold text-[#00685f]">
                          Generic Total: ₹{selectedRx.totalGenericCost.toFixed(2)}
                        </span>
                        <span className="text-xs bg-[#d6f5df] text-[#006b2c] font-bold px-2 py-0.5 rounded">
                          ₹{selectedRx.totalSavings.toFixed(2)} Saved ({(selectedRx.totalSavings / selectedRx.totalBrandedCost * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateRxStatus(selectedRx.id, 'ready_for_pickup')}
                        className="px-3.5 py-2 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Ready for Pickup</span>
                      </button>

                      <button
                        onClick={() => handleUpdateRxStatus(selectedRx.id, 'dispensed')}
                        className="px-3.5 py-2 bg-[#006b2c] hover:bg-[#00521f] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Dispensed</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-2 bg-[#f8f9ff] rounded-2xl p-8 border border-[#dce9ff] text-center text-xs text-[#6d7a77]">
                  Select a prescription inquiry from the list to view substitution options.
                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 3: SUPPLIER & PMBI REORDERS */}
        {activeTab === 'supplier' && (
          <div className="bg-white rounded-b-2xl p-5 shadow-sm border-x border-b border-[#e5eeff] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff]">
              <div>
                <h3 className="font-bold text-sm text-[#0b1c30]">PMBI Depot &amp; Authorized Supplier Orders</h3>
                <p className="text-xs text-[#6d7a77]">
                  Direct procurement channel connected to Pradhan Mantri Bharatiya Janaushadhi Pariyojana Central Warehouses.
                </p>
              </div>
              <button
                onClick={() => setShowReorderModal(true)}
                className="px-3.5 py-2 bg-[#00685f] hover:bg-[#008378] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Place New Depot Order</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#e5eeff]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9ff] text-[#3d4947] uppercase font-bold border-b border-[#e5eeff]">
                  <tr>
                    <th className="p-3">Order Code</th>
                    <th className="p-3">Formulation &amp; Quantity</th>
                    <th className="p-3">Source Warehouse</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Expected ETA</th>
                    <th className="p-3 text-right">Tracking</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f4ff]">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#f8f9ff]/70 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#00685f]">{order.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-[#0b1c30]">{order.productName}</div>
                        <div className="text-[11px] text-[#6d7a77]">{order.quantityOrdered} Units</div>
                      </td>
                      <td className="p-3 text-[#3d4947]">{order.supplierSource}</td>
                      <td className="p-3 font-bold text-[#0b1c30]">₹{order.totalCost.toLocaleString()}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          order.status === 'Delivered'
                            ? 'bg-[#d6f5df] text-[#006b2c]'
                            : order.status === 'In Transit'
                            ? 'bg-[#eff4ff] text-[#00685f]'
                            : 'bg-[#fff0d4] text-[#8a5300]'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-[#6d7a77]">{order.expectedDelivery}</td>
                      <td className="p-3 text-right font-mono text-[11px] text-[#00685f]">
                        {order.trackingNo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: STORE ANALYTICS & LOCAL PINCODE DEMAND */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-b-2xl p-5 shadow-sm border-x border-b border-[#e5eeff] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dce9ff]">
                <h4 className="text-xs font-bold uppercase text-[#6d7a77] mb-1">Pincode 560071 Search Traffic</h4>
                <div className="text-2xl font-black text-[#0b1c30]">4,280 Searches</div>
                <p className="text-[11px] text-[#006b2c] font-semibold mt-1">↑ 18% increase this week</p>
              </div>

              <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dce9ff]">
                <h4 className="text-xs font-bold uppercase text-[#6d7a77] mb-1">Most Searched Formulation</h4>
                <div className="text-base font-bold text-[#0b1c30]">Amoxicillin + Clavulanic Acid 625mg</div>
                <p className="text-[11px] text-[#3d4947] mt-1">1,420 queries in 5km radius</p>
              </div>

              <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dce9ff]">
                <h4 className="text-xs font-bold uppercase text-[#6d7a77] mb-1">Unmet Local Demand Alert</h4>
                <div className="text-base font-bold text-[#ba1a1a]">Pantoprazole 40mg</div>
                <p className="text-[11px] text-[#ba1a1a] mt-1">68 patient searches had low local stock</p>
              </div>
            </div>

            {/* Fast Moving Salts in Pincode */}
            <div className="border border-[#e5eeff] rounded-xl p-4">
              <h3 className="font-bold text-xs text-[#0b1c30] uppercase tracking-wider mb-3">
                Top 5 High-Demand Generic Alternatives in Your Circle
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { salt: 'Amoxicillin 500mg + Clavulanic 125mg', searches: 1420, yourStock: '142 Strips in Stock (Healthy)', margin: 'DPCO Compliant' },
                  { salt: 'Telmisartan 40mg', searches: 980, yourStock: '280 Strips in Stock (Healthy)', margin: 'DPCO Compliant' },
                  { salt: 'Metformin 500mg SR', searches: 890, yourStock: '310 Strips in Stock (Healthy)', margin: 'DPCO Compliant' },
                  { salt: 'Rosuvastatin 10mg', searches: 640, yourStock: '195 Strips in Stock (Healthy)', margin: 'DPCO Compliant' },
                  { salt: 'Paracetamol 650mg', searches: 520, yourStock: '520 Strips in Stock (Healthy)', margin: 'DPCO Compliant' },
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#f8f9ff] border border-[#f0f4ff]">
                    <div className="font-medium text-[#0b1c30]">{row.salt}</div>
                    <div className="flex items-center gap-4">
                      <span className="text-[#6d7a77]">{row.searches} local searches</span>
                      <span className="text-[#006b2c] font-bold">{row.yourStock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Add Medicine to Store Inventory */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#dce9ff]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff] mb-4">
              <h3 className="text-base font-bold text-[#0b1c30] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#00685f]" />
                <span>Add Medicine Formulation to Store Stock</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#6d7a77] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Formulation / Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ciprofloxacin 500mg (Jan Aushadhi)"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Active Generic Salt Composition *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ciprofloxacin Hydrochloride IP (500mg)"
                  value={newGenericSalt}
                  onChange={(e) => setNewGenericSalt(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00685f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Medicine Type</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl"
                  >
                    <option value="Jan Aushadhi">Jan Aushadhi Generic</option>
                    <option value="Branded Generic">Branded Generic</option>
                    <option value="Branded Original">Branded Original</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Chemist Selling MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">DPCO Statutory Cap (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCap}
                    onChange={(e) => setNewCap(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={newBatch}
                    onChange={(e) => setNewBatch(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Expiry Date (MM/YYYY)</label>
                  <input
                    type="text"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#e5eeff] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#eff4ff] text-[#3d4947] rounded-xl font-bold hover:bg-[#dce9ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00685f] text-white rounded-xl font-bold hover:bg-[#008378]"
                >
                  Save &amp; Publish to Pincode Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: PMBI Depot Reorder */}
      {showReorderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#dce9ff]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e5eeff] mb-4">
              <h3 className="text-base font-bold text-[#0b1c30] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#00685f]" />
                <span>Place PMBI Depot Restock Order</span>
              </h3>
              <button onClick={() => setShowReorderModal(false)} className="text-[#6d7a77] hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReorder} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Generic Medicine Formulation</label>
                <input
                  type="text"
                  required
                  value={reorderSalt}
                  onChange={(e) => setReorderSalt(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Reorder Quantity (Boxes)</label>
                <input
                  type="number"
                  min="10"
                  value={reorderQty}
                  onChange={(e) => setReorderQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#dce9ff] rounded-xl font-bold"
                />
              </div>

              <div className="bg-[#eff4ff] p-3 rounded-xl border border-[#dce9ff] space-y-1">
                <div className="flex justify-between">
                  <span>Unit Wholesale Cost:</span>
                  <strong>₹65.00 / Box</strong>
                </div>
                <div className="flex justify-between font-bold text-[#00685f] text-sm pt-1 border-t border-[#dce9ff]">
                  <span>Total Procurement Bill:</span>
                  <span>₹{(reorderQty * 65.00).toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-[#6d7a77] mt-1">
                  Dispatched from PMBI Central Warehouse within 24 hours under Govt credit terms.
                </p>
              </div>

              <div className="pt-3 border-t border-[#e5eeff] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReorderModal(false)}
                  className="px-4 py-2 bg-[#eff4ff] text-[#3d4947] rounded-xl font-bold hover:bg-[#dce9ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00685f] text-white rounded-xl font-bold hover:bg-[#008378]"
                >
                  Confirm &amp; Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
