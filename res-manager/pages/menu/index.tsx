import CRUDTable from "components/Table";
import { IColumn } from "components/Table/models";
import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import ChipBase from "components/Chip";
import { BASIC_ENUM } from "utils/enums";
import useSnackbar from "components/Snackbar/useSnackbar";
import useCreateMenu from "hooks/menu/useCreateMenu";
import useUpdateMenu from "hooks/menu/useUpdateMenu";
import useDeleteMenu from "hooks/menu/useDeleteMenu";
import MenuForm, { MenuMutationType } from "containers/menu/MenuForm";
import useGetMenuDf from "hooks/menu/useGetMenu";

const Menu: NextPage = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("manager-user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);
    const initData: MenuMutationType = {
        id: 0,
        name: "",
        status: BASIC_ENUM.ACTIVE,
        isdefault: true,
        mealtypeid: 0,
    };

    const { mutate: mutateCreate } = useCreateMenu("MenuQuery");
    const { mutate: mutateUpdate } = useUpdateMenu("MenuQuery");
    const { mutate: mutateDelete } = useDeleteMenu("MenuQuery");
    const { mutate: mutateGet } = useGetMenuDf("MenuQuery");
    const showSnackbar = useSnackbar();
    const [data, setData] = useState<MenuMutationType>(initData);
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
    const addRowData = () => {
        setIsOpenForm(true);
        setData(initData);
    };
    const updateRowData = (rowData: MenuMutationType) => {
        const data: MenuMutationType = {
            isdefault: rowData.isdefault,
            name: rowData.name,
            id: rowData.id,
            status: rowData.status,
            mealtypeid: rowData.mealtypeid,
        };
        setIsOpenForm(true);
        setData(data);
    };
    const deleteRowData = (rowData: MenuMutationType) => {
        if (rowData.status === BASIC_ENUM.INACTIVE) {
            showSnackbar({
                children: "Thực đơn này hiện đã ngừng hoạt động!",
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
            title: "Tên thực đơn",
            index: 2,
            type: "string",
        },
        {
            field: "mealtype",
            title: "Bữa ăn",
            index: 4,
            type: "object",
            subField: "name",
            subFieldType: "string",
        },
        {
            field: "mealtypeid",
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
        {
            field: "isdefault",
            title: "Loại",
            index: 7,
            type: "boolean",
            enumBooleanValue: [
                {
                    key: true,
                    value: "Mặc định",
                },
                {
                    key: false,
                    value: "Không mặc định",
                },
            ],
            render: (status: boolean) => {
                if (status) {
                    return (
                        <ChipBase
                            color={"success"}
                            label={"Mặc định"}
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
                        label={"Không mặc định"}
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
        (type: "SAVE" | "CANCEL", data?: MenuMutationType, clearErrors?: Function) => {
            if (type === "SAVE") {
                if (data) {
                    if (!data.id && data.isdefault && data.status === "INACTIVE") {
                        showSnackbar({
                            children:
                                "Không thể tạo mới thực đơn mặc định với trạng thái không hoạt động!",
                            severity: "error",
                        });
                        return;
                    }
                    if (data.id && data.isdefault && data.status === "INACTIVE") {
                        showSnackbar({
                            children:
                                "Không thể chỉnh sửa thành thực đơn mặc định với trạng thái không hoạt động!",
                            severity: "error",
                        });
                        return;
                    }
                    if (!data.id) {
                        if (data.isdefault && data.status === "ACTIVE") {
                            mutateGet(undefined, {
                                onSuccess: () => {
                                    data.id = undefined;
                                    mutateCreate(
                                        {
                                            object: {
                                                mealtypeid: data.mealtypeid,
                                                name: data.name,
                                                status: data.status,
                                                isdefault: data.isdefault,
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
                                },
                            });
                        } else {
                            data.id = undefined;
                            mutateCreate(
                                {
                                    object: {
                                        mealtypeid: data.mealtypeid,
                                        name: data.name,
                                        status: data.status,
                                        isdefault: data.isdefault,
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
                        }
                    } else {
                        if (data.isdefault && data.status === "ACTIVE") {
                            mutateGet(undefined, {
                                onSuccess: () => {
                                    mutateUpdate(
                                        {
                                            id: data.id,
                                            _set: {
                                                mealtypeid: data.mealtypeid,
                                                name: data.name,
                                                status: data.status,
                                                isdefault: data.isdefault,
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
                                },
                            });
                        } else {
                            mutateUpdate(
                                {
                                    id: data.id,
                                    _set: {
                                        mealtypeid: data.mealtypeid,
                                        name: data.name,
                                        status: data.status,
                                        isdefault: data.isdefault,
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

    const viewRowData = (rowData: MenuMutationType) => {
        const data: MenuMutationType = {
            name: rowData.name,
            status: rowData.status,
            id: rowData.id,
            mealtypeid: rowData.mealtypeid,
            isdefault: rowData.isdefault,
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
            <MenuForm
                opened={isOpenForm}
                isView={isViewAction}
                data={data}
                handleClose={handleClose}
            />
            <CRUDTable
                queryKey="MenuQuery"
                columns={columns}
                title={"Quản lý thực đơn"}
                entity="menu"
                firstOrderField="id"
                sort
                enableFilter
                maxWidth="100%"
                action={{
                    onView: (rowData: MenuMutationType) => viewRowData(rowData),
                    onAdd: () => addRowData(),
                    onEdit: (rowData: MenuMutationType) => updateRowData(rowData),
                    onDeleteRecord: (rowData: MenuMutationType) => deleteRowData(rowData),
                }}
            />
        </>
    );
};

export default Menu;
