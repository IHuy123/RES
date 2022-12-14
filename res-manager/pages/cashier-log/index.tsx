import CRUDTable from "components/Table";
import { IColumn } from "components/Table/models";
import { NextPage } from "next";
import React, { useEffect } from "react";
import ChipBase from "components/Chip";
import CellTableTypography from "components/CellTableTypography";
import { Button } from "@mui/material";
import useUpdateCashierLog from "hooks/cashier-log/useUpdateCashierLog";
import useSnackbar from "components/Snackbar/useSnackbar";

const CashierLog: NextPage = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("manager-user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);

    const showSnackbar = useSnackbar();
    const { mutate } = useUpdateCashierLog("CashierQuery");
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
            field: "creationtime",
            title: "Thời gian tạo",
            index: 3,
            type: "timestamp",
            disableFilter: true,
        },
        {
            field: "account",
            title: "Tài khoản",
            index: 4,
            type: "object",
            subField: "fullname",
            subFieldType: "string",
        },
        {
            field: "shift",
            title: "Ca làm việc",
            width: "140px",
            index: 5,
            type: "object",
            subField: "name",
            subFieldType: "string",
        },
        {
            field: "amount",
            title: "Tổng",
            width: "120px",
            index: 6,
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
            field: "type",
            title: "Loại",
            index: 7,
            // width: "60px",
            type: "enum",
            enumValue: [
                {
                    key: "OPEN",
                    value: "Mở",
                },
                {
                    key: "CLOSED",
                    value: "Đóng",
                },
            ],
            render: (status: string) => {
                if (status === "OPEN") {
                    return (
                        <ChipBase
                            color={"success"}
                            label={"Mở"}
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
                        label={"Đóng"}
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
            field: "isverify",
            title: "Trạng thái",
            type: "boolean",
            index: 8,
            enumBooleanValue: [
                {
                    key: true,
                    value: "Đã kiểm chứng",
                },
                {
                    key: false,
                    value: "Chưa kiểm chứng",
                },
            ],
            render: (status: boolean) => {
                if (status) {
                    return (
                        <ChipBase
                            color={"success"}
                            label={"Đã kiểm chứng"}
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
                        color={"warning"}
                        label={"Chưa kiểm chứng"}
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
            field: "isverify",
            title: "Thao tác",
            disableSort: true,
            disableFilter: true,
            type: "boolean",
            index: 9,
            render: (isverify: boolean, currid?: number) => {
                if (isverify) {
                    return <></>;
                }
                return (
                    <Button
                        variant="contained"
                        onClick={() => {
                            mutate(
                                {
                                    id: currid || 0,
                                    isverify: true,
                                },
                                {
                                    onSuccess: () => {
                                        showSnackbar({
                                            children: "Kiểm chứng thành công",
                                            severity: "success",
                                        });
                                    },
                                    onError: () => {
                                        showSnackbar({
                                            children: "Kiểm chứng thất bại",
                                            severity: "error",
                                        });
                                    },
                                }
                            );
                        }}
                    >
                        Kiểm chứng
                    </Button>
                );
            },
        },
    ];

    return (
        <>
            <CRUDTable
                queryKey="CashierQuery"
                columns={columns}
                title={"Nhật ký thu ngân"}
                entity="cashierlog"
                firstOrderField="id"
                sort
                enableFilter
                maxWidth="100%"
            />
        </>
    );
};

export default CashierLog;
