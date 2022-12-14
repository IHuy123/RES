import CRUDTable from "components/Table";
import { IColumn } from "components/Table/models";
import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import ChipBase from "components/Chip";
import { BASIC_ENUM } from "utils/enums";
import useSnackbar from "components/Snackbar/useSnackbar";
import SpecialRequestForm, {
    SpecialRequestMutationType,
} from "containers/special-request/SpecialRequestForm";
import useCreateSpecialRequest from "hooks/special-request/useCreateSpecialRequest";
import useUpdateSpecialRequest from "hooks/special-request/useUpdateSpecialRequest";
import useDeleteSpecialRequest from "hooks/special-request/useDeleteSpecialRequest";

const SpecialRequest: NextPage = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("manager-user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);
    const initData: SpecialRequestMutationType = {
        id: 0,
        name: "",
        status: BASIC_ENUM.ACTIVE,
        majorgroupid: 0,
    };

    const { mutate: mutateCreate } = useCreateSpecialRequest("SpReQuery");
    const { mutate: mutateUpdate } = useUpdateSpecialRequest("SpReQuery");
    const { mutate: mutateDelete } = useDeleteSpecialRequest("SpReQuery");
    const showSnackbar = useSnackbar();
    const [data, setData] = useState<SpecialRequestMutationType>(initData);
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
    const addRowData = () => {
        setIsOpenForm(true);
        setData(initData);
    };
    const updateRowData = (rowData: SpecialRequestMutationType) => {
        const data: SpecialRequestMutationType = {
            name: rowData.name,
            id: rowData.id,
            status: rowData.status,
            majorgroupid: rowData.majorgroupid,
        };
        setIsOpenForm(true);
        setData(data);
    };
    const deleteRowData = (rowData: SpecialRequestMutationType) => {
        if (rowData.status === BASIC_ENUM.INACTIVE) {
            showSnackbar({
                children: "Yêu cầu đặc biệt này hiện đã ngừng hoạt động!",
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
            title: "Tên yêu cầu đặc biệt",
            index: 2,
            type: "string",
        },
        {
            field: "majorgroup",
            title: "Tên nhóm món ăn",
            index: 4,
            type: "object",
            subField: "name",
            subFieldType: "string",
        },
        {
            field: "majorgroupid",
            title: "",
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
        (type: "SAVE" | "CANCEL", data?: SpecialRequestMutationType, clearErrors?: Function) => {
            if (type === "SAVE") {
                if (data) {
                    if (!data.id) {
                        data.id = undefined;
                        mutateCreate(
                            {
                                object: {
                                    majorgroupid: data.majorgroupid,
                                    name: data.name,
                                    status: BASIC_ENUM.ACTIVE,
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
                                    majorgroupid: data.majorgroupid,
                                    name: data.name,
                                    status: data.status,
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

    const viewRowData = (rowData: SpecialRequestMutationType) => {
        const data: SpecialRequestMutationType = {
            name: rowData.name,
            status: rowData.status,
            id: rowData.id,
            majorgroupid: rowData.majorgroupid,
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
            <SpecialRequestForm
                opened={isOpenForm}
                isView={isViewAction}
                data={data}
                handleClose={handleClose}
            />
            <CRUDTable
                queryKey="SpReQuery"
                columns={columns}
                title={"Quản lý yêu cầu đặc biệt"}
                entity="specialrequest"
                firstOrderField="id"
                sort
                enableFilter
                maxWidth="100%"
                action={{
                    onView: (rowData: SpecialRequestMutationType) => viewRowData(rowData),
                    onAdd: () => addRowData(),
                    onEdit: (rowData: SpecialRequestMutationType) => updateRowData(rowData),
                    onDeleteRecord: (rowData: SpecialRequestMutationType) => deleteRowData(rowData),
                }}
            />
        </>
    );
};

export default SpecialRequest;
