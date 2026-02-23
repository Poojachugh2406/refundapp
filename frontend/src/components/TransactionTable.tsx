import { useEffect, useState } from "react";
import Input from "./UI/Input";
import { Download, Image, Filter, Package, RefreshCw, SearchIcon, SquareArrowOutUpRight, Trash2Icon, X, User, Bell, Mail } from "lucide-react";
import { exportToExcel, formatOrdersForExport } from '../utils/exportUtils.ts';
import Button from './UI/Button';
import toast from "react-hot-toast";
import { format } from "date-fns";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/utils/api.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import TransactionActions from "./TransactionActions.tsx";
import {
    type OrdersResponse,
    type RefundsResponse,
    Process,
    Role,
    TransactionStatus
} from '../types/transactions.ts';

interface Props<P extends Process> {
    process: P;
    role: Role;
}


function TransactionTable({ process, role }: Props<Process>) {
    const TOTAL_COLUMNS = 8;
    const transactionName = process.charAt(0).toUpperCase() + process.slice(1);

    /* ------------------------------------- states ------------------------------------- */
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(new Set());
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [bulkAction, setBulkAction] = useState<null | TransactionStatus>(null);
    const [bulkMessage, setBulkMessage] = useState('');
    const [bulkResult, setBulkResult] = useState<null | {
        success: boolean;
        modifiedCount?: number;
        message?: string;
    }>(null);

    const [filters, setFilters] = useState({
        seller: '',
        status: '',
        brand: '',
        mediator: '',
        platform: '',
        product: '',
        productName: '',
        brandName: '',
        fromDate: '',
        toDate: ''
    });

    /* ------------------------------------- HOOKS ------------------------------------- */

    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    /* ------------------------------------- use effects ------------------------------------- */
    useEffect(() => {
        if (location.state?.orderNumber) {
            const orderNum = location.state.orderNumber;
            setSearchQuery(orderNum);
            setSearchTerm(orderNum);
        }
    }, []);

    useEffect(() => {
        setSelectAll(false);
        setSelectedIds(new Set());
        setExcludedIds(new Set());
        setSelectionMode(false);
    }, [
        itemsPerPage,
        searchTerm,
        filters.status,
        filters.brand,
        filters.brandName,
        filters.mediator,
        filters.productName,
        filters.seller,
        filters.fromDate,
        filters.toDate,
        filters.platform,
    ]);

    useEffect(() => {
        if (!bulkAction) setBulkMessage('');
    }, [bulkAction]);



    /* ------------------------------------- query functions ------------------------------------- */
    const fetchTransaction = async ({ queryKey }: any): Promise<OrdersResponse | RefundsResponse> => {
        const [_key, { ...params }] = queryKey;
        const queryString = new URLSearchParams(params).toString();

        const endpoint = `/${process}/all-${process}s`;

        try {
            const response: any = await apiGet(
                `${endpoint}?${queryString}`
            );
            if (!response.success) {
                throw new Error(response.message || `Failed to fetch ${transactionName}s`);
            }
            return response.data;
        } catch (error: any) {
            throw new Error(error.message || `Failed to fetch ${transactionName}s`);
        }
    }

    const fetchFiltersData = async () => {
        try {
            const response: any = await apiGet(`/admin/filter-options`);
            if (response.success) {
                return response.data;
            }
            throw new Error(`Failed to fetch ${transactionName} filter options`);
        } catch (error: any) {
            throw new Error(error.message || `Failed to fetch ${transactionName} filters Data`);
        }
    };


    /* ------------------------------------- queries ------------------------------------- */

    // get all transactions query with filters, pagination and search
    const { data, isLoading, isError, error } = useQuery({
        queryKey: [process, { ...filters, page: pageNo, limit: itemsPerPage, searchTerm }],
        queryFn: fetchTransaction,
        placeholderData: (prev) => prev,
        staleTime: 5 * 2 * 60 * 1000
    });

    // Filters query
    const { data: filtersData } = useQuery({
        queryKey: ["filtersData"],
        queryFn: fetchFiltersData,
        staleTime: Infinity,
        gcTime: Infinity,
    });

    /* ------------------------------------- mutations ------------------------------------- */
    // Delete single transaction mutation
    const deleteTransactionMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await apiDelete(`${process}/${id}`);
            if (!response.success) {
                throw new Error(response.message);
            }
            return { id, ...response };
        },
        onSuccess: () => {
            // Invalidate and refetch transactions after deletion
            queryClient.invalidateQueries({ queryKey: [process] });
            toast.success(`${transactionName} deleted successfully`);
        },
        onError: (error: any) => {
            console.error(`Error deleting ${transactionName}:`, error);
            toast.error(error.response?.data?.message || error.message || `Failed to delete ${transactionName}`);
        },
    });

    const bulkUpdateMutation = useMutation({
        mutationFn: async (status: TransactionStatus) => {
            const payload = {
                selectAll,
                filters: {
                    searchTerm,
                    status: filters.status,
                    mediator: filters.mediator,
                    brand: filters.brand,
                    product: filters.productName,
                    seller: filters.seller,
                    platform: filters.platform,
                    fromDate: filters.fromDate,
                    toDate: filters.toDate,
                },
                selectedIds: selectAll ? [] : Array.from(selectedIds),
                exclusion: selectAll ? Array.from(excludedIds) : [],
                status: status,
                rejectionMessage: status === TransactionStatus.REJECTED ? 'Bulk rejected by admin' : undefined,
                refillMessage: status === TransactionStatus.REFILL ? 'Bulk marked for refill by admin' : undefined,
                note: status === TransactionStatus.ACCEPTED ? 'Bulk accepted by admin' : undefined,
            };

            if (status === TransactionStatus.ACCEPTED && bulkMessage.trim()) {
                payload.note = bulkMessage;
            }

            if (status === TransactionStatus.REJECTED) {
                payload.rejectionMessage = bulkMessage;
            }

            if (status === TransactionStatus.REFILL) {
                payload.refillMessage = bulkMessage;
            }

            const res: any = await apiPatch(
                `/${process}/bulk/update-status`,
                payload
            );

            if (!res.success) throw new Error(res.message);
            return res.data;
        },

        onSuccess: (data) => {
            setBulkResult({
                success: true,
                modifiedCount: data.modifiedCount,
            });

            handleDeselectAll();
            queryClient.invalidateQueries({ queryKey: [process] });
        },

        onError: (err: any) => {
            setBulkResult({
                success: false,
                message: err.response?.data?.message || 'Bulk update failed',
            });
        },
    });

    const remindMutation = useMutation({
        mutationFn: async (ids?: string[]) => {
            const payload = {
                selectAll,
                filters: {
                    searchTerm,
                    status: filters.status,
                    mediator: filters.mediator,
                    brand: filters.brand,
                    product: filters.productName,
                    seller: filters.seller,
                    platform: filters.platform,
                    fromDate: filters.fromDate,
                    toDate: filters.toDate,
                },
                selectedIds: ids && ids.length > 0 ? ids : selectAll ? [] : Array.from(selectedIds),
                exclusion: selectAll ? Array.from(excludedIds) : []
            };

            const res: any = await apiPost(`/order/remind`, payload);

            if (!res.success) throw new Error(res.message);
            return res;
        },

        onSuccess: (data) => {
            toast.success(`Reminder sent successfully`);
            handleDeselectAll();
        },

        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to send reminder");
        }
    });

    /* ------------------------------------- local variables ------------------------------------- */

    const transactions: any = data && 'items' in data ? data.items : [];

    const pagination: any = (data && 'pagination' in data) ? data.pagination : {};
    const selectedCount = selectAll
        ? (pagination.totalCount || 0) - excludedIds.size
        : selectedIds.size;

    const hasSelection = selectedCount > 0;
    const isMessageRequired = bulkAction !== TransactionStatus.ACCEPTED;



    /* ------------------------------------- callbacks ------------------------------------- */

    const handleDelete = async (id: string) => {
        if (!window.confirm(`Are you sure you want to delete this ${process}?`)) return;
        deleteTransactionMutation.mutate(id);
    };

    const handleRefundForm = async (orderNumber: string) => {
        navigate(`/${role}/refunds`, { state: { orderNumber } });
    };

    // Function to get status display information
    const getTransactionStatusInfo = (status: string) => {
        const statusInfo = {
            pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
            refill: { label: 'Refill', color: 'bg-yellow-100 text-yellow-800' },
            refund_placed: { label: 'Refund Placed', color: 'bg-blue-100 text-blue-800' },
            rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
            accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-800' },
            payment_done: { label: 'Payment Done', color: 'bg-green-100 text-green-800' },
            brand_released: {
                label: role === Role.ADMIN ? 'Payment Done' : 'Paid By Admin',
                color: role === Role.ADMIN ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
            }
        };
        return statusInfo[status as keyof typeof statusInfo] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const queryParams = { ...filters, searchTerm, status: filters.status, product: filters.product };
            const queryString = new URLSearchParams(queryParams).toString();

            const response: any = await apiGet(`/${process}/download?${queryString}`);
            if (response.success) {
                const formattedData = formatOrdersForExport(response.data);
                exportToExcel(formattedData, process);
                toast.success(`${process} exported successfully!`);
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            toast.error('Failed to export data');
        } finally {
            setIsExporting(false);
        }
    };

    // Handle search with enter key
    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchTerm(searchQuery);
            setPageNo(1); // Reset to first page when searching
        }
    };

    // Handle search icon click
    const handleSearchClick = () => {
        setSearchTerm(searchQuery);
        setPageNo(1); // Reset to first page when searching
    };

    // Handle filter changes with page reset
    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPageNo(1); // Reset to first page when filters change
    };

    // Handle items per page change
    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setPageNo(1); // Reset to first page when changing items per page
    };

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({
            status: '',
            brand: '',
            mediator: '',
            platform: '',
            productName: '',
            product: '',
            brandName: '',
            seller: '',
            fromDate: '',
            toDate: ''
        });
        setSearchTerm('');
        setSearchQuery('');
        setPageNo(1);
    };

    const handleSelectAll = () => {
        setSelectAll(true);
        setSelectedIds(new Set());   // no longer needed
        setExcludedIds(new Set());   // clean slate
    };

    const handleDeselectAll = () => {
        setSelectAll(false);
        setSelectedIds(new Set());
        setExcludedIds(new Set());
    };

    const isRowSelected = (id: string) => {
        if (selectAll) {
            return !excludedIds.has(id);
        }
        return selectedIds.has(id);
    };


    const expandAll = () => {
        setExpandedRowIds(prev => {
            const next = new Set(prev);
            transactions.forEach((t: { _id: string; }) => next.add(t._id));
            return next;
        });
    };

    const collapseAll = () => {
        setExpandedRowIds(new Set());
    };

    const toggleRow = async (transactionId: string) => {
        setExpandedRowIds(prev => {
            const next = new Set(prev);

            if (next.has(transactionId)) {
                next.delete(transactionId);
            } else {
                next.add(transactionId);
            }

            return next;
        });
    };

    const toggleSelect = (transactionId: string) => {
        if (selectAll) {
            setExcludedIds(prev => {
                const next = new Set(prev);
                next.has(transactionId) ? next.delete(transactionId) : next.add(transactionId);
                return next;
            });
        } else {
            setSelectedIds(prev => {
                const next = new Set(prev);
                next.has(transactionId) ? next.delete(transactionId) : next.add(transactionId);
                return next;
            });
        }
    };


    const openImage = (imageUrl: string) => setSelectedImage(imageUrl);
    const closeImage = () => setSelectedImage(null);
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) closeImage();
    };

    const handleConfirmBulk = () => {
        if (!bulkAction) return;
        bulkUpdateMutation.mutate(bulkAction);
        setBulkAction(null);
    };

    const handleReminder = (id?: string, lastReminderDate?: string) => {
        if (!id && !hasSelection) return;

        if (id && (!window.confirm(`Send reminder email to user associated with this order, Last reminder was sent on: ${lastReminderDate ? new Date(lastReminderDate).toLocaleDateString() : 'never'}?`))) return;
        else if (!id && !window.confirm(`Send reminder email to ${selectedCount} users?`)) return;

        remindMutation.mutate(id ? [id] : undefined);
    };



    if (isLoading && !data) return ( // Show loading only on initial fetch
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading {process}s...</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-red-600">Something went wrong: {error?.message}</p>
                <Button
                    onClick={() => queryClient.refetchQueries({ queryKey: [process] })}
                    className="mt-4"
                >
                    Retry
                </Button>
            </div>
        </div>
    );
    return (
        <div>
            <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6 items-end">
                    <div className="col-span-3 sm:col-span-2 lg:col-span-3">
                        <Input
                            label="Search"
                            className="flex-1"
                            placeholder="Search by order ID, Reviewer name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={handleSearchKeyPress}
                            rightIcon={
                                <div
                                    onClick={handleSearchClick}
                                    className="hover:cursor-pointer hover:text-gray-900 text-gray-500"
                                >
                                    <SearchIcon className="w-4 h-4" />
                                </div>
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Show entries</label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                            className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <Button
                            variant="outline"
                            onClick={clearAllFilters}
                            className="w-full text-xs sm:text-sm py-2 truncate"
                            size="sm"
                        >
                            <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Clear Filters
                        </Button>
                    </div>

                    <div className="flex items-end">
                        <Button
                            variant="primary"
                            onClick={handleExport}
                            disabled={isExporting || transactions.length === 0}
                            className="w-full text-xs sm:text-sm py-2"
                            size="sm"
                        >
                            {isExporting ? (
                                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 animate-spin" />
                            ) : (
                                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            )}
                            Export
                        </Button>
                    </div>
                </div>

                {/* Filters Grid - 3 per row on mobile */}
                <div className="grid grid-cols-3 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4">
                    {/* Status Filter */}
                    <div className="xs:col-span-1">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value={TransactionStatus.PENDING}>Pending</option>
                            <option value={TransactionStatus.ACCEPTED}>Accepted</option>
                            <option value={TransactionStatus.REJECTED}>Rejected</option>
                            {process === Process.ORDER && <option value={TransactionStatus.REFUND_PLACED}>Refund Placed</option>}
                            {process === Process.ORDER && <option value={TransactionStatus.REFUND_NOT_PLACED}>Refund Not Placed</option>}
                            <option value={TransactionStatus.REFILL}>Refill</option>
                            <option value={role === Role.ADMIN ? [TransactionStatus.PAYMENT_DONE, TransactionStatus.BRAND_RELEASED] : TransactionStatus.PAYMENT_DONE}>Payment Done</option>
                            {role === Role.MEDIATOR && <option value={TransactionStatus.BRAND_RELEASED}>Paid By Admin</option>}
                        </select>
                    </div>

                    {/* Product Name Filter */}
                    <div className="xs:col-span-1">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Product</label>
                        <select
                            value={filters.product}
                            onChange={(e) => handleFilterChange('product', e.target.value)}
                            className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Products</option>
                            {filtersData?.products?.map((product: any) => (
                                <option key={product._id} value={product._id}>
                                    {product.name} - {product.productCode}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Brand Name Filter */}
                    <div className="xs:col-span-1">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <select
                            value={filters.brand}
                            onChange={(e) => handleFilterChange('brand', e.target.value)}
                            className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Brands</option>
                            {[...new Set(filtersData?.products?.map((p: any) => p.brand))]
                                .filter(Boolean)
                                .map((brand: any) => (
                                    <option key={brand} value={brand}>
                                        {brand}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Platform Filter */}
                    <div className="xs:col-span-1 sm:col-span-1">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Platform</label>
                        <select
                            value={filters.platform}
                            onChange={(e) => handleFilterChange('platform', e.target.value)}
                            className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Platforms</option>
                            {filtersData?.platforms?.map((platform: any) => (
                                <option key={platform.value} value={platform.value}>
                                    {platform.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Mediator Filter */}
                    {role === Role.ADMIN && <div className="xs:col-span-1 sm:col-span-1 md:col-span-1">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Mediator</label>
                        <select
                            value={filters.mediator}
                            onChange={(e) => handleFilterChange('mediator', e.target.value)}
                            className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Mediators</option>
                            {filtersData?.mediators
                                ?.slice() // original array mutate na ho
                                .sort((a: any, b: any) =>
                                    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
                                )
                                .map((mediator: any) => (
                                    <option key={mediator._id} value={mediator._id}>
                                        {mediator.name} - {mediator.email}
                                    </option>
                                ))
                            }
                        </select>
                    </div>}

                    {/* Seller Filter */}
                    <div className="xs:col-span-1 sm:col-span-1 md:col-span-1">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Seller</label>
                        <select
                            value={filters.seller}
                            onChange={(e) => handleFilterChange('seller', e.target.value)}
                            className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Sellers</option>
                            {filtersData?.sellers?.map((seller: any) => (
                                <option key={seller._id} value={seller._id}>
                                    {seller.name} - {seller.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* From Date Filter */}
                    <div className="xs:col-span-1 sm:col-span-1">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">From Date</label>
                        <input
                            type="date"
                            value={filters.fromDate}
                            onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                            className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* To Date Filter */}
                    <div className="xs:col-span-1 sm:col-span-1">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">To Date</label>
                        <input
                            type="date"
                            value={filters.toDate}
                            onChange={(e) => handleFilterChange('toDate', e.target.value)}
                            className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>
            {/* ================= TABLE TOOLBAR ================= */}
            <div className="flex flex-col sm:flex-row gap-3 p-3 mb-3 rounded-2xl bg-gray-100 border">

                {/* ================= LEFT GROUP ================= */}
                <div className="flex flex-wrap items-center gap-2 bg-white rounded-2xl px-3 py-2 shadow-sm w-full sm:w-auto">

                    {/* Select Toggle */}
                    <button
                        className="px-3 py-1.5 text-xs sm:text-sm rounded-full bg-blue-600 text-white"
                        onClick={() => {
                            setSelectionMode(v => !v);
                            handleDeselectAll();
                        }}
                    >
                        {selectionMode ? "Cancel" : "Select"}
                    </button>

                    {selectionMode && (
                        <>
                            <button
                                className="px-3 py-1.5 text-xs sm:text-sm rounded-full text-blue-600 hover:bg-blue-50"
                                onClick={handleSelectAll}
                            >
                                Select All
                            </button>

                            <button
                                className="px-3 py-1.5 text-xs sm:text-sm rounded-full text-blue-600 hover:bg-blue-50"
                                onClick={handleDeselectAll}
                            >
                                Deselect
                            </button>

                            <span className="text-xs sm:text-sm text-gray-600 ml-1">
                                {selectedCount} selected
                            </span>

                            {/* ADMIN BULK ACTIONS */}
                            {role === Role.ADMIN && (
                                <div className="flex flex-wrap items-center gap-2 border-t sm:border-t-0 sm:border-l pt-2 sm:pt-0 sm:pl-3 w-full sm:w-auto">
                                    <button
                                        disabled={!hasSelection}
                                        onClick={() => setBulkAction(TransactionStatus.ACCEPTED)}
                                        className="px-3 py-1.5 text-xs sm:text-sm rounded-full bg-green-600 text-white disabled:opacity-40"
                                    >
                                        Accept
                                    </button>

                                    <button
                                        disabled={!hasSelection}
                                        onClick={() => setBulkAction(TransactionStatus.REJECTED)}
                                        className="px-3 py-1.5 text-xs sm:text-sm rounded-full bg-red-600 text-white disabled:opacity-40"
                                    >
                                        Reject
                                    </button>

                                    <button
                                        disabled={!hasSelection}
                                        onClick={() => setBulkAction(TransactionStatus.REFILL)}
                                        className="px-3 py-1.5 text-xs sm:text-sm rounded-full bg-orange-500 text-white disabled:opacity-40"
                                    >
                                        Refill
                                    </button>

                                    {/* REMIND BUTTON */}
                                    {filters.status !== TransactionStatus.REFUND_PLACED &&
                                        filters.status !== TransactionStatus.PAYMENT_DONE && (
                                            <button
                                                disabled={!hasSelection}
                                                onClick={() => handleReminder()}
                                                className="px-3 py-1.5 text-xs sm:text-sm rounded-full bg-indigo-600 text-white disabled:opacity-40"
                                            >
                                                Remind
                                            </button>
                                        )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* ================= RIGHT GROUP ================= */}
                <div className="flex items-center justify-center sm:justify-end gap-2 bg-white rounded-2xl px-3 py-2 shadow-sm w-full sm:w-auto sm:ml-auto">

                    <button
                        className="px-3 py-1.5 text-xs sm:text-sm rounded-full text-purple-600 hover:bg-purple-50"
                        onClick={expandAll}
                    >
                        Expand
                    </button>

                    <button
                        className="px-3 py-1.5 text-xs sm:text-sm rounded-full text-purple-600 hover:bg-purple-50"
                        onClick={collapseAll}
                    >
                        Collapse
                    </button>
                </div>

                {/* ================= BULK CONFIRM MODAL ================= */}
                {bulkAction && (
                    <div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4"
                        onClick={() => setBulkAction(null)}
                    >
                        <div
                            className="bg-white rounded-2xl p-4 w-full max-w-md"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-base sm:text-lg font-semibold mb-2">
                                Confirm bulk update
                            </h3>

                            <p className="text-xs sm:text-sm text-gray-600 mb-3">
                                Update <b>{selectedCount}</b> orders to
                                <b className="ml-1">{bulkAction}</b>
                            </p>

                            <textarea
                                value={bulkMessage}
                                onChange={e => setBulkMessage(e.target.value)}
                                placeholder={
                                    bulkAction === TransactionStatus.ACCEPTED
                                        ? "Add note (optional)"
                                        : bulkAction === TransactionStatus.REJECTED
                                            ? "Enter rejection reason"
                                            : "Enter refill reason"
                                }
                                className="w-full border rounded-lg p-2 text-xs sm:text-sm mb-4 resize-none"
                                rows={3}
                            />

                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setBulkAction(null)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    variant="primary"
                                    isLoading={bulkUpdateMutation.isPending}
                                    disabled={isMessageRequired && !bulkMessage.trim()}
                                    onClick={handleConfirmBulk}
                                >
                                    Yes, Update
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= BULK RESULT MODAL ================= */}
                {bulkResult && (
                    <div
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4"
                        onClick={() => setBulkResult(null)}
                    >
                        <div
                            className="bg-white rounded-2xl p-4 w-full max-w-md"
                            onClick={e => e.stopPropagation()}
                        >
                            {bulkResult.success ? (
                                <>
                                    <h3 className="text-green-600 font-semibold text-base sm:text-lg">
                                        Bulk update successful
                                    </h3>
                                    <p className="mt-2 text-xs sm:text-sm">
                                        {bulkResult.modifiedCount} {process}s updated
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-red-600 font-semibold text-base sm:text-lg">
                                        Bulk update failed
                                    </h3>
                                    <p className="mt-2 text-xs sm:text-sm">
                                        {bulkResult.message}
                                    </p>
                                </>
                            )}

                            <div className="flex justify-end mt-4">
                                <Button onClick={() => setBulkResult(null)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

            </div>


            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading && !data ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    {[
                                        "S. No.",
                                        "Order ID",
                                        "Product",
                                        "Reviewer",
                                        "Mediator",
                                        "Amount",
                                        "Date",
                                        "Actions",
                                    ].map((title, i) => (
                                        <th
                                            key={i}
                                            className="px-2 py-2 sm:px-4 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {title}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-gray-200">
                                {transactions.map((item: any, index: number) => {
                                    const statusInfo = getTransactionStatusInfo(process === Process.ORDER ? item.orderStatus : item.status);
                                    return (
                                        <React.Fragment key={item._id}>
                                            <tr
                                                className={`hover:bg-gray-50 text-[11px] sm:text-sm border-t border-gray-300 ${expandedRowIds.has(item._id) ? 'bg-gray-50 border-b-0' : 'border-b border-gray-300'}`}
                                            >
                                                <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap font-medium text-gray-900">
                                                    {selectionMode && (
                                                        <div>
                                                            <input
                                                                type="checkbox"
                                                                checked={isRowSelected(item._id)}
                                                                onChange={() => toggleSelect(item._id)}
                                                                onClick={e => e.stopPropagation()}
                                                            />

                                                        </div>
                                                    )}

                                                    {index + 1 + (pageNo - 1) * itemsPerPage}
                                                </td>

                                                <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-900">
                                                    {process === Process.ORDER ? item.orderNumber :
                                                        process === Process.REFUND ? item?.order?.orderNumber : 'NA'}
                                                    <div className="py-1">
                                                        <span
                                                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${statusInfo.color}`}
                                                        >
                                                            {statusInfo.label}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-900">
                                                    <div className="flex flex-col gap-[1px] max-w-[120px] sm:max-w-[220px]">
                                                        <p className="truncate">
                                                            {process === Process.ORDER ? item.product?.name ?? "N/A" :
                                                                process === Process.REFUND ? item?.order?.product?.name ?? "N/A" : "N/A"} /
                                                            <span className="text-[10px] sm:text-xs">
                                                                {" "}
                                                                {process === Process.ORDER ? item.product?.productCode ?? "N/A" :
                                                                    process === Process.REFUND ? item?.order?.product?.productCode ?? "N/A" : "N/A"}
                                                            </span>
                                                        </p>

                                                        <p className="truncate">
                                                            {process === Process.ORDER ? item.product?.brand ?? "N/A" :
                                                                process === Process.REFUND ? item?.order?.product?.brand ?? "N/A" : "N/A"} /
                                                            <span className="text-[10px] sm:text-xs">
                                                                {" "}
                                                                {process === Process.ORDER ? item.product?.brandCode ?? "N/A" :
                                                                    process === Process.REFUND ? item?.order?.product?.brandCode ?? "N/A" : "N/A"}
                                                            </span>
                                                        </p>
                                                        <p className="truncate">
                                                            {process === Process.ORDER ? item.product?.productPlatform ?? "N/A" :
                                                                process === Process.REFUND ? item?.order?.product?.productPlatform ?? "N/A" : "N/A"}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-900">
                                                    <p className="max-w-[120px] break-words whitespace-normal">
                                                        {process === Process.ORDER ? item.name :
                                                            process === Process.REFUND ? item?.order?.name : "N/A"}
                                                    </p>

                                                </td>

                                                <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-900">
                                                    <p className="max-w-[120px] break-words whitespace-normal">
                                                        {process === Process.ORDER ? item.mediator?.nickName ?? "N/A" :
                                                            process === Process.REFUND ? item?.order?.mediator?.nickName ?? "N/A" : "N/A"}
                                                    </p>

                                                </td>

                                                <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-900">
                                                    ₹{process === Process.ORDER ? item.orderAmount.toLocaleString() :
                                                        process === Process.REFUND ? item?.order?.orderAmount.toLocaleString() : "N/A"}
                                                </td>

                                                <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-500">
                                                    {format(new Date(item.createdAt), "dd MMM yyyy")}
                                                </td>

                                                <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap font-medium">
                                                    <div className="flex items-center gap-1 sm:gap-2">

                                                        {/* Expand / Collapse */}
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="p-1 sm:p-2"
                                                            onClick={() => toggleRow(item._id)}
                                                        >
                                                            {expandedRowIds.has(item._id) ? (
                                                                <ChevronUp className="w-4 h-4" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4" />
                                                            )}
                                                        </Button>

                                                        {/* Delete */}
                                                        {role === Role.ADMIN && <Button
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={deleteTransactionMutation.isPending}
                                                            className="p-1 sm:p-2"
                                                            onClick={() => handleDelete(item._id)}
                                                        >
                                                            <Trash2Icon className="w-4 h-4 text-red-500" />
                                                        </Button>}

                                                        {/* Refund page */}
                                                        {process === Process.ORDER && (item.orderStatus === TransactionStatus.REFUND_PLACED || item.orderStatus === TransactionStatus.PAYMENT_DONE) && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="p-1 sm:p-2"
                                                                onClick={() => handleRefundForm(item.orderNumber)}
                                                            >
                                                                <SquareArrowOutUpRight className="w-4 h-4 text-blue-700" />
                                                            </Button>
                                                        )}

                                                        {process === Process.ORDER && item.orderStatus !== TransactionStatus.PAYMENT_DONE && item.orderStatus !== TransactionStatus.REFUND_PLACED &&
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={remindMutation.isPending || selectedCount !== 0}
                                                                className="p-1 sm:p-2 relative"
                                                                onClick={() => handleReminder(item._id, item.lastReminderDate)}
                                                            >
                                                                <Mail className="w-4 h-4 text-blue-600" />
                                                                <Bell className="w-3 h-3 text-orange-500 absolute top-1 right-1" fill="currentColor" />
                                                            </Button>
                                                        }
                                                    </div>
                                                </td>

                                            </tr>
                                            {expandedRowIds.has(item._id) && (
                                                <tr className="bg-gray-50">
                                                    {/* Expanded content */}
                                                    <td colSpan={TOTAL_COLUMNS - 1} className="p-0">
                                                        <div className="pl-1 sm:pl-2 md:pl-3 pb-1 sm:pb-2 text-[12px] sm:text-[14px]">
                                                            {/* Rejection / Refill */}
                                                            {((process === Process.ORDER && item.orderStatus === TransactionStatus.REJECTED) || (process === Process.REFUND && item.status === TransactionStatus.REJECTED))
                                                                && item.rejectionMessage && (
                                                                    <div className="mb-2 sm:mb-3">
                                                                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                                                            <h4 className="font-semibold text-red-800 mb-1 text-[12px] sm:text-[13px]">
                                                                                Rejection Reason
                                                                            </h4>
                                                                            <p className="text-red-700 text-[12px]">
                                                                                {item.rejectionMessage}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            {((process === Process.ORDER && item.orderStatus === TransactionStatus.REFILL) || (process === Process.REFUND && item.status === TransactionStatus.REFILL))
                                                                && item.refillMessage && (
                                                                    <div className="mb-2 sm:mb-3">
                                                                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                                                            <h4 className="font-semibold text-yellow-800 mb-1 text-[12px] sm:text-[13px]">
                                                                                Refill Message
                                                                            </h4>
                                                                            <p className="text-yellow-700 text-[12px]">
                                                                                {item.refillMessage}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            {/* Order Info + Product */}
                                                            {process === Process.ORDER && <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                                                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                                                                    <h4 className="font-semibold mb-2 text-[13px] sm:text-[14px]">
                                                                        Order Info
                                                                    </h4>
                                                                    <p><b>Order:</b> {item.orderNumber}</p>
                                                                    <p><b>Name:</b> {item.name}</p>
                                                                    <p><b>Email:</b> {item.email}</p>
                                                                    <p>
                                                                        <b>Placed:</b>{" "}
                                                                        {format(new Date(item.createdAt), "dd MMM yyyy")}
                                                                    </p>
                                                                </div>

                                                                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                                                                    <h4 className="font-semibold mb-2 text-[13px] sm:text-[14px]">
                                                                        Product
                                                                    </h4>
                                                                    <p className="break-words">
                                                                        <b>Name:</b> {item.product?.name}
                                                                    </p>
                                                                    <p><b>Code:</b> {item.product?.productCode}</p>
                                                                    <p><b>Brand:</b> {item.product?.brand}</p>
                                                                    <p><b>Amount:</b> ₹{item.orderAmount}</p>
                                                                </div>
                                                            </div>}

                                                            {process === Process.REFUND && <>
                                                                {/* Refund + Reviewer Info */}
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                                                    {/* Refund Info */}
                                                                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                                                                        <h4 className="font-semibold mb-2 text-[13px] sm:text-[14px] flex items-center">
                                                                            <Package className="w-4 h-4 mr-2" />
                                                                            Refund Info
                                                                        </h4>

                                                                        <div className="space-y-1 text-xs sm:text-sm">
                                                                            {item.upiId && (
                                                                                <p><b>UPI ID:</b> {item.upiId}</p>
                                                                            )}
                                                                            {item.bankInfo && (
                                                                                <>
                                                                                    <p><b>Account No:</b> {item.bankInfo.accountNumber}</p>
                                                                                    <p><b>IFSC:</b> {item.bankInfo.ifscCode}</p>
                                                                                </>
                                                                            )}
                                                                            <p className="break-all">
                                                                                <b>Review Link:</b>{" "}
                                                                                <a
                                                                                    href={item.reviewLink ?? "#"}
                                                                                    target="_blank"
                                                                                    className="text-blue-600 underline"
                                                                                >
                                                                                    {item.reviewLink ?? "N/A"}
                                                                                </a>
                                                                            </p>
                                                                            <p>
                                                                                <b>Submitted:</b>{" "}
                                                                                {format(new Date(item.createdAt), "dd MMM yyyy")}
                                                                            </p>
                                                                            <p>
                                                                                <b>Return Window Closed:</b>{" "}
                                                                                {item.isReturnWindowClosed ? "Yes" : "No"}
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Reviewer Info */}
                                                                    <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                                                                        <h4 className="font-semibold mb-2 text-[13px] sm:text-[14px] flex items-center">
                                                                            <User className="w-4 h-4 mr-2" />
                                                                            Reviewer Info
                                                                        </h4>

                                                                        <div className="space-y-1 text-xs sm:text-sm">
                                                                            <p><b>Name:</b> {item.order.name}</p>
                                                                            <p><b>Email:</b> {item.order.email}</p>
                                                                            <p><b>Phone:</b> {item.order.phone}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* Order + Product Info */}
                                                                <div className="bg-pink-50 p-3 sm:p-4 rounded-lg border border-pink-100">
                                                                    <h4 className="font-semibold mb-3 text-[13px] sm:text-[14px] flex items-center">
                                                                        <Package className="w-4 h-4 mr-2" />
                                                                        Order Information
                                                                    </h4>

                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs sm:text-sm">
                                                                        <p><b>Product:</b> {item.order.product?.name ?? "N/A"}</p>
                                                                        <p><b>Code:</b> {item.order.product?.productCode ?? "N/A"}</p>
                                                                        <p><b>Brand:</b> {item.order.product?.brand ?? "N/A"}</p>
                                                                        <p><b>ASIN:</b> {item.order.product?.brandCode ?? "N/A"}</p>
                                                                        <p><b>Platform:</b> {item.order.product?.productPlatform ?? "N/A"}</p>

                                                                        <p className="md:col-span-2 break-all">
                                                                            <b>Product Link:</b>{" "}
                                                                            <a
                                                                                href={item.order.product?.productLink}
                                                                                target="_blank"
                                                                                className="text-blue-600 underline"
                                                                            >
                                                                                {item.order.product?.productLink ?? "N/A"}
                                                                            </a>
                                                                        </p>

                                                                        <p><b>Deal Type:</b> {item.order.dealType ?? "N/A"}</p>
                                                                        <p><b>Rating / Review:</b> {item.order.ratingOrReview ?? "N/A"}</p>
                                                                        <p><b>Replacement:</b> {item.order.isReplacement ?? "N/A"}</p>
                                                                        <p><b>Order Amount:</b> ₹{item.order.orderAmount ?? "N/A"}</p>
                                                                        <p><b>Order No:</b> {item.order.orderNumber ?? "N/A"}</p>

                                                                        {item.order.isReplacement === "yes" && (
                                                                            <p className="md:col-span-2">
                                                                                <b>Old Order No:</b> {item.order.oldOrderNumber}
                                                                            </p>
                                                                        )}

                                                                        <p><b>Less Price:</b> ₹{item.order.lessPrice ?? 0}</p>
                                                                        <p>
                                                                            <b>Refund Amount:</b>{" "}
                                                                            ₹{item.order.orderAmount - (item.order.lessPrice ?? 0)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </>}

                                                            {/* Screenshots */}
                                                            <div className="mt-3 sm:mt-4">
                                                                {/* Heading */}
                                                                <h4 className="flex items-center gap-1 text-[12px] sm:text-[13px] font-semibold text-gray-800">
                                                                    <Image className="w-4 h-4" />
                                                                    Screenshots
                                                                </h4>
                                                                <p className="text-[10px] sm:text-[11px] text-gray-500 mb-2">
                                                                    (click on thumbnail to preview)
                                                                </p>

                                                                {/* Carousel */}
                                                                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                                                                    {item.orderSS && (
                                                                        <div
                                                                            className="flex-shrink-0 w-24 cursor-pointer"
                                                                            onClick={() => openImage(item.orderSS)}
                                                                        >
                                                                            <img
                                                                                src={item.orderSS}
                                                                                alt="Order Screenshot"
                                                                                className="w-full h-20 object-cover rounded-md border border-gray-200"
                                                                            />
                                                                            <p className="mt-1 text-center text-[10px] text-gray-600">
                                                                                Order
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {item.priceBreakupSS && (
                                                                        <div
                                                                            className="flex-shrink-0 w-24 cursor-pointer"
                                                                            onClick={() => openImage(item.priceBreakupSS)}
                                                                        >
                                                                            <img
                                                                                src={item.priceBreakupSS}
                                                                                alt="Price Breakup Screenshot"
                                                                                className="w-full h-20 object-cover rounded-md border border-gray-200"
                                                                            />
                                                                            <p className="mt-1 text-center text-[10px] text-gray-600">
                                                                                Price Breakup
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {item.deliveredSS && (
                                                                        <div
                                                                            className="flex-shrink-0 w-24 cursor-pointer"
                                                                            onClick={() => openImage(item.deliveredSS)}
                                                                        >
                                                                            <img
                                                                                src={item.deliveredSS}
                                                                                alt="Delivered Screenshot"
                                                                                className="w-full h-20 object-cover rounded-md border border-gray-200"
                                                                            />
                                                                            <p className="mt-1 text-center text-[10px] text-gray-600">
                                                                                Delivered
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    {item.reviewSS && (
                                                                        <div
                                                                            className="flex-shrink-0 w-24 cursor-pointer"
                                                                            onClick={() => openImage(item.reviewSS)}
                                                                        >
                                                                            <img
                                                                                src={item.reviewSS}
                                                                                alt="Review Screenshot"
                                                                                className="w-full h-20 object-cover rounded-md border border-gray-200"
                                                                            />
                                                                            <p className="mt-1 text-center text-[10px] text-gray-600">
                                                                                Review
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    {item.sellerFeedbackSS && (
                                                                        <div
                                                                            className="flex-shrink-0 w-24 cursor-pointer"
                                                                            onClick={() => openImage(item.sellerFeedbackSS)}
                                                                        >
                                                                            <img
                                                                                src={item.sellerFeedbackSS}
                                                                                alt="Seller Feedback Screenshot"
                                                                                className="w-full h-20 object-cover rounded-md border border-gray-200"
                                                                            />
                                                                            <p className="mt-1 text-center text-[10px] text-gray-600">
                                                                                Seller Feedback
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    {item.returnWindowSS && (
                                                                        <div
                                                                            className="flex-shrink-0 w-24 cursor-pointer"
                                                                            onClick={() => openImage(item.returnWindowSS)}
                                                                        >
                                                                            <img
                                                                                src={item.returnWindowSS}
                                                                                alt="Return Window Screenshot"
                                                                                className="w-full h-20 object-cover rounded-md border border-gray-200"
                                                                            />
                                                                            <p className="mt-1 text-center text-[10px] text-gray-600">
                                                                                Return Window
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </td>


                                                    {/* Actions column */}
                                                    <td className="align-top">
                                                        <TransactionActions data={item} role={role} process={process} />
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                    {/* Open Image Modal */}
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

                    {transactions.length === 0 && !isLoading && (
                        <div className="text-center py-8 sm:py-12">
                            <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                            <p className="text-gray-500 text-sm sm:text-base">
                                No {process}s found matching your criteria
                            </p>
                        </div>
                    )}
                </div>
            </div>
            {/* Pagination */}
            {pagination.totalPages > 0 && (
                <div className="flex flex-col xs:flex-row items-center justify-between mt-4 gap-2 p-2">
                    {/* Mobile Page Info */}
                    <div className="xs:hidden text-xs text-gray-600 text-center w-full">
                        Page {pageNo} of {pagination.totalPages}
                    </div>

                    <div className="flex items-center justify-center gap-1 w-full xs:w-auto">
                        {/* Previous Button */}
                        <Button
                            variant="outline"
                            disabled={!pagination.hasPrevPage}
                            onClick={() => setPageNo(pageNo - 1)}
                            className="text-xs py-1 px-2 min-w-[70px] h-8"
                            size="sm"
                        >
                            Prev
                        </Button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            {Array.from({ length: pagination.totalPages }, (_, k) => {
                                const pageNumber = k + 1;

                                // Show limited pages on mobile
                                if (window.innerWidth < 475) {
                                    const showPage =
                                        pageNumber === 1 ||
                                        pageNumber === pagination.totalPages ||
                                        pageNumber === pageNo ||
                                        pageNumber === pageNo - 1 ||
                                        pageNumber === pageNo + 1;

                                    if (!showPage) {
                                        if ((pageNumber === 2 && pageNo > 3) || (pageNumber === pagination.totalPages - 1 && pageNo < pagination.totalPages - 2)) {
                                            return (
                                                <span key={k} className="px-1 text-xs text-gray-500">
                                                    ...
                                                </span>
                                            );
                                        }
                                        return null;
                                    }
                                }

                                return (
                                    <Button
                                        key={k}
                                        onClick={() => setPageNo(pageNumber)}
                                        variant={pageNo === pageNumber ? "primary" : "outline"}
                                        className="w-7 h-7 text-xs p-0 min-w-0"
                                        size="sm"
                                    >
                                        {pageNumber}
                                    </Button>
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        <Button
                            variant="outline"
                            disabled={!pagination.hasNextPage}
                            onClick={() => setPageNo(pageNo + 1)}
                            className="text-xs py-1 px-2 min-w-[70px] h-8"
                            size="sm"
                        >
                            Next
                        </Button>
                    </div>

                    {/* Desktop Page Info */}
                    <div className="hidden xs:block text-xs text-gray-600 whitespace-nowrap">
                        Page {pageNo} of {pagination.totalPages}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TransactionTable;