import { Box, Card, Grid, Typography } from "@mui/material";
import TextfieldBase from "components/BaseTextField";
import CellTableTypography from "components/CellTableTypography";
import CRUDTable from "components/Table";
import { IColumn } from "components/Table/models";
import { format } from "date-fns";
import { Billdetail, GetBillDetailQuery } from "generated/graphql";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useGetBill from "hooks/bill/useGetBill";
import BillDetailForm from "containers/bill-detail/BillDetailForm";
import useGetBillDetail from "hooks/bill/useGetBillDetail";
import { BILL_ENUM } from "utils/enums";

const BillDetail: NextPage = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("manager-user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);
    const router = useRouter();
    const { id } = router.query;
    const { data, isLoading } = useGetBill(Number(id || 0));
    const { mutate } = useGetBillDetail();
    const [databyId, setData] = useState<GetBillDetailQuery["billdetail_by_pk"]>(null);
    const [open, setOpen] = useState(false);
    const columns: IColumn[] = [
        {
            field: "id",
            title: "STT",
            index: 1,
            type: "index",
            disableSort: true,
            disableFilter: true,
        },
        {
            field: "itemname",
            title: "Tên món ăn",
            index: 2,
            type: "string",
        },
        {
            field: "itemprice",
            title: "Giá món ăn",
            index: 3,
            type: "number",
            disableFilter: true,
            render: (data: number) => {
                return (
                    <CellTableTypography>
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(data)}
                    </CellTableTypography>
                );
            },
        },
        {
            field: "quantity",
            title: "Số lượng",
            index: 4,
            type: "number",
            disableFilter: true,
        },
        {
            field: "amount",
            title: "Tổng",
            index: 5,
            type: "number",
            disableFilter: true,
            render: (data: number) => {
                return (
                    <CellTableTypography>
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(data)}
                    </CellTableTypography>
                );
            },
        },
    ];

    if (isLoading) {
        return <div>loading</div>;
    }
    if (!data?.bill_by_pk) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h3">Hóa đơn này không tồn tại!</Typography>
            </Box>
        );
    }
    return (
        <Box sx={{ width: "100%" }}>
            <BillDetailForm data={databyId} opened={open} handleClose={() => setOpen(false)} />
            <Card
                style={{
                    marginBottom: "30px",
                }}
            >
                <Grid
                    container
                    spacing={2}
                    padding={2}
                    sx={{
                        "& > :not(style)": {
                            m: 1,
                            display: "flex",
                        },
                        width: "100%",
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        display="flex"
                        position="relative"
                        sx={{
                            justifyContent: { xs: "space-between", lg: "center" },
                        }}
                    >
                        <Typography
                            display="block"
                            color="textPrimary"
                            gutterBottom
                            textAlign="center"
                            variant="h5"
                            sx={{ fontWeight: "bold" }}
                        >
                            {"Hóa đơn #" + data?.bill_by_pk?.billno}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid item xs={12}>
                            <Typography variant="h6" fontWeight="600" component="h6">
                                Thông tin chi tiết
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        gap={3}
                        display="flex"
                        sx={{
                            flexWrap: { xs: "wrap", lg: "nowrap" },
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            gap={3}
                            display="flex"
                            sx={{
                                flexWrap: { xs: "wrap", md: "nowrap" },
                            }}
                        >
                            <TextfieldBase
                                id="check"
                                label={"Mã đơn hàng"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={data?.bill_by_pk?.check?.checkno}
                            />
                            <TextfieldBase
                                id="bill"
                                label={"Mã hóa đơn"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={data?.bill_by_pk?.billno}
                            />
                            <TextfieldBase
                                id="guestNo"
                                label={"Tên khách hàng"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={data?.bill_by_pk?.guestname}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        gap={3}
                        display="flex"
                        sx={{
                            flexWrap: { xs: "wrap", lg: "nowrap" },
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            gap={3}
                            display="flex"
                            sx={{
                                flexWrap: { xs: "wrap", md: "nowrap" },
                            }}
                        >
                            <TextfieldBase
                                id="subtotal"
                                label={"Tổng"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(data?.bill_by_pk?.subtotal)}
                            />
                            <TextfieldBase
                                id="totaltax"
                                label={"Thuế"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={`${new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(data?.bill_by_pk?.totaltax)}`}
                            />
                            <TextfieldBase
                                id="totalamount"
                                label={"Tổng hóa đơn"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(data?.bill_by_pk?.totalamount)}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        gap={3}
                        display="flex"
                        sx={{
                            flexWrap: { xs: "wrap", lg: "nowrap" },
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            gap={3}
                            display="flex"
                            sx={{
                                flexWrap: { xs: "wrap", md: "nowrap" },
                            }}
                        >
                            <TextfieldBase
                                id="status"
                                label={"Trạng thái"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={
                                    data?.bill_by_pk?.status === BILL_ENUM.CLOSED
                                        ? "Đóng"
                                        : "Hoàn trả"
                                }
                            />
                            <TextfieldBase
                                id="creationtime"
                                label={"Thời gian tạo"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={format(
                                    new Date(data?.bill_by_pk?.creationtime) || new Date(),
                                    "dd/MM/yyyy HH:mm:ss"
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        gap={3}
                        display="flex"
                        sx={{
                            flexWrap: { xs: "wrap", lg: "nowrap" },
                        }}
                    >
                        <Grid
                            item
                            xs={12}
                            gap={3}
                            display="flex"
                            sx={{
                                flexWrap: { xs: "wrap", md: "nowrap" },
                            }}
                        >
                            <TextfieldBase
                                id="note"
                                label={"Ghi chú"}
                                variant="outlined"
                                multiline
                                minRows={3}
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={data?.bill_by_pk?.note}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid item xs={12}>
                            <CRUDTable
                                queryKey="BillDetailQuery"
                                columns={columns}
                                title={"Món ăn trong hóa đơn"}
                                entity="billdetail"
                                firstOrderField="id"
                                defaultFilter={`{billid: {_eq: ${id}}}`}
                                defaultFilterForCount={`{billid: {_eq: ${id}}}`}
                                sort
                                enableFilter
                                maxWidth="100%"
                                action={{
                                    onView: (rowData: Billdetail) => {
                                        mutate(
                                            {
                                                id: rowData.id || 0,
                                            },
                                            {
                                                onSuccess(data) {
                                                    setData(data.billdetail_by_pk);
                                                    setOpen(true);
                                                },
                                            }
                                        );
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid item xs={12}>
                        <CRUDTable
                            queryKey="BillPaymentQuery"
                            defaultFilter={`{billid: {_eq: ${id}}}`}
                            defaultFilterForCount={`{billid: {_eq: ${id}}}`}
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
                                    field: "paymentmethodname",
                                    title: "Tên phương thức thanh toán",
                                    index: 2,
                                    type: "string",
                                },
                                {
                                    field: "amountreceive",
                                    title: "Tổng tiền",
                                    index: 3,
                                    type: "number",
                                    disableFilter: true,
                                    render: (data: number) => {
                                        return (
                                            <CellTableTypography>
                                                {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }).format(data)}
                                            </CellTableTypography>
                                        );
                                    },
                                },
                                {
                                    field: "transactionid",
                                    title: "Mã đơn hàng",
                                    index: 2,
                                    type: "string",
                                    render: (data: string) => {
                                        return (
                                            <CellTableTypography>{data || ""}</CellTableTypography>
                                        );
                                    },
                                },
                            ]}
                            title={"Các phương thức thanh toán"}
                            entity="billpayment"
                            firstOrderField="id"
                            sort
                            enableFilter
                            maxWidth="100%"
                        />
                    </Grid>
                </Grid>
            </Card>
        </Box>
    );
};

export default BillDetail;
