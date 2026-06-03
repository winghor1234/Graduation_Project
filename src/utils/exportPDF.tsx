import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

type InvoiceItem = {
    name: string;
    qty: number;
    price: number;
    total: number;
};

type InvoiceData = {
    invoiceNumber: string;
    date: string;
    customerName: string;
    phone: string;
    subtotal: number;
    vat: number;
    grandTotal: number;
    items: InvoiceItem[];
};

// ================= CUSTOM TYPE =================
type jsPDFWithPlugin = jsPDF & {
    lastAutoTable: {
        finalY: number;
    };
};

// ================= EXPORT FUNCTION =================
export const exportInvoicePDF = (
    invoice: InvoiceData
) => {
    // ================= CREATE PDF =================
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    // ================= COMPANY =================
    doc.setFontSize(24);
    doc.text("My Company", 14, 20);

    doc.setFontSize(11);

    doc.text(
        "Address: Vientiane, Laos",
        14,
        28
    );

    doc.text(
        "Phone: 020 99999999",
        14,
        34
    );

    doc.text(
        "Email: company@gmail.com",
        14,
        40
    );

    // ================= INVOICE TITLE =================
    doc.setFontSize(22);

    doc.text("INVOICE", 150, 20);

    doc.setFontSize(11);

    doc.text(
        `Invoice No: ${invoice.invoiceNumber}`,
        140,
        30
    );

    doc.text(
        `Date: ${dayjs(invoice.date).format(
            "DD/MM/YYYY"
        )}`,
        140,
        37
    );

    // ================= CUSTOMER =================
    doc.setFontSize(14);

    doc.text(
        "Customer Information",
        14,
        55
    );

    doc.setFontSize(11);

    doc.text(
        `Customer Name: ${invoice.customerName}`,
        14,
        63
    );

    doc.text(
        `Phone Number: ${invoice.phone}`,
        14,
        70
    );

    // ================= TABLE =================
    autoTable(doc, {
        startY: 80,

        head: [
            [
                "No",
                "Item",
                "Quantity",
                "Price",
                "Total",
            ],
        ],

        body: invoice.items.map(
            (item, index) => [
                index + 1,
                item.name,
                item.qty,
                `$${item.price.toFixed(2)}`,
                `$${item.total.toFixed(2)}`,
            ]
        ),

        styles: {
            fontSize: 10,
            cellPadding: 3,
            overflow: "linebreak",
        },

        headStyles: {
            fillColor: [41, 128, 185],
            textColor: [255, 255, 255],
            fontStyle: "bold",
        },

        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },

        margin: {
            left: 14,
            right: 14,
        },

        didDrawPage: (data) => {
            // ================= FOOTER =================
            const pageCount = (doc.internal as any).getNumberOfPages();

            doc.setFontSize(10);

            doc.text(
                `Page ${data.pageNumber} of ${pageCount}`,
                170,
                290
            );
        },
    });

    // ================= FIX TYPESCRIPT ERROR =================
    const pdfDoc = doc as jsPDFWithPlugin;

    const finalY =
        pdfDoc.lastAutoTable.finalY + 15;

    // ================= SUMMARY =================
    doc.setFontSize(12);

    doc.text(
        `Subtotal: $${invoice.subtotal.toFixed(
            2
        )}`,
        140,
        finalY
    );

    doc.text(
        `VAT: $${invoice.vat.toFixed(2)}`,
        140,
        finalY + 8
    );

    doc.setFontSize(14);

    doc.text(
        `Grand Total: $${invoice.grandTotal.toFixed(
            2
        )}`,
        140,
        finalY + 18
    );

    // ================= SIGNATURE =================
    doc.setFontSize(12);

    doc.text("Customer Signature", 20, 250);

    doc.line(20, 255, 80, 255);

    doc.text("Authorized Signature", 120, 250);

    doc.line(120, 255, 180, 255);

    // ================= PRINT SUPPORT =================
    // doc.autoPrint();
    // window.open(doc.output("bloburl"));

    // ================= SAVE =================
    doc.save(
        `invoice-${invoice.invoiceNumber}.pdf`
    );
};