import CRUDTable from "components/Table";
import { IColumn } from "components/Table/models";
import { NextPage } from "next";
import React, { useEffect } from "react";
import ChipBase from "components/Chip";
import { CHECK_ENUM } from "utils/enums";
import router from "next/router";
import { Check } from "generated/graphql";
import CellTableTypography from "components/CellTableTypography";

const Check: NextPage = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("manager-user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);

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
            field: "creationtime",
            title: "Thời gian tạo",
            index: 2,
            type: "timestamp",
            disableFilter: true,
        },
        {
            field: "checkno",
            title: "Mã đơn hàng",
            index: 3,
            type: "number",
            disableFilter: true,
        },
        {
            field: "totaltax",
            title: "Tổng thuế",
            index: 4,
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
            field: "totalamount",
            title: "Tổng tiền",
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
                    key: CHECK_ENUM.ACTIVE,
                    value: "Đang hoạt động",
                },
                {
                    key: CHECK_ENUM.CLOSED,
                    value: "Đã đóng",
                },
                {
                    key: CHECK_ENUM.VOID,
                    value: "void",
                },
            ],
            render: (status: string) => {
                if (status === CHECK_ENUM.ACTIVE) {
                    return (
                        <ChipBase
                            color={"success"}
                            label={"Đang hoạt động"}
                            size="small"
                            sx={{
                                fontSize: 14,
                                minWidth: "150px",
                            }}
                        />
                    );
                }
                if (status === CHECK_ENUM.CLOSED) {
                    return (
                        <ChipBase
                            color={"warning"}
                            label={"Đã đóng"}
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
    ];

    return (
        <>
            <CRUDTable
                queryKey="CheckQuery"
                columns={columns}
                title={"Quản lý đơn hàng"}
                entity="check"
                firstOrderField="id"
                sort
                enableFilter
                maxWidth="100%"
                action={{
                    onView: (rowData: Check) => {
                        router.push(`/check/${rowData.id}`);
                    },
                }}
            />
        </>
    );
};

export default Check;
