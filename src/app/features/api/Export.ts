import axiosInstance from "@/lib/axiosInstance";

export const exportReportApi = {
  getExportReport: async (params: {
    reportType?: string;
    period?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const res = await axiosInstance.get("/export", {
      params,
    });

    return res.data;
  },
};
