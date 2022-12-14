import React from "react";
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    SubTitle,
    Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import useGetBillByTime from "hooks/dashboard/useGetBillByTime";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, SubTitle, Tooltip);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "top" as const,
        },
        title: {
            display: true,
            text: "Biểu đồ tổng quan doanh thu",
            align: "start" as "start" | "end" | "center",
            font: {
                size: 24,
            },
        },
        subtitle: {
            display: true,
            text: "Nhấn vào bất cứ điểm nào trên biểu đồ để xem chi tiết",
            align: "start" as "start" | "end" | "center",
            font: {
                size: 18,
            },
            padding: {
                bottom: 30,
            },
        },
    },
};

const labels = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"];

export const LineChartYear = () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const { data: t1 } = useGetBillByTime(`${year}/01/01 00:00:00`, `${year}/01/31 23:59:59`, 1);
    const { data: t2 } = useGetBillByTime(`${year}/02/01 00:00:00`, `${year}/02/28 23:59:59`, 2);
    const { data: t3 } = useGetBillByTime(`${year}/03/01 00:00:00`, `${year}/03/31 23:59:59`, 3);
    const { data: t4 } = useGetBillByTime(`${year}/04/01 00:00:00`, `${year}/04/30 23:59:59`, 4);
    const { data: t5 } = useGetBillByTime(`${year}/05/01 00:00:00`, `${year}/05/31 23:59:59`, 5);
    const { data: t6 } = useGetBillByTime(`${year}/06/01 00:00:00`, `${year}/06/30 23:59:59`, 6);
    const { data: t7 } = useGetBillByTime(`${year}/07/01 00:00:00`, `${year}/07/31 23:59:59`, 7);
    const { data: t8 } = useGetBillByTime(`${year}/08/01 00:00:00`, `${year}/08/31 23:59:59`, 8);
    const { data: t9 } = useGetBillByTime(`${year}/09/01 00:00:00`, `${year}/09/30 23:59:59`, 9);
    const { data: t10 } = useGetBillByTime(`${year}/10/01 00:00:00`, `${year}/10/31 23:59:59`, 10);
    const { data: t11 } = useGetBillByTime(`${year}/11/01 00:00:00`, `${year}/11/30 23:59:59`, 11);
    const { data: t12 } = useGetBillByTime(`${year}/12/01 00:00:00`, `${year}/12/31 23:59:59`, 12);
    return (
        <Line
            options={options}
            data={{
                labels,
                datasets: [
                    {
                        data: [
                            t1?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t2?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t3?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t4?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t5?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t6?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t7?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t8?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t9?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t10?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t11?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t12?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                        ].filter((_, i) => i < month),
                        borderColor: "rgb(53, 162, 235)",
                        backgroundColor: "rgba(53, 162, 235, 0.5)",
                    },
                ],
            }}
        />
    );
};
