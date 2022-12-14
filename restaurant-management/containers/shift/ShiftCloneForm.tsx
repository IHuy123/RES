import React, { useEffect } from "react";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

import {
    Button,
    Grid,
    Modal,
    Box,
    Typography,
    Autocomplete,
    TextField,
    SxProps,
} from "@mui/material";
import CardContainer from "components/Card/Container";
import useGetAllWorkSession from "hooks/worksession/useGetAll";
import TextfieldBase from "components/BaseTextField";
import { add } from "date-fns";
import { MobileDatePicker } from "@mui/x-date-pickers";
import useSnackbar from "components/Snackbar/useSnackbar";
import useGetOneShift from "hooks/shift/useGetOneShift";
import useCheckWS from "hooks/shift/useCheckWS";
import useCreateShift from "hooks/shift/useCreateShift";
import { Shift_Insert_Input } from "generated/graphql";

export interface CloneForm {
    worksessionId: number;
    startTime: Date;
    endTime: Date;
}

export const popperSx: SxProps = {
    "& .MuiPickersCalendarHeader-labelContainer": {
        minHeight: 50,
        fontSize: 14,
    },
    // "& .MuiDayPicker-header span": {
    //     minHeight: 50,
    //     fontSize: 60,
    // },
};
const ShiftCloneForm: React.FC<{ opened: boolean; action: Function }> = (props) => {
    const { opened, action } = props;

    const { mutate: mutateByWS } = useGetOneShift();

    const { mutate } = useCheckWS();

    const showSnackbar = useSnackbar();

    const { mutate: createMutate } = useCreateShift("ShiftQuery");

    const { handleSubmit, setValue, control, clearErrors, unregister, watch } = useForm<CloneForm>(
        {}
    );

    useEffect(() => {
        if (opened) {
            const newDate = new Date();
            setValue(
                "startTime",
                add(newDate, {
                    days: 1,
                })
            );
            setValue(
                "endTime",
                add(newDate, {
                    days: 1,
                })
            );
        }
    }, [setValue, opened]);

    const { data } = useGetAllWorkSession();

    const submitHandler: SubmitHandler<CloneForm> = async (data: CloneForm) => {
        try {
            if (data) {
                mutateByWS(
                    {
                        _eq: data.worksessionId,
                    },
                    {
                        onSuccess: (xs) => {
                            if (xs.shift?.filter((x) => x.status === "ACTIVE").length === 0) {
                                showSnackbar({
                                    children: "Phi??n l??m vi???c n??y kh??ng c?? ca l??m vi???c ????? sao ch??p",
                                    severity: "error",
                                });
                                return;
                            }
                            mutate(
                                {
                                    _gte: data.startTime,
                                    _lte: data.endTime,
                                },
                                {
                                    onSuccess: (vl) => {
                                        const arr: Array<Array<Shift_Insert_Input>> =
                                            vl.worksession.map((ws) => {
                                                return xs.shift
                                                    .filter((wss) => wss.status === "ACTIVE")
                                                    .map((wss) => {
                                                        return {
                                                            isopen: false,
                                                            name: wss.name || "",
                                                            status: "ACTIVE",
                                                            starttime: wss.starttime,
                                                            endtime: wss.endtime,
                                                            worksessionid: ws.id,
                                                        };
                                                    });
                                            });
                                        createMutate(
                                            {
                                                objects: arr.flat(),
                                            },
                                            {
                                                onSuccess() {
                                                    showSnackbar({
                                                        children: "T???o th??nh c??ng",
                                                        severity: "success",
                                                    });
                                                    action();
                                                    clearErrors();
                                                    unregister();
                                                },
                                                onError() {
                                                    showSnackbar({
                                                        children: "T???o th???t b???i",
                                                        severity: "error",
                                                    });
                                                },
                                            }
                                        );
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
                        Sao ch??p ca l??m vi???c
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
                                required: "Phi??n l??m vi???c l?? b???t bu???c",
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
                                                label={"Ch???n phi??n l??m vi???c"}
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
                        <Controller
                            control={control}
                            rules={{
                                required: "Th???i gian b???t ?????u l?? b???t bu???c",
                            }}
                            name="startTime"
                            render={({ field: { value: currentValue, ref, onChange } }) => (
                                <MobileDatePicker
                                    DialogProps={{
                                        sx: popperSx,
                                    }}
                                    ref={ref}
                                    renderInput={(params) => <TextField fullWidth {...params} />}
                                    label={"Th???i gian b???t ?????u"}
                                    value={currentValue}
                                    onChange={(value) => {
                                        onChange(value || new Date());
                                    }}
                                    inputFormat="dd/MM/yyyy"
                                    minDate={add(new Date(), {
                                        days: 1,
                                    })}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="endTime"
                            rules={{
                                required: "Th???i gian k???t th??c l?? b???t bu???c",
                            }}
                            render={({ field: { value: currentValue, ref, onChange } }) => (
                                <MobileDatePicker
                                    ref={ref}
                                    renderInput={(params) => (
                                        <TextField
                                            fullWidth
                                            {...params}
                                            error={watch("startTime") > watch("endTime")}
                                            helperText={
                                                watch("startTime") > watch("endTime") &&
                                                "Th???i gian b???t ?????u ph???i b?? h??n th???i gian k???t th??c"
                                            }
                                        />
                                    )}
                                    label={"Th???i gian k???t th??c"}
                                    value={currentValue}
                                    onChange={(value) => {
                                        onChange(value || new Date());
                                    }}
                                    inputFormat="dd/MM/yyyy"
                                    minDate={add(new Date(), {
                                        days: 1,
                                    })}
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
                            {"Tr??? v???"}
                        </Button>
                        <Button
                            disabled={watch("startTime") >= watch("endTime")}
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            {"Sao ch??p"}
                        </Button>
                    </Box>
                </Grid>
            </CardContainer>
        </Modal>
    );
};

export default React.memo(ShiftCloneForm);
