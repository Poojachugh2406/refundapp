import React from 'react';
// import { Package } from 'lucide-react';
import bblogo from '../../assets/bblogog.png'
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            {/* <Package className="h-6 w-6 text-blue-600" /> */}
            <img width="70" src = {bblogo} alt = "Logo"/>
            <span className="text-lg font-semibold text-gray-900">Relamp Digital</span>
          </div>
          
          <div className="text-sm text-gray-600 text-center md:text-right">
            <p>&copy; 2025 Relamp Digital. All rights reserved.</p>
            <p className="mt-1">Streamlining your refund process</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;