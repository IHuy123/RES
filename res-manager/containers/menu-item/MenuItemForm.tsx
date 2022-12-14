import React, { useEffect } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { Button, Grid, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { IForm } from "utils/common";
import CardContainer from "components/Card/Container";
import { Menuitem } from "generated/graphql";
import CustomizeAutocomplete from "components/CustomizedAutocomplete";
import { CurrencyFormatInput } from "components/NumberInput";

export interface MenuItemMutationType {
    id?: Menuitem["id"];
    menuid: Menuitem["menuid"];
    itemid: Menuitem["itemid"];
    price: Menuitem["price"];
}

const MenuItemForm: React.FC<IForm<MenuItemMutationType>> = (
    props: IForm<MenuItemMutationType>
) => {
    const { data: defaultData, isView } = props;
    const { handleSubmit, setValue, clearErrors, control, unregister } =
        useForm<MenuItemMutationType>({});

    useEffect(() => {
        setValue("id", defaultData.id);
        setValue("itemid", defaultData.itemid);
        setValue("menuid", defaultData.menuid);
        setValue("price", defaultData.price);
    }, [defaultData, setValue]);

    const submitHandler: SubmitHandler<MenuItemMutationType> = async (
        data: MenuItemMutationType
    ) => {
        try {
            if (data) {
                props.handleClose("SAVE", data, () => {
                    clearErrors();
                    unregister();
                });
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
                                ? "Chi tiết mục thực đơn"
                                : "Chỉnh sửa mục thực đơn"
                            : "Thêm món ăn vào thực đơn"}
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
                        <CustomizeAutocomplete
                            defaultId={!!defaultData.id ? defaultData.menuid : undefined}
                            conditionField=""
                            control={control}
                            rules={{
                                min: {
                                    value: 1,
                                    message: "Thực đơn là bắt buộc",
                                },
                            }}
                            readonly={isView}
                            name="menuid"
                            entity="menu"
                            displayField="name"
                            label={"Thực đơn"}
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
                        <CustomizeAutocomplete
                            defaultId={!!defaultData.id ? defaultData.itemid : undefined}
                            conditionField=""
                            control={control}
                            rules={{
                                min: {
                                    value: 1,
                                    message: "Món ăn là bắt buộc",
                                },
                            }}
                            readonly={isView}
                            name="itemid"
                            entity="item"
                            displayField="name"
                            label={"Món ăn"}
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
                        <CurrencyFormatInput
                            control={control}
                            required
                            name="price"
                            label="Giá món ăn"
                            rules={{
                                required: {
                                    value: true,
                                    message: "Giá món ăn là bắt buộc",
                                },
                                min: {
                                    value: 1000,
                                    message: "Giá nhỏ nhất là 1.000VNĐ",
                                },
                                max: {
                                    value: 100000000,
                                    message: "Giá lớn nhất là 100.000.000VNĐ",
                                },
                            }}
                            fullWidth
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

export default React.memo(MenuItemForm);
