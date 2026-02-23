import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
    X,
    User,
    Mail,
    Phone,
    Calendar,
    IndianRupee,
    // Package,
    Star,
    ExternalLink,
    Link
} from 'lucide-react';
import Button from './UI/Button';
import { useForm, Controller } from 'react-hook-form';
import SearchableSelect from './UI/SearchableSelect';
import { apiGet, userAPI } from '@/utils/api';
import type { ActiveProduct } from '@/types/products';
import Input from './UI/Input';
import RadioGroup from './UI/RadioGroup';
import FileUpload from './UI/FileUpload';
import bblogo from "../assets/bblogog.png"
import { Process, type UpdateOrderData, Role, type UpdateRefundData } from '@/types/transactions';

interface EdiTransactionModalProps {
    onClose: () => void;
    data: any;
    onSave: (updatedData: Partial<any>, orderId: string, files?: { [key: string]: File }) => void; // Changed to void
    isSubmitting: boolean; // Added this prop
    role: Role;
    process: Process;
}

const EditTransactionModal: React.FC<EdiTransactionModalProps> = ({ onClose, data, onSave, isSubmitting, role, process }) => {
    const orderData = process === Process.ORDER ? data : data.order;

    const [products, setProducts] = useState<ActiveProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ActiveProduct | null>(null);
    const [orderSS, setOrderSS] = useState<File | null>(null);
    const [priceBreakupSS, setPriceBreakupSS] = useState<File | null>(null);
    const [deliveredSS, setDeliveredSS] = useState<File | null>(null);
    const [reviewSS, setReviewSS] = useState<File | null>(null);
    const [sellerFeedbackSS, setSellerFeedbackSS] = useState<File | null>(null);
    const [returnWindowSS, setReturnWindowSS] = useState<File | null>(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const orderForm = useForm<UpdateOrderData>({
        defaultValues: {
            name: orderData.name,
            email: orderData.email,
            phone: orderData.phone,
            orderDate: orderData.orderDate
                ? new Date(orderData.orderDate).toISOString().split("T")[0]
                : "",
            orderAmount: orderData.orderAmount,
            lessPrice: orderData.lessPrice,
            product: orderData.product?._id,
            dealType: orderData.dealType,
            isReplacement: orderData.isReplacement,
            oldOrderNumber: orderData.oldOrderNumber || "",
            ratingOrReview: orderData.ratingOrReview,
            exchangeProduct: orderData.exchangeProduct || ""
        }
    });

    const refundForm = useForm<UpdateRefundData>({
        defaultValues: {
            reviewLink: data.reviewLink,
            paymentMethod: data.bankInfo ? "bank" : "upi",
            upiId: data.upiId ?? "",
            accountNumber: data.bankInfo?.accountNumber ?? "",
            ifscCode: data.bankInfo?.ifscCode ?? "",
            isReturnWindowClosed: data.isReturnWindowClosed ? "yes" : "no",
            status: data.status,
            rejectionMessage: data.rejectionMessage ?? "",
            note: data.note ?? ""
        }
    });

    const {
        handleSubmit,
    } = process === "order" ? orderForm : refundForm;


    // Watch form values
    const selectedProductId = orderForm?.watch("product");
    const isReplacement = orderForm?.watch("isReplacement");
    const dealType = orderForm?.watch("dealType");

    const paymentMethod = refundForm?.watch("paymentMethod");


    useEffect(() => {
        if (selectedProductId && products.length > 0) {
            console.log("Selected Product ID:", selectedProductId);
            const product = products.find(p => p._id === String(selectedProductId));
            console.log("Selected Product:", product);
            if (product) {
                setSelectedProduct(product);
                fetchSlots();
            }
        } else {
            setSelectedProduct(null);
        }
    }, [selectedProductId, products]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response: any = await userAPI.getAllActiveProducts();
                if (response.success) {
                    setProducts(response.data);
                    // Set initial selected product
                    const initialProduct = response.data.find((p: ActiveProduct) => p._id === orderData.product?._id);
                    if (initialProduct) {
                        console.log("Initial product found:", initialProduct);
                        setSelectedProduct(initialProduct);
                    }
                } else {
                    toast.error("Failed to load products");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to load products");
            }
        };
        fetchProducts();
    }, [orderData.product?._id]);

    const fetchSlots = async () => {
        try {
            const response: any = await apiGet('/product/slots/' + selectedProductId);
            if (response.success && response.data) {
                const options = response.data.slots.map((slot: any) => {
                    if (slot.slots > 0) return {
                        value: slot.value,
                        label: `${slot.label} (available slots: ${slot.slots})`
                    }
                }).filter(Boolean);
                setAvailableSlots(options);

            }
        } catch (error: any) {
            console.log(error.response.data.message)
        }
    }

    const productOptions = products?.map((product) => ({
        value: product?._id,
        label: `${product?.productCode} - ${product?.name}`,
    })) || [];

    const onSubmit = (formData: any) => { // Removed async
        if (process === Process.ORDER && (!formData.product || !formData.name || !formData.email || !formData.phone || !formData.orderDate || !formData.orderAmount || !formData.lessPrice)) {
            toast.error("Please fill all details");
            return;
        }
        const updatedTransaction: any = {};
        if (process === Process.ORDER) {
            if (formData.product !== orderData.product?._id) {
                updatedTransaction.product = formData.product;
            }
            if (formData.name !== orderData.name) {
                updatedTransaction.name = formData.name;
            }
            if (formData.email !== orderData.email) {
                updatedTransaction.email = formData.email;
            }
            if (formData.phone !== orderData.phone) {
                updatedTransaction.phone = formData.phone;
            }
            if (new Date(formData.orderDate).getTime() !== new Date(orderData.orderDate).getTime()) {
                updatedTransaction.orderDate = formData.orderDate;
            }
            if (formData.orderAmount !== orderData.orderAmount) {
                updatedTransaction.orderAmount = formData.orderAmount;
            }
            if (formData.lessPrice !== orderData.lessPrice) {
                updatedTransaction.lessPrice = formData.lessPrice;
            }
            if (formData.isReplacement !== orderData.isReplacement || formData.isReplacement === 'yes') {
                updatedTransaction.isReplacement = formData.isReplacement;
                if (formData.isReplacement === 'yes') {
                    updatedTransaction.oldOrderNumber = formData.oldOrderNumber;
                }
            }
            if (formData.dealType !== orderData.dealType || formData.dealType === 'exchange') {
                updatedTransaction.dealType = formData.dealType;
                if (formData.dealType === 'exchange') {
                    updatedTransaction.exchangeProduct = formData.exchangeProduct;
                }
            }

            if (formData.ratingOrReview !== orderData.ratingOrReview) {
                updatedTransaction.ratingOrReview = formData.ratingOrReview;
            }
        } else {
            if (formData.reviewLink !== data.reviewLink) {
                updatedTransaction.reviewLink = formData.reviewLink;
            }

            // Payment info
            if (formData.paymentMethod === 'bank') {
                updatedTransaction.bankInfo = {
                    accountNumber: formData.accountNumber,
                    ifscCode: formData.ifscCode
                };
                updatedTransaction.upiId = null; // Clear UPI ID
            } else {
                updatedTransaction.upiId = formData.upiId;
                updatedTransaction.bankInfo = null; // Clear bank info
            }

            // Return window status
            updatedTransaction.isReturnWindowClosed = formData.isReturnWindowClosed === 'yes';

            // Add note
            updatedTransaction.note = formData.note;
        }

        // No try/catch/finally needed here
        // The mutation in the parent handles loading state and errors
        const files: { [key: string]: File } = {}
        if (orderSS) files.orderSS = orderSS;
        if (priceBreakupSS) files.priceBreakupSS = priceBreakupSS;
        if (deliveredSS) files.deliveredSS = deliveredSS;
        if (reviewSS) files.reviewSS = reviewSS;
        if (sellerFeedbackSS) files.sellerFeedbackSS = sellerFeedbackSS;
        if (returnWindowSS) files.returnWindowSS = returnWindowSS;

        onSave(updatedTransaction, data._id, files); // Just call onSave
    };

    const handleProductLinkClick = () => {
        if (selectedProduct?.productLink) {
            window.open(selectedProduct.productLink, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Edit {process.charAt(0).toUpperCase() + process.slice(1)}</h2>
                        <p className="text-gray-600 text-sm mt-1">{process.charAt(0).toUpperCase() + process.slice(1)} #{orderData.orderNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    {process === Process.ORDER && <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                        {/* Product Information Section */}
                        <section className="space-y-6">

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Controller
                                    name="product"
                                    control={orderForm.control}
                                    rules={{ required: "Product is required" }} // Add your validation rules here
                                    render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                                        <SearchableSelect
                                            ref={ref}
                                            name="product"
                                            value={value}
                                            onChange={onChange} // Controller handles the string-to-state update
                                            error={error?.message}
                                            options={[...productOptions].sort((a, b) => a.label.localeCompare(b.label))} // Ensure this matches your variable name for product options
                                            placeholder="Select a product" // Add if needed
                                        />
                                    )}
                                />
                                <Input
                                    label="Product Name"
                                    required
                                    value={selectedProduct?.name || ""}
                                    placeholder="Product Name"
                                    disabled
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <Input
                                    label="Product Link"
                                    required
                                    value={selectedProduct?.productLink || ""}
                                    placeholder="Product Link"
                                    onClick={handleProductLinkClick}
                                    disabled
                                    className={selectedProduct?.productLink ? "cursor-pointer" : ""}
                                    rightIcon={selectedProduct?.productLink ? <ExternalLink className="w-4 h-4" /> : undefined}
                                />
                                <Input
                                    label="Platform"
                                    required
                                    value={selectedProduct?.productPlatform || ""}
                                    placeholder="Platform"
                                    disabled
                                />
                                <Input
                                    label="Brand"
                                    required
                                    value={selectedProduct?.brand || ""}
                                    placeholder="Brand"
                                    disabled
                                />
                            </div>


                        </section>
                        {/* Basic Information Section */}
                        <section className="space-y-6">


                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    icon={<Mail className="w-4 h-4" />}
                                    placeholder="your.email@example.com"
                                    required
                                    register={orderForm.register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Invalid email address"
                                        }
                                    })}

                                    error={orderForm.formState.errors.email?.message}
                                />
                                <Input
                                    label="WhatsApp Number"
                                    icon={<Phone className="w-4 h-4" />}
                                    placeholder="9876543210"
                                    required
                                    register={orderForm.register("phone", {
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Phone number must be 10 digits"
                                        }
                                    })}
                                    error={orderForm.formState.errors.phone?.message}
                                />
                            </div>

                            <Input
                                label="Reviewer Name"
                                icon={<User className="w-4 h-4" />}
                                placeholder="Enter reviewer name"
                                required
                                register={orderForm.register("name", {
                                    required: "Reviewer name is required",
                                    minLength: {
                                        value: 2,
                                        message: "Name must be at least 2 characters"
                                    }
                                })}
                                error={orderForm.formState.errors.name?.message}
                            />
                        </section>

                        {/* Order Details Section */}
                        <section className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <Input
                                        label="Order Date"
                                        type="date"
                                        icon={<Calendar className="w-4 h-4" />}
                                        required
                                        register={orderForm.register("orderDate", { required: "Order date is required" })}
                                        error={orderForm.formState.errors.orderDate?.message}
                                    />
                                    <Input
                                        label="Total Order Amount"
                                        type="number"
                                        icon={<IndianRupee className="w-4 h-4" />}
                                        placeholder="0.00"
                                        required
                                        register={orderForm.register("orderAmount", {
                                            required: "Order amount is required",
                                            min: { value: 0, message: "Order amount must be positive" },
                                            valueAsNumber: true
                                        })}
                                        error={orderForm.formState.errors.orderAmount?.message}
                                    />
                                    <Input
                                        label="Your Less Price"
                                        type="number"
                                        icon={<IndianRupee className="w-4 h-4" />}
                                        placeholder="0.00"
                                        required
                                        register={orderForm.register("lessPrice", {
                                            required: "Less price is required",
                                            // min: { value: 0, message: "Less price must be positive" },
                                            valueAsNumber: true
                                        })}
                                        error={orderForm.formState.errors.lessPrice?.message}
                                    />
                                </div>

                                <RadioGroup
                                    label="Is this a replacement order?"
                                    required
                                    options={[
                                        { value: "no", label: "No" },
                                        { value: "yes", label: "Yes" }
                                    ]}
                                    register={orderForm.register("isReplacement", { required: "Please select an option" })}
                                    error={orderForm.formState.errors.isReplacement?.message}
                                />

                                {isReplacement === "yes" && (
                                    <Input
                                        label="Old Order ID to Replace"
                                        placeholder="Enter old order ID"
                                        required
                                        register={orderForm.register("oldOrderNumber", { required: "Old order ID is required" })}
                                        error={orderForm.formState.errors.oldOrderNumber?.message}
                                    />
                                )}
                            </div>
                        </section>

                        {/* Deal Type & Rating Section */}
                        <section className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Deal Type */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            {/* <Package className="w-4 h-4 text-green-600" /> */}
                                            <img width="70" src={bblogo} alt="Logo" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">Deal Type</h3>
                                    </div>
                                    <RadioGroup
                                        label=""
                                        required
                                        options={[
                                            { value: "original", label: "Original" },
                                            { value: "exchange", label: "Exchange" },
                                            { value: "empty", label: "Empty" }
                                        ]}
                                        register={orderForm.register("dealType", { required: "Please select deal type" })}
                                        error={orderForm.formState.errors.dealType?.message}
                                    />
                                    {dealType === "exchange" && (
                                        <Input
                                            label="Exchange Product"
                                            placeholder="Enter exchange product details"
                                            required
                                            register={orderForm.register("exchangeProduct", { required: "Exchange product is required" })}
                                            error={orderForm.formState.errors.exchangeProduct?.message}
                                        />
                                    )}
                                </div>

                                {/* Rating/Review */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Star className="w-4 h-4 text-yellow-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">Rating / Review</h3>
                                    </div>

                                    <RadioGroup
                                        label=""
                                        required
                                        options={
                                            availableSlots.map((slot: any) => {
                                                return {
                                                    label: slot.label,
                                                    value: slot.value
                                                }
                                            })
                                        }
                                        register={orderForm.register("ratingOrReview", { required: "Please select an option" })}
                                        error={orderForm.formState.errors.ratingOrReview?.message}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FileUpload
                                    label="Order Screenshot"
                                    // accept="image/*,.pdf"
                                    value={orderSS}
                                    onChange={setOrderSS}
                                />
                                <FileUpload
                                    label="Price Breakup Screenshot"
                                    // accept="image/*,.pdf"
                                    value={priceBreakupSS}
                                    onChange={setPriceBreakupSS}
                                />

                            </div>
                        </section>
                    </form>}
                    {process === Process.REFUND && (
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                            {/* Basic Information */}
                            <section className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                    Basic Information
                                </h3>

                                <Input
                                    label="Review Link"
                                    icon={<Link className="w-4 h-4" />}
                                    placeholder="https://example.com/review"
                                    register={refundForm.register("reviewLink")}
                                    required
                                    error={refundForm.formState.errors.reviewLink?.message}
                                />
                            </section>

                            {/* Payment Information */}
                            <section className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                    Payment Information
                                </h3>

                                <RadioGroup
                                    label="Payment Method"
                                    options={[
                                        { label: 'UPI', value: 'upi' },
                                        { label: 'Bank Transfer', value: 'bank' },
                                    ]}
                                    register={refundForm.register('paymentMethod', {
                                        required: 'Please select a payment method',
                                    })}
                                    error={refundForm.formState.errors.paymentMethod?.message}
                                />

                                {paymentMethod === 'upi' && (
                                    <Input
                                        label="UPI ID"
                                        placeholder="yourname@upi"
                                        register={refundForm.register('upiId')}
                                        required
                                    />
                                )}

                                {paymentMethod === 'bank' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input label="Account Number" register={refundForm.register('accountNumber')} />
                                        <Input label="IFSC Code" register={refundForm.register('ifscCode')} />
                                    </div>
                                )}
                            </section>

                            {/* Screenshots */}
                            <section className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                                    Update Screenshots
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FileUpload label="Delivered Screenshot" value={deliveredSS} onChange={setDeliveredSS} />
                                    <FileUpload label="Review Screenshot" value={reviewSS} onChange={setReviewSS} />
                                    <FileUpload label="Seller Feedback Screenshot" value={sellerFeedbackSS} onChange={setSellerFeedbackSS} />
                                    <FileUpload label="Return Window Screenshot" value={returnWindowSS} onChange={setReturnWindowSS} />
                                </div>
                            </section>
                        </form>
                    )}

                </div>

                {/* Fixed Footer */}
                <div className="border-t border-gray-200 bg-white p-6 sticky bottom-0">
                    <div className="flex flex-row gap-4 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting} // Use prop
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleSubmit(onSubmit)}
                            isLoading={isSubmitting} // Use prop
                            disabled={isSubmitting} // Use prop
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                        >
                            {isSubmitting ? "Updating..." : "Update"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTransactionModal;