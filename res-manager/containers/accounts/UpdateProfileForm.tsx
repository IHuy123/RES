import React, { useEffect, useRef, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import {
    Avatar,
    Button,
    Grid,
    IconButton,
    InputAdornment,
    Modal,
    Tooltip,
    Box,
    Typography,
} from "@mui/material";
import { IForm } from "utils/common";
import CardContainer from "components/Card/Container";
import TextfieldBase from "components/BaseTextField";
import AccountDTO from "models/account.model";
import CustomizeAutocomplete from "components/CustomizedAutocomplete";
import useEmailExist from "hooks/account/useEmailExist";
import usePhoneExist from "hooks/account/usePhoneExist";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PendingIcon from "@mui/icons-material/Pending";
import { handleUpload } from "configurations/firebase";

const UpdateProfileForm: React.FC<IForm<AccountDTO>> = (props: IForm<AccountDTO>) => {
    const { data: defaultData, isView } = props;
    const ref = useRef<HTMLInputElement | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        clearErrors,
        setError,
        control,
    } = useForm<AccountDTO>({});

    useEffect(() => {
        setValue("id", defaultData.id);
        setValue("username", defaultData.username);
        setValue("email", defaultData.email);
        setValue("fullname", defaultData.fullname);
        setValue("phone", defaultData.phone);
        setValue("roleid", defaultData.roleid);
        setValue("avatar", defaultData.avatar);
        setValue("status", defaultData.status);
    }, [defaultData, setValue]);

    const [avatar, setAvatar] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const uploadProfilePic = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onloadend = () => {
                if (reader.result !== null) {
                    setAvatar(reader.result.toString());
                }
            };
            setFile(e.target.files[0]);
        }
    };

    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const { data: emailExist, isLoading: emailLoading } = useEmailExist(email);
    const { data: phoneExist, isLoading: phoneLoading } = usePhoneExist(phone);

    useEffect(() => {
        if (email) {
            if (emailExist?.account && emailExist?.account.length > 0) {
                setError("email", {
                    message: "Email đã được sử dụng",
                    type: "manual",
                });
            }
        }
    }, [email, emailExist, setError]);

    useEffect(() => {
        if (phone) {
            if (phoneExist?.account && phoneExist?.account.length > 0) {
                setError("phone", {
                    message: "Số điện thoại đã được sử dụng",
                    type: "manual",
                });
            }
        }
    }, [phone, phoneExist, setError]);

    const submitHandler: SubmitHandler<AccountDTO> = async (data: AccountDTO) => {
        try {
            if (data) {
                if (file && avatar) {
                    data.avatar = await handleUpload(file);
                }
                props.handleClose("SAVE", data, clearErrors);
            }
            setFile(null);
            setAvatar("");
            setEmail("");
            setPhone("");
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
                        Thông tin cá nhân
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
                        }}
                    >
                        <Avatar
                            alt="Remy Sharp"
                            src={
                                avatar ||
                                defaultData.avatar ||
                                "https://st3.depositphotos.com/1767687/16607/v/450/depositphotos_166074422-stock-illustration-default-avatar-profile-icon-grey.jpg"
                            }
                            sx={{
                                width: 80,
                                height: 80,
                                alignItems: "center",
                                cursor: isView ? "default" : "pointer",
                            }}
                            onClick={() => {
                                if (!isView) {
                                    ref.current?.click();
                                }
                            }}
                        ></Avatar>
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
                            id="username"
                            label={"Tên đăng nhập"}
                            variant="outlined"
                            InputProps={{
                                readOnly: isView,
                            }}
                            required
                            fullWidth
                            error={!!errors.username}
                            helperText={errors.username && errors.username.message}
                            {...register("username", {
                                required: {
                                    value: true,
                                    message: "Tên đăng nhập là bắt buộc!",
                                },
                                onBlur: () =>
                                    setValue(
                                        "username",
                                        getValues("username")
                                            ? getValues("username").trim()
                                            : getValues("username")
                                    ),
                            })}
                        />
                        {!isView && (
                            <TextfieldBase
                                id="password"
                                label={"Mật khẩu"}
                                type="password"
                                variant="outlined"
                                required
                                fullWidth
                                error={!!errors.password}
                                helperText={errors.password && errors.password.message}
                                {...register("password", {
                                    required: {
                                        value: !defaultData.id,
                                        message: "Mật khẩu là bắt buộc!",
                                    },
                                    onBlur: () =>
                                        setValue(
                                            "password",
                                            getValues("password")
                                                ? getValues("password") || "".trim()
                                                : getValues("password")
                                        ),
                                })}
                            />
                        )}
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
                            id="fullname"
                            label={"Tên đầy đủ"}
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                readOnly: isView,
                            }}
                            required
                            error={!!errors.fullname}
                            helperText={errors.fullname && errors.fullname.message}
                            {...register("fullname", {
                                required: {
                                    value: true,
                                    message: String("Tên đầy đủ là bắt buộc!"),
                                },
                                onBlur: () =>
                                    setValue(
                                        "fullname",
                                        getValues("fullname")
                                            ? getValues("fullname").trim()
                                            : getValues("fullname")
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
                            id="email"
                            label={"Email"}
                            variant="outlined"
                            InputProps={{
                                readOnly: isView,
                                endAdornment: email && (
                                    <InputAdornment position="end">
                                        <Tooltip
                                            title={
                                                emailLoading
                                                    ? "Đang kiểm tra"
                                                    : emailExist?.account &&
                                                      emailExist?.account.length > 0
                                                    ? "Đã tồn tại"
                                                    : "Email hợp lệ"
                                            }
                                        >
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                edge="end"
                                            >
                                                {errors.email ? (
                                                    <ErrorIcon color="error" />
                                                ) : emailLoading ? (
                                                    <PendingIcon color="warning" />
                                                ) : emailExist?.account &&
                                                  emailExist?.account.length === 0 ? (
                                                    <CheckCircleIcon color="success" />
                                                ) : (
                                                    <ErrorIcon color="error" />
                                                )}
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                            required
                            error={!!errors.email}
                            helperText={errors.email && errors.email.message}
                            {...register("email", {
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: String("Email không hợp lệ!"),
                                },
                                required: {
                                    value: true,
                                    message: String("Email là bắt buộc!"),
                                },
                                onBlur: () => {
                                    let email = getValues("email");
                                    email = email ? email.trim() : email;
                                    setValue("email", email);
                                    setEmail(email);
                                },
                            })}
                            fullWidth
                        />
                        <TextfieldBase
                            id="phone"
                            label={"Số điện thoại"}
                            variant="outlined"
                            required
                            InputProps={{
                                readOnly: isView,
                                endAdornment: phone && (
                                    <InputAdornment position="end">
                                        <Tooltip
                                            title={
                                                phoneLoading
                                                    ? "Đang kiểm tra"
                                                    : phoneExist?.account &&
                                                      phoneExist?.account.length > 0
                                                    ? "Đã tồn tại"
                                                    : "Số điện thoại hợp lệ"
                                            }
                                        >
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                edge="end"
                                            >
                                                {errors.phone ? (
                                                    <ErrorIcon color="error" />
                                                ) : phoneLoading ? (
                                                    <PendingIcon color="warning" />
                                                ) : phoneExist?.account &&
                                                  phoneExist?.account.length === 0 ? (
                                                    <CheckCircleIcon color="success" />
                                                ) : (
                                                    <ErrorIcon color="error" />
                                                )}
                                            </IconButton>
                                        </Tooltip>
                                    </InputAdornment>
                                ),
                            }}
                            error={!!errors.phone}
                            helperText={errors.phone && errors.phone.message}
                            {...register("phone", {
                                required: {
                                    value: true,
                                    message: String("Số điện thoại là bắt buộc!"),
                                },
                                pattern: {
                                    value: /(0[3|5|7|8|9])+([0-9]{8})\b/i,
                                    message: "Số điện thại không đúng định dạng!",
                                },
                                onBlur: () => {
                                    let phone = getValues("phone");
                                    phone = phone ? phone.trim() : phone;
                                    setValue("phone", phone);
                                    setPhone(phone);
                                },
                            })}
                            fullWidth
                            // disabled={Boolean(!!defaultData.id)}
                        />
                    </Grid>
                    <Grid
                        item
                        gap={3}
                        display="flex"
                        sx={{
                            flexWrap: { xs: "wrap", md: "nowrap" },
                        }}
                    >
                        <CustomizeAutocomplete
                            defaultId={!!defaultData.id ? defaultData.roleid : undefined}
                            conditionField="isActive"
                            control={control}
                            rules={{
                                min: {
                                    value: 1,
                                    message: "Vai trò là bắt buộc",
                                },
                            }}
                            readonly={true}
                            name="roleid"
                            entity="role"
                            displayField="name"
                            label={"Vai trò"}
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
                                setFile(null);
                                setAvatar("");
                                setEmail("");
                                setPhone("");
                                props.handleClose("CANCEL", undefined, clearErrors);
                            }}
                        >
                            {"Trở về"}
                        </Button>
                    </Box>
                </Grid>
            </CardContainer>
        </Modal>
    );
};

export default React.memo(UpdateProfileForm);
