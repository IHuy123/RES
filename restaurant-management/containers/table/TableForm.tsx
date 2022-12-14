import React, { useEffect } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { Button, Grid, MenuItem, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { IForm } from "utils/common";
import CardContainer from "components/Card/Container";
import TextfieldBase from "components/BaseTextField";
import { Table } from "generated/graphql";
import ReactHookFormSelect from "components/SelectBase";
import { TABLE_ENUM } from "utils/enums";
import { NumberFormatInput } from "components/NumberInput";
import CustomizeAutocomplete from "components/CustomizedAutocomplete";
import useGetLocation from "hooks/location/useGetLocation";
import useSnackbar from "components/Snackbar/useSnackbar";

export interface TableMutationType {
    id?: Table["id"];
    name: Table["name"];
    status: Table["status"];
    seat: Table["seat"];
    locationid: Table["locationid"];
}

const TableForm: React.FC<IForm<TableMutationType>> = (props: IForm<TableMutationType>) => {
    const { mutate } = useGetLocation("");
    const showSnackbar = useSnackbar();
    const { data: defaultData, isView } = props;
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        clearErrors,
        control,
        unregister,
    } = useForm<TableMutationType>({});

    useEffect(() => {
        setValue("id", defaultData.id);
        setValue("name", defaultData.name);
        setValue("status", defaultData.status || TABLE_ENUM.NOT_USE);
        setValue("locationid", defaultData.locationid);
        setValue("seat", defaultData.seat);
    }, [defaultData, setValue]);

    const submitHandler: SubmitHandler<TableMutationType> = async (data: TableMutationType) => {
        try {
            if (data) {
                mutate(
                    {
                        id: data.locationid,
                    },
                    {
                        onSuccess(dataLc) {
                            if (dataLc.location_by_pk?.status === "INACTIVE") {
                                showSnackbar({
                                    children: "Khu vực này không hoạt động",
                                    severity: "error",
                                });
                                return;
                            }
                            props.handleClose("SAVE", data, () => {
                                clearErrors();
                                unregister();
                            });
                        },
                    }
                );
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    };

    return (
        <Modal open={props.opened}>
            <CardContainer width="90%" maxWidth={820}>
                <Box sx={{ display: "flex", justifyContent: "center", m: 3 }}>
                    <Typography variant="h6" component="h2">
                        {defaultData.id
                            ? props.isView
                                ? "Chi tiết bàn ăn"
                                : "Chỉnh sửa bàn ăn"
                            : "Tạo mới bàn ăn"}
                    </Typography>
                </Box>
                <Grid
                    component="form"
                    onSubmit={handleSubmit(submitHandler)}
                    sx={{
                        "& > :not(style)": {
                            m: 2,
                            display: "flex",
                        },
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        gap={3}
                        display="flex"
                        sx={{
                            flexWrap: { xs: "wrap", md: "nowrap" },
                        }}
                    >
                        <TextfieldBase
                            id="name"
                            label={"Tên bàn ăn"}
                            variant="outlined"
                            InputProps={{
                                readOnly: isView,
                            }}
                            required
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name && errors.name.message}
                            {...register("name", {
                                required: {
                                    value: true,
                                    message: "Tên bàn ăn là bắt buộc!",
                                },
                                onBlur: () =>
                                    setValue(
                                        "name",
                                        getValues("name")
                                            ? getValues("name").trim()
                                            : getValues("name")
                                    ),
                            })}
                        />
                        <NumberFormatInput
                            control={control}
                            name="seat"
                            label="Số chỗ ngồi"
                            rules={{
                                required: {
                                    value: true,
                                    message: "Số chỗ ngồi là bắt buộc",
                                },
                                min: {
                                    value: 1,
                                    message: "Phải có ít nhất 1 chỗ ngồi",
                                },
                                max: {
                                    value: 100,
                                    message: "Có tối đa 100 chỗ ngồi",
                                },
                            }}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        gap={3}
                        display="flex"
                        sx={{
                            flexWrap: { xs: "wrap", md: "nowrap" },
                        }}
                    >
                        <ReactHookFormSelect
                            fullWidth
                            control={control}
                            label="Trạng thái"
                            name="status"
                            readOnly={isView}
                        >
                            <MenuItem value={TABLE_ENUM.NOT_USE}>Không được sử dụng</MenuItem>
                            <MenuItem value={TABLE_ENUM.IN_USE}>Đang được sử dụng</MenuItem>
                            <MenuItem value={TABLE_ENUM.INACTIVE}>Ngừng hoạt động</MenuItem>
                        </ReactHookFormSelect>
                        <CustomizeAutocomplete
                            defaultId={!!defaultData.id ? defaultData.locationid : undefined}
                            conditionField=""
                            control={control}
                            rules={{
                                min: {
                                    value: 1,
                                    message: "Khu vực là bắt buộc",
                                },
                            }}
                            readonly={isView}
                            name="locationid"
                            entity="location"
                            displayField="name"
                            label={"Khu vực"}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column-reverse", sm: "row" },
                            justifyContent: "center",
                            mx: "auto",
                            p: 1,
                            m: 1,
                            "& > :not(style)": { m: 1 },
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => {
                                props.handleClose("CANCEL", undefined, clearErrors);
                            }}
                        >
                            {"Trở về"}
                        </Button>
                        {isView || (
                            <Button variant="contained" type="submit" autoFocus>
                                {defaultData.id ? "Chỉnh sửa" : "Tạo mới"}
                            </Button>
                        )}
                    </Box>
                </Grid>
            </CardContainer>
        </Modal>
    );
};

export default React.memo(TableForm);
