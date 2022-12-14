import React, { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Grid, Modal, Typography, Box } from "@mui/material";
import { IForm } from "utils/common";
import CardContainer from "components/Card/Container";
import TextfieldBase from "components/BaseTextField";
import { Systemsetting } from "generated/graphql";
import Image from "next/image";
import { NumberFormatInput } from "components/NumberInput";
import { handleUpload } from "configurations/firebase";

const SettingForm: React.FC<IForm<Systemsetting>> = (props: IForm<Systemsetting>) => {
    const ref = useRef<HTMLInputElement | null>(null);
    const [avatar, setAvatar] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const { data: defaultData, isView } = props;
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        clearErrors,
        control,
    } = useForm<Systemsetting>({});

    useEffect(() => {
        setValue("id", defaultData.id);
        setValue("restaurantimage", defaultData.restaurantimage);
        setValue("restaurantname", defaultData.restaurantname);
        setValue("taxvalue", defaultData.taxvalue);
        setValue("address", defaultData.address);
    }, [defaultData, setValue]);

    const submitHandler: SubmitHandler<Systemsetting> = async (data: Systemsetting) => {
        try {
            if (data) {
                if (file && avatar) {
                    data.restaurantimage = await handleUpload(file);
                }
                props.handleClose("SAVE", data, clearErrors);
            }
            setAvatar("");
            setFile(null);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    };

    const uploadProfilePic = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = () => {
                if (reader.result !== null) {
                    setAvatar(reader.result.toString());
                    setFile(e.target.files && e.target.files[0]);
                }
            };
        }
    };

    return (
        <Modal open={props.opened}>
            <CardContainer width="90%" maxWidth={820}>
                <Box sx={{ display: "flex", justifyContent: "center", m: 3 }}>
                    <Typography variant="h6" component="h2">
                        {defaultData.id
                            ? props.isView
                                ? "Xem c???u h??nh h??? th???ng"
                                : "Ch???nh s???a c???u h??nh h??? th???ng"
                            : "T???o m???i c???u h??nh h??? th???ng"}
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
                            mb: 5,
                        }}
                    >
                        <Image
                            alt="Remy Sharp"
                            src={
                                avatar ||
                                defaultData.restaurantimage ||
                                "https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg"
                            }
                            width={300}
                            height={300}
                            style={{
                                cursor: "pointer",
                            }}
                            onClick={() => {
                                ref.current?.click();
                            }}
                            // sx={{ width: 80, height: 80, alignItems: "center" }}
                        ></Image>
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
                            id="restaurantname"
                            label={"T??n nh?? h??ng"}
                            variant="outlined"
                            InputProps={{
                                readOnly: isView,
                            }}
                            required
                            fullWidth
                            error={!!errors.restaurantname}
                            helperText={errors.restaurantname && errors.restaurantname.message}
                            {...register("restaurantname", {
                                required: {
                                    value: true,
                                    message: "T??n nh?? h??ng l?? b???t bu???c!",
                                },
                                maxLength: {
                                    value: 50,
                                    message: "T??n nh?? h??ng t???i ??a 50 k?? t???",
                                },
                                onBlur: () =>
                                    setValue(
                                        "restaurantname",
                                        getValues("restaurantname")
                                            ? getValues("restaurantname").trim()
                                            : getValues("restaurantname")
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
                        <TextfieldBase
                            id="address"
                            label={"?????a ch???"}
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                readOnly: isView,
                            }}
                            required
                            error={!!errors.address}
                            helperText={errors.address && errors.address.message}
                            {...register("address", {
                                required: {
                                    value: true,
                                    message: "?????a ch??? l?? b???t bu???c",
                                },
                                onBlur: () =>
                                    setValue(
                                        "address",
                                        getValues("address")
                                            ? getValues("address").trim()
                                            : getValues("address")
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
                        <NumberFormatInput
                            control={control}
                            name="taxvalue"
                            label="Thu??? c???a h??ng"
                            rules={{ required: true, min: 1, max: 100 }}
                            fullWidth
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        display="flex"
                        sx={{
                            flexWrap: { xs: "wrap", md: "nowrap" },
                        }}
                    >
                        {errors.taxvalue && (
                            <Typography mt={-1.8} marginLeft={2} variant="caption" color="red">
                                Gi?? tr??? thu??? kh??ng h???p l???
                            </Typography>
                        )}
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
                                setAvatar("");
                                setFile(null);
                            }}
                        >
                            {"Tr??? l???i"}
                        </Button>
                        <Button variant="contained" type="submit" autoFocus>
                            {defaultData.id ? "Ch???nh s???a" : "T???o m???i"}
                        </Button>
                    </Box>
                </Grid>
            </CardContainer>
        </Modal>
    );
};

export default React.memo(SettingForm);
