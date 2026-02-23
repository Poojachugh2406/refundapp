import TransactionTable from '@/components/TransactionTable';
import { Process, Role } from '@/types/transactions';
import React from 'react';


const AdminRefunds: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Refunds</h1>
          {/* <p className="text-gray-600">Review and process all refund requests.</p> */}
        </div>
        
      </div>
      <TransactionTable role={Role.ADMIN} process={Process.REFUND}/>
    </div>
  );
};

export default AdminRefunds;