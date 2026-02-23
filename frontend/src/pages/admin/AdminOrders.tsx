// src/pages/admin/OrdersPage.tsx
import TransactionTable from '@/components/TransactionTable';
import { Process, Role } from '@/types/transactions';
import React from 'react';


const AdminOrders: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
        </div>
      </div>
      <TransactionTable role={Role.ADMIN} process={Process.ORDER}/>
    </div>
  );
};

export default AdminOrders;