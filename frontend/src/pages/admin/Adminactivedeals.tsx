// import React, { useState, useEffect } from 'react';
// import { FaWhatsapp } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';
// import {
//   Package,
//   ExternalLink,
//   Search,
//   AlertCircle,
// } from 'lucide-react';
// import { userAPI } from '@/utils/api';
// import Button from '@/components/UI/Button';
// import Input from '@/components/UI/Input';
// import type { ActiveProduct } from '@/types/products';

// interface ActiveDealsProps { }

// const ActiveDeals: React.FC<ActiveDealsProps> = () => {
//   const navigate = useNavigate();
//   const [products, setProducts] = useState<ActiveProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   // const [sortBy, setSortBy] = useState('name');
//   const [filters, setFilters] = useState({
//     platform: '',
//     brandName: '',
//     product: ""
//   });

//   useEffect(() => {
//     fetchActiveProducts();
//   }, []);

//   const fetchActiveProducts = async () => {
//     try {
//       setLoading(true);
//       const response: any = await userAPI.getAllActiveProducts();
//       if (response.success) {
//         setProducts(response.data || []);
//       } else {
//         throw new Error(response.message || 'Failed to fetch products');
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message || 'Failed to load active deals');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePlaceOrder = (product: ActiveProduct) => {
//     // Navigate to order form with product data
//     navigate('/order', {
//       state: {
//         productId: product._id
//       }
//     });
//   };

//   // Filter and sort products
//   const filteredProducts = products
//     .filter(product => {
//       const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         product.productCode.toLowerCase().includes(searchTerm.toLowerCase());

//       //   const matchesSearch =
//       //   item.order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       //   item.order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       //   item.order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       //   item.order.phone.toLowerCase().includes(searchTerm.toLowerCase());

//       // const matchesFilters =
//       //   (!filters.status || getRefundStatus(item) === filters.status)&&
//       //   (!filters.mediator || (item.order.mediator.nickName && item.order.mediator.nickName.toLowerCase().includes(filters.mediator.toLowerCase()))) &&
//       //   (!filters.platform || item.order.product.productPlatform?.toLowerCase().includes(filters.platform.toLowerCase())) &&
//       //   (!filters.brandName || item.order.product.brand.toLowerCase().includes(filters.brandName.toLowerCase()));


//       const matchesFilters =
//         (!filters.platform || product.productPlatform?.toLowerCase().includes(filters.platform.toLowerCase())) &&
//         (!filters.brandName || product.brand.toLowerCase().includes(filters.brandName.toLowerCase())) &&
//         (!filters.product || product.name.toLowerCase().includes(filters.product.toLowerCase()));


//       return matchesSearch && matchesFilters;
//     });
//   const platforms = [...new Set(products.map(p => p.productPlatform))];

//   const getSlotAvailabilityColor = (slots: number) => {
//     if (slots === 0) return 'text-red-600 bg-red-50 border-red-200';
//     if (slots <= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
//     return 'text-green-600 bg-green-50 border-green-200';
//   };

//   // const getSlotAvailabilityText = (slots: number) => {
//   //   if (slots === 0) return 'No slots available';
//   //   if (slots <= 5) return `${slots} slots left`;
//   //   return `${slots} slots available`;
//   // };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//             <p className="text-gray-600">Loading active deals...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
//             <div className="flex items-start">
//               <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 mr-3" />
//               <div>
//                 <h3 className="text-red-800 font-semibold text-lg mb-2">Unable to load deals</h3>
//                 <p className="text-red-600 mb-4">{error}</p>
//                 <Button
//                   onClick={fetchActiveProducts}
//                   variant="outline"
//                 >
//                   Try Again
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-3">Active Deals</h1>
//         </div>


//         {/* Filters and Search */}
//         <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-8">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">

//             {/* Search Input - Full width on mobile, spans 4 columns on desktop */}
//             <div className="lg:col-span-4">
//               <Input
//                 label="Search Products"
//                 icon={<Search className="w-4 h-4" />}
//                 placeholder="Search by name, brand, or code..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full"
//               />
//             </div>

//             {/* Filter Controls - Stack on mobile, grid on desktop */}
//             <div className="lg:col-span-8">
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

//                 {/* Platform Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Platform
//                   </label>
//                   <select
//                     value={filters.platform}
//                     onChange={(e) => {
//                       setFilters({ ...filters, platform: e.target.value })
//                     }}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   >
//                     <option value="">All Platforms</option>
//                     {platforms.map(platform => (
//                       <option key={platform} value={platform}>
//                         {platform}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Brand Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Brand
//                   </label>
//                   <select
//                     value={filters.brandName}
//                     onChange={(e) => {
//                       setFilters({ ...filters, brandName: e.target.value })
//                     }}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   >
//                     <option value="">All Brands</option>
//                     {Array.from(new Set(products.map(r => ({ brand: r.brand, brandCode: r.brandCode })).filter(Boolean)
//                     )).map(item => (
//                       <option key={item.brandCode} value={item.brand}>
//                         {item.brand} - {item.brandCode}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Product Filter */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Product
//                   </label>
//                   <select
//                     value={filters.product}
//                     onChange={(e) => {
//                       setFilters({ ...filters, product: e.target.value })
//                     }}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   >
//                     <option value="">All Products</option>
//                     {Array.from(new Set(products.map(r => ({ name: r.name, productCode: r.productCode })).filter(Boolean)
//                     )).map(item => (
//                       <option key={item.productCode} value={item.name}>
//                         {item.name} - {item.productCode}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>


//         {/* Products Grid */}
//         {filteredProducts.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
//             <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
//             <p className="text-gray-500 mb-6">
//               {searchTerm || filters.brandName !== 'all'
//                 ? 'Try adjusting your search filters'
//                 : 'No active deals available at the moment'}
//             </p>
//             {(searchTerm || filters.platform !== 'all') && (
//               <Button
//                 onClick={() => {
//                   setSearchTerm('');
//                   setFilters({ ...filters, platform: '', brandName: '' });
//                 }}
//                 variant="outline"
//               >
//                 Clear Filters
//               </Button>
//             )}
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S. No.</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Platform</th>
//                     {/* <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Code</th> */}
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slots</th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredProducts.map((product, index) => (
//                     <tr key={product._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-4 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
//                       <td className="px-4 py-4 text-sm font-medium text-gray-900">
//                         <div>
//                           {product.name}

//                         </div>
//                         <code className="text-sm font-mono text-gray-900">{product.productCode}</code>
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-600">
//                         <div >
//                           {product.brand}
//                         </div>
//                         <code className="text-sm font-mono text-gray-900">{product.brandCode}</code>

//                       </td>
//                       <td className="px-4 py-4">
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                           {product.productPlatform}
//                         </span>
//                       </td>
//                       {/* <td className="px-4 py-4">
//               <code className="text-sm font-mono text-gray-900">{product.productCode}</code>
//             </td> */}
//                       <td className="px-4 py-4">
//                         <div className="flex flex-col gap-1">
//                           {product && !!product.availableRatingSlots && product.availableRatingSlots > 0 && (
//                             <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSlotAvailabilityColor(product.availableRatingSlots)}`}>
//                               Rating : {product.availableRatingSlots}
//                             </span>
//                           )}
//                           {product && !!product.availableReviewSlots && product.availableReviewSlots > 0 && (
//                             <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSlotAvailabilityColor(product.availableReviewSlots)}`}>
//                               Review: {product.availableReviewSlots}
//                             </span>
//                           )}
//                           {product && !!product.availableOnlyOrderSlots && product.availableOnlyOrderSlots > 0 && (
//                             <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSlotAvailabilityColor(product.availableOnlyOrderSlots)}`}>
//                               Only Order: {product.availableOnlyOrderSlots}
//                             </span>
//                           )}
//                           {product && !!product.availableReviewSubmitted && product.availableReviewSubmitted > 0 && (
//                             <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSlotAvailabilityColor(product.availableReviewSubmitted)}`}>
//                               Review Submit: {product.availableReviewSubmitted}
//                             </span>
//                           )}
//                         </div>
//                       </td>

//                       <td className="px-4 py-4">
//                         <div className="flex flex-col gap-2">
//                           {/* Order Button and External Link */}
//                           <div className="flex items-center gap-2">
//                             <Button
//                               onClick={() => handlePlaceOrder(product)}
//                               disabled={
//                                 product.availableRatingSlots === 0 &&
//                                 product.availableOnlyOrderSlots === 0 &&
//                                 product.availableReviewSlots === 0 &&
//                                 product.availableReviewSubmitted === 0
//                               }
//                               className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 text-xs px-3 py-1.5 rounded-md font-medium"
//                             >
//                               Order
//                             </Button>


//                             {/* WhatsApp Button */}
//                             <div >
//                               <a
//                                 href="https://api.whatsapp.com/send?phone=+919068627365&text=Deal%20with%20Hawk Agency%20here%20-%20https://Hawk Agency.com/order/123456789"
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="inline-flex items-center justify-center p-1.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-md transition-colors duration-200 group"
//                                 title="Contact on WhatsApp"
//                               >
//                                 <FaWhatsapp className="w-4 h-4" />
//                                 {/* <span className="">Contact on WhatsApp</span> */}
//                               </a>
//                             </div>


//                             {product.productLink && (
//                               <a
//                                 href={product.productLink}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="p-1.5 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 transition-colors duration-200"
//                                 title="View Product"
//                               >
//                                 <ExternalLink className="w-3.5 h-3.5" />
//                               </a>
//                             )}



//                           </div>




//                         </div>
//                       </td>
//                     </tr>
//                   ))}


//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div >
//   );
// };

// export default ActiveDeals;




// At the top of Adminactivedeals.tsx

// Add this line with your other imports
import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
// import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import {
  Package,
  ExternalLink,
  Search,
  AlertCircle,
  Copy,  

  

} from 'lucide-react';
import { userAPI } from '@/utils/api';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import type { ActiveProduct } from '@/types/products';

interface ActiveDealsProps { }

const ActiveDeals: React.FC<ActiveDealsProps> = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ActiveProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    platform: '',
    brandName: '',
    product: ""
  });

  useEffect(() => {
    fetchActiveProducts();
  }, []);

  const fetchActiveProducts = async () => {
    try {
      setLoading(true);
      const response: any = await userAPI.getAllActiveProducts();
      if (response.success) {
        setProducts(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load active deals');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = (product: ActiveProduct) => {
    navigate('/order', {
      state: {
        productId: product._id
      }
    });
  };
// --- MODIFIED FUNCTION ---
  // This function now directly includes all slot details
  const handleCopyDeal = async (product: ActiveProduct) => {
    // 1. Build the slot availability message directly
    const slotMessage = `
*Available Slots:*
- Rating Slots: ${product.availableRatingSlots || 0}
- Review Slots: ${product.availableReviewSlots || 0}
- Only Order Slots: ${product.availableOnlyOrderSlots || 0}
- Review Submit Slots: ${product.availableReviewSubmitted || 0}
`;

    // 2. Build the final deal message
    // You can customize this text format however you like
    const dealMessage = `🔥 *Hawk Agency Deal!* 🔥
*Product:* ${product.name}
*Brand:* ${product.brand}
*Platform:* ${product.productPlatform}
*View Product:* ${product.productLink}
${slotMessage}
*Place your order here:*
https://Hawk Agencyapp.vercel.app/order
`;

   // 3. Copy to clipboard
    try {
      await navigator.clipboard.writeText(dealMessage);
      toast.success('Deal message copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy message: ', err);
      toast.error('Failed to copy message.');
    }
  };
  // --- END ---
  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters =
        (!filters.platform || product.productPlatform?.toLowerCase().includes(filters.platform.toLowerCase())) &&
        (!filters.brandName || product.brand.toLowerCase().includes(filters.brandName.toLowerCase())) &&
        (!filters.product || product.name.toLowerCase().includes(filters.product.toLowerCase()));

      return matchesSearch && matchesFilters;
    });
  
  const platforms = [...new Set(products.map(p => p.productPlatform))];

  const getSlotAvailabilityColor = (slots: number) => {
    if (slots === 0) return 'text-red-600 bg-red-50 border-red-200';
    if (slots <= 5) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading active deals...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-2xl mx-auto">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-red-800 font-semibold text-base sm:text-lg mb-2">Unable to load deals</h3>
                <p className="text-red-600 text-sm sm:text-base mb-4">{error}</p>
                <Button
                  onClick={fetchActiveProducts}
                  variant="outline"
                  className="text-xs sm:text-sm"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 ">
         
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Active Deals</h1>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
            
            {/* Search Input */}
            <div className="lg:col-span-4">
              <Input
                label="Search Products"
                icon={<Search className="w-3 h-3 sm:w-4 sm:h-4" />}
                placeholder="Search by name, brand, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm sm:text-base"
              />
            </div>

            {/* Filter Controls */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-3 xs:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                
                {/* Platform Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Platform
                  </label>
                  <select
                    value={filters.platform}
                    onChange={(e) => {
                      setFilters({ ...filters, platform: e.target.value })
                    }}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="">All Platforms</option>
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Brand
                  </label>
                  <select
                    value={filters.brandName}
                    onChange={(e) => {
                      setFilters({ ...filters, brandName: e.target.value })
                    }}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="">All Brands</option>
                    {Array.from(new Set(products.map(r => ({ brand: r.brand, brandCode: r.brandCode })).filter(Boolean)
                    )).map(item => (
                      <option key={item.brandCode} value={item.brand}>
                        {item.brand.length > 12 ? `${item.brand.substring(0, 12)}...` : item.brand} - {item.brandCode}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Filter */}
                <div className="xs:col-span-2 lg:col-span-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Product
                  </label>
                  <select
                    value={filters.product}
                    onChange={(e) => {
                      setFilters({ ...filters, product: e.target.value })
                    }}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  >
                    <option value="">All Products</option>
                    {Array.from(new Set(products.map(r => ({ name: r.name, productCode: r.productCode })).filter(Boolean)
                    )).map(item => (
                      <option key={item.productCode} value={item.name}>
                        {item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name} - {item.productCode}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border p-6 sm:p-8 lg:p-12 text-center">
            <Package className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">
              {searchTerm || filters.brandName !== 'all'
                ? 'Try adjusting your search filters'
                : 'No active deals available at the moment'}
            </p>
            {(searchTerm || filters.platform !== 'all') && (
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ ...filters, platform: '', brandName: '' });
                }}
                variant="outline"
                className="text-xs sm:text-sm"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="md:overflow-x-auto">
      {/* 2. Table: Uses md:table to revert to table display only on medium screens and up */}
      <table className="w-full md:table">
        
        {/* 3. Thead: Hidden on small screens (card view) as labels are shown in TD */}
        <thead className="hidden md:table-header-group bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S. No.</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Brand</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Platform</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admin Less</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Buyer Less</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mediator Less</th>
         
         
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Slots</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
         
          </tr>
        </thead>
        
        {/* 4. Tbody: Uses md:table-row-group to ensure proper table structure on larger screens */}
        <tbody className="divide-y divide-gray-200 md:table-row-group">
          {filteredProducts.map((product , index) => (
            // 5. TR: Block (Card) on mobile, reverts to table-row on medium screens
            <tr 
              key={product._id} 
              className="block mb-4 p-4 border border-gray-200 rounded-lg shadow-sm md:table-row md:mb-0 md:p-0 md:border-0 md:rounded-none md:shadow-none hover:bg-gray-50 transition-colors"
            >
              
              {/* S. No. - Hidden on mobile, only visible in table view */}
              <td className="hidden md:table-cell px-4 py-4 text-sm font-medium text-gray-900">{index+1}</td>
              
              {/* Product - Displays label on mobile */}
              <td className="block md:table-cell px-4 py-2 md:py-4 text-sm font-medium text-gray-900 border-b md:border-b-0">
                <span className="font-bold md:hidden text-gray-600">Product: </span>
                <div>
                  {product.name}
                </div>
                <code className="text-sm font-mono text-gray-500 block">Code: {product.productCode}</code>
              </td>
              
              {/* Brand - Displays label on mobile */}
              <td className="block md:table-cell px-4 py-2 md:py-4 text-sm text-gray-600 border-b md:border-b-0">
                <span className="font-bold md:hidden text-gray-600">Brand: </span>
                <div >
                  {product.brand}
                </div>
                <code className="text-sm font-mono text-gray-500 block">Code: {product.brandCode}</code>
              </td>
              
              {/* Platform - Displays label on mobile */}
              <td className="block md:table-cell px-4 py-2 md:py-4 border-b md:border-b-0">
                <span className="font-bold md:hidden text-gray-600">Platform: </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {product.productPlatform}
                </span>
              </td>
              {/* --- NEW COLUMN DATA START --- */}
                      <td className="block md:table-cell px-4 py-2 md:py-4 text-sm text-gray-700 border-b md:border-b-0">
                        <span className="font-bold md:hidden text-gray-600">Admin Less: </span>
                        {/* Use `|| 0` to show 0 instead of nothing if the value is null/undefined */}
                        {product.adminLess || 0}
                      </td>
                      
                      <td className="block md:table-cell px-4 py-2 md:py-4 text-sm text-gray-700 border-b md:border-b-0">
                        <span className="font-bold md:hidden text-gray-600">Buyer Less: </span>
                        {product.buyerLess || 0}
                      </td>

                      <td className="block md:table-cell px-4 py-2 md:py-4 text-sm text-gray-700 border-b md:border-b-0">
                        <span className="font-bold md:hidden text-gray-600">Mediator Less: </span>
                        {product.medLess || 0}
                        
                      </td> 
              
              {/* Slots - Displays label on mobile */}
              <td className="block md:table-cell px-4 py-2 md:py-4 border-b md:border-b-0">
                <span className="font-bold md:hidden text-gray-600">Slots: </span>
                <div className="flex flex-col gap-1 md:flex-row md:flex-wrap">
                  {product && !!product.availableRatingSlots &&  product.availableRatingSlots > 0 && (
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSlotAvailabilityColor(product.availableRatingSlots)}`}>
                      Rating : {product.availableRatingSlots}
                    </span>
                  )}
                  {product && !!product.availableReviewSlots && product.availableReviewSlots > 0 && (
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSlotAvailabilityColor(product.availableReviewSlots)}`}>
                      Review: {product.availableReviewSlots}
                    </span>
                  )}
                  {product && !!product.availableOnlyOrderSlots &&  product.availableOnlyOrderSlots > 0 && (
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSlotAvailabilityColor(product.availableOnlyOrderSlots)}`}>
                      Only Order: {product.availableOnlyOrderSlots}
                    </span>
                  )}
                  {product && !!product.availableReviewSubmitted &&  product.availableReviewSubmitted > 0 && (
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSlotAvailabilityColor(product.availableReviewSubmitted)}`}>
                      Review Submit: {product.availableReviewSubmitted}
                    </span>
                  )}
                </div>
              </td>
              
              {/* Actions - Displays label on mobile */}
              <td className="block md:table-cell px-4 py-4">
                <span className="font-bold md:hidden text-gray-600">Actions: </span>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handlePlaceOrder(product)}
                    disabled={
                      product.availableRatingSlots === 0 && 
                      product.availableOnlyOrderSlots === 0 && 
                      product.availableReviewSlots === 0 &&
                      product.availableReviewSubmitted === 0
                    }
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs px-3 py-1.5 rounded"
                  >
                    Order
                  </Button>
                  {product.productLink && (
                    <a
                      href={product.productLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 border border-gray-300 rounded text-gray-700 hover:bg-white hover:border-gray-400 transition-colors"
                      title="View Product"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
{/* --- COPY BUTTON --- */}
                          <button
                            onClick={() => handleCopyDeal(product)}
                            className="p-1.5 border border-gray-300 rounded text-gray-700 hover:bg-white hover:border-gray-400 transition-colors"
                            title="Copy Deal Message"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          {/* --- END --- */}

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveDeals;