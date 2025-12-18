// import { Edit, Image, Package, X, ZoomIn, XCircle, Box, FileCheck, ClipboardListIcon } from "lucide-react";
// import {useState } from "react";
// import { toast } from "react-hot-toast";
// import EditOrderModal from "./EditOrderModal";
// // import { apiUpdate } from "../../utils/api";
// import Button from "../UI/Button";
// import { format } from "date-fns";
// import type { OrderWithDetails, UpdateOrderData } from "@/types/orders";
// import { apiGet, ordersAPI } from "@/utils/api";
// import { useQuery } from "@tanstack/react-query";

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case 'pending': return 'bg-yellow-100 text-yellow-800';
//     case 'accepted': return 'bg-blue-100 text-blue-800';
//     case 'refund_placed': return 'bg-green-100 text-green-800';
//     case 'rejected': return 'bg-red-100 text-red-800';
//     case 'payment_done': return 'bg-green-100 text-green-800';
//     default: return 'bg-gray-100 text-gray-800';
//   }
// };

// const OrderModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   // data: OrderWithDetails | null;
//   orderId: string;
//   onUpdate: (updatedOrder: OrderWithDetails) => void; // 3. Add callback to update parent state
// }> = ({ isOpen, onClose, orderId, onUpdate }) => {
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 4. State for edit modal
//   const [isUpdating, setIsUpdating] = useState(false);
//   // const [data, setData] = useState<OrderWithDetails | null>(null);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [rejectionMessage, setRejectionMessage] = useState('');


//   const { data, isLoading } = useQuery({
//     queryKey: ['order', orderId],
//     queryFn: async () => {
//       const response: any = await apiGet(`/order/${orderId}`);
//       if (!response.success) {
//         throw new Error(response.message || 'Failed to fetch order details');
//       }
//       return response.data;
//     }
//   });



//   // if (!isOpen || !data) return null;

//   const openImage = (imageUrl: string) => setSelectedImage(imageUrl);
//   const closeImage = () => setSelectedImage(null);
//   const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) closeImage();
//   };

//   const handleReject = async () => {

//     setIsUpdating(true);
//     try {
//       const response: any = await ordersAPI.updateOrderStatus(data._id, {
//         orderStatus: 'rejected',
//         rejectionMessage: rejectionMessage || undefined // Only send if provided
//       });

//       if (response.success) {
//         toast.success("Order has been rejected.");
//         onUpdate(response.data);
//         onClose();
//         setShowRejectModal(false);
//         setRejectionMessage(''); // Reset message
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to reject order.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleRefill = async () => {
//     if (!window.confirm("Are you sure you want this order to be marked for refill?")) return;

//     setIsUpdating(true);
//     try {
//       // The body of the request includes the order number and the new status
//       const response: any = await ordersAPI.updateOrderStatus(data._id, { orderStatus: 'refill' });

//       if (response.success) {
//         toast.success("Order has been marked for refill.");
//         onUpdate(response.data); // Update the parent component's state
//         onClose(); // Close the main modal
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to change order status to refill.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleAccepted = async () => {
//     if (!window.confirm("Are you sure you want to Accept this order?")) return;

//     setIsUpdating(true);
//     try {
//       // The body of the request includes the order number and the new status
//       const response: any = await ordersAPI.updateOrderStatus(data._id, { orderStatus: 'accepted' });

//       if (response.success) {
//         toast.success("Order has been Accepted.");
//         onUpdate(response.data); // Update the parent component's state
//         onClose(); // Close the main modal
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to Accept order.");
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleUpdate = async (updatedData: Partial<UpdateOrderData>, orderId: string, files?: { orderSS?: File, priceBreakupSS?: File }) => {
//     // This function is passed to the EditOrderModal
//     setIsUpdating(true);
//     try {
//       const response: any = await ordersAPI.updateOrder(orderId, updatedData, files);
//       if (response.success) {
//         onUpdate(response.data);
//         // setIsEditModalOpen(false); // Close edit modal on success
//       } else {
//         throw new Error(response.message);
//       }
//     } finally {
//       setIsUpdating(false); // This re-enables the save Button in case of error
//       setIsEditModalOpen(false);
//     }
//   };

//   if(isLoading){
//     return <div>Loading tanstack query...</div>;
//   }

//   const screenshots = [
//     { url: data.orderSS, label: 'Order Screenshot' },
//     { url: data.priceBreakupSS, label: 'Price Breakup' }
//   ].filter(screenshot => screenshot.url);

  


//   return (
//     <>
//       {/* Main Modal */}
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">



//           {/* Modal Header */}
//           <div className="flex items-center justify-between p-6 border-b border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-900">
//               Refund Details
//             </h2>
//             <div className="flex items-center gap-2">
//               {data.orderStatus === 'rejected' && (
//                 <span className="text-red-600 font-bold">[REJECTED]</span>
//               )}
//               {data.orderStatus === 'payment_done' && (
//                 <span className="text-green-600 font-bold">[PAID]</span>
//               ) || data.orderStatus === "accepted" && (
//                 <span className="text-blue-600 font-bold">[Accepted]</span>
//               )}
//               {data.orderStatus === 'pending' &&
//                 <span className="text-yellow-600 font-bold">[PENDING]</span>
//               }
//               <Button
//                 onClick={onClose}
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors hover:cursor-pointer"
//               >
//                 <X className="w-6 h-6" />
//               </Button>
//             </div>
//           </div>

//           {/* Modal Content */}
//           <div className="p-6">
//             {/* Show reject message if available */}
//             {data.orderStatus === 'rejected' && data.rejectionMessage && (
//               <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//                 <h3 className="text-lg font-semibold text-red-800 mb-2">Rejection Reason</h3>
//                 <p className="text-red-700">{data.rejectionMessage}</p>
//               </div>
//             )}
//           </div>

//           {/* Modal Content */}
//           <div className="p-6">
//             {/* ... (rest of your modal content is unchanged) ... */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//               <div className="bg-blue-50 p-4 rounded-xl">
//                 <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
//                   <Package className="w-5 h-5 mr-2" />
//                   Order Information
//                 </h3>
//                 <div className="space-y-2 text-sm">

//                   <p><span className="font-medium">Order Number:</span> {data.orderNumber}</p>
//                   <p><span className="font-medium">Reviewer Name:</span> {data.name}</p>
//                   <p><span className="font-medium">Reviewer Email:</span> {data.email}</p>
//                   <p><span className="font-medium">Reviewer Contact:</span> {data.phone}</p>

//                   <p><span className="font-medium">Mediator Name:</span> {data.mediator?.nickName ?? data.mediator?.name ?? "N/A"}</p>
//                   <p><span className="font-medium">Mediator phone:</span> {data.mediator?.phone ?? "N/A"}</p>
//                   <p><span className="font-medium">Replacement :</span> {data.isReplacement ? "Yes" : "No"}</p>
//                   <p><span className="font-medium">Rating / Review:</span> {data.ratingOrReview}</p>
//                   <p><span className="font-medium">Deal Type:</span> {data.dealType}</p>
//                   {data.dealType === "exchange" &&
//                     <p><span className="font-medium">Exchange Product:</span> {data.exchangeProduct}</p>
//                   }


//                   <p><span className="font-medium">Order Placed on:</span> {format(new Date(data.orderDate), 'dd MMMM, yyyy')}</p>
//                   <p><span className="font-medium">Order Form Placed on:</span> {format(new Date(data.createdAt), 'dd MMMM, yyyy')}</p>
//                   <p><span className="font-medium">Status:</span>
//                     <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.orderStatus)}`}>
//                       {data?.orderStatus.replace('_', ' ')}
//                     </span>
//                   </p>


//                   {data.orderStatus === 'rejected' &&
//                     <p><span className="font-medium">Rejection Message:</span> {data.rejectionMessage ?? "N/A"}</p>
//                   }
//                   {/* ... other fields ... */}
//                 </div>
//               </div>

//               <div className="bg-green-50 p-4 rounded-xl">
//                 <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
//                   <Box className="w-5 h-5 mr-2" />
//                   Product Information
//                 </h3>
//                 <div className="space-y-2 text-sm">
//                   <p><span className="font-medium">Product Name:</span> {data.product?.name ?? "N/A"}</p>
//                   <p><span className="font-medium">Product Code:</span> {data.product?.productCode ?? "N/A"}</p>
//                   <p><span className="font-medium">Brand Name:</span> {data.product?.brand ?? "N/A"}</p>
//                   <p><span className="font-medium">ASIN Code:</span> {data.product?.brandCode ?? "N/A"}</p>
//                   <p><span className="font-medium">Product Platform:</span> {data.product?.productPlatform ?? "N/A"}</p>
//                   <p><span className="font-medium ">Product Link:</span> <a target="_blank" className="text-blue-600" href={data.product?.productLink ?? "N/A"}>{data.product?.productLink ?? "N/A"}</a></p>
//                   <p><span className="font-medium">Order Amount:</span> {data.orderAmount}</p>
//                   <p><span className="font-medium">Less Price:</span> {data.lessPrice}</p>
//                   <p><span className="font-medium">Refund Amount:</span> {data.orderAmount - data.lessPrice}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Screenshots Section */}
//             <div className="mt-8">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                 <Image className="w-5 h-5 mr-2" />
//                 Screenshots
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {screenshots.map((screenshot, index) => (
//                   <div key={index} className="relative group" onClick={() => openImage(screenshot.url as string)}>
//                     <p className="text-sm font-medium text-gray-700 mb-2">{screenshot.label}</p>
//                     <div className="relative cursor-pointer">
//                       <img
//                         src={screenshot.url}
//                         alt={screenshot.label}
//                         className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
//                       />
//                       <div className="absolute inset-0 bg-black/0  group-hover:bg-black/40 transition-opacity rounded-lg flex items-center justify-center">
//                         <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Modal Footer with new Buttons */}
//           <div className="flex flex-col md:flex-row justify-end items-center p-6 border-t border-gray-200">

//             <div className="flex space-x-4">
//               <Button variant="outline" onClick={onClose} className="w-auto">Close</Button>
//               {data.orderStatus !== 'accepted' && <Button onClick={handleAccepted} isLoading={isUpdating}
//                 className="flex items-center gap-2"
//               >
//                 <FileCheck className="w-4 h-4 mr-2" />
//                 Accept
//               </Button>}
//               {data.orderStatus !== 'rejected' && <Button
//                 variant="danger"
//                 onClick={() => setShowRejectModal(true)}
//                 isLoading={isUpdating}
//                 className="flex items-center gap-2"
//               >
//                 <XCircle className="w-4 h-4 mr-2" />
//                 Reject
//               </Button>}
//               <Button onClick={handleRefill} isLoading={isUpdating}
//                 className="flex bg-yellow-600 hover:bg-yellow-700 items-center gap-2"
//               >
//                 <ClipboardListIcon className="w-4 h-4 mr-2" />
//                 Refill
//               </Button>

//               <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>
//                 <Edit className="w-4 h-4 mr-2" />
//                 Edit
//               </Button>
//             </div>
//           </div>
//         </div>



//       </div>

//       {/* Image Lightbox Modal */}
//       {selectedImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100] p-4"
//           onClick={handleBackdropClick}
//         >
//           <div className="relative max-w-6xl max-h-full">
//             <Button
//               onClick={closeImage}
//               className="absolute -top-12 -right-4 bg-white mt-10 rounded-full p-2 z-10 hover:bg-gray-200 transition-colors hover:cursor-pointer"
//             >
//               <X className="w-6 h-6 text-gray-800" />
//             </Button>
//             <img
//               src={selectedImage}
//               alt="Enlarged view"
//               className="max-w-full max-h-[90vh] object-contain rounded-lg"
//             />
//             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
//               <Button
//                 onClick={() => window.open(selectedImage, '_blank')}
//                 className="text-sm hover:underline"
//               >
//                 Open image in new tab
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Render the Edit Modal when needed */}
//       {isEditModalOpen && (
//         <EditOrderModal
//           onClose={() => setIsEditModalOpen(false)}
//           data={data}
//           onSave={handleUpdate}
//         />
//       )}


//       {/* Rejection Reason Modal */}
//       {showRejectModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
//           <div className="bg-white rounded-2xl max-w-md w-full">
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h3 className="text-xl font-bold text-gray-900">Reject Order</h3>
//               <Button
//                 onClick={() => {
//                   setShowRejectModal(false);
//                   setRejectionMessage('');
//                 }}
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               >
//                 <X className="w-6 h-6" />
//               </Button>
//             </div>

//             <div className="p-6">
//               <p className="text-gray-600 mb-4">
//                 Are you sure you want to reject order <strong>#{data.orderNumber}</strong>?
//               </p>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Rejection Message (Optional)
//                 </label>
//                 <textarea
//                   value={rejectionMessage}
//                   onChange={(e) => setRejectionMessage(e.target.value)}
//                   placeholder="Provide a reason for rejection (this will be visible to the customer)..."
//                   className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
//                   maxLength={500}
//                 />
//                 <p className="text-xs text-gray-500 mt-1">
//                   {rejectionMessage.length}/500 characters
//                 </p>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-3 justify-end">
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setShowRejectModal(false);
//                     setRejectionMessage('');
//                   }}
//                   className="w-full sm:w-auto"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={handleReject}
//                   isLoading={isUpdating}
//                   className="w-full sm:w-auto" 
//                 >
//                   Confirm Reject
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default OrderModal;



import { Edit, Image, Package, X, ZoomIn, XCircle, Box, FileCheck, ClipboardListIcon, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import EditOrderModal from "./EditOrderModal"; // Make sure path is correct
import Button from "../UI/Button";
import { format } from "date-fns";
import type { OrderWithDetails, UpdateOrderData } from "@/types/orders";
import { apiGet, ordersAPI } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'accepted': return 'bg-blue-100 text-blue-800';
        case 'refund_placed': return 'bg-green-100 text-green-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        case 'payment_done': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    // onUpdate: (updatedOrder: OrderWithDetails) => void; // No longer needed!
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, orderId }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showRefillModal, setShowRefillModal] = useState(false);
    const [rejectionMessage, setRejectionMessage] = useState('');
    const [refillMessage, setRefillMessage] = useState('');
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['order', orderId],
        queryFn: async () => {
            const response: any = await apiGet(`/order/${orderId}`);
            if (!response.success) {
                throw new Error(response.message || 'Failed to fetch order details');
            }
            return response.data as OrderWithDetails;
        },
        enabled: isOpen, // Only fetch when the modal is open
    });

    // --- Mutations ---

    const rejectOrderMutation = useMutation({
        mutationFn: (message: string | undefined) =>
            ordersAPI.updateOrderStatus(orderId, {
                orderStatus: 'rejected',
                rejectionMessage: message || undefined
            }),
        onSuccess: () => {
            toast.success("Order has been rejected.");
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
            setShowRejectModal(false);
            setRejectionMessage('');
            onClose(); // Close main modal
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to reject order.");
        }
    });

    const refillOrderMutation = useMutation({
        mutationFn: (message: string | undefined) => ordersAPI.updateOrderStatus(orderId, { orderStatus: 'refill', refillMessage: message || undefined }),
        onSuccess: () => {
            toast.success("Order has been marked for refill.");
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to change order status to refill.");
        }
    });

    const acceptOrderMutation = useMutation({
        mutationFn: () => ordersAPI.updateOrderStatus(orderId, { orderStatus: 'accepted' }),
        onSuccess: () => {
            toast.success("Order has been Accepted.");
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to Accept order.");
        }
    });

    const editOrderMutation = useMutation({
        mutationFn: ({ updatedData, orderId, files }: {
            updatedData: Partial<UpdateOrderData>,
            orderId: string,
            files?: { orderSS?: File, priceBreakupSS?: File }
        }) => ordersAPI.updateOrder(orderId, updatedData, files),
        onSuccess: (response: any) => {
            toast.success('Order updated successfully!');
            // Invalidate list
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            // Manually set the detail query data to avoid a refetch
            queryClient.setQueryData(['order', orderId], response.data);
            setIsEditModalOpen(false); // Close edit modal
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update order");
        }
    });

    // --- Handlers ---

    const handleReject = () => {
        rejectOrderMutation.mutate(rejectionMessage);
    };

    const handleRefill = () => {
        // if (!window.confirm("Are you sure you want this order to be marked for refill?")) return;
        refillOrderMutation.mutate(refillMessage);
    };

    const handleAccepted = () => {
        if (!window.confirm("Are you sure you want to Accept this order?")) return;
        acceptOrderMutation.mutate();
    };

    const handleUpdate = (updatedData: Partial<UpdateOrderData>, orderId: string, files?: { orderSS?: File, priceBreakupSS?: File }) => {
        editOrderMutation.mutate({ updatedData, orderId, files });
    };

    // --- Image Modal Handlers ---
    const openImage = (imageUrl: string) => setSelectedImage(imageUrl);
    const closeImage = () => setSelectedImage(null);
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) closeImage();
    };

    // --- Render Logic ---

    if (!isOpen) return null;

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-4xl w-full h-96 flex items-center justify-center">
                    <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-4xl w-full p-6 text-center">
                    <h3 className="text-xl font-bold text-red-600 mb-4">Error</h3>
                    <p className="text-gray-700 mb-6">Could not load order details.</p>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </div>
            </div>
        );
    }

    const screenshots = [
        { url: data.orderSS, label: 'Order Screenshot' },
        { url: data.priceBreakupSS, label: 'Price Breakup' }
    ].filter(screenshot => screenshot.url);


    return (
        // <>
        //     {/* Main Modal */}
        //     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        //         <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

        //             {/* Modal Header */}
        //             <div className="flex items-center justify-between p-6 border-b border-gray-200">
        //                 <h2 className="text-2xl font-bold text-gray-900">
        //                     Refund Details
        //                 </h2>
        //                 <div className="flex items-center gap-2">
        //                     {data.orderStatus === 'rejected' && (
        //                         <span className="text-red-600 font-bold">[REJECTED]</span>
        //                     )}
        //                     {data.orderStatus === 'payment_done' && (
        //                         <span className="text-green-600 font-bold">[PAID]</span>
        //                     ) || data.orderStatus === "accepted" && (
        //                         <span className="text-blue-600 font-bold">[Accepted]</span>
        //                     )}
        //                     {data.orderStatus === 'pending' &&
        //                         <span className="text-yellow-600 font-bold">[PENDING]</span>
        //                     }
        //                     {data.orderStatus === 'refill' &&
        //                         <span className="text-yellow-600 font-bold">[REFILL]</span>
        //                     }
        //                     <Button
        //                         onClick={onClose}
        //                         className="p-2 hover:bg-gray-100 rounded-full transition-colors hover:cursor-pointer"
        //                     >
        //                         <X className="w-6 h-6" />
        //                     </Button>
        //                 </div>
        //             </div>

        //             {/* Modal Content */}
        //             {data.orderStatus === 'rejected' && data.rejectionMessage && (
        //                 <div className="px-6">
        //                     {/* Show reject message if available */}
        //                     <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        //                         <h3 className="text-lg font-semibold text-red-800 mb-2">Rejection Reason</h3>
        //                         <p className="text-red-700">{data.rejectionMessage}</p>
        //                     </div>
        //                 </div>
        //             )}
        //             {data.orderStatus === 'refill' && data.refillMessage && (
        //                 <div className="px-6 mt-2">
        //                     {/* Show reject message if available */}
        //                     <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        //                         <h3 className="text-lg font-semibold text-yellow-800 mb-2">Refill Message</h3>
        //                         <p className="text-yellow-700">{data.refillMessage}</p>
        //                     </div>
        //                 </div>
        //             )}
        //             {/* Modal Content */}
        //             <div className="px-6 ">
        //                 {/* ... (rest of your modal content is unchanged) ... */}
        //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        //                     <div className="bg-blue-50 p-4 rounded-xl">
        //                         <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
        //                             <Package className="w-5 h-5 mr-2" />
        //                             Order Information
        //                         </h3>
        //                         <div className="space-y-2 text-sm">

        //                             <p><span className="font-medium">Order Number:</span> {data.orderNumber}</p>
        //                             <p><span className="font-medium">Reviewer Name:</span> {data.name}</p>
        //                             <p><span className="font-medium">Reviewer Email:</span> {data.email}</p>
        //                             <p><span className="font-medium">Reviewer Contact:</span> {data.phone}</p>

        //                             <p><span className="font-medium">Mediator Name:</span> {data.mediator?.nickName ?? data.mediator?.name ?? "N/A"}</p>
        //                             <p><span className="font-medium">Mediator phone:</span> {data.mediator?.phone ?? "N/A"}</p>
        //                             <p><span className="font-medium">Replacement :</span> {data.isReplacement ? "Yes" : "No"}</p>
        //                             <p><span className="font-medium">Rating / Review:</span> {data.ratingOrReview}</p>
        //                             <p><span className="font-medium">Deal Type:</span> {data.dealType}</p>
        //                             {data.dealType === "exchange" &&
        //                                 <p><span className="font-medium">Exchange Product:</span> {data.exchangeProduct}</p>
        //                             }
        //                             <p><span className="font-medium">Order Placed on:</span> {format(new Date(data.orderDate), 'dd MMMM, yyyy')}</p>
        //                             <p><span className="font-medium">Order Form Placed on:</span> {format(new Date(data.createdAt), 'dd MMMM, yyyy')}</p>
        //                             <p><span className="font-medium">Status:</span>
        //                                 <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.orderStatus)}`}>
        //                                     {data?.orderStatus.replace('_', ' ')}
        //                                 </span>
        //                             </p>


        //                             {data.orderStatus === 'rejected' &&
        //                                 <p><span className="font-medium">Rejection Message:</span> {data.rejectionMessage ?? "N/A"}</p>
        //                             }
        //                             {/* ... other fields ... */}
        //                         </div>
        //                     </div>

        //                     <div className="bg-green-50 p-4 rounded-xl">
        //                         <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
        //                             <Box className="w-5 h-5 mr-2" />
        //                             Product Information
        //                         </h3>
        //                         <div className="space-y-2 text-sm">
        //                             <p><span className="font-medium">Product Name:</span> {data.product?.name ?? "N/A"}</p>
        //                             <p><span className="font-medium">Product Code:</span> {data.product?.productCode ?? "N/A"}</p>
        //                             <p><span className="font-medium">Brand Name:</span> {data.product?.brand ?? "N/A"}</p>
        //                             <p><span className="font-medium">ASIN Code:</span> {data.product?.brandCode ?? "N/A"}</p>
        //                             <p><span className="font-medium">Product Platform:</span> {data.product?.productPlatform ?? "N/A"}</p>
        //                             <p><span className="font-medium ">Product Link:</span> <a target="_blank" className="text-blue-600" href={data.product?.productLink ?? "N/A"}>{data.product?.productLink ?? "N/A"}</a></p>
        //                             <p><span className="font-medium">Order Amount:</span> {data.orderAmount}</p>
        //                             <p><span className="font-medium">Less Price:</span> {data.lessPrice}</p>
        //                             <p><span className="font-medium">Refund Amount:</span> {data.orderAmount - data.lessPrice}</p>
        //                         </div>
        //                     </div>
        //                 </div>

        //                 {/* Screenshots Section */}
        //                 <div className="mt-8">
        //                     <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        //                         <Image className="w-5 h-5 mr-2" />
        //                         Screenshots
        //                     </h3>
        //                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        //                         {screenshots.map((screenshot, index) => (
        //                             <div key={index} className="relative group" onClick={() => openImage(screenshot.url as string)}>
        //                                 <p className="text-sm font-medium text-gray-700 mb-2">{screenshot.label}</p>
        //                                 <div className="relative cursor-pointer">
        //                                     <img
        //                                         src={screenshot.url}
        //                                         alt={screenshot.label}
        //                                         className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
        //                                     />
        //                                     <div className="absolute inset-0 bg-black/0  group-hover:bg-black/40 transition-opacity rounded-lg flex items-center justify-center">
        //                                         <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         ))}
        //                     </div>
        //                 </div>
        //             </div>

        //             {/* Modal Footer with new Buttons */}
        //             {/* <div className="flex flex-col md:flex-row justify-end items-center p-6 border-t border-gray-200">

        //                 <div className="flex space-x-4">
        //                     <Button variant="outline" onClick={onClose} className="w-auto">Close</Button>
        //                     {data.orderStatus !== 'accepted' && <Button onClick={handleAccepted} isLoading={acceptOrderMutation.isPending}
        //                         className="flex items-center gap-2"
        //                     >
        //                         <FileCheck className="w-4 h-4 mr-2" />
        //                         Accept
        //                     </Button>}
        //                     { data.orderStatus !== 'rejected' && <Button
        //                         variant="danger"
        //                         onClick={() => setShowRejectModal(true)}
        //                         isLoading={rejectOrderMutation.isPending}
        //                         className="flex items-center gap-2"
        //                     >
        //                         <XCircle className="w-4 h-4 mr-2" />
        //                         Reject
        //                     </Button>
        //                     }
        //                     { data.orderStatus !== 'refill' && <Button
                          
        //                         onClick={() => setShowRefillModal(true)}
        //                         isLoading={refillOrderMutation.isPending}
        //                          className="flex bg-yellow-600 hover:bg-yellow-700 items-center gap-2"
        //                     >
        //                         <ClipboardListIcon className="w-4 h-4 mr-2" />
        //                         Refill
        //                     </Button>
        //                     }

                          

        //                     <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>
        //                         <Edit className="w-4 h-4 mr-2" />
        //                         Edit
        //                     </Button>
        //                 </div>
        //             </div> */}

        //             <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 p-4 sm:p-6 border-t border-gray-200">

        //                 {/* Mobile: Grid layout, Desktop: Flex layout */}
        //                 <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">

        //                     {/* Close Button */}
        //                     <Button
        //                         variant="outline"
        //                         onClick={onClose}
        //                         className="col-span-2 sm:col-auto justify-center order-last sm:order-none mt-2 sm:mt-0"
        //                     >
        //                         Close
        //                     </Button>

        //                     {/* Accept Button */}
        //                     {data.orderStatus !== 'accepted' && (
        //                         <Button
        //                             onClick={handleAccepted}
        //                             isLoading={acceptOrderMutation.isPending}
        //                             className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
        //                         >
        //                             <FileCheck className="w-3 h-3 sm:w-4 sm:h-4" />
        //                             <span>Accept</span>
        //                         </Button>
        //                     )}

        //                     {/* Reject Button */}
        //                     {data.orderStatus !== 'rejected' && (
        //                         <Button
        //                             variant="danger"
        //                             onClick={() => setShowRejectModal(true)}
        //                             isLoading={rejectOrderMutation.isPending}
        //                             className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
        //                         >
        //                             <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
        //                             <span>Reject</span>
        //                         </Button>
        //                     )}

        //                     {/* Refill Button */}
        //                     {data.orderStatus !== 'refill' && (
        //                         <Button
        //                             onClick={() => setShowRefillModal(true)}
        //                             isLoading={refillOrderMutation.isPending}
        //                             className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm bg-yellow-600 hover:bg-yellow-700"
        //                         >
        //                             <ClipboardListIcon className="w-3 h-3 sm:w-4 sm:h-4" />
        //                             <span>Refill</span>
        //                         </Button>
        //                     )}

        //                     {/* Edit Button */}
        //                     <Button
        //                         variant="secondary"
        //                         onClick={() => setIsEditModalOpen(true)}
        //                         className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
        //                     >
        //                         <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
        //                         <span>Edit</span>
        //                     </Button>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>

        //     {/* Image Lightbox Modal */}
        //     {selectedImage && (
        //         <div
        //             className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4"
        //             onClick={handleBackdropClick}
        //         >
        //             <div className="relative max-w-6xl max-h-full">
        //                 <Button
        //                     onClick={closeImage}
        //                     className="absolute -top-12 -right-4 bg-white mt-10 rounded-full p-2 z-10 hover:bg-gray-200 transition-colors hover:cursor-pointer"
        //                 >
        //                     <X className="w-6 h-6 text-gray-800" />
        //                 </Button>
        //                 <img
        //                     src={selectedImage}
        //                     alt="Enlarged view"
        //                     className="max-w-full max-h-[90vh] object-contain rounded-lg"
        //                 />
        //                 <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg">
        //                     <Button
        //                         onClick={() => window.open(selectedImage, '_blank')}
        //                         className="text-sm hover:underline"
        //                     >
        //                         Open image in new tab
        //                     </Button>
        //                 </div>
        //             </div>
        //         </div>
        //     )}

        //     {/* Render the Edit Modal when needed */}
        //     {isEditModalOpen && (
        //         <EditOrderModal
        //             onClose={() => setIsEditModalOpen(false)}
        //             data={data}
        //             onSave={handleUpdate}
        //             isSubmitting={editOrderMutation.isPending} // Pass the mutation's pending state
        //         />
        //     )}


        //     {/* Rejection Reason Modal */}
        //     {showRefillModal && (
        //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
        //             <div className="bg-white rounded-2xl max-w-md w-full">
        //                 <div className="flex items-center justify-between p-6 border-b border-gray-200">
        //                     <h3 className="text-xl font-bold text-gray-900">Refill Required </h3>
        //                     <Button
        //                         onClick={() => {
        //                             setShowRefillModal(false);
        //                             setRefillMessage('');
        //                             // setRejectionMessage('');
        //                         }}
        //                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        //                     >
        //                         <ClipboardListIcon className="w-6 h-6" />
        //                     </Button>
        //                 </div>

        //                 <div className="p-6">


        //                     <div className="mb-4">
        //                         <label className="block text-sm font-medium text-gray-700 mb-2">
        //                             Refill Message (Optional)
        //                         </label>
        //                         <textarea
        //                             value={refillMessage}
        //                             onChange={(e) => setRefillMessage(e.target.value)}
        //                             placeholder="Provide a reason for refill (this will be visible to the customer)..."
        //                             className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        //                             maxLength={500}
        //                         />
        //                         <p className="text-xs text-gray-500 mt-1">
        //                             {refillMessage.length}/500 characters
        //                         </p>
        //                     </div>

        //                     <div className="flex flex-col sm:flex-row gap-3 justify-end">
        //                         <Button
        //                             variant="outline"
        //                             onClick={() => {
        //                                 setShowRejectModal(false);
        //                                 setRejectionMessage('');
        //                             }}
        //                             className="w-full sm:w-auto"
        //                         >
        //                             Cancel
        //                         </Button>
        //                         <Button
        //                             // variant="danger"
        //                             onClick={handleRefill}
        //                             isLoading={refillOrderMutation.isPending} // Use mutation's pending state
        //                             className="w-full sm:w-auto"
        //                         >
        //                             Confirm Refill
        //                         </Button>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     )}
        //     {showRejectModal && (
        //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
        //             <div className="bg-white rounded-2xl max-w-md w-full">
        //                 <div className="flex items-center justify-between p-6 border-b border-gray-200">
        //                     <h3 className="text-xl font-bold text-gray-900">Reject Order</h3>
        //                     <Button
        //                         onClick={() => {
        //                             setShowRejectModal(false);
        //                             setRejectionMessage('');
        //                         }}
        //                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        //                     >
        //                         <X className="w-6 h-6" />
        //                     </Button>
        //                 </div>

        //                 <div className="p-6">
        //                     <p className="text-gray-600 mb-4">
        //                         Are you sure you want to reject order <strong>#{data.orderNumber}</strong>?
        //                     </p>

        //                     <div className="mb-4">
        //                         <label className="block text-sm font-medium text-gray-700 mb-2">
        //                             Rejection Message (Optional)
        //                         </label>
        //                         <textarea
        //                             value={rejectionMessage}
        //                             onChange={(e) => setRejectionMessage(e.target.value)}
        //                             placeholder="Provide a reason for rejection (this will be visible to the customer)..."
        //                             className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        //                             maxLength={500}
        //                         />
        //                         <p className="text-xs text-gray-500 mt-1">
        //                             {rejectionMessage.length}/500 characters
        //                         </p>
        //                     </div>

        //                     <div className="flex flex-col sm:flex-row gap-3 justify-end">
        //                         <Button
        //                             variant="outline"
        //                             onClick={() => {
        //                                 setShowRejectModal(false);
        //                                 setRejectionMessage('');
        //                             }}
        //                             className="w-full sm:w-auto"
        //                         >
        //                             Cancel
        //                         </Button>
        //                         <Button
        //                             variant="danger"
        //                             onClick={handleReject}
        //                             isLoading={rejectOrderMutation.isPending} // Use mutation's pending state
        //                             className="w-full sm:w-auto"
        //                         >
        //                             Confirm Reject
        //                         </Button>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     )}
        // </>

        <>
  {/* Main Modal */}
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">

      {/* Modal Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
          Refund Details
        </h2>
        <div className="flex items-center gap-1 sm:gap-2">
          {data.orderStatus === 'rejected' && (
            <span className="text-red-600 font-bold text-xs sm:text-sm">[REJECTED]</span>
          )}
          {data.orderStatus === 'payment_done' && (
            <span className="text-green-600 font-bold text-xs sm:text-sm">[PAID]</span>
          ) || data.orderStatus === "accepted" && (
            <span className="text-blue-600 font-bold text-xs sm:text-sm">[Accepted]</span>
          )}
          {data.orderStatus === 'pending' &&
            <span className="text-yellow-600 font-bold text-xs sm:text-sm">[PENDING]</span>
          }
          {data.orderStatus === 'refill' &&
            <span className="text-yellow-600 font-bold text-xs sm:text-sm">[REFILL]</span>
          }
          <Button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors hover:cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </Button>
        </div>
      </div>

      {/* Modal Content */}
      {data.orderStatus === 'rejected' && data.rejectionMessage && (
        <div className="px-3 sm:px-4 md:px-6">
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-red-800 mb-1 sm:mb-2">Rejection Reason</h3>
            <p className="text-red-700 text-xs sm:text-sm">{data.rejectionMessage}</p>
          </div>
        </div>
      )}
      {data.orderStatus === 'refill' && data.refillMessage && (
        <div className="px-3 sm:px-4 md:px-6 mt-1 sm:mt-2">
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-yellow-800 mb-1 sm:mb-2">Refill Message</h3>
            <p className="text-yellow-700 text-xs sm:text-sm">{data.refillMessage}</p>
          </div>
        </div>
      )}

      <div className="px-3 sm:px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-blue-800 mb-2 sm:mb-3 flex items-center">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Order Information
            </h3>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <p><span className="font-medium">Order Number:</span> {data.orderNumber}</p>
              <p><span className="font-medium">Reviewer Name:</span> {data.name}</p>
              <p><span className="font-medium">Reviewer Email:</span> {data.email}</p>
              <p><span className="font-medium">Reviewer Contact:</span> {data.phone}</p>
              {/* <p><span className="font-medium">Mediator Name:</span> {data.mediator?.nickName ?? data.mediator?.name ?? "N/A"}</p>
              <p><span className="font-medium">Mediator phone:</span> {data.mediator?.phone ?? "N/A"}</p>
               */}
              <p><span className="font-medium">Replacement:</span> {data.isReplacement ? "Yes" : "No"}</p>
              <p><span className="font-medium">Rating / Review:</span> {data.ratingOrReview}</p>
              <p><span className="font-medium">Deal Type:</span> {data.dealType}</p>
              {data.dealType === "exchange" &&
                <p><span className="font-medium">Exchange Product:</span> {data.exchangeProduct}</p>
              }
              <p><span className="font-medium">Order Placed on:</span> {format(new Date(data.orderDate), 'dd MMM yyyy')}</p>
              <p><span className="font-medium">Order Form Placed on:</span> {format(new Date(data.createdAt), 'dd MMM yyyy')}</p>
              <p><span className="font-medium">Status:</span>
                <span className={`ml-1 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(data.orderStatus)}`}>
                  {data?.orderStatus.replace('_', ' ')}
                </span>
              </p>
              {data.orderStatus === 'rejected' &&
                <p><span className="font-medium">Rejection Message:</span> {data.rejectionMessage ?? "N/A"}</p>
              }
            </div>
          </div>

          <div className="bg-green-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-green-800 mb-2 sm:mb-3 flex items-center">
              <Box className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Product Information
            </h3>
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <p><span className="font-medium">Product Name:</span> {data.product?.name ?? "N/A"}</p>
              <p><span className="font-medium">Product Code:</span> {data.product?.productCode ?? "N/A"}</p>
              <p><span className="font-medium">Brand Name:</span> {data.product?.brand ?? "N/A"}</p>
              <p><span className="font-medium">ASIN Code:</span> {data.product?.brandCode ?? "N/A"}</p>
              <p><span className="font-medium">Product Platform:</span> {data.product?.productPlatform ?? "N/A"}</p>
              <p><span className="font-medium">Product Link:</span> <a target="_blank" className="text-blue-600 text-xs sm:text-sm break-all" href={data.product?.productLink ?? "N/A"}>{data.product?.productLink ?? "N/A"}</a></p>
              <p><span className="font-medium">Order Amount:</span> {data.orderAmount}</p>
              <p><span className="font-medium">Less Price:</span> {data.lessPrice}</p>
              <p><span className="font-medium">Refund Amount:</span> {data.orderAmount + data.lessPrice}</p>
            </div>
          </div>
        </div>

        {/* Screenshots Section */}
        <div className="mt-4 sm:mt-6 md:mt-8">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4 flex items-center">
            <Image className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Screenshots
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {screenshots.map((screenshot, index) => (
              <div key={index} className="relative group" onClick={() => openImage(screenshot.url as string)}>
                <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{screenshot.label}</p>
                <div className="relative cursor-pointer">
                  <img
                    src={screenshot.url}
                    alt={screenshot.label}
                    className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-opacity rounded-lg flex items-center justify-center">
                    <ZoomIn className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 md:p-6 border-t border-gray-200">
        <div className="grid grid-cols-3 sm:flex sm:flex-row gap-1 sm:gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={onClose}
            className="col-span-1 sm:col-auto justify-center order-last sm:order-none mt-1 sm:mt-0 text-xs sm:text-sm py-1.5 sm:py-2"
          >
            Close
          </Button>

          { data.orderStatus !== 'payment_done' && data.orderStatus !== 'accepted' && (
            <Button
              onClick={handleAccepted}
              isLoading={acceptOrderMutation.isPending}
              className="flex items-center justify-center gap-1 text-xs sm:text-sm py-1.5 sm:py-2"
            >
              <FileCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Accept</span>
            </Button>
          )}

          {data.orderStatus !== 'rejected' && (
            <Button
              variant="danger"
              onClick={() => setShowRejectModal(true)}
              isLoading={rejectOrderMutation.isPending}
              className="flex items-center justify-center gap-1 text-xs sm:text-sm py-1.5 sm:py-2"
            >
              <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Reject</span>
            </Button>
          )}

          {data.orderStatus !== 'refill' && (
            <Button
              onClick={() => setShowRefillModal(true)}
              isLoading={refillOrderMutation.isPending}
              className="flex items-center justify-center gap-1 text-xs sm:text-sm py-1.5 sm:py-2 bg-yellow-600 hover:bg-yellow-700"
            >
              <ClipboardListIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Refill</span>
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center justify-center gap-1 text-xs sm:text-sm py-1.5 sm:py-2"
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Edit</span>
          </Button>
        </div>
      </div>
    </div>
  </div>

  {/* Image Lightbox Modal */}
  {selectedImage && (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-6xl max-h-full">
        <Button
          onClick={closeImage}
          className="absolute -top-8 sm:-top-12 -right-2 sm:-right-4 bg-white rounded-full p-1 sm:p-2 z-10 hover:bg-gray-200 transition-colors hover:cursor-pointer"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-800" />
        </Button>
        <img
          src={selectedImage}
          alt="Enlarged view"
          className="max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain rounded-lg"
        />
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg">
          <Button
            onClick={() => window.open(selectedImage, '_blank')}
            className="text-xs sm:text-sm hover:underline"
          >
            Open image in new tab
          </Button>
        </div>
      </div>
    </div>
  )}

  {/* Render the Edit Modal when needed */}
  {isEditModalOpen && (
    <EditOrderModal
      onClose={() => setIsEditModalOpen(false)}
      data={data}
      onSave={handleUpdate}
      isSubmitting={editOrderMutation.isPending}
    />
  )}

  {/* Refill Modal */}
  {showRefillModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Refill Required</h3>
          <Button
            onClick={() => {
              setShowRefillModal(false);
              setRefillMessage('');
            }}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ClipboardListIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </Button>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Refill Message (Optional)
            </label>
            <textarea
              value={refillMessage}
              onChange={(e) => setRefillMessage(e.target.value)}
              placeholder="Provide a reason for refill (this will be visible to the customer)..."
              className="w-full h-20 sm:h-24 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-xs sm:text-sm"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {refillMessage.length}/500 characters
            </p>
          </div>

          <div className="flex flex-row gap-2 sm:gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowRefillModal(false);
                setRefillMessage('');
              }}
              className="w-full sm:w-auto text-xs sm:text-sm py-1.5 sm:py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRefill}
              isLoading={refillOrderMutation.isPending}
              className="w-full sm:w-auto text-xs sm:text-sm py-1.5 sm:py-2"
            >
              Confirm Refill
            </Button>
          </div>
        </div>
      </div>
    </div>
  )}

  {/* Reject Modal */}
  {showRejectModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">Reject Order</h3>
          <Button
            onClick={() => {
              setShowRejectModal(false);
              setRejectionMessage('');
            }}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </Button>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
            Are you sure you want to reject order <strong>#{data.orderNumber}</strong>?
          </p>

          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Rejection Message (Optional)
            </label>
            <textarea
              value={rejectionMessage}
              onChange={(e) => setRejectionMessage(e.target.value)}
              placeholder="Provide a reason for rejection (this will be visible to the customer)..."
              className="w-full h-20 sm:h-24 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-xs sm:text-sm"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {rejectionMessage.length}/500 characters
            </p>
          </div>

          <div className="flex flex-row gap-2 sm:gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectModal(false);
                setRejectionMessage('');
              }}
              className="w-full sm:w-auto text-xs sm:text-sm py-1.5 sm:py-2"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              isLoading={rejectOrderMutation.isPending}
              className="w-full sm:w-auto text-xs sm:text-sm py-1.5 sm:py-2"
            >
              Confirm Reject
            </Button>
          </div>
        </div>
      </div>
    </div>
  )}
</>
    );
};

export default OrderModal;