// src/pages/admin/OrdersPage.tsx
import OrderTable from '@/components/admin/OrderTable';
import { X } from 'lucide-react';
import React from 'react';


const AdminOrders: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          {/* <X className="w-6 h-6 text-gray-700" /> */}
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
        </div>
      </div>
      <OrderTable />
    </div>
  );
};

export default AdminOrders;