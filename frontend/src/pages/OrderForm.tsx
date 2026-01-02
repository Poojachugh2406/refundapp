import { Controller } from "react-hook-form";
// ... other imports
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Upload, Calendar, User, Mail, Phone, Package, Star, RefreshCw, ArrowLeft, IndianRupee, ShoppingCart } from "lucide-react";
import { apiUpload, userAPI } from "../utils/api"; // Removed apiGet

import type { CreateOrderData } from "@/types/orders";
import Input from "@/components/UI/Input";
import RadioGroup from "@/components/UI/RadioGroup";
import FileUpload from "@/components/UI/FileUpload";
import Button from "@/components/UI/Button";
import SearchableSelect from "@/components/UI/SearchableSelect";
import type { ActiveProduct } from "@/types/products";
import type { ActiveMediators } from "@/types/users";
import { useAuth } from "@/contexts/AuthContext";
import { usePersistRHF } from "@/hooks/usePersistRHF";
import { uploadToCloudinary } from "@/utils/cloudinary";
// import Select from "@/components/UI/Select";

const OrderFormPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderScreenshot, setOrderScreenshot] = useState<File | null>(null);
    const [products, setProducts] = useState<ActiveProduct[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ActiveProduct | null>(null);
    const [mediators, setMediators] = useState<ActiveMediators[]>([]);
    const [availableSlots, setAvailableSlots] = useState<{ label: string; value: string }[]>([]);

    const { user: authUser, isAuthenticated, isLoading } = useAuth();

    // 1. Initial Data Fetch
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // This API already contains 'availableRatingSlots', 'availableReviewSlots', etc.
                const response: any = await userAPI.getAllActiveProducts();
                if (response.success) {
                    setProducts(response.data);
                } else {
                    toast.error("Failed to load products.");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to load products");
            }
        };

        const fetchMediators = async () => {
            try {
                const response: any = await userAPI.getAllActiveMediators();
                if (response.success) {
                    setMediators(response.data);
                } else {
                    toast.error("Failed to load mediators.");
                }
            } catch (error) {
                console.error("Error fetching mediators:", error);
                toast.error("Failed to load mediators");
            }
        };

        Promise.all([fetchProducts(), fetchMediators()]);
    }, []);

    const productOptions = products?.map((product) => ({
        value: product._id,
        label: product.productCode,
    })) || [];

    const mediatorOptions = mediators?.map((mediator) => ({
        value: mediator._id,
        label: mediator.nickName,
    })) || [];

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
        setValue
    } = useForm<CreateOrderData>({
        defaultValues: {
            product: "",
            mediator: ""
        },
        shouldUnregister: false
    });

    usePersistRHF<CreateOrderData>(
        "order-form",
        control,
        setValue,
        products.length > 0 && mediators.length > 0
      );

    useEffect(() => {
        if (location.state?.productId) {
            setValue("product", location.state.productId);
        }
    }, [location.state, setValue]);

    const selectedProductId = watch("product");
    const isReplacement = watch("isReplacement");

    // 2. Logic to extract slots directly from the selected product object
    useEffect(() => {
        if (selectedProductId && products.length > 0) {
            const product = products.find(p => p._id === selectedProductId);

            if (product) {
                setSelectedProduct(product);

                // Construct the options array directly from the product data
                const options = [];

                if ((product.availableRatingSlots || 0) > 0) {
                    options.push({ label: `Rating (Remaining: ${product.availableRatingSlots})`, value: 'rating' });
                }
                if ((product.availableReviewSlots || 0) > 0) {
                    options.push({ label: `Review (Remaining: ${product.availableReviewSlots})`, value: 'review' });
                }
                if ((product.availableOnlyOrderSlots || 0) > 0) {
                    options.push({ label: `Only Order (Remaining: ${product.availableOnlyOrderSlots})`, value: 'only_order' });
                }
                if ((product.availableReviewSubmitted || 0) > 0) {
                    options.push({ label: `Review Submit (Remaining: ${product.availableReviewSubmitted})`, value: 'review_submitted' });
                }

                setAvailableSlots(options);

                if (options.length === 0) {
                    toast.error("This product is fully booked.");
                }
            }
        } else {
            setSelectedProduct(null);
            setAvailableSlots([]);
        }
    }, [selectedProductId, products]);
    console.log(products)
    // 3. Auto-fill User Details
    useEffect(() => {
        if (!isLoading && isAuthenticated && authUser) {
            setValue("email", authUser.email || "", { shouldDirty: false });
            setValue("phone", authUser.phone || "", { shouldDirty: false });
            setValue("name", authUser.name || "", { shouldDirty: false });
        }
    }, [authUser, isAuthenticated, isLoading, setValue]);

    const onSubmit = async (data: CreateOrderData) => {
        if (!orderScreenshot) {
            toast.error("Please upload the order screenshot");
            return;
        }
        if (!data.mediator) {
            toast.error("Please select a mediator");
            return;
        }
        if (!data.product) {
            toast.error("Please select a product");
            return;
        }
        if (!data.ratingOrReview) {
            toast.error("Please select a slot type");
            return;
        }

        setIsSubmitting(true);
        try {
            const uploads = await toast.promise(
                    Promise.all([
                      uploadToCloudinary(orderScreenshot!)
                    ]),
                    {
                      loading: 'Uploading screenshots...',
                      success: 'Screenshots uploaded',
                      error: (err) =>
                        err.message || 'Screenshot upload failed',
                    }
                  );
            
            const [orderUpload] = uploads;
            data.orderSS = orderUpload.url;
            
            const formData = new FormData();
            formData.append("data", JSON.stringify(data));
            const response: any = await apiUpload("/order/create-order", formData);

            if (response.success) {
                localStorage.removeItem("order-form");
                toast.success("Order submitted successfully!");
                navigate("/user/orders");
            } else {
                toast.error(response.message || "Failed to submit order");
            }
        } catch (error: any) {
            console.error("Order submission error:", error);
            const errorMsg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Failed to submit order";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <div className="max-w-4xl mx-auto px-6 py-10">

                <div className="text-center mb-10">
                    <div className="flex mb-4">
                        <div>
                            <Button variant="outline" className="hover:cursor-pointer" onClick={() => navigate(-1)}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-white/20">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

                        {/* Product Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 text-red-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Product Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* REPLACEMENT CODE FOR LINE 210 */}
                                <Controller
                                    name="product"
                                    control={control}
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

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700">Product Link</label>
                                    <a
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-blue-700 hover:bg-gray-50 transition-colors block truncate"
                                        href={selectedProduct?.productLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {selectedProduct?.productLink ?? "N/A"}
                                    </a>
                                </div>

                                <Input
                                    label="Platform"
                                    required
                                    value={selectedProduct?.productPlatform || ""}
                                    placeholder="Product Platform"
                                    disabled
                                    className={selectedProduct?.productPlatform ? "cursor-pointer hover:bg-gray-50" : ""}
                                />
                                <Input
                                    label="Brand"
                                    required
                                    value={selectedProduct?.brand || ""}
                                    placeholder="Brand"
                                    disabled
                                    className={selectedProduct?.brandCode ? "cursor-pointer hover:bg-gray-50" : ""}
                                />
                                <Input
                                    label="ASIN Code"
                                    required
                                    value={selectedProduct?.brandCode || ""}
                                    placeholder="Brand Code"
                                    disabled
                                    className={selectedProduct?.brandCode ? "cursor-pointer hover:bg-gray-50" : ""}
                                />
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    icon={<Mail className="w-4 h-4" />}
                                    placeholder="your.email@example.com"
                                    required
                                    register={register("email", { required: "Email is required" })}
                                    error={errors.email?.message}
                                />

                                <Input
                                    label="Phone Number"
                                    icon={<Phone className="w-4 h-4" />}
                                    placeholder="9876543210"
                                    required
                                    register={register("phone", {
                                        required: 'Phone number is required',
                                        pattern: { value: /^[0-9]{10}$/, message: 'Must be a 10-digit phone number' }
                                    })}
                                    error={errors.phone?.message}
                                />
                            </div>

                            <Input
                                label="Reviewer Name"
                                icon={<User className="w-4 h-4" />}
                                placeholder="Enter reviewer name"
                                required
                                register={register("name", {
                                    required: 'Name is required',
                                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                                })}
                                error={errors.name?.message}
                            />
                        </div>

                        {/* Order Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <RefreshCw className="w-5 h-5 text-purple-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
                            </div>

                            <div className="bg-gray-50/50 rounded-2xl p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="Order Number"
                                        placeholder="Enter order number"
                                        required
                                        register={register("orderNumber", {
                                            required: "Order number is required",
                                            validate: (value) => {
                                                const platform = selectedProduct?.productPlatform.toLowerCase() || "";
                                                if (platform === 'amazon') {
                                                    if (!/^\d{3}-\d{7}-\d{7}$/.test(value)) return "Format must be: 000-0000000-0000000";
                                                }
                                                else if (platform === 'flipkart') {
                                                    if (!value.startsWith("OD")) return "Must start with 'OD'";
                                                    if (value.length !== 20) return `Must be 20 chars. Current: ${value.length}`;
                                                    if (!/^OD\d{18}$/.test(value)) return "Format: OD + 18 digits";
                                                }
                                                else if (platform === 'myntra') {
                                                    if (!value.startsWith("#")) return "Must start with '#'";
                                                    if (!/^#\d{21}$/.test(value)) return 'Format: # + 21 digits Current: ${value.length}';
                                                }
                                                else if (platform === 'blinkit') {
                                                    if (!value.startsWith("ORD")) return "Must start with 'ORD'";
                                                    if (!/^ORD\d{11}$/.test(value)) return "Format: ORD + 11 digits Current: ${value.length}";
                                                }

                                                return true;
                                            }
                                        })}
                                        error={errors.orderNumber?.message}
                                    />
                                    <Input
                                        label="Order Date"
                                        type="date"
                                        icon={<Calendar className="w-4 h-4" />}
                                        required
                                        register={register("orderDate", {
                                            required: "Order date is required",
                                            validate: (value) => {
                                                const selectedDate = new Date(value);
                                                const today = new Date();
                                                // Reset time to midnight (00:00:00) to ensure "today" is valid
                                                today.setHours(0, 0, 0, 0);

                                                // Fix for timezone offset issues when parsing YYYY-MM-DD
                                                // (Optional but recommended: ensure selectedDate is treated as local time)
                                                const selectedDateWithTime = new Date(selectedDate.toDateString());

                                                return selectedDateWithTime >= today || "Order date cannot be in the past";
                                            }
                                        })}
                                        error={errors.orderDate?.message}
                                    />
                                    <Input
                                        label="Total Order Amount"
                                        type="number"
                                        icon={<IndianRupee className="w-4 h-4" />}
                                        placeholder="0.00"
                                        required
                                        register={register("orderAmount", {
                                            required: "Order amount is required",
                                            min: { value: 9, message: "Must be positive" }
                                        })}
                                        error={errors.orderAmount?.message}
                                    />
                                    <Input
                                        label="Your Less Price "
                                        type="number"
                                        icon={<IndianRupee className="w-4 h-4" />}
                                        placeholder="0.00"
                                        required
                                        register={register("lessPrice", {
                                            required: "Less price is required",
                                            min: { value: 0, message: "Must be positive" }
                                        })}
                                        error={errors.lessPrice?.message}
                                    />
                                    {/* <Select
                                        label="Mediator"
                                        required
                                        placeholder="Choose a mediator"
                                        options={[...mediatorOptions].sort((a, b) => a.label.localeCompare(b.label))}
                                        {...register("mediator", { required: "Mediator selection is required" })}
                                        error={errors.mediator?.message}
                                    /> */}
                                    {/* REPLACEMENT CODE FOR LINE 396 */}
                                    <Controller
                                        name="mediator"
                                        control={control}
                                        rules={{ required: "Mediator is required" }} // Add your validation rules here
                                        render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
                                            <SearchableSelect
                                                ref={ref}
                                                name="mediator"
                                                value={value}
                                                onChange={onChange}
                                                error={error?.message}
                                                options={[...mediatorOptions].sort((a, b) => a.label.localeCompare(b.label))} // Ensure this matches your variable name for mediator options
                                                //   min={0} // The error log mentioned a 'min' prop, ensure you keep it if needed
                                                placeholder="Select a mediator" // Add if needed
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <RadioGroup
                                label="Is this a replacement order?"
                                required
                                options={[
                                    { value: "no", label: "No" },
                                    { value: "yes", label: "Yes" }
                                ]}
                                register={register("isReplacement", { required: "Please select an option" })}
                                error={errors.isReplacement?.message}
                            />

                            {isReplacement === "yes" && (
                                <Input
                                    label="Old Order ID to Replace"
                                    placeholder="Enter old order ID"
                                    required
                                    register={register("oldOrderNumber", { required: "Old order ID is required" })}
                                    error={errors.oldOrderNumber?.message}
                                />
                            )}
                        </div>

                        {/* Deal Type & Rating Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Package className="w-4 h-4 text-green-600" />
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
                                    register={register("dealType", { required: "Please select deal type" })}
                                    error={errors.dealType?.message}
                                />
                                {watch("dealType") === "exchange" && (
                                    <Input
                                        label="Exchange Product"
                                        placeholder="Enter exchange product"
                                        required
                                        register={register("exchangeProduct", { required: "Exchange product is required" })}
                                        error={errors.exchangeProduct?.message}
                                    />
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                        <Star className="w-4 h-4 text-yellow-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Rating / Review</h3>
                                </div>

                                <RadioGroup
                                    label=""
                                    required
                                    options={availableSlots}
                                    register={register("ratingOrReview", { required: "Please select an option" })}
                                    error={errors.ratingOrReview?.message}
                                />
                                {selectedProduct && availableSlots.length === 0 && (
                                    <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
                                        No slots available for this product.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* File Uploads */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <Upload className="w-5 h-5 text-orange-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800">Required Documents</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FileUpload
                                    label="Order Screenshot"
                                    value={orderScreenshot}
                                    onChange={setOrderScreenshot}
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/user/orders")}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                disabled={!orderScreenshot || isSubmitting || (availableSlots.length === 0 && !!selectedProduct)}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Order"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OrderFormPage;