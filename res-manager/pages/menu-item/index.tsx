import CRUDTable from "components/Table";
import { IColumn } from "components/Table/models";
import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import useSnackbar from "components/Snackbar/useSnackbar";
import MenuItemForm, { MenuItemMutationType } from "containers/menu-item/MenuItemForm";
import useDeleteMenuItem from "hooks/menuitem/useDeleteMenuItem";
import useCreateMenuItem from "hooks/menuitem/useCreateMenuItem";
import { Typography } from "@mui/material";
import useUpdateMenuItem from "hooks/menuitem/useUpdateMenuItem";

const MenuItem: NextPage = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("manager-user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);

    const initData: MenuItemMutationType = {
        id: 0,
        menuid: 0,
        itemid: 0,
        price: 0,
    };

    const { mutate: mutateCreate } = useCreateMenuItem("MenuItemQuery");
    const { mutate: mutateUpdate } = useUpdateMenuItem("MenuItemQuery");
    const { mutate: mutateDelete } = useDeleteMenuItem("MenuItemQuery");
    const showSnackbar = useSnackbar();
    const [data, setData] = useState<MenuItemMutationType>(initData);
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
    const addRowData = () => {
        setIsOpenForm(true);
        setData(initData);
    };

    const updateRowData = (rowData: MenuItemMutationType) => {
        setIsOpenForm(true);
        setData(rowData);
    };

    const deleteRowData = (rowData: MenuItemMutationType) => {
        mutateDelete(
            {
                _eq: rowData.id,
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
            field: "menu",
            title: "Thực đơn",
            index: 2,
            type: "object",
            subField: "name",
            subFieldType: "string",
        },
        {
            field: "item",
            title: "Món ăn",
            index: 3,
            type: "object",
            subField: "name",
            subFieldType: "string",
        },
        {
            field: "menuid",
            title: "",
            index: 4,
            type: "number",
            disable: true,
        },
        {
            field: "itemid",
            title: "",
            index: 5,
            type: "number",
            disable: true,
        },
        {
            field: "price",
            title: "Giá món ăn",
            index: 6,
            type: "number",
            disableFilter: true,
            render: (data: number) => {
                return (
                    <Typography>
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(data)}
                    </Typography>
                );
            },
        },
    ];

    const handleClose = useCallback(
        (type: "SAVE" | "CANCEL", data?: MenuItemMutationType, clearErrors?: Function) => {
            if (type === "SAVE") {
                if (data) {
                    if (!data.id) {
                        data.id = undefined;
                        mutateCreate(
                            {
                                object: {
                                    itemid: data.itemid,
                                    menuid: data.menuid,
                                    price: data.price,
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
                                _set: {
                                    itemid: data.itemid,
                                    menuid: data.menuid,
                                    price: data.price,
                                },
                                id: data.id,
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

    const viewRowData = (rowData: MenuItemMutationType) => {
        const data: MenuItemMutationType = {
            id: rowData.id,
            menuid: rowData.menuid,
            itemid: rowData.itemid,
            price: rowData.price,
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
            <MenuItemForm
                opened={isOpenForm}
                isView={isViewAction}
                data={data}
                handleClose={handleClose}
            />
            <CRUDTable
                queryKey="MenuItemQuery"
                columns={columns}
                title={"Quản lý mục thực đơn"}
                entity="menuitem"
                firstOrderField="id"
                sort
                enableFilter
                maxWidth="100%"
                action={{
                    onView: (rowData: MenuItemMutationType) => viewRowData(rowData),
                    onAdd: () => addRowData(),
                    onDeleteRecord: (rowData: MenuItemMutationType) => deleteRowData(rowData),
                    onEdit: (rowData: MenuItemMutationType) => updateRowData(rowData),
                }}
            />
        </>
    );
};

export default MenuItem;
