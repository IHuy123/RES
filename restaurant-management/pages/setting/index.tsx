import React, { useCallback, useEffect, useState } from "react";
import {
    Button,
    Card,
    CardContent,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Container,
    Grid,
    Typography,
    ListItem,
    ListItemText,
} from "@mui/material";
import { Box } from "@mui/system";

import LoadingCustomize from "components/Loading";

import { NextPage } from "next";
import RestaurantImage from "containers/setting/RestaurantImage";
import SettingForm from "containers/setting/Form";
import useGetSystemSetting from "hooks/system-setting/useGetSystemSetting";
import useCreateSetting from "hooks/system-setting/useCreateSetting";
import useUpdateSetting from "hooks/system-setting/useUpdateSetting";
import useDeleteSetting from "hooks/system-setting/useDeleteSetting";
import useSnackbar from "components/Snackbar/useSnackbar";
import { CreateSettingMutationMutationVariables, Systemsetting } from "generated/graphql";
import { ConfirmModal } from "components/ConfirmModel";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const Setting: NextPage = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);

    const initData: Systemsetting = {
        id: 0,
        restaurantimage: "",
        restaurantname: "",
        address: "",
        taxvalue: 0,
    };

    const { mutate: mutateCreate } = useCreateSetting("GetSystemSetting");
    const { mutate: mutateUpdate } = useUpdateSetting("GetSystemSetting");
    const { mutate: mutateDelete } = useDeleteSetting("GetSystemSetting");
    const showSnackbar = useSnackbar();
    const [record, setRecord] = useState<Systemsetting>(initData);
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
    const [isOpenConfirmForm, setIsOpenConfirmForm] = useState<boolean>(false);
    const openPopUpCreate = () => {
        setIsOpenForm(true);
        setRecord(initData);
    };

    const openPopUpUpdate = (setting: Systemsetting) => {
        setIsOpenForm(true);
        setRecord({
            ...setting,
        });
    };

    const openDeleteSetting = (setting: Systemsetting) => {
        setIsOpenConfirmForm(true);
        setRecord({
            ...setting,
        });
    };

    const { data, isLoading } = useGetSystemSetting();

    const resetData = () => {
        setRecord(initData);
        setIsOpenForm(false);
    };

    const handleCloseConfirmModal = async (
        e: React.MouseEvent<HTMLButtonElement | MouseEvent>,
        action: "CONFIRM" | "CANCEL"
    ) => {
        if (action === "CONFIRM") {
            mutateDelete(
                {
                    id: record.id,
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
        setIsOpenConfirmForm(false);
    };

    const handleClose = useCallback(
        (type: "SAVE" | "CANCEL", data?: Systemsetting, clearErrors?: Function) => {
            if (type === "SAVE") {
                if (data) {
                    if (!data.id) {
                        // eslint-disable-next-line unused-imports/no-unused-vars
                        const { id, ...rest } = data;
                        const record: CreateSettingMutationMutationVariables = {
                            ...rest,
                        };
                        mutateCreate(record, {
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
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    if (data?.systemsetting.length === 0) {
        return (
            <>
                <SettingForm opened={isOpenForm} data={record} handleClose={handleClose} />
                <Box sx={{ mt: 10 }}>
                    <Typography variant="h6" align="center">
                        Hiện tại chưa có setting cho hệ thống, Vui lòng tạo mới!
                    </Typography>
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            sx={{ mt: 3 }}
                            color="primary"
                            variant="contained"
                            onClick={() => openPopUpCreate()}
                        >
                            {"Tạo mới"}
                        </Button>
                    </Box>
                </Box>
            </>
        );
    }
    const setting = data?.systemsetting[0];
    return (
        <>
            <ConfirmModal
                open={isOpenConfirmForm}
                message={"Bạn có muốn xóa cấu hình hệ thống hiện tại?"}
                handleClose={handleCloseConfirmModal}
            />
            <SettingForm opened={isOpenForm} data={record} handleClose={handleClose} />
            <LoadingCustomize isLoading={isLoading}>
                <Card>
                    <CardContent sx={{ height: "100%", width: "100%" }}>
                        <Container maxWidth="lg">
                            <Grid
                                container
                                columnSpacing={5}
                                mt={2}
                                display="flex"
                                sx={{
                                    flexDirection: { xs: "column", lg: "row" },
                                    alignItems: { xs: "center", lg: "stretch" },
                                    justifyContent: { xs: "center", lg: "flex-start" },
                                }}
                            >
                                <Grid item lg={6} md={10} xs={12}>
                                    {setting && (
                                        <RestaurantImage image={setting?.restaurantimage || ""} />
                                    )}
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={12}
                                    xs={12}
                                    width={1}
                                    display="flex"
                                    flexDirection="column"
                                    gap={2}
                                    sx={{
                                        marginTop: { xs: 3, lg: 0 },
                                    }}
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        sx={{
                                            justifyContent: { xs: "center", lg: "flex-start" },
                                        }}
                                    >
                                        <Typography
                                            variant="h5"
                                            fontWeight={600}
                                            textTransform="uppercase"
                                            textAlign="center"
                                        >
                                            {setting?.restaurantname || "N/A"}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Box
                                            mt={2}
                                            sx={{
                                                display: "flex",
                                            }}
                                        >
                                            <TableContainer component={Paper}>
                                                <Table width="100%">
                                                    <TableBody>
                                                        <StyledTableRow
                                                            style={{
                                                                verticalAlign: "middle",
                                                            }}
                                                        >
                                                            <TableCell align="left" padding="none">
                                                                <ListItem>
                                                                    <ListItemText
                                                                        primary={
                                                                            <Typography
                                                                                variant="body2"
                                                                                align="left"
                                                                                sx={{
                                                                                    fontWeight:
                                                                                        "bold",
                                                                                }}
                                                                            >
                                                                                {"Tên nhà hàng"}
                                                                            </Typography>
                                                                        }
                                                                    />
                                                                </ListItem>
                                                            </TableCell>
                                                            <TableCell align="left" padding="none">
                                                                <ListItem>
                                                                    <ListItemText
                                                                        primary={
                                                                            <Typography
                                                                                variant="body2"
                                                                                align="left"
                                                                            >
                                                                                {setting?.restaurantname ||
                                                                                    "N/A"}
                                                                            </Typography>
                                                                        }
                                                                    />
                                                                </ListItem>
                                                            </TableCell>
                                                        </StyledTableRow>
                                                        <StyledTableRow
                                                            style={{
                                                                verticalAlign: "middle",
                                                            }}
                                                        >
                                                            <TableCell align="left" padding="none">
                                                                <ListItem>
                                                                    <ListItemText
                                                                        primary={
                                                                            <Typography
                                                                                variant="body2"
                                                                                align="left"
                                                                                sx={{
                                                                                    fontWeight:
                                                                                        "bold",
                                                                                }}
                                                                            >
                                                                                {"Địa chỉ"}
                                                                            </Typography>
                                                                        }
                                                                    />
                                                                </ListItem>
                                                            </TableCell>
                                                            <TableCell align="left" padding="none">
                                                                <ListItem>
                                                                    <ListItemText
                                                                        primary={
                                                                            <>
                                                                                <Box
                                                                                    sx={{
                                                                                        display:
                                                                                            "flex",
                                                                                    }}
                                                                                >
                                                                                    {setting?.address ||
                                                                                        "N/A"}
                                                                                </Box>
                                                                            </>
                                                                        }
                                                                    />
                                                                </ListItem>
                                                            </TableCell>
                                                        </StyledTableRow>
                                                        <StyledTableRow
                                                            style={{
                                                                verticalAlign: "middle",
                                                            }}
                                                        >
                                                            <TableCell align="left" padding="none">
                                                                <ListItem>
                                                                    <ListItemText
                                                                        primary={
                                                                            <Typography
                                                                                variant="body2"
                                                                                align="left"
                                                                                sx={{
                                                                                    fontWeight:
                                                                                        "bold",
                                                                                }}
                                                                            >
                                                                                {"Mã số thuế"}
                                                                            </Typography>
                                                                        }
                                                                    />
                                                                </ListItem>
                                                            </TableCell>
                                                            <TableCell align="left" padding="none">
                                                                <ListItem>
                                                                    <ListItemText
                                                                        primary={
                                                                            <Typography
                                                                                variant="body2"
                                                                                align="left"
                                                                            >
                                                                                {setting?.taxvalue ||
                                                                                    "N/A"}
                                                                            </Typography>
                                                                        }
                                                                    />
                                                                </ListItem>
                                                            </TableCell>
                                                        </StyledTableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    </Box>
                                    <Box
                                        display="flex"
                                        justifyContent="flex-end"
                                        alignItems="center"
                                        mt={3}
                                    >
                                        {setting && (
                                            <Box display={"flex"} columnGap={2}>
                                                <Button
                                                    color="error"
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => openDeleteSetting(setting)}
                                                >
                                                    {"Xóa cấu hình"}
                                                </Button>
                                                <Button
                                                    color="primary"
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => openPopUpUpdate(setting)}
                                                >
                                                    {"Chỉnh sửa"}
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Container>
                    </CardContent>
                </Card>
            </LoadingCustomize>
        </>
    );
};

export default Setting;
