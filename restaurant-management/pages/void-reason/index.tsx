import CRUDTable from "components/Table";
import { IColumn } from "components/Table/models";
import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import ChipBase from "components/Chip";
import { BASIC_ENUM } from "utils/enums";
import useSnackbar from "components/Snackbar/useSnackbar";
import VoidreasonForm, { VoidReasonMutationType } from "containers/void-reason/VoidReason";
import useCreateVoidReason from "hooks/void-reason/useCreateVoidReason";
import useUpdateVoidreason from "hooks/void-reason/useUpdateVoidReason";
import useDeleteVoidReason from "hooks/void-reason/useDeleteVoidReason";

const VoidReason: NextPage = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);
    const initData: VoidReasonMutationType = {
        id: 0,
        name: "",
        status: BASIC_ENUM.ACTIVE,
    };

    const { mutate: mutateCreate } = useCreateVoidReason("VoidReasonQuery");
    const { mutate: mutateUpdate } = useUpdateVoidreason("VoidReasonQuery");
    const { mutate: mutateDelete } = useDeleteVoidReason("VoidReasonQuery");
    const showSnackbar = useSnackbar();
    const [data, setData] = useState<VoidReasonMutationType>(initData);
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
    const addRowData = () => {
        setIsOpenForm(true);
        setData(initData);
    };
    const updateRowData = (rowData: VoidReasonMutationType) => {
        const data: VoidReasonMutationType = {
            name: rowData.name,
            id: rowData.id,
            status: rowData.status,
        };
        setIsOpenForm(true);
        setData(data);
    };
    const deleteRowData = (rowData: VoidReasonMutationType) => {
        if (rowData.status === BASIC_ENUM.INACTIVE) {
            showSnackbar({
                children: "Lý do hủy này hiện đã ngừng hoạt động!",
                severity: "error",
            });
        } else {
            mutateDelete(
                {
                    id: rowData.id,
                    status: BASIC_ENUM.INACTIVE,
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
            title: "Tên lý do hủy",
            index: 2,
            type: "string",
        },
        {
            field: "status",
            title: "Trạng thái",
            index: 3,
            type: "enum",
            enumValue: [
                {
                    key: BASIC_ENUM.ACTIVE,
                    value: "Đang hoạt động",
                },
                {
                    key: BASIC_ENUM.INACTIVE,
                    value: "Không hoạt động",
                },
            ],
            render: (status: string) => {
                if (status === BASIC_ENUM.ACTIVE) {
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
        (type: "SAVE" | "CANCEL", data?: VoidReasonMutationType, clearErrors?: Function) => {
            if (type === "SAVE") {
                if (data) {
                    if (!data.id) {
                        data.id = undefined;
                        mutateCreate(data, {
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
                        });
                    } else {
                        mutateUpdate(data, {
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
                        });
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

    const viewRowData = (rowData: VoidReasonMutationType) => {
        const data: VoidReasonMutationType = {
            name: rowData.name,
            status: rowData.status,
            id: rowData.id,
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
            <VoidreasonForm
                opened={isOpenForm}
                isView={isViewAction}
                data={data}
                handleClose={handleClose}
            />
            <CRUDTable
                queryKey="VoidReasonQuery"
                columns={columns}
                title={"Quản lý các lý do hủy"}
                entity="voidreason"
                firstOrderField="id"
                sort
                enableFilter
                maxWidth="100%"
                action={{
                    onView: (rowData: VoidReasonMutationType) => viewRowData(rowData),
                    onAdd: () => addRowData(),
                    onEdit: (rowData: VoidReasonMutationType) => updateRowData(rowData),
                    onDeleteRecord: (rowData: VoidReasonMutationType) => deleteRowData(rowData),
                }}
            />
        </>
    );
};

export default VoidReason;
