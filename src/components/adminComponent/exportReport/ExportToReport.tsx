
// import { Customers } from "@/modules/customer/customer.type";
// import { exportExcel } from "@/utils/exportExcel";
// import { exportPDF } from "@/utils/exportPdf";


import { formatCurrency } from "@/utils/FormatCurrency";
import { Customers } from "../customer/CustomerType";
import { handleExcelExport, handlePDFExport } from "../../ExportToReport";
import { Product } from "../products/ProductType";
import { PurchaseOrder } from "../purchase/PurchaseType";



// export const handleCustomerPDFExport = (data: Customers[]) => {
//     if (!data) return;
//     exportPDF({
//         type: "report",
//         title: "Customer Report",
//         meta: {
//             companyName: "Sport Wear Systems",
//             address: "Vientiane, Laos",
//             phone: "020 xxxx",
//             email: "SportWearSystems@gmail.com",
//         },

//         columns: [
//             { header: "No", key: "__index" },
//             { header: "Customer", key: "customerName" },
//         ],

//         data: data?.map((c, index) => ({
//             __index: index + 1,
//             customerName: c.customer_name,
//         })),
//     });
// };


// export const handleCustomerExcelExport = (data: Customers[]) => {
//     if (!data) return;

//     exportExcel({
//         fileName: "customer-report",
//         sheetName: "Customers",
//         columns: [
//             {
//                 header: "No",
//                 key: "__index",
//             },
//             {
//                 header: "Customer Name",
//                 key: "customer_name",
//             },
//         ],
//         data: data?.map((c, index) => ({
//             __index: index + 1,
//             customer_name: c.customer_name,
//         })),
//     });
// };





export const handleProductPDFExport = (products: Product[]) => {
    handlePDFExport({
        title: "Product Report",
        fileName: "product-report",
        columns: [
            {
                header: "Code",
                key: "product_code",
            },
            {
                header: "Product",
                key: "product_name",
            },
            {
                header: "Stock",
                key: "stock_qty",
            },
            {
                header: "Sale Price",
                key: "sale_price",
            },
        ],

        data: products.map((c, index) => ({
            product_code: c.product_code,
            product_name: c.product_name,
            stock_qty: c.stock_qty,
            sale_price: formatCurrency(c.sale_price),
        }))
    });
};

export const handleProductExcelExport = (products: Product[]) => {
    handleExcelExport({
        title: "Product Report",
        fileName: "product-report",
        sheetName: "Products",
        columns: [
            {
                header: "Code",
                key: "product_code",
            },
            {
                header: "Product",
                key: "product_name",
            },
            {
                header: "Stock",
                key: "stock_qty",
            },
            {
                header: "Sale Price",
                key: "sale_price",
            },
        ],

        data: products.map((c, index) => ({
            product_code: c.product_code,
            product_name: c.product_name,
            stock_qty: c.stock_qty,
            sale_price: formatCurrency(c.sale_price),
        }))
    });

}

export const handleCustomerPDFExport = (customers: Customers[]) => {
    handlePDFExport({
        title: "Customer Report",
        fileName: "customer-report",
        columns: [
            {
                header: "No",
                key: "__index",
            },
            {
                header: "Customer Name",
                key: "customer_name",
            },
        ],

        data: customers.map((c, index) => ({
            __index: index + 1,
            customer_name: c.customer_name,
        })),
    });
};

export const handleCustomerExcelExport = (customers: Customers[]) => {
    handleExcelExport({
        title: "Customer Report",
        fileName: "customer-report",
        sheetName: "Customers",
        columns: [
            {
                header: "No",
                key: "__index",
            },
            {
                header: "Customer Name",
                key: "customer_name",
            },
        ],

        data: customers.map((c, index) => ({
            __index: index + 1,
            customer_name: c.customer_name,
        })),
    });
};


export const handlePurchasePDFExport = (purchases: PurchaseOrder[]) => {
    handlePDFExport({
        title: "Purchase Report",
        fileName: "purchase-report",
        columns: [
            {
                header: "No",
                key: "__index",
            },
            {
                header: "Purchase Code",
                key: "purchase_code",
            },
            {
                header: "Supplier",
                key: "supplier_name",
            },
            {
                header: "Amount",
                key: "amount",
            },
        ],

        data: purchases.map((c, index) => ({
            __index: index + 1,
            purchase_code: c.purchase_code,
            supplier_name: c.supplier?.supplier_name,
            amount: c.total_amount,

        })),
    });
};