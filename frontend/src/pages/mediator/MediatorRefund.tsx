// src/pages/admin/AdminRefunds.tsx

// import type { RefundsResponse } from '@/types/products';
import MediatorRefundTable from '@/components/mediator/MediatorRefundTable';
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
      <MediatorRefundTable/>
    </div>
  );
};

export default MediatorRefunds;