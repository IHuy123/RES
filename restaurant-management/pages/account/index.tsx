import CRUDTable from "components/Table";
import { IColumn } from "components/Table/models";
import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import { USER_ENUM } from "utils/enums";
import useSnackbar from "components/Snackbar/useSnackbar";
import useGetRole from "hooks/role/useGetRole";
import { Box, Tab, Tabs } from "@mui/material";
import TabPanel from "components/Tab/TabPanel";
import ChipBase from "components/Chip";
import AccountForm from "containers/accounts/AccountForm";
import AccountDTO from "models/account.model";
import useUpdateAccount from "hooks/account/useUpdateAccount";
import useDeleteAccount from "hooks/account/useDeleteAccount";
import useCreateAccount from "hooks/account/useCreateAccount";
import bcrypt from "bcryptjs";
import useUpdateAccountWithNoPass from "hooks/account/useUpdateAccountWithNoPass";
import { LoginQueryQuery } from "generated/graphql";

const Account: NextPage = () => {
    const [user, setUser] = React.useState<LoginQueryQuery>();

    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        } else {
            setUser(JSON.parse(localStorage.getItem("user") || "{}"));
        }
    }, []);

    const { data: roles } = useGetRole();
    const initData: AccountDTO = {
        id: 0,
        username: "",
        status: USER_ENUM.INACTIVE,
        email: "",
        fullname: "",
        phone: "",
        roleid: 0,
    };

    const { mutate: mutateCreate } = useCreateAccount("AccountQuery");
    const { mutate: mutateUpdate } = useUpdateAccount("AccountQuery");
    const { mutate: mutateUpdateWithNoPass } = useUpdateAccountWithNoPass("AccountQuery");
    const { mutate: mutateDelete } = useDeleteAccount("AccountQuery");
    const showSnackbar = useSnackbar();
    const [data, setData] = useState<AccountDTO>(initData);
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
    const addRowData = () => {
        setIsOpenForm(true);
        setData(initData);
    };
    const updateRowData = (rowData: AccountDTO) => {
        setIsOpenForm(true);
        setData(rowData);
    };
    const deleteRowData = (rowData: AccountDTO) => {
        if (rowData.status === USER_ENUM.INACTIVE) {
            showSnackbar({
                children: "Tài khoản này hiện đã ngừng hoạt động!",
                severity: "error",
            });
        } else {
            if (rowData.id === user?.account[0]?.id) {
                showSnackbar({
                    children: "Không được xóa chính mình!",
                    severity: "error",
                });
            } else {
                mutateDelete(
                    {
                        id: rowData.id,
                        status: USER_ENUM.INACTIVE,
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
            width: "80px",
        },
        {
            field: "username",
            title: "Tên đăng nhập",
            index: 2,
            type: "string",
            width: "120px",
        },
        {
            field: "status",
            title: "Trạng thái",
            index: 3,
            type: "enum",
            width: "120px",
            enumValue: [
                {
                    key: "ONLINE",
                    value: "TRỰC TUYẾN",
                },
                {
                    key: "OFFLINE",
                    value: "NGOẠI TUYẾN",
                },
                {
                    key: "INACTIVE",
                    value: "NGƯNG HOẠT ĐỘNG",
                },
            ],
            render: (status: string) => {
                if (status === "ONLINE") {
                    return (
                        <ChipBase
                            color={"success"}
                            label={"TRỰC TUYẾN"}
                            size="small"
                            sx={{
                                fontSize: 12,
                            }}
                        />
                    );
                }
                if (status === "OFFLINE") {
                    return (
                        <ChipBase
                            color={"error"}
                            label={"NGOẠI TUYẾN"}
                            size="small"
                            sx={{
                                fontSize: 12,
                            }}
                        />
                    );
                }
                if (status === "INACTIVE") {
                    return (
                        <ChipBase
                            color={"warning"}
                            label={"NGƯNG HOẠT ĐỘNG"}
                            size="small"
                            sx={{
                                fontSize: 12,
                            }}
                        />
                    );
                }
                return (
                    <ChipBase
                        color={"warning"}
                        label={"INACTIVE"}
                        size="small"
                        sx={{
                            fontSize: 12,
                        }}
                    />
                );
            },
        },
        {
            field: "fullname",
            title: "Tên",
            index: 4,
            type: "string",
            width: "160px",
        },
        {
            field: "email",
            title: "Email",
            index: 5,
            type: "string",
            width: "160px",
        },
        {
            field: "phone",
            title: "Số điện thoại",
            index: 6,
            type: "string",
            width: "160px",
        },
        {
            index: 7,
            field: "roleid",
            type: "number",
            title: "roleId",
            disable: true,
        },
        {
            index: 8,
            field: "avatar",
            type: "string",
            title: "avatar",
            disable: true,
        },
    ];

    const handleClose = useCallback(
        (type: "SAVE" | "CANCEL", data?: AccountDTO, clearErrors?: Function) => {
            if (type === "SAVE") {
                if (data) {
                    if (!data.id) {
                        data.id = undefined;
                        data.status = USER_ENUM.OFFLINE;
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(data.password || "", salt, function (err, hash) {
                                data.password = hash;
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
                            });
                        });
                    } else {
                        if (data.password) {
                            bcrypt.genSalt(10, function (err, salt) {
                                bcrypt.hash(data.password || "", salt, function (err, hash) {
                                    data.password = hash;
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
                                });
                            });
                        } else {
                            data.password = undefined;
                            mutateUpdateWithNoPass(data, {
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

    const viewRowData = (rowData: AccountDTO) => {
        setIsOpenForm(true);
        setData(rowData);
        setViewAction(true);
    };

    const resetData = () => {
        setData(initData);
        setIsOpenForm(false);
    };

    const [index, setIndex] = React.useState(0);

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={index}
                    onChange={(event: React.SyntheticEvent, newValue: number) => {
                        setIndex(newValue);
                    }}
                    aria-label="basic tabs example"
                >
                    {roles?.role?.map((x, key) => {
                        return (
                            <Tab
                                key={x.name}
                                label={`${x.name}(${x.accounts_aggregate.aggregate?.count || 0})`}
                                value={key}
                            />
                        );
                    })}
                </Tabs>
            </Box>
            <AccountForm
                opened={isOpenForm}
                isView={isViewAction}
                data={data}
                handleClose={handleClose}
            />
            {roles?.role?.map((x, key) => {
                return (
                    <TabPanel key={x.name} index={index} value={key}>
                        <CRUDTable
                            queryKey="AccountQuery"
                            columns={columns}
                            title={`Quản lý tài khoản (${x.name})`}
                            entity="account"
                            firstOrderField="id"
                            sort
                            enableFilter
                            defaultFilter={`{roleid: {_eq: ${x.id}}}`}
                            defaultFilterForCount={`{roleid: {_eq: ${x.id}}}`}
                            maxWidth="100%"
                            action={{
                                onView: (rowData: AccountDTO) => viewRowData(rowData),
                                onAdd: () => addRowData(),
                                onEdit: (rowData: AccountDTO) => updateRowData(rowData),
                                onDeleteRecord: (rowData: AccountDTO) => deleteRowData(rowData),
                            }}
                        />
                    </TabPanel>
                );
            })}
        </>
    );
};

export default Account;
