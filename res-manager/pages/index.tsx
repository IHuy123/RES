import { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { CalendarToday as CalendarTodayIcon } from "@mui/icons-material";
import useGetBillByTime from "hooks/dashboard/useGetBillByTime";
import useGetBillByTimeWithRefund from "hooks/dashboard/useGetBillByTimeWithRefund";
import useGetBillByTimeWithClose from "hooks/dashboard/useGetBillByTimeWithClose";
import { LineChartYear } from "containers/chart/LineChartYear";
import DonutChart from "containers/chart/DonutChart";
import useGetBillMoneyByTimeWithRefund from "hooks/dashboard/useGetBillMoneyByTimeWithRefund";
import useGetCoverByTime from "hooks/dashboard/useGetCoverByTime";
import { LineChartMonth } from "containers/chart/LineChartMonth";
import { LineChartDay } from "containers/chart/LineChartDay";
import BarChartWithProduct from "containers/chart/BarChartWithProduct";
import BarChartWithAmount from "containers/chart/BarChartWithAmount";
import CRUDTable from "components/Table";
import useGetKK from "hooks/dashboard/useGetKK";
import CellTableTypography from "components/CellTableTypography";

const average = (arr: any) => arr.reduce((p: any, c: any) => p + c, 0) / arr.length;

const mm = (nn: string) => {
    const t = nn.substring(0, 8).split(":");
    return 3600 * +t[0] + 60 * +t[1] + +t[2];
};

const numberToTime = (x: number) => {
    return new Date(x * 1000).toISOString().substring(11, 19);
};

const Home: NextPage = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("manager-user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const day = new Date().getDate();
    const { data: totalBill } = useGetBillByTime(
        `${year}/${month}/01 00:00:00`,
        `${year}/${month}/${day} 23:59:59`
    );
    const { data: totalBillWithClose } = useGetBillByTimeWithClose(
        `${year}/${month}/01 00:00:00`,
        `${year}/${month}/${day} 23:59:59`
    );
    const { data: totalBillWithRefund } = useGetBillByTimeWithRefund(
        `${year}/${month}/01 00:00:00`,
        `${year}/${month}/${day} 23:59:59`
    );
    const { data: totalBillMoneyWithRefund } = useGetBillMoneyByTimeWithRefund(
        `${year}/${month}/01 00:00:00`,
        `${year}/${month}/${day} 23:59:59`
    );
    const { data: dataCover } = useGetCoverByTime(
        `${year}/${month}/01  00:00:00`,
        `${year}/${month}/${day} 23:59:59`
    );
    const { data: dataKK } = useGetKK(
        `${year}/${month}/01  00:00:00`,
        `${year}/${month}/${day} 23:59:59`
    );
    const [type, setType] = useState<"MONTH" | "DAY" | "YEAR">("DAY");
    const [type1, setType1] = useState<"MONTH" | "DAY" | "YEAR">("DAY");
    return (
        <Box p={1}>
            <Box
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
                alignItems="stretch"
                marginY={2}
                marginX={4}
            >
                <Box
                    sx={{
                        flexShrink: 0,
                        flexGrow: 1,
                        flexBasis: { lg: "25%", md: "50%", xs: "100%" },
                        paddingRight: { md: 5, xs: 0 },
                        cursor: "pointer",
                    }}
                    onClick={() => {}}
                >
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderLeft: ".25rem solid #4e73df",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            boxShadow: 6,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                flexGrow: 1,
                                rowGap: 1,
                            }}
                        >
                            <Typography
                                component="h2"
                                fontSize="18px"
                                fontWeight="700"
                                textTransform="uppercase"
                                color="#4e73df"
                                noWrap
                                pb={2}
                            >
                                {"Doanh thu"}
                            </Typography>
                            <Typography
                                component="h5"
                                fontSize="28px"
                                fontWeight="600"
                                lineHeight="24px"
                                color="#5a5c69"
                            >
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(
                                    totalBill?.bill_aggregate?.aggregate?.sum?.totalamount || 0
                                )}
                            </Typography>
                        </Box>
                        <CalendarTodayIcon
                            fontSize="large"
                            style={{
                                fontWeight: "900",
                                lineHeight: "32px",
                                color: "#dddfeb",
                            }}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        flexShrink: 0,
                        flexGrow: 1,
                        flexBasis: { lg: "25%", md: "50%", xs: "100%" },
                        paddingRight: { md: 5, xs: 0 },
                        cursor: "pointer",
                    }}
                    onClick={() => {}}
                >
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderLeft: ".25rem solid #4e73df",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            boxShadow: 6,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                flexGrow: 1,
                                rowGap: 1,
                            }}
                        >
                            <Typography
                                component="h2"
                                fontSize="18px"
                                fontWeight="700"
                                textTransform="uppercase"
                                color="#4e73df"
                                noWrap
                                pb={2}
                            >
                                {"Tổng tiền hoàn trả"}
                            </Typography>
                            <Typography
                                component="h5"
                                fontSize="28px"
                                fontWeight="600"
                                lineHeight="24px"
                                color="#5a5c69"
                            >
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(
                                    Math.abs(
                                        totalBillMoneyWithRefund?.bill_aggregate?.aggregate?.sum
                                            ?.totalamount || 0
                                    )
                                )}
                            </Typography>
                        </Box>
                        <CalendarTodayIcon
                            fontSize="large"
                            style={{
                                fontWeight: "900",
                                lineHeight: "32px",
                                color: "#dddfeb",
                            }}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        flexShrink: 0,
                        flexGrow: 1,
                        flexBasis: { lg: "25%", md: "50%", xs: "100%" },
                        paddingRight: { md: 5, xs: 0 },
                        cursor: "pointer",
                    }}
                    onClick={() => {}}
                >
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderLeft: ".25rem solid #4e73df",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            boxShadow: 6,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                flexGrow: 1,
                                rowGap: 1,
                            }}
                        >
                            <Typography
                                component="h2"
                                fontSize="18px"
                                fontWeight="700"
                                textTransform="uppercase"
                                color="#4e73df"
                                noWrap
                                pb={2}
                            >
                                {"Tổng hóa đơn đóng"}
                            </Typography>
                            <Typography
                                component="h5"
                                fontSize="28px"
                                fontWeight="600"
                                lineHeight="24px"
                                color="#5a5c69"
                            >
                                {totalBillWithClose?.bill_aggregate?.aggregate?.count || 0}
                            </Typography>
                        </Box>
                        <CalendarTodayIcon
                            fontSize="large"
                            style={{
                                fontWeight: "900",
                                lineHeight: "32px",
                                color: "#dddfeb",
                            }}
                        />
                    </Box>
                </Box>
            </Box>
            <Box
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
                alignItems="stretch"
                marginY={2}
                marginX={4}
            >
                <Box
                    sx={{
                        flexShrink: 0,
                        flexGrow: 1,
                        flexBasis: { lg: "25%", md: "50%", xs: "100%" },
                        paddingRight: { md: 5, xs: 0 },
                        cursor: "pointer",
                    }}
                    onClick={() => {}}
                >
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderLeft: ".25rem solid #4e73df",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            boxShadow: 6,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                flexGrow: 1,
                                rowGap: 1,
                            }}
                        >
                            <Typography
                                component="h2"
                                fontSize="18px"
                                fontWeight="700"
                                textTransform="uppercase"
                                color="#4e73df"
                                noWrap
                                pb={2}
                            >
                                {"Tổng hóa đơn trả"}
                            </Typography>
                            <Typography
                                component="h5"
                                fontSize="28px"
                                fontWeight="600"
                                lineHeight="24px"
                                color="#5a5c69"
                            >
                                {totalBillWithRefund?.bill_aggregate?.aggregate?.count || 0}
                            </Typography>
                        </Box>
                        <CalendarTodayIcon
                            fontSize="large"
                            style={{
                                fontWeight: "900",
                                lineHeight: "32px",
                                color: "#dddfeb",
                            }}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        flexShrink: 0,
                        flexGrow: 1,
                        flexBasis: { lg: "25%", md: "50%", xs: "100%" },
                        paddingRight: { md: 5, xs: 0 },
                        cursor: "pointer",
                    }}
                    onClick={() => {}}
                >
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderLeft: ".25rem solid #4e73df",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            boxShadow: 6,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                flexGrow: 1,
                                rowGap: 1,
                            }}
                        >
                            <Typography
                                component="h2"
                                fontSize="18px"
                                fontWeight="700"
                                textTransform="uppercase"
                                color="#4e73df"
                                noWrap
                                pb={2}
                            >
                                {"Tổng số khách mới"}
                            </Typography>
                            <Typography
                                component="h5"
                                fontSize="28px"
                                fontWeight="600"
                                lineHeight="24px"
                                color="#5a5c69"
                            >
                                {dataCover?.check_aggregate?.aggregate?.sum?.cover || 0}
                            </Typography>
                        </Box>
                        <CalendarTodayIcon
                            fontSize="large"
                            style={{
                                fontWeight: "900",
                                lineHeight: "32px",
                                color: "#dddfeb",
                            }}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        flexShrink: 0,
                        flexGrow: 1,
                        flexBasis: { lg: "25%", md: "50%", xs: "100%" },
                        paddingRight: { md: 5, xs: 0 },
                        cursor: "pointer",
                    }}
                    onClick={() => {}}
                >
                    <Box
                        sx={{
                            backgroundColor: "#fff",
                            padding: "20px",
                            borderLeft: ".25rem solid #4e73df",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            boxShadow: 6,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                flexGrow: 1,
                                rowGap: 1,
                            }}
                        >
                            <Typography
                                component="h2"
                                fontSize="18px"
                                fontWeight="700"
                                textTransform="uppercase"
                                color="#4e73df"
                                noWrap
                                pb={2}
                            >
                                {"Thời gian trung bình"}
                            </Typography>
                            <Typography
                                component="h5"
                                fontSize="28px"
                                fontWeight="600"
                                lineHeight="24px"
                                color="#5a5c69"
                            >
                                {numberToTime(
                                    average(
                                        dataKK?.search_articles?.map((x) => {
                                            return mm(x.averagetime) || 0;
                                        }) || [0]
                                    ) || 0
                                )}
                            </Typography>
                        </Box>
                        <CalendarTodayIcon
                            fontSize="large"
                            style={{
                                fontWeight: "900",
                                lineHeight: "32px",
                                color: "#dddfeb",
                            }}
                        />
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // flexWrap: "true",
                    flexDirection: "column",
                }}
            >
                <Box sx={{ width: "90%" }}>
                    <ButtonGroup
                        sx={{ float: "right" }}
                        variant="contained"
                        aria-label="outlined primary button group"
                    >
                        <Button onClick={() => setType("DAY")}>Ngày</Button>
                        <Button onClick={() => setType("MONTH")}>Tháng</Button>
                        <Button onClick={() => setType("YEAR")}>Năm</Button>
                    </ButtonGroup>
                    {type === "YEAR" ? (
                        <LineChartYear />
                    ) : type === "MONTH" ? (
                        <LineChartMonth />
                    ) : type === "DAY" ? (
                        <LineChartDay />
                    ) : null}
                </Box>
                <Box sx={{ height: 5 }}></Box>
                <Box sx={{ width: "90%", minHeight: 500 }}>
                    <DonutChart />
                </Box>
                <Box sx={{ height: 5 }}></Box>
                <Box sx={{ width: "90%", minHeight: 500 }}>
                    <BarChartWithProduct />
                </Box>
                <Box sx={{ height: 5 }}></Box>
                <Box sx={{ width: "90%", minHeight: 500 }}>
                    <BarChartWithAmount />
                </Box>
                <Box sx={{ height: 20 }}></Box>
                <Box sx={{ width: "90%" }}>
                    <ButtonGroup
                        sx={{ float: "right" }}
                        variant="contained"
                        aria-label="outlined primary button group"
                    >
                        <Button onClick={() => setType1("DAY")}>Ngày</Button>
                        <Button onClick={() => setType1("MONTH")}>Tháng</Button>
                        <Button onClick={() => setType1("YEAR")}>Năm</Button>
                    </ButtonGroup>
                </Box>
                <Box sx={{ height: 20 }}></Box>
                <CRUDTable
                    queryKey="QuanXQuery"
                    columns={[
                        {
                            field: "id",
                            title: "STT",
                            index: 1,
                            type: "index",
                            disableSort: true,
                            disableFilter: true,
                        },
                        {
                            field: "name",
                            title: "Tên món ăn",
                            index: 2,
                            type: "string",
                        },
                        {
                            field: "quantity",
                            title: "Số lượng",
                            index: 3,
                            type: "number",
                            disableFilter: true,
                        },
                        {
                            field: "averagetime",
                            title: "Thời gian trung bình",
                            index: 3,
                            type: "time",
                            disableFilter: true,
                            disableSort: true,
                            render: (x: string) => {
                                return (
                                    <CellTableTypography>
                                        {x ? x.substring(0, 8) : ""}
                                    </CellTableTypography>
                                );
                            },
                        },
                    ]}
                    title={"Top 10 món ăn theo số lượng"}
                    entity="search_articles"
                    firstOrderField="quantity"
                    sort
                    enableFilter
                    maxWidth="100%"
                    args={
                        type1 === "MONTH"
                            ? `{x: "${year}/${month}/01  00:00:00", y: "${year}/${month}/${day} 23:59:59"}`
                            : type1 === "DAY"
                            ? `{x: "${year}/${month}/${day}  00:00:00", y: "${year}/${month}/${day} 23:59:59"}`
                            : `{x: "${year}/01/01  00:00:00", y: "${year}/${month}/${day} 23:59:59"}`
                    }
                />
                {/* <Grid item md={5} xs={12}>
                </Grid>
                <Grid item md={5} xs={12}>
                    <BarChart />
                </Grid>
                <Grid item md={5} xs={12}>
                    <BarChart />
                </Grid> */}
            </Box>
        </Box>
    );
};

export default Home;
