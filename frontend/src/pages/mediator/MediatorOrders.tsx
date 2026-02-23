import TransactionTable from '@/components/TransactionTable';
import React from 'react';
import { Process, Role } from '@/types/transactions';

const MediatorOrders: React.FC = () => {

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
          {/* <p className="text-gray-600">Review and process all customer orders.</p> */}
        </div>
      </div>
      <TransactionTable role={Role.MEDIATOR} process={Process.ORDER}/>
    </div>
  );
};

export default MediatorOrders;