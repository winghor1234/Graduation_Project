import { NextRequest, NextResponse } from "next/server"
import { ExportService } from "./export.service";
import { ExcelBuilder } from "./builders/excel.builder";
import { ExportColumns } from "./constants/exportColumns";
import { PdfBuilder } from "./builders/pdf.builder";


export class ExportController {

    static async ProductTop(req: NextRequest): Promise<NextResponse> {
        try {
            // get query params
            const { searchParams } = new URL(req.url);
            const startDate = searchParams.get("startDate");
            const endDate = searchParams.get("endDate");

            // get data from service
            const data = await ExportService.getProductsTop({ startDate, endDate });

            // check data
            if (!data || data.length === 0) {
                return NextResponse.json({ message: "Product not found" }, { status: 404 });
            }
            // console.log(data);

            // format export data
            const exportData = data.map((item) => ({
                productCode: item.product_code,
                productName: item.product_name,
                // Category: item.category?.category_name,
                // PurchasePrice: item.purchase_price,
                price: item.sale_price,
                ptock: item.stock_qty,
            }));

            // export excel
            return await ExcelBuilder.export({
                sheetName: "Top Product Report",
                columns: ExportColumns.products,
                data: exportData,
                fileName: "top-product-report"
            });

        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 }
            );
        }
    }


    // ===== PDF =====

    static async ProductTopPdf(
        req: NextRequest
    ): Promise<NextResponse> {

        try {

            const { searchParams } =
                new URL(req.url);

            const startDate =
                searchParams.get("startDate");

            const endDate =
                searchParams.get("endDate");

            const data =
                await ExportService
                    .getProductsTop({
                        startDate,
                        endDate
                    });

            if (!data?.length) {

                return NextResponse.json(
                    {
                        message:
                            "No data found"
                    },
                    {
                        status: 404
                    }
                );
            }

            const exportData =
                data.map((item) => ({

                    ProductCode:
                        item?.product_code,

                    ProductName:
                        item?.product_name,

                    SalePrice:
                        item?.sale_price,

                    Stock:
                        item?.stock_qty,

                    TotalSold:
                        item?.total_quantity
                }));

            return await PdfBuilder.export({

                title: "Top Product Report",

                columns:
                    ExportColumns.products,

                data:
                    exportData,

                fileName:
                    "top-product-report"
            });

        } catch (error) {

            console.error(error);

            return NextResponse.json(
                {
                    message:
                        "Internal Server Error"
                },
                {
                    status: 500
                }
            );
        }
    }
}