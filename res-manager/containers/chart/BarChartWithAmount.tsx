import { Bar } from "react-chartjs-2";

import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
import useGetItemByAmount from "hooks/major-group/useGetItemByAmount";

Chart.register(CategoryScale, LinearScale, BarElement);

const BarChartWithAmount = () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const day = new Date().getDate();
    const { data, isLoading } = useGetItemByAmount(
        `${year}/${month}/01 00:00:00`,
        `${year}/${month}/${day} 23:59:59`
    );

    if (isLoading) {
        return null;
    }
    return (
        <Bar
            data={{
                labels: data?.item
                    ?.filter((x) => x.checkdetails_aggregate?.aggregate?.sum?.amount)
                    .sort(
                        (a, b) =>
                            b.checkdetails_aggregate.aggregate?.sum?.amount -
                            a.checkdetails_aggregate.aggregate?.sum?.amount
                    )
                    .slice(0, 5)
                    .map((x) => x.name),
                datasets: [
                    {
                        label: "Số tiền",
                        indexAxis: "y" as "x" | "y",
                        data: data?.item
                            ?.filter((x) => x.checkdetails_aggregate?.aggregate?.sum?.amount)
                            .sort(
                                (a, b) =>
                                    b.checkdetails_aggregate.aggregate?.sum?.amount -
                                    a.checkdetails_aggregate.aggregate?.sum?.amount
                            )
                            .slice(0, 5)
                            .map((x) => x.checkdetails_aggregate?.aggregate?.sum?.amount || 0),
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                            "rgba(255, 205, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(201, 203, 207, 0.2)",
                        ],
                        borderColor: [
                            "rgb(255, 99, 132)",
                            "rgb(255, 159, 64)",
                            "rgb(255, 205, 86)",
                            "rgb(75, 192, 192)",
                            "rgb(54, 162, 235)",
                            "rgb(153, 102, 255)",
                            "rgb(201, 203, 207)",
                        ],
                        borderWidth: 1,
                    },
                ],
            }}
            options={{
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        align: "start",
                        text: "Top 5 sản phẩm bán chạy nhất theo số tiền",
                        font: {
                            size: 24,
                        },
                    },
                },
            }}
        />
    );
};

export default BarChartWithAmount;
