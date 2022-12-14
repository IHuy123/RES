import React, { useEffect } from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Button, Grid, Modal, Box, Typography, Autocomplete, TextField } from "@mui/material";
import CardContainer from "components/Card/Container";
import useGetAllWorkSession from "hooks/worksession/useGetAll";
import TextfieldBase from "components/BaseTextField";
import { format } from "date-fns";
import { TimePicker } from "@mui/x-date-pickers";
import useSnackbar from "components/Snackbar/useSnackbar";
import useGetOneShift from "hooks/shift/useGetOneShift";
import useGetShiftById from "hooks/shift/useGetShiftById";
import useDeleteShift from "hooks/shift/useDeleteShift";
import useUpdateShift from "hooks/shift/useUpdateShift";
import { LoginQueryQuery } from "generated/graphql";

export interface UpdateShiftDTO {
    worksessionId: number;
    startTime: Date;
    endTime: Date;
    name?: string;
    id?: number;
}
const ShiftUpdateForm: React.FC<{ opened: boolean; action: Function; id: number }> = (props) => {
    const { opened, action, id } = props;

    const { data: dataById, isLoading } = useGetShiftById(id);

    const [user, setUser] = React.useState<LoginQueryQuery>();

    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (userJson) {
            setUser(JSON.parse(localStorage.getItem("user") || "{}"));
        }
    }, []);

    const { mutate } = useUpdateShift("ShiftQuery");
    const { mutate: mutateDelete } = useDeleteShift("ShiftQuery");

    const { mutate: mutateByWS } = useGetOneShift();

    const showSnackbar = useSnackbar();

    const {
        handleSubmit,
        setValue,
        control,
        clearErrors,
        unregister,
        watch,
        register,
        getValues,
        formState: { errors },
    } = useForm<UpdateShiftDTO>({});

    useEffect(() => {
        if (opened) {
            setValue("name", dataById?.shift_by_pk?.name);
            const start = dataById?.shift_by_pk?.starttime || "12:00";
            const end = dataById?.shift_by_pk?.endtime || "12:00";
            const startTime = new Date();
            startTime.setHours(Number(start.split(":")[0]));
            startTime.setMinutes(Number(start.split(":")[1]));
            startTime.setSeconds(0);
            const endTime = new Date();
            endTime.setHours(Number(end.split(":")[0]));
            endTime.setMinutes(Number(end.split(":")[1]));
            endTime.setSeconds(0);
            setValue("startTime", startTime);
            setValue("endTime", endTime);
            setValue("worksessionId", dataById?.shift_by_pk?.worksessionid || 0);
            setValue("id", dataById?.shift_by_pk?.id || 0);
        }
    }, [setValue, opened, dataById]);

    const { data } = useGetAllWorkSession();

    const convert = (time: string) => {
        const times = time.split(":");
        return Number(times[0]) * 60 + Number(times[1]);
    };

    const closeShift = () => {
        mutate(
            {
                id: id,
                isopen: false,
                name: dataById?.shift_by_pk?.name || "",
                status: dataById?.shift_by_pk?.status,
                starttime: dataById?.shift_by_pk?.starttime || "",
                endtime: dataById?.shift_by_pk?.endtime || "",
                worksessionid: dataById?.shift_by_pk?.worksessionid || 0,
                closerid: user?.account[0]?.id || 0,
                openerid: dataById?.shift_by_pk?.openerid,
            },
            {
                onSuccess() {
                    showSnackbar({
                        children: "Đóng thành công",
                        severity: "success",
                    });
                    action();
                    clearErrors();
                    unregister();
                },
                onError() {
                    showSnackbar({
                        children: "Đóng thất bại",
                        severity: "error",
                    });
                },
            }
        );
    };
    const openShift = () => {
        if (!dataById?.shift_by_pk?.worksession?.isopen) {
            showSnackbar({
                children: "Không thể mở ca làm việc với phiên làm việc đã đóng",
                severity: "error",
            });
            return;
        }
        mutate(
            {
                id: id,
                isopen: true,
                name: dataById?.shift_by_pk?.name || "",
                status: dataById?.shift_by_pk?.status,
                starttime: dataById?.shift_by_pk?.starttime || "",
                endtime: dataById?.shift_by_pk?.endtime || "",
                worksessionid: dataById?.shift_by_pk?.worksessionid || 0,
                openerid: user?.account[0]?.id || 0,
                closerid: dataById?.shift_by_pk?.closerid,
            },
            {
                onSuccess() {
                    showSnackbar({
                        children: "Đóng thành công",
                        severity: "success",
                    });
                    action();
                    clearErrors();
                    unregister();
                },
                onError() {
                    showSnackbar({
                        children: "Đóng thất bại",
                        severity: "error",
                    });
                },
            }
        );
    };

    const submitHandler: SubmitHandler<UpdateShiftDTO> = async (data: UpdateShiftDTO) => {
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
                                .filter((x) => x.id !== id)
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
                                    id: id,
                                    isopen: false,
                                    name: data.name || "",
                                    status: "ACTIVE",
                                    starttime: startTimeString,
                                    endtime: endTimeString,
                                    worksessionid: data.worksessionId,
                                    openerid: dataById?.shift_by_pk?.openerid,
                                    closerid: dataById?.shift_by_pk?.closerid,
                                },
                                {
                                    onSuccess() {
                                        showSnackbar({
                                            children: "Chỉnh sửa thành công",
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

    if (isLoading) {
        return null;
    }

    return (
        <Modal open={opened} disableEnforceFocus>
            <CardContainer width="90%" maxWidth={820}>
                <Box sx={{ display: "flex", justifyContent: "center", m: 3 }}>
                    <Typography variant="h6" component="h2">
                        Chỉnh sửa ca làm việc
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
                                                              ) >
                                                                  format(
                                                                      new Date(),
                                                                      "yyyy/MM/dd"
                                                                  ) && !x.isopen
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
                                        value={{
                                            key: currentValue,
                                            value:
                                                data?.worksession?.find(
                                                    (x) => x.id === currentValue
                                                )?.workdate || "",
                                        }}
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
                            variant="contained"
                            color="warning"
                            onClick={() => {
                                if ((dataById?.shift_by_pk?.checks?.length || 0) > 0) {
                                    showSnackbar({
                                        children: "Ca đã có giao dịch",
                                        severity: "error",
                                    });
                                } else {
                                    mutateDelete(
                                        {
                                            id: id,
                                            status: "INACTIVE",
                                        },
                                        {
                                            onSuccess: () => {
                                                showSnackbar({
                                                    children: "Xóa thành công",
                                                    severity: "success",
                                                });
                                                action();
                                                unregister();
                                                clearErrors();
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
                            }}
                        >
                            {"Xóa ca làm việc"}
                        </Button>
                        <Button
                            disabled={watch("startTime") >= watch("endTime")}
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            {"Chỉnh sửa"}
                        </Button>

                        {format(
                            data?.worksession.find((x) => x.id === watch("worksessionId"))?.workdate
                                ? new Date(
                                      data?.worksession.find(
                                          (x) => x.id === watch("worksessionId")
                                      )?.workdate
                                  )
                                : new Date(),
                            "yyyy/MM/dd"
                        ) <= format(new Date(), "yyyy/MM/dd") && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={dataById?.shift_by_pk?.isopen ? closeShift : openShift}
                            >
                                {dataById?.shift_by_pk?.isopen ? "Đóng" : "Mở"}
                            </Button>
                        )}
                    </Box>
                </Grid>
            </CardContainer>
        </Modal>
    );
};

export default React.memo(ShiftUpdateForm);
