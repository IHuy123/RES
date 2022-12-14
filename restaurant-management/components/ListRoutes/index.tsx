import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

import RoutesCollapse from "./components/RoutesCollapse";

import { routes } from "./data";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import LockResetIcon from "@mui/icons-material/LockReset";
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    Collapse,
    List,
    ListItemButton,
    useTheme,
} from "@mui/material";
import Image from "next/image";
import _ from "lodash";
import LogoutIcon from "@mui/icons-material/Logout";
import UpdateProfileForm from "containers/accounts/UpdateProfileForm";
import { LoginQueryQuery } from "generated/graphql";
import { USER_ENUM } from "utils/enums";
import AccountDTO from "models/account.model";
import bcrypt from "bcryptjs";
import useUpdateAccount from "hooks/account/useUpdateAccount";
import useLogin from "hooks/login/useLogin";
import useSnackbar from "components/Snackbar/useSnackbar";
import useUpdateAccountWithNoPass from "hooks/account/useUpdateAccountWithNoPass";
import useDeleteAccount from "hooks/account/useDeleteAccount";

export type ChildrenType = {
    fatherIndex: number;
    selectedChildIndex: number;
    isOpen: boolean;
};

type ListRoutesType = {
    appbarHeight: number;
    user:
        | Partial<{
              firstName?: string;
              avatar?: string;
          }>
        | undefined;
};

const initialValue = {
    fatherIndex: -1,
    selectedChildIndex: -1,
    isOpen: false,
};

const ListRoutes: React.FC<ListRoutesType> = ({ appbarHeight, user }) => {
    const theme = useTheme();
    const router = useRouter();
    const [openUserInfo, setOpenUserInfor] = useState<boolean>(false);
    const { mutate: mutateUpdate } = useUpdateAccount("AccountQuery");
    const { mutate: mutateUpdateNoPass } = useUpdateAccountWithNoPass("AccountQuery");
    const { mutate: login } = useLogin();
    const showSnackbar = useSnackbar();
    // const [isOpenFormChangePassword, setOpenFormChangePassword] = useState<boolean>(false);
    const [userCurrent, setUserCurrent] = useState<LoginQueryQuery>();
    const { mutate: mutateDelete } = useDeleteAccount("xxx");

    useEffect(() => {
        // Perform localStorage action
        setUserCurrent(JSON.parse(localStorage.getItem("user") || "{}"));
    }, []);
    const [openChildren, setOpenChildren] = useState<ChildrenType>(initialValue);
    useEffect(() => {
        let itemSelectedFromSessionStorage = null;
        let select: ChildrenType = initialValue;
        let split = router.asPath.slice(1).split("/");
        let routerExecute = split.length > 0 ? `/${split[0]}` : router.asPath;
        routes.forEach((item) => {
            if (!_.isEqual(select, initialValue)) {
                return;
            }
            if (item.path) {
                _.isEqual(routerExecute, item.path) &&
                    (select = {
                        fatherIndex: item.id,
                        selectedChildIndex: item.id,
                        isOpen: true,
                    });
            } else if (item.children) {
                let objectSelected = item.children.find((item) =>
                    _.isEqual(routerExecute, item.path)
                );
                objectSelected &&
                    (select = {
                        fatherIndex: item.id,
                        selectedChildIndex: objectSelected.id,
                        isOpen: true,
                    });
            }
        });
        if (window.sessionStorage != undefined) {
            itemSelectedFromSessionStorage = window.sessionStorage.getItem("itemSelected");
        }
        if (itemSelectedFromSessionStorage !== null) {
            if (
                _.isEqual(
                    select,
                    JSON.parse(itemSelectedFromSessionStorage) && !_.isEqual(select, initialValue)
                )
            ) {
                setOpenChildren(JSON.parse(itemSelectedFromSessionStorage));
            } else if (!_.isEqual(select, initialValue)) {
                setOpenChildren(select);
            } else if (!_.isEqual(JSON.parse(itemSelectedFromSessionStorage), initialValue)) {
                setOpenChildren(JSON.parse(itemSelectedFromSessionStorage));
            }
        } else if (!_.isEqual(select, initialValue)) {
            setOpenChildren(select);
        }
    }, [router]);

    useEffect(() => {
        if (!_.isEqual(openChildren, initialValue)) {
            window.sessionStorage.setItem("itemSelected", JSON.stringify(openChildren));
        }
    }, [openChildren]);
    const handleListItemClick = (
        index: number,
        path: string | undefined,
        hasChildren: boolean,
        fatherIndex: number
    ) => {
        if (path) {
            router.push(path);
        }
        if (hasChildren) {
            setOpenChildren((prev) => {
                return {
                    ...prev,
                    fatherIndex: fatherIndex,
                    selectedChildIndex: index,
                    isOpen: prev.fatherIndex != fatherIndex ? true : !prev.isOpen,
                };
            });
        } else {
            setOpenChildren((prev) => {
                return {
                    ...prev,
                    selectedChildIndex: index,
                    fatherIndex: fatherIndex,
                    isOpen: true,
                };
            });
        }
    };

    const handleClose = (type: "SAVE" | "CANCEL", data?: AccountDTO, clearErrors?: Function) => {
        if (type === "SAVE") {
            if (data) {
                if (data.id) {
                    if (data.password) {
                        bcrypt.genSalt(10, function (err, salt) {
                            bcrypt.hash(data.password || "", salt, function (err, hash) {
                                data.password = hash;
                                mutateUpdate(data, {
                                    onSuccess: () => {
                                        login(
                                            {
                                                _eq: data.username,
                                            },
                                            {
                                                onSuccess(dataLogin) {
                                                    localStorage.setItem(
                                                        "user",
                                                        JSON.stringify(dataLogin)
                                                    );
                                                    setOpen(false);
                                                    showSnackbar({
                                                        children: "Chỉnh sửa thành công",
                                                        severity: "success",
                                                    });
                                                    window.location.reload();
                                                },
                                            }
                                        );
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
                        mutateUpdateNoPass(data, {
                            onSuccess: () => {
                                login(
                                    {
                                        _eq: data.username,
                                    },
                                    {
                                        onSuccess(dataLogin) {
                                            localStorage.setItem("user", JSON.stringify(dataLogin));
                                            setOpen(false);
                                            showSnackbar({
                                                children: "Chỉnh sửa thành công",
                                                severity: "success",
                                            });
                                            window.location.reload();
                                        },
                                    }
                                );
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
        } else {
            setOpen(false);
        }
        if (clearErrors) {
            clearErrors();
        }
    };

    const logout = async () => {
        mutateDelete(
            {
                id: (userCurrent && userCurrent?.account && userCurrent?.account[0]?.id) || 0,
                status: USER_ENUM.OFFLINE,
            },
            {
                onSuccess: () => {
                    localStorage.clear();
                    window.location.replace("https://binhtruongthanh.tech/login");
                },
            }
        );
    };

    const [open, setOpen] = useState(false);

    const changePasswordData = () => {
        // setOpenFormChangePassword(true);
    };

    const changeProfile = () => {
        setOpen(true);
    };

    return (
        <React.Fragment>
            {/* <ChangePasswordForm
                opened={isOpenFormChangePassword}
                handleClose={handleClose}
                phoneNumber={user?.phoneNumber || ""}
            /> */}
            {/* <Toolbar /> */}
            <Box
                style={{
                    overflowY: "auto",
                    height: "100%",
                }}
            >
                <UpdateProfileForm
                    opened={open}
                    isView={false}
                    data={{
                        email:
                            userCurrent?.account && userCurrent?.account[0]
                                ? userCurrent?.account[0].email
                                : "",
                        fullname:
                            userCurrent?.account && userCurrent?.account[0]
                                ? userCurrent?.account[0].fullname
                                : "",
                        phone:
                            userCurrent?.account && userCurrent?.account[0]
                                ? userCurrent?.account[0].phone
                                : "",
                        username:
                            userCurrent?.account && userCurrent?.account[0]
                                ? userCurrent?.account[0].username
                                : "",
                        roleid:
                            userCurrent?.account && userCurrent?.account[0]
                                ? userCurrent?.account[0].roleid
                                : 0,
                        avatar:
                            userCurrent?.account && userCurrent?.account[0]
                                ? userCurrent?.account[0].avatar
                                : "",
                        id:
                            userCurrent?.account && userCurrent?.account[0]
                                ? userCurrent?.account[0].id
                                : 0,
                        status:
                            userCurrent?.account && userCurrent?.account[0]
                                ? userCurrent?.account[0].status
                                : USER_ENUM.INACTIVE,
                    }}
                    handleClose={handleClose}
                />
                <Box
                    sx={{
                        marginTop: `${appbarHeight}px`,
                        backgroundColor: "#20252a",
                        color: "#FFFFFF",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <Box
                        sx={{
                            padding: "0px",
                            cursor: "pointer",
                            color: "#FFFFF",
                            fontWeight: 600,
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background:
                                    "linear-gradient(90deg, rgba(213,239,252,1) 50%, rgba(255,221,238,1) 100%)",
                                boxShadow: "inset 0 0 0 2000px rgb(0, 0, 0, .05)",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                            }}
                        ></Box>
                        <ListItem
                            button
                            sx={{
                                width: "100%",
                            }}
                            onClick={() => setOpenUserInfor(!openUserInfo)}
                        >
                            <ListItemText
                                style={{
                                    fontWeight: "800 !important",
                                    fontSize: "28px",
                                    color: "rgb(0,0,0)",
                                }}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: "inline" }}
                                            component="span"
                                            variant="body2"
                                        >
                                            ADMIN
                                        </Typography>
                                    </React.Fragment>
                                }
                            >
                                {`Administrator`}
                            </ListItemText>
                            {openUserInfo ? <ExpandLess /> : <ExpandMore />}
                        </ListItem>
                        <Collapse in={openUserInfo} timeout="auto" unmountOnExit>
                            <List
                                component="div"
                                disablePadding
                                style={{
                                    backgroundColor: "#2d353c",
                                }}
                            >
                                <ListItemButton
                                    sx={{
                                        color: "rgba(255,255,255, 0.6)",
                                    }}
                                    onClick={() => changePasswordData()}
                                >
                                    <ListItemIcon>
                                        <LockResetIcon
                                            sx={{
                                                color: "rgba(255,255,255, 0.6)",
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        onClick={() => changeProfile()}
                                        primary={"Thông tin cá nhân"}
                                    />
                                </ListItemButton>
                                <ListItemButton
                                    sx={{
                                        color: "rgba(255,255,255, 0.6)",
                                    }}
                                    onClick={() => logout()}
                                >
                                    <ListItemIcon>
                                        <LogoutIcon
                                            sx={{
                                                color: "rgba(255,255,255, 0.6)",
                                            }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={"Đăng xuất"} />
                                </ListItemButton>
                            </List>
                        </Collapse>
                    </Box>
                </Box>
                {routes.map((item) => (
                    <React.Fragment key={item.name}>
                        <ListItem
                            button
                            key={item.name}
                            onClick={() =>
                                handleListItemClick(
                                    item.id,
                                    item.path,
                                    Boolean(item.children),
                                    item.id
                                )
                            }
                            style={
                                !item?.children && openChildren.fatherIndex === item.id
                                    ? {
                                          transition: "ease-in-out .4s",
                                          borderRight: `3px solid ${theme.palette.primary.main}`,
                                      }
                                    : {}
                            }
                            selected={openChildren.fatherIndex === item.id}
                        >
                            <ListItemIcon
                                style={{
                                    minWidth: "50px",
                                }}
                            >
                                <Image src={item.icon} width={30} height={30} alt={"icon"} />
                            </ListItemIcon>
                            <ListItemText primary={`${item.name}`} />
                            {item?.children ? (
                                openChildren.fatherIndex == item.id && openChildren.isOpen ? (
                                    <ExpandLess />
                                ) : (
                                    <ExpandMore />
                                )
                            ) : null}
                        </ListItem>
                        {item?.children ? (
                            <RoutesCollapse
                                item={item?.children}
                                fatherId={item?.id}
                                handleListItemClick={handleListItemClick}
                                openChildren={openChildren}
                            />
                        ) : null}
                    </React.Fragment>
                ))}
            </Box>
        </React.Fragment>
    );
};

export default ListRoutes;
