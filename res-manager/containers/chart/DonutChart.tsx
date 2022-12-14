import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Title, Legend } from "chart.js";
import useGetPM from "hooks/major-group/useGetPM";

Chart.register(ArcElement, Title);
const Donut = () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const day = new Date().getDate();
    const { data: dataPM, isLoading } = useGetPM(
        `${year}/${month}/01 00:00:00`,
        `${year}/${month}/${day} 23:59:59`
    );

    if (isLoading) {
        return null;
    }

    return (
        <>
            <Doughnut
                data={{
                    labels: dataPM?.paymentmethod?.map((x) => x.name),
                    datasets: [
                        {
                            data: dataPM?.paymentmethod?.map(
                                (x) => x.billpayments_aggregate?.aggregate?.count || 0
                            ),
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
                            hoverBorderWidth: 8,
                            hoverBorderColor: [
                                "rgb(255, 99, 132)",
                                "rgb(255, 159, 64)",
                                "rgb(255, 205, 86)",
                                "rgb(75, 192, 192)",
                                "rgb(54, 162, 235)",
                                "rgb(153, 102, 255)",
                                "rgb(201, 203, 207)",
                            ],
                        },
                    ],
                }}
                plugins={[Legend]}
                options={{
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: "top" as const,
                        },
                        title: {
                            display: true,
                            text: "Thông tin hình thức thanh toán",
                            align: "start",
                            font: {
                                size: 24,
                            },
                        },
                    },
                }}
            />
        </>
    );
};

export default Donut;
