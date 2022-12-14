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
                children: "Th???c ????n n??y hi???n ???? ng???ng ho???t ?????ng!",
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
                            children: "X??a th??nh c??ng",
                            severity: "success",
                        });
                    },
                    onError: () => {
                        showSnackbar({
                            children: "X??a th???t b???i",
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
            title: "T??n th???c ????n",
            index: 2,
            type: "string",
        },
        {
            field: "mealtype",
            title: "B???a ??n",
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
            title: "Tr???ng th??i",
            index: 6,
            type: "enum",
            enumValue: [
                {
                    key: BASIC_ENUM.ACTIVE,
                    value: "??ang ho???t ?????ng",
                },
                {
                    key: BASIC_ENUM.INACTIVE,
                    value: "Kh??ng ho???t ?????ng",
                },
            ],
            render: (status: string) => {
                if (status === BASIC_ENUM.ACTIVE) {
                    return (
                        <ChipBase
                            color={"success"}
                            label={"??ang ho???t ?????ng"}
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
                        label={"Kh??ng ho???t ?????ng"}
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
            title: "Lo???i",
            index: 7,
            type: "boolean",
            enumBooleanValue: [
                {
                    key: true,
                    value: "M???c ?????nh",
                },
                {
                    key: false,
                    value: "Kh??ng m???c ?????nh",
                },
            ],
            render: (status: boolean) => {
                if (status) {
                    return (
                        <ChipBase
                            color={"success"}
                            label={"M???c ?????nh"}
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
                        label={"Kh??ng m???c ?????nh"}
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
                                "Kh??ng th??? t???o m???i th???c ????n m???c ?????nh v???i tr???ng th??i kh??ng ho???t ?????ng!",
                            severity: "error",
                        });
                        return;
                    }
                    if (data.id && data.isdefault && data.status === "INACTIVE") {
                        showSnackbar({
                            children:
                                "Kh??ng th??? ch???nh s???a th??nh th???c ????n m???c ?????nh v???i tr???ng th??i kh??ng ho???t ?????ng!",
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
                                                    children: "Th??m m???i th??nh c??ng",
                                                    severity: "success",
                                                });
                                            },
                                            onError: () => {
                                                showSnackbar({
                                                    children: "Th??m m???i th???t b???i",
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
                                            children: "Th??m m???i th??nh c??ng",
                                            severity: "success",
                                        });
                                    },
                                    onError: () => {
                                        showSnackbar({
                                            children: "Th??m m???i th???t b???i",
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
                                                    children: "Ch???nh s???a th??nh c??ng",
                                                    severity: "success",
                                                });
                                            },
                                            onError: () => {
                                                showSnackbar({
                                                    children: "Ch???nh s???a th???t b???i",
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
                                            children: "Ch???nh s???a th??nh c??ng",
                                            severity: "success",
                                        });
                                    },
                                    onError: () => {
                                        showSnackbar({
                                            children: "Ch???nh s???a th???t b???i",
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
                title={"Qu???n l?? th???c ????n"}
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
