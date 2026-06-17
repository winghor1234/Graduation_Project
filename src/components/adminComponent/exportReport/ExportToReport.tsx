
import { formatCurrency } from "@/utils/FormatCurrency";
import { Customers } from "../customer/CustomerType";
import { handleExcelExport, handlePDFExport } from "../../ExportToReport";
import { Product } from "../products/ProductType";
import { PurchaseOrder } from "../purchase/PurchaseType";
import { Import } from "../import/ImportType";

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
            stock_qty: c.stock_qty,
            sale_price: formatCurrency(c.sale_price),
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
            stock_qty: c.stock_qty,
            sale_price: formatCurrency(c.sale_price),
        }))
    });

}


// Product end


// Customer start

export const handleCustomerPDFExport = (customers: Customers[]) => {
    handlePDFExport({
        title: "ລາຍງານຂໍ້ມູນລູກຄ້າ",
        fileName: "customer-report",
        columns: [
            {
                header: "ລຳດັບ",
                key: "__index",
            },
            {
                header: "ຊື່ລູກຄ້າ",
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
        title: "ລາຍງານຂໍ້ມູນລູກຄ້າ",
        fileName: "customer-report",
        sheetName: "Customers",
        columns: [
            {
                header: "ລຳດັບ",
                key: "__index",
            },
            {
                header: "ຊື່ລູກຄ້າ",
                key: "customer_name",
            },
        ],

        data: customers.map((c, index) => ({
            __index: index + 1,
            customer_name: c.customer_name,
        })),
    });
};

// Customer end



// Purchase start

export const handlePurchasePDFExport = (purchases: PurchaseOrder[]) => {
    handlePDFExport({
        title: "ລາຍງານການຈັດຊື້",
        fileName: "purchase-report",
        columns: [
            {
                header: "ລຳດັບ",
                key: "__index",
            },
            {
                header: "ລະຫັດການຈັດຊື້",
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
            amount: c.total_amount,

        })),
    });
};

export const handlePurchaseExcelExport = (purchases: PurchaseOrder[]) => {
    handleExcelExport({
        title: "ລາຍງານການຈັດຊື້",
        fileName: "purchase-report",
        sheetName: "Purchases",
        columns: [
            {
                header: "ລຳດັບ",
                key: "__index",
            },
            {
                header: "ລະຫັດການຈັດຊື້",
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
            amount: c.total_amount,

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
            amount: c.import_details?.reduce((a, b) => a + b.cost_price * b.quantity, 0),

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
            amount: c.import_details?.reduce((a, b) => a + b.cost_price * b.quantity, 0),

        })),
    });
};

// Import end
