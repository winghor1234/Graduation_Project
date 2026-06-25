
import { formatCurrency } from "@/utils/FormatCurrency";
import { Customer } from "../customer/CustomerType";
import { handleExcelExport, handlePDFExport } from "../../ExportToReport";
import { Product } from "../products/ProductType";
import { PurchaseOrder } from "../purchase/PurchaseType";
import { Import } from "../import/ImportType";
import { formatDate } from "@/utils/FormatDate";
import { Sale } from "@/app/(admin)/report/saleQuantity/page";

// product start

export const handleProductPDFExport = (products: Product[]) => {
    handlePDFExport({
        title: "ລາຍງານສິນຄ້າ",
        fileName: "product-report",
        columns: [
            {
                header: "ລະຫັດ",
                key: "product_code",
            },
            {
                header: "ສິນຄ້າ",
                key: "product_name",
            },
            {
                header: "ຈຳນວນໃນສາງ",
                key: "stock_qty",
            },
            {
                header: "ລາຄາຂາຍ",
                key: "sale_price",
            },
        ],

        data: products.map((c, index) => ({
            product_code: c.product_code,
            product_name: c.product_name,
            stock_qty: c.variants[0].stock_qty,
            sale_price: formatCurrency(c.variants[0].sale_price),
        }))
    });
};

export const handleProductExcelExport = (products: Product[]) => {
    handleExcelExport({
        title: "ลາຍງານສິນຄ້າ",
        fileName: "product-report",
        sheetName: "Products",
        columns: [
            {
                header: "ລະຫັດ",
                key: "product_code",
            },
            {
                header: "ສິນຄ້າ",
                key: "product_name",
            },
            {
                header: "ຈຳນວນໃນສາງ",
                key: "stock_qty",
            },
            {
                header: "ລາຄາຂາຍ",
                key: "sale_price",
            },
        ],

        data: products.map((c, index) => ({
            product_code: c.product_code,
            product_name: c.product_name,
            stock_qty: c.variants[0].stock_qty,
            sale_price: formatCurrency(c.variants[0].sale_price),
        }))
    });

}


// Product end


// Customer start

export const handleCustomerPDFExport = (customers: Customer[]) => {
    handlePDFExport({
        title: "ລາຍງານລູກຄ້າ",
        fileName: "customer-report",
        columns: [
            { header: "ລຳດັບ", key: "__index" },
            { header: "ຊື່ລູກຄ້າ", key: "customer_name" },
            { header: "ເບີໂທ", key: "phone" },
            // { header: "ອີເມລ", key: "email" },
            { header: "ແຂວງ", key: "province" },
            { header: "ແຕ້ມສະສົມ", key: "point" },
            { header: "ຈຳນວນອໍເດີ", key: "total_orders" },
            { header: "ຍອດຊື້ອອນລາຍ", key: "total_order_amount" },
            { header: "ຈຳນວນຊື້ໜ້າຮ້ານ", key: "total_sales" },
            { header: "ຍອດຊື້ໜ້າຮ້ານ", key: "total_sale_amount" },
            { header: "ວັນທີສະໝັກ", key: "createdAt" },
        ],
        data: customers.map((c, index) => ({
            __index: index + 1,
            customer_name: c.customer_name,
            phone: c.phone,
            // email: c.email,
            province: c.province ?? "-",
            point: formatCurrency(c.point),
            total_orders: formatCurrency(c.orders?.length ?? 0),
            total_order_amount: formatCurrency(c.orders?.reduce((sum, o) => sum + (o.total_amount ?? 0), 0) ?? 0),
            total_sales: formatCurrency(c.sales?.length ?? 0),
            total_sale_amount: formatCurrency(c.sales?.reduce((sum, s) => sum + (s.total_amount ?? 0), 0) ?? 0),
            createdAt: formatDate(c.createdAt),
        })),
    });
};

export const handleCustomerExcelExport = (customers: Customer[]) => {
    handleExcelExport({
        title: "ລາຍງານລູກຄ້າ",
        fileName: "customer-report",
        sheetName: "Customers",
        columns: [
            { header: "ລຳດັບ", key: "__index" },
            { header: "ຊື່ລູກຄ້າ", key: "customer_name" },
            { header: "ເບີໂທ", key: "phone" },
            { header: "ອີເມລ", key: "email" },
            { header: "ແຂວງ", key: "province" },
            { header: "ແຕ້ມສະສົມ", key: "point" },
            { header: "ຈຳນວນອໍເດີ", key: "total_orders" },
            { header: "ຍອດຊື້ອອນລາຍ", key: "total_order_amount" },
            { header: "ຈຳນວນຊື້ໜ້າຮ້ານ", key: "total_sales" },
            { header: "ຍອດຊື້ໜ້າຮ້ານ", key: "total_sale_amount" },
            { header: "ວັນທີສະໝັກ", key: "createdAt" },
        ],
        data: customers.map((c, index) => ({
            __index: index + 1,
            customer_name: c.customer_name,
            phone: c.phone,
            email: c.email,
            province: c.province ?? "-",
            point: formatCurrency(c.point),
            total_orders: formatCurrency(c.orders?.length ?? 0),
            total_order_amount: formatCurrency(c.orders?.reduce((sum, o) => sum + (o.total_amount ?? 0), 0) ?? 0),
            total_sales: formatCurrency(c.sales?.length ?? 0),
            total_sale_amount: formatCurrency(c.sales?.reduce((sum, s) => sum + (s.total_amount ?? 0), 0) ?? 0),
            createdAt: formatDate(c.createdAt),
        })),
    });
};
// Customer end



// Purchase start

export const handlePurchasePDFExport = (purchases: PurchaseOrder[]) => {
    handlePDFExport({
        title: "ລາຍງານການສັ່ງຊື້",
        fileName: "purchase-report",
        columns: [
            {
                header: "ລຳດັບ",
                key: "__index",
            },
            {
                header: "ລະຫັດການສັ່ງຊື້",
                key: "purchase_code",
            },
            {
                header: "ຜູ້ສະໜອງ (Supplier)",
                key: "supplier_name",
            },
            {
                header: "ຍອດລວມ",
                key: "amount",
            },
            {
                header: "ວັນທີສັ່ງຊື້",
                key: "purchase_date",
            }
        ],

        data: purchases.map((c, index) => ({
            __index: index + 1,
            purchase_code: c.purchase_code,
            supplier_name: c.supplier?.supplier_name,
            amount: formatCurrency(c.total_amount ?? 0),
            purchase_date: formatDate(c.purchase_date),

        })),
    });
};

export const handlePurchaseExcelExport = (purchases: PurchaseOrder[]) => {
    handleExcelExport({
        title: "ລາຍງານການສັ່ງຊື້",
        fileName: "purchase-report",
        sheetName: "Purchases",
        columns: [
            {
                header: "ລຳດັບ",
                key: "__index",
            },
            {
                header: "ລະຫັດການສັ່ງຊື້",
                key: "purchase_code",
            },
            {
                header: "ຜູ້ສະໜອງ (Supplier)",
                key: "supplier_name",
            },
            {
                header: "ຍອດລວມ",
                key: "amount",
            },
        ],

        data: purchases.map((c, index) => ({
            __index: index + 1,
            purchase_code: c.purchase_code,
            supplier_name: c.supplier?.supplier_name,
            amount: formatCurrency(c.total_amount ?? 0),
            purchases_date: formatDate(c.purchase_date),

        })),
    });
};

// Purchase end


// Import start

export const handleImportPDFExport = (imports: Import[]) => {
    handlePDFExport({
        title: "ລາຍງານການນຳເຂົ້າ",
        fileName: "import-report",
        columns: [
            {
                header: "ລຳດັບ",
                key: "__index",
            },
            {
                header: "ລະຫັດການນຳເຂົ້າ",
                key: "import_code",
            },
            {
                header: "ຜູ້ສະໜອງ",
                key: "supplier_name",
            },
            {
                header: "ຍອດລວມ",
                key: "amount",
            },
        ],

        data: imports.map((c, index) => ({
            __index: index + 1,
            import_code: c.import_code,
            supplier_name: c.purchase?.supplier?.supplier_name,
            amount: formatCurrency(c.import_details.reduce((a, b) => a + b.cost_price * b.quantity, 0)),

        })),
    });
};


export const handleImportExcelExport = (imports: Import[]) => {
    handleExcelExport({
        title: "ລາຍງານການນຳເຂົ້າ",
        fileName: "import-report",
        sheetName: "Imports",
        columns: [
            {
                header: "ລຳດັບ",
                key: "__index",
            },
            {
                header: "ລະຫັດການນຳເຂົ້າ",
                key: "import_code",
            },
            {
                header: "ຜູ້ສະໜອງ",
                key: "supplier_name",
            },
            {
                header: "ຍອດລວມ",
                key: "amount",
            },
        ],

        data: imports.map((c, index) => ({
            __index: index + 1,
            import_code: c.import_code,
            supplier_name: c.purchase?.supplier?.supplier_name,
            amount: formatCurrency(c.import_details.reduce((a, b) => a + b.cost_price * b.quantity, 0)),

        })),
    });
};

// Import end


// sale quantity start

export const handleSalePDFExport = (sales: Sale[]) => {
    handlePDFExport({
        title: "ລາຍງານຈຳນວນການຂາຍ",
        fileName: "sale-quantity-report",
        columns: [
            { header: "ລຳດັບ", key: "__index" },
            { header: "ລູກຄ້າ", key: "customer" },
            { header: "ພະນັກງານຂາຍ", key: "employee" },
            { header: "ລາຍການສິນຄ້າ", key: "products" },
            { header: "ຈຳນວນລວມ", key: "quantity" },
            { header: "ວັນທີ", key: "date" },
            { header: "ຍອດລວມ", key: "amount" },
        ],
        data: sales.map((s, index) => ({
            __index: index + 1,
            customer: s.customer?.customer_name ?? "-",
            employee: s.employee?.employee_name ?? "-",
            products: s.sale_details?.map((d) => `${d.product?.product_name ?? "-"} x ${d.quantity}`).join(", ") ?? "-",
            quantity: s.sale_details?.reduce((sum, d) => sum + d.quantity, 0) ?? 0,
            date: formatDate(s.sale_date),
            amount: formatCurrency(s.total_amount ?? 0),
        })),
    });
};

// ================= EXCEL =================

export const handleSaleExcelExport = (sales: Sale[]) => {
    handleExcelExport({
        title: "ລາຍງານຈຳນວນການຂາຍ",
        fileName: "sale-quantity-report",
        sheetName: "Sales",
        columns: [
            { header: "ລຳດັບ", key: "__index" },
            { header: "ລູກຄ້າ", key: "customer" },
            { header: "ພະນັກງານຂາຍ", key: "employee" },
            { header: "ລາຍການສິນຄ້າ", key: "products" },
            { header: "ຈຳນວນລວມ (ຊິ້ນ)", key: "quantity" },
            { header: "ວັນທີ", key: "date" },
            { header: "ຍອດລວມ", key: "amount" },
        ],
        data: sales.map((s, index) => ({
            __index: index + 1,
            customer: s.customer?.customer_name ?? "-",
            employee: s.employee?.employee_name ?? "-",
            products: s.sale_details?.map((d) => `${d.product?.product_name ?? "-"} x${d.quantity}`).join(", ") ?? "-",
            quantity: s.sale_details?.reduce((sum, d) => sum + d.quantity, 0) ?? 0,
            date: formatDate(s.sale_date),
            amount: formatCurrency(s.total_amount) ?? 0,
        })),
    });
};


// sale quantity end


// revenue start


export const handleRevenuePDFExport = (sales: Sale[]) => {
    handlePDFExport({
        title: "ລາຍງານຈຳນວນການຂາຍ",
        fileName: "sale-quantity-report",
        columns: [
            { header: "ລຳດັບ", key: "__index" },
            { header: "ລູກຄ້າ", key: "customer" },
            { header: "ພະນັກງານຂາຍ", key: "employee" },
            { header: "ລາຍການສິນຄ້າ", key: "products" },
            { header: "ຈຳນວນລວມ (ຊິ້ນ)", key: "quantity" },
            { header: "ວັນທີ", key: "date" },
            { header: "ຍອດລວມ", key: "amount" },
        ],
        data: sales.map((s, index) => ({
            __index: index + 1,
            customer: s.customer?.customer_name ?? "-",
            employee: s.employee?.employee_name ?? "-",
            products: s.sale_details?.map((d) => `${d.product?.product_name ?? "-"} x${d.quantity}`).join(", ") ?? "-",
            quantity: s.sale_details?.reduce((sum, d) => sum + d.quantity, 0) ?? 0,
            date: formatDate(s.sale_date),
            amount: formatCurrency(s.total_amount) ?? 0,
        })),
    });
};


export const handleRevenueExcelExport = (sales: Sale[]) => {
    handleExcelExport({
        title: "ລາຍງານຈຳນວນການຂາຍ",
        fileName: "sale-quantity-report",
        sheetName: "Sales",
        columns: [
            { header: "ລຳດັບ", key: "__index" },
            { header: "ລູກຄ້າ", key: "customer" },
            { header: "ພະນັກງານຂາຍ", key: "employee" },
            { header: "ລາຍການສິນຄ້າ", key: "products" },
            { header: "ຈຳນວນລວມ (ຊິ້ນ)", key: "quantity" },
            { header: "ວັນທີ", key: "date" },
            { header: "ຍອດລວມ", key: "amount" },
        ],
        data: sales.map((s, index) => ({
            __index: index + 1,
            customer: s.customer?.customer_name ?? "-",
            employee: s.employee?.employee_name ?? "-",
            products: s.sale_details?.map((d) => `${d.product?.product_name ?? "-"} x${d.quantity}`).join(", ") ?? "-",
            quantity: s.sale_details?.reduce((sum, d) => sum + d.quantity, 0) ?? 0,
            date: formatDate(s.sale_date),
            amount: formatCurrency(s.total_amount) ?? 0,
        })),
    });
};

// revenue end
