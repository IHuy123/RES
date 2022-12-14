import CRUDTable from "components/Table";
import { IColumn } from "components/Table/models";
import { NextPage } from "next";
import React, { useEffect } from "react";
import ChipBase from "components/Chip";
import { BILL_ENUM } from "utils/enums";
import router from "next/router";
import { Bill } from "generated/graphql";
import CellTableTypography from "components/CellTableTypography";

const Bill: NextPage = () => {
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
            field: "billno",
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
                    key: BILL_ENUM.REFUND,
                    value: "Hoàn tiền",
                },
                {
                    key: BILL_ENUM.CLOSED,
                    value: "Đã đóng",
                },
            ],
            render: (status: string) => {
                if (status === BILL_ENUM.CLOSED) {
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
                return (
                    <ChipBase
                        color={"error"}
                        label={"Hoàn tiền"}
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
                queryKey="BillQuery"
                columns={columns}
                title={"Quản lý hóa đơn"}
                entity="bill"
                firstOrderField="id"
                sort
                enableFilter
                maxWidth="100%"
                action={{
                    onView: (rowData: Bill) => {
                        router.push(`/bill/${rowData.id}`);
                    },
                }}
            />
        </>
    );
};

export default Bill;
