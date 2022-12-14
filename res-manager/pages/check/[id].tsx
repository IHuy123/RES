import { Box, Button, Card, Grid, Modal, Typography } from "@mui/material";
import TextfieldBase from "components/BaseTextField";
import CellTableTypography from "components/CellTableTypography";
import ChipBase from "components/Chip";
import CRUDTable from "components/Table";
import { IColumn } from "components/Table/models";
import { format } from "date-fns";
import { Checkdetail, GetCheckDetailQuery } from "generated/graphql";
import useGetCheck from "hooks/check/useGetCheck";
import useGetCheckDetail from "hooks/check/useGetCheckDetail";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CHECK_DETAIL_ENUM, CHECK_ENUM } from "utils/enums";
import CheckDetailForm from "containers/check-detail/CheckDetailForm";

const CheckDetail: NextPage = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("manager-user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);
    const router = useRouter();
    const { id } = router.query;
    const { data, isLoading } = useGetCheck(Number(id || 0));
    const { mutate } = useGetCheckDetail();
    const [databyId, setData] = useState<GetCheckDetailQuery["checkdetail_by_pk"]>(null);
    const [open, setOpen] = useState(false);
    const [itemid, setItemId] = useState<number>(0);
    const columns: IColumn[] = [
        {
            field: "id",
            title: "STT",
            index: 1,
            type: "index",
            disableSort: true,
            disableFilter: true,
            width: "80px",
        },
        {
            field: "item",
            title: "Tên món ăn",
            index: 2,
            type: "object",
            subField: "name",
            subFieldType: "string",
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
        {
            field: "status",
            title: "Trạng thái",
            index: 6,
            type: "enum",
            enumValue: [
                {
                    key: CHECK_DETAIL_ENUM.READY,
                    value: "Sẵn sàng",
                },
                {
                    key: CHECK_DETAIL_ENUM.RECALL,
                    value: "Gọi lại",
                },
                {
                    key: CHECK_DETAIL_ENUM.SERVED,
                    value: "Đã phục vụ",
                },
                {
                    key: CHECK_DETAIL_ENUM.VOID,
                    value: "Hủy",
                },
                {
                    key: CHECK_DETAIL_ENUM.WAITING,
                    value: "Đang chờ",
                },
            ],
            render: (status: string) => {
                if (status === CHECK_DETAIL_ENUM.READY) {
                    return (
                        <ChipBase
                            color={"success"}
                            label={"Sẵn sàng"}
                            size="small"
                            sx={{
                                fontSize: 14,
                                minWidth: "150px",
                            }}
                        />
                    );
                }
                if (status === CHECK_DETAIL_ENUM.RECALL) {
                    return (
                        <ChipBase
                            color={"secondary"}
                            label={"Gọi lại"}
                            size="small"
                            sx={{
                                fontSize: 14,
                                minWidth: "150px",
                            }}
                        />
                    );
                }
                if (status === CHECK_DETAIL_ENUM.SERVED) {
                    return (
                        <ChipBase
                            color={"info"}
                            label={"Đã phục vụ"}
                            size="small"
                            sx={{
                                fontSize: 14,
                                minWidth: "150px",
                            }}
                        />
                    );
                }
                if (status === CHECK_DETAIL_ENUM.WAITING) {
                    return (
                        <ChipBase
                            color={"warning"}
                            label={"Đang chờ"}
                            size="small"
                            sx={{
                                fontSize: 14,
                                minWidth: "150px",
                            }}
                        />
                    );
                }
                return (
                    <ChipBase
                        color={"error"}
                        label={"Hủy"}
                        size="small"
                        sx={{
                            fontSize: 14,
                            minWidth: "150px",
                        }}
                    />
                );
            },
        },
        {
            index: 7,
            disableFilter: true,
            disableSort: true,
            title: "Xem yêu cầu đặc biệt",
            field: "id",
            type: "number",
            render: (data: number) => {
                return (
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                setItemId(data);
                            }}
                        >
                            Xem
                        </Button>
                    </Box>
                );
            },
        },
    ];

    if (isLoading) {
        return <div>loading</div>;
    }
    if (!data?.check_by_pk) {
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
                <Typography variant="h3">Đơn hàng này không tồn tại!</Typography>
            </Box>
        );
    }
    return (
        <Box sx={{ width: "100%" }}>
            <CheckDetailForm data={databyId} opened={open} handleClose={() => setOpen(false)} />
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
                            {"Đơn hàng #" + data?.check_by_pk?.checkno}
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
                                id="shift"
                                label={"Ca làm việc"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={data?.check_by_pk?.shift?.name}
                            />
                            <TextfieldBase
                                id="account"
                                label={"Tài khoản"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={data?.check_by_pk?.account?.fullname}
                            />
                            <TextfieldBase
                                id="table"
                                label={"Bàn ăn"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={data?.check_by_pk?.table?.name}
                            />
                            <TextfieldBase
                                id="loation"
                                label={"Khu vực"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={data?.check_by_pk?.table?.location?.name}
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
                                id="checkno"
                                label={"Mã đơn hàng"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={data?.check_by_pk?.checkno}
                            />
                            <TextfieldBase
                                id="guestNo"
                                label={"Tên khách hàng"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={data?.check_by_pk?.guestname}
                            />
                            <TextfieldBase
                                id="cover"
                                label={"Số khách"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={data?.check_by_pk?.cover}
                            />
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
                                }).format(data?.check_by_pk?.subtotal)}
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
                                }).format(data?.check_by_pk?.totaltax)}`}
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
                                }).format(data?.check_by_pk?.totalamount)}
                            />
                            <TextfieldBase
                                id="status"
                                label={"Trạng thái"}
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                }}
                                fullWidth
                                value={
                                    data?.check_by_pk?.status === CHECK_ENUM.ACTIVE
                                        ? "Sẵn sàng"
                                        : data?.check_by_pk?.status === CHECK_ENUM.CLOSED
                                        ? "Đã đóng"
                                        : "Hủy"
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
                                    new Date(data?.check_by_pk?.creationtime) || new Date(),
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
                                value={data?.check_by_pk?.note}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid item xs={12}>
                            <CRUDTable
                                queryKey="CheckDetailQuery"
                                columns={columns}
                                title={"Món ăn trong đơn hàng"}
                                entity="checkdetail"
                                defaultFilter={`{checkid: {_eq: ${id}}}`}
                                defaultFilterForCount={`{checkid: {_eq: ${id}}}`}
                                firstOrderField="id"
                                sort
                                enableFilter
                                maxWidth="100%"
                                action={{
                                    onView: (rowData: Checkdetail) => {
                                        mutate(
                                            {
                                                id: rowData.id || 0,
                                            },
                                            {
                                                onSuccess(data) {
                                                    setData(data.checkdetail_by_pk);
                                                    setOpen(true);
                                                },
                                            }
                                        );
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Modal hideBackdrop open={Boolean(itemid)} onClose={() => setItemId(0)}>
                        <Grid
                            sx={{
                                position: "absolute" as "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                width: 1200,
                                bgcolor: "background.paper",
                                border: "2px solid #000",
                                boxShadow: 24,
                                pt: 2,
                                px: 4,
                                pb: 3,
                            }}
                        >
                            {itemid ? (
                                <Grid item xs={12}>
                                    <Grid item xs={12}>
                                        <CRUDTable
                                            queryKey="SpcQuery"
                                            columns={[
                                                {
                                                    field: "id",
                                                    title: "STT",
                                                    index: 1,
                                                    type: "index",
                                                    disableSort: true,
                                                    disableFilter: true,
                                                    width: "80px",
                                                },
                                                {
                                                    field: "specialrequest",
                                                    title: "Yêu cầu",
                                                    index: 2,
                                                    type: "object",
                                                    subField: "name",
                                                    subFieldType: "string",
                                                },
                                            ]}
                                            title={"Yêu cầu đặc biệt cho món ăn"}
                                            entity="checkdetailspecialrequest"
                                            defaultFilter={`{checkdetailid: {_eq: ${itemid}}}`}
                                            defaultFilterForCount={`{checkdetailid: {_eq: ${itemid}}}`}
                                            firstOrderField="id"
                                            sort
                                            enableFilter
                                            maxWidth="100%"
                                        />
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => setItemId(0)}
                                        >
                                            Đóng
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : null}
                        </Grid>
                    </Modal>
                </Grid>
            </Card>
        </Box>
    );
};

export default CheckDetail;
