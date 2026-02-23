import { Edit, X, XCircle, FileCheck, ClipboardListIcon, CheckCircle, IndianRupee } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import EditTransactionModal from "./EditTransactionModal"; // Make sure path is correct
import Button from "./UI/Button";
import { ordersAPI, refundsAPI } from "@/utils/api";
import {useMutation, useQueryClient } from "@tanstack/react-query";
import { Process, Role, TransactionStatus, WHITELISTED_MEDIATOR_NICKNAMES } from "@/types/transactions";


interface TransactionActionsProps {
  data: any;
  role: Role;
  process: Process;
}

function TransactionActions({ data, role, process }: TransactionActionsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [refillMessage, setRefillMessage] = useState('');
  const queryClient = useQueryClient();
  const api = process === Process.ORDER ? ordersAPI : refundsAPI;

  // --- Mutations ---
  const rejectTransactionMutation = useMutation({
  mutationFn: (message?: string) => {
    const payload =
      process === Process.ORDER
        ? {
            orderStatus: TransactionStatus.REJECTED,
            rejectionMessage: message,
          }
        : {
            status: TransactionStatus.REJECTED,
            rejectionMessage: message,
          };

    return api.updateStatus(data._id, payload);
  },
    onSuccess: () => {
      toast.success(`${process} has been rejected.`);
      queryClient.invalidateQueries({ queryKey: [process] });
      queryClient.invalidateQueries({ queryKey: [process, data._id] });
      setShowRejectModal(false);
      setRejectionMessage('');
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject order.");
    }
  });

  const refillTransactionMutation = useMutation({
    mutationFn: (message: string | undefined) => {
      const payload = process === Process.ORDER
        ? { orderStatus: TransactionStatus.REFILL, refillMessage: message }
        : { status: TransactionStatus.REFILL, refillMessage: message };
      return api.updateStatus(data._id, payload);
    },
    onSuccess: () => {
      toast.success(`${process} has been marked for refill.`);
      queryClient.invalidateQueries({ queryKey: [process] });
      queryClient.invalidateQueries({ queryKey: [process, data._id] });
    },
    onError: (error: any) => {
      toast.error(error.message || `Failed to change ${process} status to refill.`);
    }
  });

  const acceptTransactionMutation = useMutation({
    mutationFn: () => {
      const payload = process === Process.ORDER ? { orderStatus: TransactionStatus.ACCEPTED } : { status: TransactionStatus.ACCEPTED };
      return api.updateStatus(data._id, payload);
    },
    onSuccess: () => {
      toast.success(`${process} has been Accepted.`);
      queryClient.invalidateQueries({ queryKey: [process] });
      queryClient.invalidateQueries({ queryKey: [process, data._id] });
    },
    onError: (error: any) => {
      toast.error(error.message || `Failed to Accept ${process}.`);
    }
  });

  const paymentDoneMutation = useMutation({
    mutationFn: () => {
      const status_to_set = role === Role.ADMIN && !WHITELISTED_MEDIATOR_NICKNAMES.includes(data?.order?.mediator?.nickName) ? TransactionStatus.BRAND_RELEASED : TransactionStatus.PAYMENT_DONE;
      const payload = { status: status_to_set };
      return api.updateStatus(data._id, payload);
    },
    onSuccess: () => {
      toast.success(`${process} has been marked as Payment Done.`);
      queryClient.invalidateQueries({ queryKey: [process] });
      queryClient.invalidateQueries({ queryKey: [process, data._id] });
    },
    onError: (error: any) => {
      toast.error(error.message || `Failed to update ${process} status to Payment Done.`);
    }
  });

  const editTransactionMutation = useMutation({
    mutationFn: ({ updatedData, transactionId, files }: {
      updatedData: Partial<any>,
      transactionId: string,
      files?: { [key: string]: File }
    }) => api.update(transactionId, updatedData, files),
    onSuccess: (response: any) => {
      toast.success(`${process} updated successfully!`);
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: [process] });
      // Manually set the detail query data to avoid a refetch
      queryClient.setQueryData([process, data._id], response.data);
      setIsEditModalOpen(false); // Close edit modal
    },
    onError: (error: any) => {
      toast.error(error.message || `Failed to update ${process}`);
    }
  });

  // --- Handlers ---

  const handleReject = () => {
    rejectTransactionMutation.mutate(rejectionMessage);
  };

  const handleRefill = () => {
    // if (!window.confirm("Are you sure you want this order to be marked for refill?")) return;
    refillTransactionMutation.mutate(refillMessage);
  };

  const handleAccepted = () => {
    if (!window.confirm(`Are you sure you want to Accept this ${process}?`)) return;
    acceptTransactionMutation.mutate();
  };

  const handlePaymentDone = () => {
    if (!window.confirm(`Are you sure you want to mark this ${process} as Payment Done?`)) return;
    paymentDoneMutation.mutate();
  };

  const handleUpdate = (updatedData: Partial<any>, transactionId: string, files?: { [key: string]: File }) => {
    editTransactionMutation.mutate({ updatedData, transactionId, files });
  };

  const getStatus = () => {
    if (process === Process.ORDER) {
      return data.orderStatus;
    } else {
      return data.status;
    }
    return '';
  }

  const upiId = role === ( Role.MEDIATOR || (Role.ADMIN && process === Process.REFUND && WHITELISTED_MEDIATOR_NICKNAMES.includes(data?.order?.mediator?.nickName))) ? data.upiId : data?.order?.mediator.upiId;
  const refundAmount = ((data?.order?.orderAmount ?? 0) - (data?.order?.lessPrice ?? 0));
  const upiURL = `upi://pay?pa=${encodeURIComponent(upiId)}&am=${encodeURIComponent(refundAmount)}&cu=INR&tn=${encodeURIComponent(`OrderNumber: ${data?.order?.orderNumber ?? 'N/A'}`)}`
  
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 sm:gap-0 p-4 bg-gray-50 rounded-b-lg">
        <div className="flex flex-col gap-2 w-full sm:w-auto">

          {role === Role.ADMIN && getStatus() !== TransactionStatus.ACCEPTED && (getStatus() !== TransactionStatus.PAYMENT_DONE && getStatus() !== TransactionStatus.BRAND_RELEASED) && (
            <Button
              onClick={handleAccepted}
              isLoading={acceptTransactionMutation.isPending}
              className="flex items-center justify-center gap-1 text-xs sm:text-sm py-1.5 sm:py-2"
            >
              <FileCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Accept</span>
            </Button>
          )}

          {role === Role.ADMIN && getStatus() !== TransactionStatus.REJECTED && (
            <Button
              variant="danger"
              onClick={() => setShowRejectModal(true)}
              isLoading={rejectTransactionMutation.isPending}
              className="flex items-center justify-center gap-1 text-xs sm:text-sm py-1.5 sm:py-2"
            >
              <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Reject</span>
            </Button>
          )}

          {role === Role.ADMIN && getStatus() !== TransactionStatus.REFILL && (
            <Button
              onClick={() => setShowRefillModal(true)}
              isLoading={refillTransactionMutation.isPending}
              className="flex items-center justify-center gap-1 text-xs sm:text-sm py-1.5 sm:py-2 bg-yellow-600 hover:bg-yellow-700"
            >
              <ClipboardListIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Refill</span>
            </Button>
          )}

          {
            process === Process.REFUND &&
            (
              (role === Role.ADMIN && getStatus() === TransactionStatus.ACCEPTED) ||
              (role === Role.MEDIATOR &&
                (getStatus() === TransactionStatus.ACCEPTED ||
                  getStatus() === TransactionStatus.BRAND_RELEASED)
              )
            ) && (
              <Button
                variant="secondary"
                onClick={() => handlePaymentDone()}
                isLoading={paymentDoneMutation.isPending}
                className="flex items-center justify-center gap-1 text-xs sm:text-sm py-1.5 sm:py-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Paid</span>
              </Button>
            )
          }

          {
            process === Process.REFUND &&
            data.order?.orderNumber &&
            data.order?.orderAmount &&
            (
              (role === Role.ADMIN && data.status === TransactionStatus.ACCEPTED) ||
              (
                role === Role.MEDIATOR &&
                (
                  data.status === TransactionStatus.ACCEPTED ||
                  data.status === TransactionStatus.BRAND_RELEASED
                )
              )
            )
            && (
              <a
                href={upiId ? upiURL : undefined}
                className={`flex items-center justify-center gap-1 text-xs sm:text-sm py-1.5 sm:py-2 
                 px-3 rounded-md ${upiId ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'} 
                 text-white transition-colors duration-200 w-full`}
                tabIndex={upiId ? 0 : -1}
                aria-disabled={!upiId}
                onClick={e => {
                  if (!upiId) e.preventDefault();
                }}
                target="_blank"
              >
                <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Pay via UPI</span>
              </a>
            )
          }

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

      {/* Render the Edit Modal when needed */}
      {isEditModalOpen && (
        <EditTransactionModal
          onClose={() => setIsEditModalOpen(false)}
          data={data}
          onSave={handleUpdate}
          isSubmitting={editTransactionMutation.isPending}
          role={role}
          process={process}
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
                <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
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
                  isLoading={refillTransactionMutation.isPending}
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
                Are you sure you want to reject {process} <strong>#{process === Process.ORDER ? data.orderNumber : data?.order?.orderNumber}</strong>?
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
                  isLoading={rejectTransactionMutation.isPending}
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

export default TransactionActions;