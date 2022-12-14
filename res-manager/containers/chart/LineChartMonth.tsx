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

const labels: string[] = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
];

// const daysInMonth = (month: number, year: number) => {
//     // Use 1 for January, 2 for February, etc.
//     return new Date(year, month, 0).getDate();
// };

export const LineChartMonth = () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const day = new Date().getDate();

    const { data: t1 } = useGetBillByTime(
        `${year}/${month}/01 00:00:00`,
        `${year}/${month}/01 23:59:59`,
        101
    );
    const { data: t2 } = useGetBillByTime(
        `${year}/${month}/02 00:00:00`,
        `${year}/${month}/02 23:59:59`,
        102
    );
    const { data: t3 } = useGetBillByTime(
        `${year}/${month}/03 00:00:00`,
        `${year}/${month}/03 23:59:59`,
        103
    );
    const { data: t4 } = useGetBillByTime(
        `${year}/${month}/04 00:00:00`,
        `${year}/${month}/04 23:59:59`,
        104
    );
    const { data: t5 } = useGetBillByTime(
        `${year}/${month}/05 00:00:00`,
        `${year}/${month}/05 23:59:59`,
        105
    );
    const { data: t6 } = useGetBillByTime(
        `${year}/${month}/06 00:00:00`,
        `${year}/${month}/06 23:59:59`,
        106
    );
    const { data: t7 } = useGetBillByTime(
        `${year}/${month}/07 00:00:00`,
        `${year}/${month}/07 23:59:59`,
        107
    );
    const { data: t8 } = useGetBillByTime(
        `${year}/${month}/08 00:00:00`,
        `${year}/${month}/08 23:59:59`,
        108
    );
    const { data: t9 } = useGetBillByTime(
        `${year}/${month}/09 00:00:00`,
        `${year}/${month}/09 23:59:59`,
        109
    );
    const { data: t10 } = useGetBillByTime(
        `${year}/${month}/10 00:00:00`,
        `${year}/${month}/10 23:59:59`,
        110
    );
    const { data: t11 } = useGetBillByTime(
        `${year}/${month}/11 00:00:00`,
        `${year}/${month}/11 23:59:59`,
        111
    );
    const { data: t12 } = useGetBillByTime(
        `${year}/${month}/12 00:00:00`,
        `${year}/${month}/12 23:59:59`,
        112
    );
    const { data: t13 } = useGetBillByTime(
        `${year}/${month}/13 00:00:00`,
        `${year}/${month}/13 23:59:59`,
        113
    );
    const { data: t14 } = useGetBillByTime(
        `${year}/${month}/14 00:00:00`,
        `${year}/${month}/14 23:59:59`,
        114
    );
    const { data: t15 } = useGetBillByTime(
        `${year}/${month}/15 00:00:00`,
        `${year}/${month}/15 23:59:59`,
        115
    );
    const { data: t16 } = useGetBillByTime(
        `${year}/${month}/16 00:00:00`,
        `${year}/${month}/16 23:59:59`,
        116
    );
    const { data: t17 } = useGetBillByTime(
        `${year}/${month}/17 00:00:00`,
        `${year}/${month}/17 23:59:59`,
        117
    );
    const { data: t18 } = useGetBillByTime(
        `${year}/${month}/18 00:00:00`,
        `${year}/${month}/18 23:59:59`,
        118
    );
    const { data: t19 } = useGetBillByTime(
        `${year}/${month}/19 00:00:00`,
        `${year}/${month}/19 23:59:59`,
        119
    );
    const { data: t20 } = useGetBillByTime(
        `${year}/${month}/20 00:00:00`,
        `${year}/${month}/20 23:59:59`,
        120
    );
    const { data: t21 } = useGetBillByTime(
        `${year}/${month}/21 00:00:00`,
        `${year}/${month}/21 23:59:59`,
        121
    );
    const { data: t22 } = useGetBillByTime(
        `${year}/${month}/22 00:00:00`,
        `${year}/${month}/22 23:59:59`,
        122
    );
    const { data: t23 } = useGetBillByTime(
        `${year}/${month}/23 00:00:00`,
        `${year}/${month}/23 23:59:59`,
        123
    );
    const { data: t24 } = useGetBillByTime(
        `${year}/${month}/24 00:00:00`,
        `${year}/${month}/24 23:59:59`,
        124
    );
    const { data: t25 } = useGetBillByTime(
        `${year}/${month}/25 00:00:00`,
        `${year}/${month}/25 23:59:59`,
        125
    );
    const { data: t26 } = useGetBillByTime(
        `${year}/${month}/26 00:00:00`,
        `${year}/${month}/26 23:59:59`,
        126
    );
    const { data: t27 } = useGetBillByTime(
        `${year}/${month}/27 00:00:00`,
        `${year}/${month}/27 23:59:59`,
        127
    );
    const { data: t28 } = useGetBillByTime(
        `${year}/${month}/28 00:00:00`,
        `${year}/${month}/28 23:59:59`,
        128
    );
    const { data: t29 } = useGetBillByTime(
        `${year}/${month}/29 00:00:00`,
        `${year}/${month}/29 23:59:59`,
        129
    );
    const { data: t30 } = useGetBillByTime(
        `${year}/${month}/30 00:00:00`,
        `${year}/${month}/30 23:59:59`,
        130
    );
    const { data: t31 } = useGetBillByTime(
        `${year}/${month}/31 00:00:00`,
        `${year}/${month}/31 23:59:59`,
        131
    );

    const labelInMonth: string[] = labels.filter((_, i) => i < day);
    return (
        <Line
            options={options}
            data={{
                labels: labelInMonth,
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
                            t13?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t14?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t15?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t16?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t17?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t18?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t19?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t20?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t21?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t22?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t23?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t24?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t25?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t26?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t27?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t28?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t29?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t30?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                            t31?.bill_aggregate.aggregate?.sum?.totalamount || 0,
                        ].filter((_, i) => i < day),
                        borderColor: "rgb(53, 162, 235)",
                        backgroundColor: "rgba(53, 162, 235, 0.5)",
                    },
                ],
            }}
        />
    );
};
