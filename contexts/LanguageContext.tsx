"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

type LanguageContextType = {
    language: "en" | "ar";
    setLanguage: (lang: "en" | "ar") => void;
    t: (key: string, replacements?: Record<string, string | number>) => string;
};

const translations: Record<"en" | "ar", Record<string, any>> = { en, ar };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<"en" | "ar">("ar");

    useEffect(() => {
        document.documentElement.lang = language;
        document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    }, [language]);

    const t = (key: string, replacements?: Record<string, string | number>): string => {
        const keys = key.split(".");
        let value: any = translations[language];
        for (const k of keys) {
            value = value?.[k];
        }
        if (value && replacements) {
            Object.entries(replacements).forEach(([placeholder, replacement]) => {
                value = value.replace(`{${placeholder}}`, String(replacement));
            });
        }
        return typeof value === "string" ? value :  key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            <div className={`${language === "ar" ? "ar" : "en"}`}>{children}</div>
        </LanguageContext.Provider>
    );
};


















// "use client";

// import { assert, error } from "console";
// import { e } from "nuqs/dist/serializer-D6QaciYt";
// import React, { createContext, useContext, useState, useEffect } from "react";

// type LanguageContextType = {
//     language: "en" | "ar";
//     setLanguage: (lang: "en" | "ar") => void;
//     t: (key: string) => string;
// };

// const LanguageContext = createContext<LanguageContextType | undefined>(
//     undefined
// );

// export const useLanguage = () => {
//     const context = useContext(LanguageContext);
//     if (!context) {
//         throw new Error("useLanguage must be used within a LanguageProvider");
//     }
//     return context;
// };

// export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
//     children,
// }) => {
//     const [language, setLanguage] = useState<"en" | "ar">("ar");

//     useEffect(() => {
//         document.documentElement.lang = language;
//         document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
//     }, [language]);

//     const translations = {
//         en: {
//             dashboard: "Dashboard",
//             hotels: "Hotels",
//             rooms: "Rooms",
//             services: "Services",
//             products: "Products",
//             stores: "Stores",
//             orders: "Orders",
//             manage_orders: "Manage Orders",
//             edit_status: "Edit Status",
//             edit_status_description: "Edit the status of the order.",
//             select_status: "Select a status",
//             assign_driver: "Assign Driver",
//             assign_driver_title: "Assign Driver",
//             assign_driver_description: "Assign a driver to the order.",
//             select_driver: "Select a driver",
//             vendors: "Vendors",
//             admins: "Admins",
//             store: "Store",
//             settings: "Settings",
//             login: "Login",
//             email: "Email",
//             password: "Password",
//             remember_me: "Remember me",
//             forgot_password: "Forgot password?",
//             search: "Search...",
//             total_revenue: "Total Revenue",
//             bookings: "Bookings",
//             active_hotels: "Active Hotels",
//             active_services: "Active Services",
//             add_room: "Add Room",
//             add_service: "Add Service",
//             add_product: "Add Product",
//             add_vendor: "Add Vendor",
//             add_admin: "Add Admin",
//             add_new: "Add New",
//             edit: "Edit",
//             delete: "Delete",
//             edit_admin: "Edit Admin",
//             confirm_delete_admin: "Are you sure you want to delete this admin?",
//             admin_created: "Admin created successfully",
//             admin_updated: "Admin updated successfully",
//             admin_deleted: "Admin deleted successfully",
//             submitting: "Submitting...",
//             submit: "Submit",
//             select_option: "Select an option",
//             required_field: "This field is required",
//             my_account: "My Account",
//             profile: "Profile",
//             logout: "Logout",
//             name: "Name",
//             description: "Description",
//             price: "Price",
//             stock: "Stock",
//             category: "Category",
//             status: "Status",
//             customer: "Customer",
//             date: "Date",
//             total: "Total",
//             phone: "Phone",
//             phone_number: "Phone Number",
//             phone_number_withcode: "Phone Number (with country code)",
//             role: "Role",
//             last_login: "Last Login",
//             select_hotel: "Select a hotel",
//             select_store: "Select a store",
//             edit_order: "Edit Order",
//             login_success: "Login successful",
//             logging_in: "Logging in...",
//             loading: "Loading...",

//             //success
//             add_success: "Added successfully",
//             update_success: "Updated successfully",
//             delete_success: "Deleted successfully",

//             //Errors
//             error_delete: "Failed to delete, please try again later.",
//             error_title: "Oops! Something went wrong.",
//             error_message: "Something went wrong, please try again later.",
//             error_place_order: "Failed to place order, please try again later.",
//             error_ongoing_order: "You have an ongoing order. Please complete it first.",
//             errors.fetch: "Failed to fetch data, please try again later.",
//             error_invalid_room_uuid: "Invalid Room Id.",
//             ERROR_CITY_CONFLICT: "City already exists for this service",
//             error_service_not_found: "Service not found.",
//             CLIENT_ALREADY_EXISTS: "A client with this name already exists.",
//             ROOM_ALREADY_EXISTS: "A room with this name already exists.",
//             CITY_ALREADY_EXISTS: "A city with this name already exists in this country.",
//             CITY_SERVICE_NOT_FOUND: "City not found for this service.",
//             CITY_CONFLICT: "City already exists for this service.",
//             SLUG_CONFLICT: "Slug already exists for this service.",
//             error_update: "An error occurred during the update. Please try again later.",
//             retry_button: "Retry",

//             go_home: "Go back to Home",
//             page_not_found_title: "Page Not Found",
//             NotFound_title: "404",
//             NotFound_message: "Oops! The page you are looking for doesn't exist.",

//             //store
//             checkout: "Checkout",
//             your_cart_is_empty: "Your cart is empty.",
//             your_cart: "Your Cart",
//             quantity: "Quantity",
//             go_back_to_store: "Back to Store",

//             remove: "Remove",
//             select_payment_method: "Select Payment Method",
//             credit_card: "Credit/Debit Card",
//             cash_on_delivery: "Cash on Delivery",
//             digital_wallet: "Digital Wallet",
//             confirm_purchase: "Confirm Purchase",
//             store_name: "Store Name",
//             store_description: "Store Description",
//             store_image: "Store Image",
//             store_banner: "Store Banner",
//             store_address: "Store Address",
//             //Order Success
//             order_successful: "Order Successful",
//             order_success_message: "Your order has been placed successfully! Thank you for shopping with us.",
//             order_confirmed_message: "Your order has been confirmed and is being processed.",
//             back_to_home: "Back to Home",
//             view_order: "View Order",
//             order_now: "Order Now",
//             orders_page: "Orders Page",
//             delivery_orders: "Delivery Orders",
//             service_orders: "Service Orders",
//             pending: "Pending",
//             pickup: "Pickup",
//             on_way: "On the Way",
//             completed: "Completed",
//             canceled: "Canceled",
          
//             //hotels
//             hotel_list: "Hotel List",
//             manage_hotels: "Manage Hotels",
//             hotel_name: "Hotel Name",
//             city: "City",
//             created_at: "Created At",
//             manage_rooms: "Manage Rooms",
//             add_hotel_title: "Add Hotel",
//             edit_hotel_title: "Edit Hotel",
//             hotel_name_placeholder: "Enter the hotel name",
//             address: "Address",
//             hotel_common.placeholders.address: "Enter the hotel address",
//             country: "Country",
//             hotel_city: "City",
//             hotel_common.locationUrl: "Location URL",
//             hotel_common.placeholders.locationUrl: "Enter the Google Maps URL",
//             //rooms
//             room_list: "Room List",
//             room_number: "Room Number",
//             room_number_placeholder: "Enter the room number",
//             room_type: "Room Type",
//             room_type_placeholder: "Enter the room type",
//             qr_code_title: "QR Code",
//             qr_code_description: "Scan the QR code to view the room details",
//             view_qr: "View QR Code",
//             //section
//             section: "Section",
//             section_list: "Section List",
//             section_name: "Section Name",

//             //vendors
//             vendor: "Vendor",
//             vendor_list: "Vendors List",
//             vendor_email: "Vendor's Email",
//             vendor_phone: "Phone Number",
//             vendor_city: "City",
//             add_new_vendor: "Add New Vendor",
//             manage_vendors: "Manage Vendors",
//             no_changes_made: "No changes made",

//             //drivers
//             driver_list: "Driver List",
//             driver_name: "Driver Name",
//             driver_phone: "Phone Number",
//             driver_city: "City",
//             new_driver: "Add New Driver",
//             manage_drivers: "Manage Drivers",
//             //service
//             edit_service: "Edit Service",
//             service_name: "Service Title",
//             service_name_placeholder: "Enter Service title",
//             service_description: "Service Description",
//             service_description_placeholder: "Enter Service description",
//             //delete model
//             common.delete_confirmation_title: "Delete Confirmation",
//             common.delete_confirmation_description: "Are you sure you want to delete this entity?",
//             confirm: "Confirm",
//             //validation
//             common.validation.required: "This field is required",
            
//             create: "Create",
//             save_changes: "Save Changes",
//             cancel: "Cancel",
//             edit_item: "Edit",
//             delete_item: "Delete",
        
//         },
//         ar: {
//             dashboard: "لوحة التحكم",
//             hotels: "الفنادق",
//             rooms: "الغرف",
//             services: "الخدمات",
//             products: "المنتجات",
//             stores: "المتاجر",
//             orders: "الطلبات",
//             manage_orders: "ادارة الطلبات",
//             edit_status: "تعديل الحالة",
//             edit_status_description: 'تعديل حالة الطلبات القائمة',
//             select_status: 'اختيار الحالة',
//             assign_driver: "تعيين سائق",
//             assign_driver_title: "تعيين السائق",
//             assign_driver_description: "تعيين سائق للطلب",
//             select_driver: "اختيار السائق",
//             vendors: "الموردون",
//             store: "المتجر",
//             admins: "المسؤولون",
//             settings: "الإعدادات",
//             login: "تسجيل الدخول",
//             email: "البريد الإلكتروني",
//             password: "كلمة المرور",
//             common.placeholders.password: "ادخل كلمة المرور",
//             remember_me: "تذكرني",
//             forgot_password: "نسيت كلمة المرور؟",
//             search: "بحث...",
//             total_revenue: "إجمالي الإيرادات",
//             bookings: "الحجوزات",
//             active_hotels: "الفنادق النشطة",
//             active_services: "الخدمات النشطة",
//             hotel: "إضافة فندق",
//             add_room: "إضافة غرفة",
//             add_service: "إضافة خدمة",
//             add_product: "إضافة منتج",
//             add_vendor: "إضافة مورد",
//             add_admin: "إضافة مسؤول",
//             add_new: "اضافة",

//             edit: "تعديل",
//             delete: "حذف",
//             edit_admin: "تعديل المسؤول",
//             confirm_delete_admin: "هل أنت متأكد أنك تريد حذف هذا المسؤول؟",
//             admin_created: "تم إنشاء المسؤول بنجاح",
//             admin_updated: "تم تحديث المسؤول بنجاح",
//             admin_deleted: "تم حذف المسؤول بنجاح",
//             submitting: "جاري الإرسال...",
//             submit: "إرسال",
//             select_option: "اختر خيارًا",
//             required_field: "هذا الحقل مطلوب",
//             my_account: "حسابي",
//             profile: "الملف الشخصي",
//             logout: "تسجيل الخروج",
//             name: "الاسم",
//             description: "الوصف",
//             price: "السعر",
//             stock: "المخزون",
//             category: "الفئة",
//             status: "الحالة",
//             customer: "العميل",
//             date: "التاريخ",
//             total: "الإجمالي",
//             phone: "الجوال",
//             phone_number: "رقم الجوال",
//             phone_number_placeholder: "ادخل رقم الجوال",
//             role: "الدور",
//             last_login: "آخر تسجيل دخول",
//             select_hotel: "اختر فندقًا",
//             select_store: "اختر متجرًا",
//             edit_order: "تعديل الطلب",
//             login_success: "تم تسجيل الدخول بنجاح",
//             logging_in: "جاري تسجيل الدخول...",
//             loading: "جاري التحميل...",
//             loading_products: "جاري تحميل المنتجات...",
            
//             //cart
//             empty_cart: "سلة فارغة",
//             add_items_to_continue: "اضافة عناصر للمتابعة",

//             no_changes_made: "لم تقم باضافة او تعديلات",

//             //Success
//             add_success: "تم الاضافة بنجاح",
//             update_success: "تم التحديث بنجاح",
//             delete_success: "تم الحذف بنجاح",

//             //errors
//             error_add: "حدث خطاء في الاضافة. يرجى المحاولة مرة أخرى لاحقًا.",
//             error_update: "حدث خطاء في التحديث. يرجى المحاولة مرة أخرى لاحقًا.",
//             error_delete: "حدث خطأ في الحذف. يرجى المحاولة مرة أخرى لاحقًا.",
            
//             ERROR_CITY_CONFLICT: "هذا المدنية مسجلة بالفعل",
//             error_title: "عذرًا! حدث خطأ ما.",
//             error_invalid_room_uuid: "رابط الغرفة غير صالح. يرجى المحاولة مرة أخرى لاحقًا.",
//             error_message: "حدث خطا غير متوقع. يرجى المحاولة مرة أخرى لاحقًا.",
//             errors.fetch: "حدث خطاء في جلب البيانات. يرجى المحاولة مرة أخرى لاحقًا.",
//             retry_button: "إعادة المحاولة",
//             error_place_order: "حدث خطاء في اتمام الطلب. يرجى المحاولة مرة أخرى لاحقًا.",
//             error_ongoing_order: "لديك طلب قائم بالفعل, يرجى اتمامه اولاً",
//             error_service_not_found: "الخدمة غير موجودة",
//             CLIENT_ALREADY_EXISTS: "يوجد عميل بهذا الاسم بالفعل.",
//             ROOM_ALREADY_EXISTS: "يوجد غرفة بهذا الاسم بالفعل.",
//             CITY_ALREADY_EXISTS: "يوجد مدينة بهذا الاسم بالفعل في هذه الدولة.",
//             CITY_SERVICE_NOT_FOUND: "الخدمة غير موجودة في هذه المدينة.",
//             CITY_CONFLICT: "هذه المدينة مسجلة بالفعل.",
//             service_list: "قائمة الخدمات",
//             go_home: "العودة إلى الصفحة الرئيسية",
//             page_not_found_title: "المعذرة !",
//             NotFound_title: "الصفحة غير موجودة",
//             NotFound_message: "عذرًا! الصفحة التي تبحث عنها غير موجودة.",
//             SLUG_CONFLICT: "معرف الخدمه مستخدم بالفعل.",
//             cities: "المدن",
//             service_slug: "معرف الخدمة",
//             service_slug_placeholder: "ادخل معرف الخدمة",
//             //store
//             checkout: "إتمام الشراء",
//             your_cart_is_empty: "سلتك فارغة.",
//             your_cart: "سلتك",
//             phone_number_withcode: "رقم الجوال مع مفتاح الدولة",
//             quantity: "الكمية",
//             remove: "حذف",
//             select_payment_method: "اختر طريقة الدفع",
//             credit_card: "بطاقة ائتمان/خصم",
//             cash_on_delivery: "الدفع عند الاستلام",
//             digital_wallet: "المحفظة الرقمية",
//             confirm_purchase: "تأكيد الشراء",  
             
//             add_store_title: "اضافة متجر",
//             edit_store_title: "تعديل متجر",
//             store_name: "اسم المتجر",
//             store_name_placeholder: "ادخل اسم المتجر",
//             store_description: "وصف المتجر",
//             store_description_placeholder: "ادخل وصف المتجر",
//             store_address: "عنوان المتجر",
//             store_image: "صورة المتجر",
//             store_banner: "خلفية المتجر",
//             //Delete model
//             common.delete_confirmation_title: "تاكيد الحذف",
//             common.delete_confirmation_description: "هل انت متاكد من حذف العنصر؟",
//             confirm: "تاكيد",
//             //orders
//             order_successful: "تم الطلب بنجاح",
//             order_success_message: "تم تقديم طلبك بنجاح! شكرًا لتسوقك معنا.",
//             order_confirmed_message: "تم تأكيد طلبك وهو الآن قيد التنفيذ.",
//             back_to_home: "العودة إلى الصفحة الرئيسية",
//             view_order: "عرض الطلب",
//             orders_page: "صفحة الطلبات",
//             delivery_orders: "طلبات التوصيل",
//             service_orders: "طلبات الخدمات",
//             PENDING: "قيد الانتظار",
//             PICKUP: "استلام",
//             ON_WAY: "في الطريق",
//             COMPLETED: "مكتمل",
//             CANCELED: "ملغي",
//             //services
//             order_now: "اطلب الان",

//             //hotels
//             hotel_list: "قائمة الفنادق",
//             manage_hotels: "إدارة الفنادق",
//             hotel_name: "اسم الفندق",
//             city: "المدينة",
//             created_at: "تاريخ الإنشاء",
//             manage_rooms: "إدارة الغرف",
//             // Add Hotel Page
//             add_hotel_title: "إضافة فندق",
//             edit_hotel_title: "تعديل فندق",
//             hotel_name_placeholder: "أدخل اسم الفندق",
//             address: "العنوان",
//             common.placeholders.address: "أدخل عنوان الفندق",
//             country: "البلد",
//             hotel_city: "المدينة",
//             common.locationUrl: "رابط الموقع",
//             common.placeholders.locationUrl: "أدخل رابط موقع Google Maps",
//             //room
//             room_list: "قائمة الغرف",
//             room_number: "رقم الغرفة",
//             room_number_placeholder: "ادخل رقم الغرفة",
//             room_type: "نوع الغرفة",
//             room_type_placeholder: "ادخل نوع الغرفة",
//             qr_code_title: "QrCode الخاص بالغرفه",
//             qr_code_description: "قم بمشاركة هذا الكود للدخول الى صفحة الغرفة",
//             view_qr: "اظهار الكود QR",
//             //section
//             section: "القسم",
//             section_list: "اقسام المتاجر",
//             section_name: "اسم القسم",

//             //vendors
//             vendor: "المورد",
//             vendor_list: "قائمة الموردين",
//             edit_vendor: "تعديل المورد",
//             vendor_email: "البريد الإلكتروني للمورد",
//             email_placeholder: "ادخل البريد الإلكتروني ",
//             vendor_phone: "رقم هاتف المورد",
//             vendor_city: "المدينة",
//             add_new_vendor: "إضافة مورد جديد",
//             manage_vendors: "إدارة الموردين",
//             failed_fetch_vendors: "فشل في جلب بيانات الموردين. يرجى المحاولة لاحقًا.",
//             //drivers
//             driver_list: "السائقين",
//             driver_name: "اسم السائق",
//             //service
//             edit_service: "تعديل الخدمة",
//             service_name: "اسم الخدمة ",
//             service_name_placeholder: "ادخل اسم الخدمة ",
//             service_description: "وصف الخدمه",
//             service_description_placeholder: "ادخل وصف الخدمة",
            
//             //validation
//             common.validation.required: "هذا الحقل مطلوب",
//             validation_min_length: "d",


//             create: "انشاء جديد",
//             save_changes: "حفظ التغييرات",
//             cancel: "الغاء",
//             edit_item: "تعديل",
//             delete_item: "حذف",

//         },
//     };

//     const t = (key: string) => {
//         return (
//             translations[language][key as keyof (typeof translations)["en"]] ||
//             key
//         );
//     };

//     return (
//         <LanguageContext.Provider value={{ language, setLanguage, t }}>
//         <div className={`${language === "ar" ? "ar" : "en"}`}>{children}</div>
// </LanguageContext.Provider>
//     );
// };
