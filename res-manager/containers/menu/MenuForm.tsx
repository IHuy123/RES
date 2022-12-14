import React, { useEffect } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { Button, Grid, MenuItem, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { IForm } from "utils/common";
import CardContainer from "components/Card/Container";
import TextfieldBase from "components/BaseTextField";
import { Menu } from "generated/graphql";
import ReactHookFormSelect from "components/SelectBase";
import { BASIC_ENUM } from "utils/enums";
import CustomizeAutocomplete from "components/CustomizedAutocomplete";
import useSnackbar from "components/Snackbar/useSnackbar";
import useGetMealType from "hooks/meal-type/useGetMealType";
import SwitchBase from "components/SwitchBase";

export interface MenuMutationType {
    id?: Menu["id"];
    name: Menu["name"];
    status: Menu["status"];
    isdefault: Menu["isdefault"];
    mealtypeid: Menu["mealtypeid"];
}

const MenuForm: React.FC<IForm<MenuMutationType>> = (props: IForm<MenuMutationType>) => {
    const { mutate } = useGetMealType("");
    const showSnackbar = useSnackbar();
    const { data: defaultData, isView } = props;
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        getValues,
        clearErrors,
        control,
        unregister,
    } = useForm<MenuMutationType>({});

    useEffect(() => {
        setValue("id", defaultData.id);
        setValue("name", defaultData.name);
        setValue("isdefault", defaultData.isdefault);
        setValue("status", defaultData.status || BASIC_ENUM.ACTIVE);
        setValue("mealtypeid", defaultData.mealtypeid);
    }, [defaultData, setValue]);

    const submitHandler: SubmitHandler<MenuMutationType> = async (data: MenuMutationType) => {
        try {
            if (data) {
                mutate(
                    {
                        id: data.mealtypeid,
                    },
                    {
                        async onSuccess(dataLc) {
                            if (dataLc.mealtype_by_pk?.status === "INACTIVE") {
                                showSnackbar({
                                    children: "Bữa ăn này không hoạt động",
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
                                ? "Chi tiết thực đơn"
                                : "Chỉnh sửa thực đơn"
                            : "Tạo mới thực đơn"}
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
                            label={"Tên thực đơn"}
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
                                    message: "Tên thực đơn là bắt buộc!",
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
                        <SwitchBase control={control} label="Thực đơn mặc định" name="isdefault" />
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
                            <MenuItem value={BASIC_ENUM.ACTIVE}>Đang hoạt động</MenuItem>
                            <MenuItem value={BASIC_ENUM.INACTIVE}>Ngừng hoạt động</MenuItem>
                        </ReactHookFormSelect>
                        <CustomizeAutocomplete
                            defaultId={!!defaultData.id ? defaultData.mealtypeid : undefined}
                            conditionField=""
                            control={control}
                            rules={{
                                min: {
                                    value: 1,
                                    message: "Bữa ăn là bắt buộc",
                                },
                            }}
                            readonly={isView}
                            name="mealtypeid"
                            entity="mealtype"
                            displayField="name"
                            label={"Bữa ăn"}
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
                            <Button
                                disabled={Boolean(
                                    defaultData.id && defaultData.isdefault && !watch("isdefault")
                                )}
                                variant="contained"
                                type="submit"
                                autoFocus
                            >
                                {defaultData.id ? "Chỉnh sửa" : "Tạo mới"}
                            </Button>
                        )}
                    </Box>
                </Grid>
            </CardContainer>
        </Modal>
    );
};

export default React.memo(MenuForm);
