/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import { Button, Grid, MenuItem, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { IForm } from "utils/common";
import CardContainer from "components/Card/Container";
import TextfieldBase from "components/BaseTextField";
import { Item } from "generated/graphql";
import ReactHookFormSelect from "components/SelectBase";
import { BASIC_ENUM } from "utils/enums";
import CustomizeAutocomplete from "components/CustomizedAutocomplete";
import useSnackbar from "components/Snackbar/useSnackbar";
import useGetMajorGroup from "hooks/major-group/useGetMajorGroup";
import { handleUpload } from "configurations/firebase";

export interface ItemMutationType {
    id?: Item["id"];
    name: Item["name"];
    status: Item["status"];
    image: Item["image"];
    majorgroupid: Item["majorgroupid"];
}

const ItemForm: React.FC<IForm<ItemMutationType>> = (props: IForm<ItemMutationType>) => {
    const { mutate } = useGetMajorGroup("");
    const showSnackbar = useSnackbar();
    const ref = React.useRef<HTMLInputElement | null>(null);
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
    } = useForm<ItemMutationType>({});

    const [image, setImage] = React.useState("");
    const [file, setFile] = React.useState<File | null>(null);
    const uploadProfilePic = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = () => {
                if (reader.result !== null) {
                    setImage(reader.result.toString());
                }
            };
            setFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        setValue("id", defaultData.id);
        setValue("name", defaultData.name);
        setValue("image", defaultData.image);
        setValue("status", defaultData.status || BASIC_ENUM.ACTIVE);
        setValue("majorgroupid", defaultData.majorgroupid);
    }, [defaultData, setValue]);

    const submitHandler: SubmitHandler<ItemMutationType> = async (data: ItemMutationType) => {
        try {
            if (data) {
                mutate(
                    {
                        id: data.majorgroupid,
                    },
                    {
                        async onSuccess(dataLc) {
                            if (dataLc.majorgroup_by_pk?.status === "INACTIVE") {
                                showSnackbar({
                                    children: "Nhóm thức ăn này không hoạt động",
                                    severity: "error",
                                });
                                return;
                            }
                            if (data) {
                                if (file && image) {
                                    data.image = await handleUpload(file);
                                }
                            }
                            props.handleClose("SAVE", data, () => {
                                clearErrors();
                                unregister();
                                setFile(null);
                                setImage("");
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
                                ? "Chi tiết món ăn"
                                : "Chỉnh sửa món ăn"
                            : "Tạo mới món ăn"}
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
                            display: "flex",
                            justifyContent: "center",
                            backgroundSize: "cover",
                        }}
                    >
                        <img
                            alt="ReFmy Sharp"
                            src={
                                image ||
                                defaultData.image ||
                                "https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg"
                            }
                            width={"auto"}
                            height={240}
                            style={{
                                alignItems: "center",
                                cursor: isView ? "default" : "pointer",
                            }}
                            onClick={() => {
                                if (!isView) {
                                    ref.current?.click();
                                }
                            }}
                        />
                        <input
                            type="file"
                            onChange={uploadProfilePic}
                            style={{
                                display: "none",
                            }}
                            ref={ref}
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
                        <TextfieldBase
                            id="name"
                            label={"Tên món ăn"}
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
                                    message: "Tên món ăn là bắt buộc!",
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
                            defaultId={!!defaultData.id ? defaultData.majorgroupid : undefined}
                            conditionField=""
                            control={control}
                            rules={{
                                min: {
                                    value: 1,
                                    message: "Nhóm thức ăn là bắt buộc",
                                },
                            }}
                            readonly={isView}
                            name="majorgroupid"
                            entity="majorgroup"
                            displayField="name"
                            label={"Nhóm thức ăn"}
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
                                props.handleClose("CANCEL", undefined, () => {
                                    clearErrors();
                                    unregister();
                                    setFile(null);
                                    setImage("");
                                });
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

export default React.memo(ItemForm);
