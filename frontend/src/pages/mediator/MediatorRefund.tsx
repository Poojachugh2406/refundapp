import TransactionTable from '@/components/TransactionTable';
import { Role, Process } from '@/types/transactions';
import React from 'react';


const MediatorRefunds: React.FC = () => {


  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Refunds</h1>
          {/* <p className="text-gray-600">Review and process all refund requests.</p> */}
        </div>
        
      </div>
      <TransactionTable role={Role.MEDIATOR} process={Process.REFUND}/>
    </div>
  );
};

export default MediatorRefunds;