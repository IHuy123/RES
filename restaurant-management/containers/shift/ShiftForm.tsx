import React, { useEffect } from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Button, Grid, Modal, Box, Typography, Autocomplete, TextField } from "@mui/material";
import CardContainer from "components/Card/Container";
import useGetAllWorkSession from "hooks/worksession/useGetAll";
import TextfieldBase from "components/BaseTextField";
import { format } from "date-fns";
import { TimePicker } from "@mui/x-date-pickers";
import useCreateShift from "hooks/shift/useCreateShift";
import useSnackbar from "components/Snackbar/useSnackbar";
import useGetOneShift from "hooks/shift/useGetOneShift";

export interface CreateShiftDTO {
    worksessionId: number;
    startTime: Date;
    endTime: Date;
    name?: string;
}
const ShiftForm: React.FC<{ opened: boolean; action: Function }> = (props) => {
    const { opened, action } = props;

    const { mutate } = useCreateShift("ShiftQuery");

    const { mutate: mutateByWS } = useGetOneShift();

    const showSnackbar = useSnackbar();

    const {
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        clearErrors,
        unregister,
        getValues,
        watch,
        register,
    } = useForm<CreateShiftDTO>({});

    useEffect(() => {
        if (opened) {
            const newDate = new Date();
            setValue("startTime", newDate);
            setValue("endTime", newDate);
        }
    }, [setValue, opened]);

    const { data } = useGetAllWorkSession();

    const convert = (time: string) => {
        const times = time.split(":");
        return Number(times[0]) * 60 + Number(times[1]);
    };

    const submitHandler: SubmitHandler<CreateShiftDTO> = async (data: CreateShiftDTO) => {
        try {
            if (data) {
                mutateByWS(
                    {
                        _eq: data.worksessionId,
                    },
                    {
                        onSuccess: (xs) => {
                            const startTimeString = `${data.startTime.getHours()}:${data.startTime.getMinutes()}:00`;
                            const endTimeString = `${data.endTime.getHours()}:${data.endTime.getMinutes()}:00}`;
                            const index = xs.shift
                                .filter((x) => x.status === "ACTIVE")
                                .findIndex(
                                    (k) =>
                                        (convert(startTimeString) < convert(k.endtime) &&
                                            convert(endTimeString) > convert(k.starttime)) ||
                                        k.name === data.name
                                );
                            if (index !== -1) {
                                showSnackbar({
                                    children: "Đã tồn tại",
                                    severity: "error",
                                });
                                return;
                            }
                            mutate(
                                {
                                    objects: [
                                        {
                                            isopen: false,
                                            name: data.name || "",
                                            status: "ACTIVE",
                                            starttime: startTimeString,
                                            endtime: endTimeString,
                                            worksessionid: data.worksessionId,
                                        },
                                    ],
                                },
                                {
                                    onSuccess() {
                                        showSnackbar({
                                            children: "Tạo thành công",
                                            severity: "success",
                                        });
                                        action();
                                        clearErrors();
                                        unregister();
                                    },
                                    onError() {
                                        showSnackbar({
                                            children: "Tạo thất bại",
                                            severity: "error",
                                        });
                                    },
                                }
                            );
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
        <Modal open={opened} disableEnforceFocus>
            <CardContainer width="90%" maxWidth={820}>
                <Box sx={{ display: "flex", justifyContent: "center", m: 3 }}>
                    <Typography variant="h6" component="h2">
                        Tạo mới ca làm việc
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
                        <Controller
                            control={control}
                            name="worksessionId"
                            rules={{
                                required: "Phiên làm việc là bắt buộc",
                            }}
                            render={({
                                // eslint-disable-next-line unused-imports/no-unused-vars
                                field: { value: currentValue, ref, onChange },
                                fieldState: { error },
                            }) => {
                                return (
                                    <Autocomplete<{
                                        key: number;
                                        value: string;
                                    }>
                                        id="select-customize"
                                        options={
                                            data
                                                ? data.worksession
                                                      ?.filter(
                                                          (x) =>
                                                              format(
                                                                  x?.workdate
                                                                      ? new Date(x?.workdate)
                                                                      : new Date(),
                                                                  "yyyy/MM/dd"
                                                              ) >= format(new Date(), "yyyy/MM/dd")
                                                      )
                                                      .sort((a, b) => a.workdate - b.workdate)
                                                      .map((x) => {
                                                          return {
                                                              key: x.id,
                                                              value: x.workdate,
                                                          };
                                                      })
                                                : []
                                        }
                                        getOptionLabel={(option) => option.value}
                                        fullWidth
                                        isOptionEqualToValue={(option, value) =>
                                            !option.key || !value.key || option.key === value.key
                                        }
                                        onChange={(e, newValue) => {
                                            if (newValue) {
                                                onChange(newValue.key);
                                            }
                                        }}
                                        ref={ref}
                                        renderInput={(params) => (
                                            <TextfieldBase
                                                {...params}
                                                label={"Chọn phiên làm việc"}
                                                required={true}
                                                inputRef={ref}
                                                ref={ref}
                                                error={Boolean(error)}
                                                helperText={Boolean(error) && error?.message}
                                            />
                                        )}
                                    />
                                );
                            }}
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
                            label={"Tên ca làm việc"}
                            variant="outlined"
                            required
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name && errors.name.message}
                            {...register("name", {
                                required: {
                                    value: true,
                                    message: "Tên ca làm việc là bắt buộc!",
                                },
                                onBlur: () =>
                                    setValue(
                                        "name",
                                        getValues("name")
                                            ? getValues("name")?.trim()
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
                        <Controller
                            control={control}
                            rules={{
                                required: "Thời gian bắt đầu là bắt buộc",
                            }}
                            name="startTime"
                            render={({ field: { value: currentValue, ref, onChange } }) => (
                                <TimePicker
                                    ref={ref}
                                    renderInput={(params) => <TextField fullWidth {...params} />}
                                    label={"Thời gian bắt đầu"}
                                    value={currentValue}
                                    onChange={(value) => {
                                        onChange(value || new Date());
                                    }}
                                    inputFormat="HH:mm"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="endTime"
                            rules={{
                                required: "Thời gian kết thúc là bắt buộc",
                            }}
                            render={({ field: { value: currentValue, ref, onChange } }) => (
                                <TimePicker
                                    ref={ref}
                                    renderInput={(params) => (
                                        <TextField
                                            fullWidth
                                            {...params}
                                            error={watch("startTime") >= watch("endTime")}
                                            helperText={
                                                watch("startTime") >= watch("endTime") &&
                                                "Thời gian bắt đầu phải bé hơn thời gian kết thúc"
                                            }
                                        />
                                    )}
                                    label={"Thời gian kết thúc"}
                                    value={currentValue}
                                    onChange={(value) => {
                                        onChange(value || new Date());
                                    }}
                                    inputFormat="HH:mm"
                                />
                            )}
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
                                action();
                                unregister();
                                clearErrors();
                            }}
                        >
                            {"Trở về"}
                        </Button>
                        <Button
                            disabled={watch("startTime") >= watch("endTime")}
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            {"Tạo mới"}
                        </Button>
                    </Box>
                </Grid>
            </CardContainer>
        </Modal>
    );
};

export default React.memo(ShiftForm);
