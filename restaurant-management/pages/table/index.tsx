import CRUDTable from "components/Table";
import { IColumn } from "components/Table/models";
import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import ChipBase from "components/Chip";
import { TABLE_ENUM } from "utils/enums";
import useSnackbar from "components/Snackbar/useSnackbar";
import TableForm, { TableMutationType } from "containers/table/TableForm";
import useCreateTable from "hooks/table/useCreateTable";
import useUpdateTable from "hooks/table/useUpdateTable";
import useDeleteTable from "hooks/table/useDeleteTable";

const Table: NextPage = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);
    const initData: TableMutationType = {
        id: 0,
        name: "",
        status: TABLE_ENUM.NOT_USE,
        seat: 0,
        locationid: 0,
    };

    const { mutate: mutateCreate } = useCreateTable("TableQuery");
    const { mutate: mutateUpdate } = useUpdateTable("TableQuery");
    const { mutate: mutateDelete } = useDeleteTable("TableQuery");
    const showSnackbar = useSnackbar();
    const [data, setData] = useState<TableMutationType>(initData);
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
    const addRowData = () => {
        setIsOpenForm(true);
        setData(initData);
    };
    const updateRowData = (rowData: TableMutationType) => {
        const data: TableMutationType = {
            name: rowData.name,
            id: rowData.id,
            status: rowData.status,
            seat: rowData.seat,
            locationid: rowData.locationid,
        };
        setIsOpenForm(true);
        setData(data);
    };
    const deleteRowData = (rowData: TableMutationType) => {
        if (rowData.status === TABLE_ENUM.INACTIVE) {
            showSnackbar({
                children: "Bàn này hiện đã ngừng hoạt động!",
                severity: "error",
            });
        } else {
            mutateDelete(
                {
                    id: rowData.id,
                    status: TABLE_ENUM.INACTIVE,
                },
                {
                    onSuccess: () => {
                        showSnackbar({
                            children: "Xóa thành công",
                            severity: "success",
                        });
                    },
                    onError: () => {
                        showSnackbar({
                            children: "Xóa thất bại",
                            severity: "error",
                        });
                    },
                }
            );
        }
    };

    const [isViewAction, setViewAction] = useState<boolean>(false);

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
            field: "name",
            title: "Tên bàn",
            index: 2,
            type: "string",
        },
        {
            field: "seat",
            title: "Số chỗ ngồi",
            index: 3,
            type: "number",
            disableFilter: true,
        },
        {
            field: "location",
            title: "Tên khu vực",
            index: 4,
            type: "object",
            subField: "name",
            subFieldType: "string",
        },
        {
            field: "locationid",
            title: "Mã khu vực",
            index: 5,
            type: "number",
            disable: true,
        },
        {
            field: "status",
            title: "Trạng thái",
            index: 6,
            type: "enum",
            enumValue: [
                {
                    key: TABLE_ENUM.IN_USE,
                    value: "Đang sử dụng",
                },
                {
                    key: TABLE_ENUM.NOT_USE,
                    value: "Không sử dụng",
                },
                {
                    key: TABLE_ENUM.INACTIVE,
                    value: "Không hoạt động",
                },
            ],
            render: (status: string) => {
                if (status === TABLE_ENUM.IN_USE) {
                    return (
                        <ChipBase
                            color={"success"}
                            label={"Đang sử dụng"}
                            size="small"
                            sx={{
                                fontSize: 14,
                                minWidth: "150px",
                            }}
                        />
                    );
                }
                if (status === TABLE_ENUM.NOT_USE) {
                    return (
                        <ChipBase
                            color={"warning"}
                            label={"Không sử dụng"}
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
                        label={"Không hoạt động"}
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

    const handleClose = useCallback(
        (type: "SAVE" | "CANCEL", data?: TableMutationType, clearErrors?: Function) => {
            if (type === "SAVE") {
                if (data) {
                    if (!data.id) {
                        data.id = undefined;
                        mutateCreate(
                            {
                                object: {
                                    locationid: data.locationid,
                                    name: data.name,
                                    seat: data.seat,
                                    status: TABLE_ENUM.NOT_USE,
                                },
                            },
                            {
                                onSuccess: () => {
                                    showSnackbar({
                                        children: "Thêm mới thành công",
                                        severity: "success",
                                    });
                                },
                                onError: () => {
                                    showSnackbar({
                                        children: "Thêm mới thất bại",
                                        severity: "error",
                                    });
                                },
                            }
                        );
                    } else {
                        mutateUpdate(
                            {
                                id: data.id,
                                _set: {
                                    locationid: data.locationid,
                                    name: data.name,
                                    seat: data.seat,
                                },
                            },
                            {
                                onSuccess: () => {
                                    showSnackbar({
                                        children: "Chỉnh sửa thành công",
                                        severity: "success",
                                    });
                                },
                                onError: () => {
                                    showSnackbar({
                                        children: "Chỉnh sửa thất bại",
                                        severity: "error",
                                    });
                                },
                            }
                        );
                    }
                }
            }
            if (clearErrors) {
                clearErrors();
            }
            resetData();
            setViewAction(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const viewRowData = (rowData: TableMutationType) => {
        const data: TableMutationType = {
            name: rowData.name,
            status: rowData.status,
            id: rowData.id,
            seat: rowData.seat,
            locationid: rowData.locationid,
        };
        setIsOpenForm(true);
        setData(data);
        setViewAction(true);
    };

    const resetData = () => {
        setData(initData);
        setIsOpenForm(false);
    };

    return (
        <>
            <TableForm
                opened={isOpenForm}
                isView={isViewAction}
                data={data}
                handleClose={handleClose}
            />
            <CRUDTable
                queryKey="TableQuery"
                columns={columns}
                title={"Quản lý bàn ăn"}
                entity="table"
                firstOrderField="id"
                sort
                enableFilter
                maxWidth="100%"
                action={{
                    onView: (rowData: TableMutationType) => viewRowData(rowData),
                    onAdd: () => addRowData(),
                    onEdit: (rowData: TableMutationType) => updateRowData(rowData),
                    onDeleteRecord: (rowData: TableMutationType) => deleteRowData(rowData),
                }}
            />
        </>
    );
};

export default Table;
