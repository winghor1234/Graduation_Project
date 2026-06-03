
import { Customers } from "@/modules/customer/customer.type";
import { exportExcel } from "@/utils/exportExcel";
import { exportPDF } from "@/utils/exportPdf";



export const handleCustomerPDFExport = (data: Customers[]) => {
    if (!data) return;
    exportPDF({
        type: "report",
        title: "Customer Report",
        meta: {
            companyName: "Sport Wear Systems",
            address: "Vientiane, Laos",
            phone: "020 xxxx",
            email: "SportWearSystems@gmail.com",
        },

        columns: [
            { header: "No", key: "__index" },
            { header: "Customer", key: "customerName" },
        ],

        data: data?.map((c, index) => ({
            __index: index + 1,
            customerName: c.customer_name,
        })),
    });
};


export const handleCustomerExcelExport = (data: Customers[]) => {
    if (!data) return;

    exportExcel({
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
        data: data?.map((c, index) => ({
            __index: index + 1,
            customer_name: c.customer_name,
        })),
    });
};
