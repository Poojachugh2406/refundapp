
import { useState } from "react";
import { Download, Eye, Filter, Package, RefreshCw, SearchIcon } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { exportToExcel, formatRefundsForExport } from "../../utils/exportUtils";
import Input from "../UI/Input";
import Button from "../UI/Button";
import type { RefundWithDetails } from "@/types/refunds";
import MediatorRefundModal from "./MediatorRefundModal"; // Make sure path is correct
import { apiGet } from "@/utils/api";
import { useLocation } from "react-router-dom";
import { useQuery,  useQueryClient } from "@tanstack/react-query";

function MediatorRefundTable() {
    const [searchQuery, setSearchQuery] = useState(''); // For the input box
    const [searchTerm, setSearchTerm] = useState(''); // For the API query
    const [selectedRefundItem, setSelectedRefundItem] = useState<RefundWithDetails | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const location = useLocation();
    const queryClient = useQueryClient();

    const [filters, setFilters] = useState({
        seller: '',
        status: '',
        brand: '',
        platform: '',
        product: '',
        brandName: '',
        fromDate: '',
        toDate: ''
    });

    // --- Data Fetching with useQuery ---
    const fetchRefunds = async ({ queryKey }: any): Promise<any> => {
        const [_key, { ...params }] = queryKey;
        const queryString = new URLSearchParams(params).toString();

        try {
            const response: any = await apiGet(`/refund/mediator/all-refunds?${queryString}`);
            if (response.success) {
                return response; // Return the full response { data, pagination }
            }
            throw new Error(response.message || 'Failed to fetch refunds');
        } catch (error: any) {
            throw new Error(error.message || 'Failed to fetch refunds');
        }
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["refunds", { ...filters, page: pageNo, limit: itemsPerPage, searchTerm }],
        queryFn: fetchRefunds,
        placeholderData: (prev) => prev,
        staleTime: 5 * 2 * 60 * 1000, // 10 minutes
    });

    const refunds: any[] = data?.data || [];
    const pagination: any = data?.pagination || {};

    // --- Filters Data ---
    const { data: filtersData } = useQuery({
        queryKey: ["filtersData"],
        queryFn: async () => {
            try {
                const response: any = await apiGet(`/admin/filter-options`);
                if (response.success) {
                    return response.data;
                }
                throw new Error('Failed to fetch filter options');
            } catch (error: any) {
                throw new Error(error.message || "failed to fetch filters Data");
            }
        },
        staleTime: 50 * 60 * 1000, // 5 0 minutes
    });

    // --- Handlers ---
    const handleReview = (item: RefundWithDetails) => {
        setSelectedRefundItem(item);
        setIsModalOpen(true);
    };

    // Handle search with enter key
    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchTerm(searchQuery);
            setPageNo(1); // Reset to first page
        }
    };

    // Handle search icon click
    const handleSearchClick = () => {
        setSearchTerm(searchQuery);
        setPageNo(1); // Reset to first page
    };

    // Handle filter changes with page reset
    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPageNo(1); // Reset to first page
    };

    // Handle items per page change
    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setPageNo(1); // Reset to first page
    };

    const clearAllFilters = () => {
        setFilters({
            seller: '',
            status: '',
            brand: '',
            platform: '',
            product: '',
            brandName: '',
            fromDate: '',
            toDate: ''
        });
        setSearchTerm('');
        setSearchQuery('');
        setPageNo(1);
    };

    // --- Export ---
    const handleExport = async () => {
        setIsExporting(true);
        try {
            // Build the same query string as the main fetch
            const queryParams = { ...filters, searchTerm, status: filters.status, product: filters.product };
            const queryString = new URLSearchParams(queryParams).toString();

            const response: any = await apiGet(`/refund/mediator/download?${queryString}`);
            if (response.success) {
                const formattedData = formatRefundsForExport(response.data);
                exportToExcel(formattedData, 'refunds');
                toast.success('Refunds exported successfully!');
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            toast.error('Failed to export data');
        } finally {
            setIsExporting(false);
        }
    };

    // Set search term from navigation state (e.g., coming from OrderTable)
    useState(() => {
        if (location.state?.orderNumber) {
            const orderNum = location.state.orderNumber;
            setSearchQuery(orderNum);
            setSearchTerm(orderNum);
        }
    });

    const getRefundStatusInfo = (status: string) => {
        const statusInfo = {
            pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
            refill: { label: 'Refill', color: 'bg-yellow-100 text-yellow-800' },
            refund_placed: { label: 'Refund Placed', color: 'bg-blue-100 text-blue-800' },
            rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
            accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-800' },
            payment_done: { label: 'Payment Done', color: 'bg-green-100 text-green-800' }
        };
        return statusInfo[status as keyof typeof statusInfo] || { label: status, color: 'bg-gray-100 text-gray-800' };
    };


    // --- Render Logic ---
    if (isLoading && !data) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading refunds...</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-red-600">Something went wrong: {error?.message}</p>
                <Button
                    onClick={() => queryClient.refetchQueries({ queryKey: ['refunds'] })}
                    className="mt-4"
                >
                    Retry
                </Button>
            </div>
        </div>
    );

    return (
        <div>
            {/* Search and Filter Section */}
            {/* <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4 items-end">
                    <div className="md:col-span-2 lg:col-span-3">
                        <Input
                            label="Search"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Show entries</label>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Clear Filters
                        </Button>
                    </div>
                    <div className="flex items-end">
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            disabled={isExporting || refunds.length === 0}
                            className="w-full"
                        >
                            {isExporting ? (
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4 mr-2" />
                            )}
                            Export
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                            <option value="payment_done">Payment Done</option>
                            <option value="refill">Refill</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name
                        </label>
                        <select
                            value={filters.product}
                            onChange={(e) => handleFilterChange('product', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Products</option>
                            {filtersData?.products?.map((product: any) => (
                                <option key={product._id} value={product._id}>
                                    {product.name} - {product.productCode}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                        <select
                            value={filters.platform}
                            onChange={(e) => handleFilterChange('platform', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Platforms</option>
                            {filtersData?.platforms?.map((platform: any) => (
                                <option key={platform.value} value={platform.value}>
                                    {platform.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mediator</label>
                        <select
                            value={filters.mediator}
                            onChange={(e) => handleFilterChange('mediator', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Mediators</option>
                            {filtersData?.mediators?.map((mediator: any) => (
                                <option key={mediator._id} value={mediator._id}>
                                    {mediator.name} - {mediator.email}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Seller</label>
                        <select
                            value={filters.seller}
                            onChange={(e) => handleFilterChange('seller', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Sellers</option>
                            {filtersData?.sellers?.map((seller: any) => (
                                <option key={seller._id} value={seller._id}>
                                    {seller.name} - {seller.email}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            From Date
                        </label>
                        <input
                            type="date"
                            value={filters.fromDate}
                            onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            To Date
                        </label>
                        <input
                            type="date"
                            value={filters.toDate}
                            onChange={(e) => handleFilterChange('toDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div> */}

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
                            disabled={isExporting || refunds.length === 0}
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
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                            <option value="refill">Refill</option>
                            <option value="payment_done">Payment Done</option>
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




            {/* Data Table */}
            {/* <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 ">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S. No.</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reviewer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mediator
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {refunds.map((item, index) => {
                                const status = item.status;
                                const statusColors: any = {
                                    pending: 'bg-yellow-100 text-yellow-800',
                                    accepted: 'bg-blue-100 text-blue-800',
                                    rejected: 'bg-red-100 text-red-800',
                                    payment_done: 'bg-green-100 text-green-800',
                                    refill: 'bg-yellow-100 text-yellow-800'
                                };
                                const statusLabels: any = {
                                    pending: 'Pending',
                                    accepted: 'Accepted',
                                    rejected: 'Rejected',
                                    payment_done: 'Payment Done',
                                    refill: 'Refill'
                                };

                                return (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {index + 1 + (pageNo - 1) * itemsPerPage}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {item?.order?.orderNumber ?? "N/A"}
                                            <div className=" py-1 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
                                                    {statusLabels[status]}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex flex-col">
                                                <p>
                                                    {item.order.product?.name ?? "N/A"} /
                                                    <span className="text-xs"> {item.order.product?.productCode ?? "N/A"}</span>
                                                </p>
                                                <p>
                                                    {item.order.product?.brand ?? "N/A"} /
                                                    <span className="text-xs "> {item.order.product?.brandCode ?? "N/A"}</span>
                                                </p>
                                                <p>
                                                    {item.order.product?.productPlatform ?? "N/A"}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item?.order?.name ?? "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {item?.order?.mediator?.nickName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{item?.order?.orderAmount ?? "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(item.createdAt), "dd MMM yyyy")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleReview(item)}
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={deleteRefundMutation.isPending}
                                                    onClick={() => handleDelete(item._id)}
                                                >
                                                    <Trash2Icon className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {refunds.length === 0 && !isLoading && (
                    <div className="text-center py-12">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No refunds found matching your criteria</p>
                    </div>
                )}
            </div> */}


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
                            <tbody className="bg-white divide-y divide-gray-200">
                                {refunds.map((item, index) => {
                                    const statusInfo = getRefundStatusInfo(item.status);
                                    return (
                                        <tr
                                            key={item._id}
                                            className="hover:bg-gray-50 text-[11px] sm:text-sm"
                                        >
                                            <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap font-medium text-gray-900">
                                                {index + 1 + (pageNo - 1) * itemsPerPage}
                                            </td>

                                            <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-900">
                                                {item.order.orderNumber}
                                                <div className="py-1">
                                                    <span
                                                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${statusInfo.color}`}
                                                    >
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-900">
                                                <div className="flex flex-col gap-[1px]">
                                                    <p className="truncate">
                                                        {item.order.product?.name ?? "N/A"} /
                                                        <span className="text-[10px] sm:text-xs">
                                                            {" "}
                                                            {item.order.product?.productCode ?? "N/A"}
                                                        </span>
                                                    </p>
                                                    <p className="truncate">
                                                        {item.order.product?.brand ?? "N/A"} /
                                                        <span className="text-[10px] sm:text-xs">
                                                            {" "}
                                                            {item.order.product?.brandCode ?? "N/A"}
                                                        </span>
                                                    </p>
                                                    <p className="truncate">{item.order.product?.productPlatform ?? "N/A"}</p>
                                                </div>
                                            </td>

                                            <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-900">
                                                {item.order.name}
                                            </td>

                                            <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-900">
                                                {item.order.mediator?.nickName || "N/A"}
                                            </td>

                                            <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-900">
                                                ₹{item.order.orderAmount}
                                            </td>

                                            <td className="px-2 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-gray-500">
                                                {format(new Date(item.createdAt), "dd MMM yyyy")}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleReview(item)}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                 
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    {refunds.length === 0 && !isLoading && (
                        <div className="text-center py-8 sm:py-12">
                            <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                            <p className="text-gray-500 text-sm sm:text-base">
                                No orders found matching your criteria
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {/* {pagination?.totalPages > 0 && (
                <div className="flex justify-end mt-4 gap-2">
                    <Button
                        variant="outline"
                        disabled={!pagination.hasPrevPage}
                        onClick={() => setPageNo(pageNo - 1)}
                    >
                        Previous
                    </Button>
                    {Array.from({ length: pagination.totalPages }, (_, k) => (
                        <Button
                            key={k}
                            onClick={() => setPageNo(k + 1)}
                            variant={pageNo === k + 1 ? "primary" : "outline"}
                        >
                            {k + 1}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        disabled={!pagination.hasNextPage}
                        onClick={() => setPageNo(pageNo + 1)}
                    >
                        Next
                    </Button>
                </div>
            )} */}

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



            {/* Modal */}
            {selectedRefundItem &&
                <MediatorRefundModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedRefundItem(null);
                    }}
                    refundId={selectedRefundItem._id}
                // No more setRefunds or onUpdate props!
                />
            }
        </div>
    )
}

export default MediatorRefundTable;