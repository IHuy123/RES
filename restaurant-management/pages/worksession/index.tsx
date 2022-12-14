import {
    ViewState,
    EditingState,
    ChangeSet,
    AppointmentModel,
} from "@devexpress/dx-react-scheduler";
import {
    Scheduler,
    SchedulerProps,
    Appointments,
    DragDropProvider,
    Toolbar,
    TodayButton,
    MonthView,
    DateNavigator,
} from "@devexpress/dx-react-scheduler-material-ui";
import {
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Modal,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { DateTimePicker, MobileDatePicker } from "@mui/x-date-pickers";
import TextfieldBase from "components/BaseTextField";
import CardContainer from "components/Card/Container";
import useSnackbar from "components/Snackbar/useSnackbar";
import { popperSx } from "containers/shift/ShiftCloneForm";
import { add, format } from "date-fns";
import useDeleteWorksession from "hooks/worksession/useDeleteWorksession";
import useGetAllWorkSession from "hooks/worksession/useGetAll";
import useGetWorksessionById from "hooks/worksession/useGetWorksessionById";
import useGetWSFromTo from "hooks/worksession/useGetWSFromTo";
import useInsertMulti from "hooks/worksession/useInsertMulti";
import useUpdateWorkSession from "hooks/worksession/useUpdateWorkSession";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const SchedulerOk: React.FC<SchedulerProps & { children: React.ReactNode }> = ({
    children,
    ...rest
}) => {
    return <Scheduler {...rest}>{children}</Scheduler>;
};

export interface ShiftCreate {
    startTime: Date | null;
    endTime: Date | null;
}

const WorkSession = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [check, setCheck] = useState(false);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [selected, setSelected] = useState<null | number>(null);
    const Appointment: React.FC = (props: any) => {
        const { style, data, ...restProps } = props;
        return (
            <Appointments.Appointment
                {...restProps}
                style={{
                    ...style,
                    backgroundColor: data.backgroundColor,
                    color: data.color || "white",
                    fontSize: 12,
                }}
                onDoubleClick={() => setSelected(data.id)}
            >
                {data.content}
            </Appointments.Appointment>
        );
    };

    const { mutate } = useInsertMulti("GetAllWorkSessionQuery");
    const { mutate: updateMutate } = useUpdateWorkSession("GetAllWorkSessionQuery");
    const { mutate: deleteMutation } = useDeleteWorksession("GetAllWorkSessionQuery");
    const { mutate: getWSFromTo } = useGetWSFromTo();

    const { data: dataAll, isLoading } = useGetAllWorkSession();
    const { data: dataById, isLoading: isLoadingById } = useGetWorksessionById(selected);

    const appointments: AppointmentModel[] | undefined = dataAll?.worksession.map((x) => {
        return {
            startDate: new Date(
                new Date(x.workdate).getFullYear(),
                new Date(x.workdate).getMonth(),
                new Date(x.workdate).getDate(),
                0,
                0,
                0
            ),
            endDate: new Date(
                new Date(x.workdate).getFullYear(),
                new Date(x.workdate).getMonth(),
                new Date(x.workdate).getDate(),
                23,
                59,
                59
            ),
            content:
                !x.updaterid && !x.isopen ? (
                    <Box sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="inherit">
                                Thời gian tạo:{" "}
                                {format(new Date(x.creationtime), "dd/MM/yyyy hh:mm:ss")}
                            </Typography>
                            {/* <Typography variant="inherit">Trạng thái: Mới tạo</Typography> */}
                        </Box>
                    </Box>
                ) : x.isopen ? (
                    <Box sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="inherit">
                                Thời gian mở:{" "}
                                {x.updatetime
                                    ? format(new Date(x.updatetime), "dd/MM/yyyy hh:mm:ss")
                                    : "Chưa xử lí"}
                            </Typography>
                            {/* <Typography variant="inherit">Trạng thái: Đang mở</Typography> */}
                        </Box>
                    </Box>
                ) : (
                    <Box sx={{ p: 1 }}>
                        <Box>
                            <Typography variant="inherit">
                                Thời gian đóng:{" "}
                                {format(new Date(x.updatetime), "dd/MM/yyyy hh:mm:ss")}
                            </Typography>
                            {/* <Typography variant="inherit">Trạng thái: Đã đóng</Typography> */}
                        </Box>
                    </Box>
                ),
            allDay: true,
            id: x.id,
            backgroundColor:
                !x.isopen && !x.updaterid ? "#fb8c00" : x.isopen ? "#1e88e5" : "#fb8c00",
        };
    });

    const { handleSubmit, setValue } = useForm<ShiftCreate>({});

    const commitChanges = (changes: ChangeSet) => {
        // eslint-disable-next-line no-console
        console.log(changes);
    };

    const tomorrowFns = add(new Date(), {
        days: 0,
    });

    const showSnackbar = useSnackbar();

    useEffect(() => {
        setValue("startTime", startTime);
    }, [startTime, setValue]);

    useEffect(() => {
        setValue("endTime", endTime);
    }, [endTime, setValue]);

    const submitHandler: SubmitHandler<ShiftCreate> = async (data: ShiftCreate) => {
        try {
            if (data && data.startTime && data.endTime) {
                getWSFromTo(
                    {
                        _gte: format(data.startTime, "yyyy/MM/dd"),
                        _lte: format(data.endTime, "yyyy/MM/dd"),
                    },
                    {
                        onSuccess(dataWS) {
                            // if (dataWS.worksession.length > 0) {
                            //     showSnackbar({
                            //         children: "Đã tồn tại phiên làm việc",
                            //         variant: "filled",
                            //         severity: "error",
                            //     });
                            //     return;
                            // }

                            const listWorkDate: any = {};
                            dataWS.worksession.forEach((x) => {
                                listWorkDate[String(x.workdate)] = 1;
                            });
                            if (data && data.startTime && data.endTime) {
                                const listOfDates: Date[] = [];
                                while (data.startTime <= data.endTime) {
                                    if (!listWorkDate[format(data.startTime, "yyyy-MM-dd")]) {
                                        listOfDates.push(data.startTime);
                                    }
                                    data.startTime = add(data.startTime, {
                                        days: 1,
                                    });
                                }
                                mutate(
                                    {
                                        objects: listOfDates.map((workingDate) => {
                                            return {
                                                creationtime: add(new Date(), {
                                                    hours: 7,
                                                }),
                                                creatorid: 1,
                                                isopen: false,
                                                workdate: add(workingDate, {
                                                    hours: 7,
                                                }),
                                            };
                                        }),
                                    },
                                    {
                                        onSuccess: () => {
                                            showSnackbar({
                                                children: "Tạo mới thành công",
                                                variant: "filled",
                                                severity: "success",
                                            });
                                            setOpenModal(false);
                                        },
                                        onError: () => {
                                            showSnackbar({
                                                children: "Tạo mới thất bại",
                                                variant: "filled",
                                                severity: "error",
                                            });
                                        },
                                    }
                                );
                            }
                        },
                    }
                );
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    };

    const tick = (checked: boolean) => {
        if (checked) {
            setStartTime(tomorrowFns);
            const date = new Date();
            date.setMonth(11);
            date.setDate(31);
            setEndTime(date);
        } else {
            setStartTime(null);
            setEndTime(null);
        }
        setCheck(!check);
    };

    const deleteWorkSession = () => {
        deleteMutation(
            {
                id: selected,
            },
            {
                onSuccess: () => {
                    showSnackbar({
                        children: "Xóa thành công",
                        variant: "filled",
                        severity: "success",
                    });
                    setSelected(null);
                },
            }
        );
    };

    const hanldeWorkSessionItem = (id: number | null) => {
        if (id) {
            if (
                dataById?.worksession_by_pk?.isopen &&
                dataById?.worksession_by_pk?.shifts &&
                dataById?.worksession_by_pk?.shifts.length > 0 &&
                dataById?.worksession_by_pk?.shifts
                    .filter((x) => x.status === "ACTIVE")
                    .findIndex((x) => x.isopen) !== -1
            ) {
                showSnackbar({
                    children: "Các ca làm việc chưa được đóng hết",
                    variant: "filled",
                    severity: "error",
                });
                return;
            }
            updateMutate(
                {
                    isopen: !dataById?.worksession_by_pk?.isopen,
                    updaterid: 1,
                    updatetime: add(new Date(), {
                        hours: 7,
                    }),
                    id: id,
                },
                {
                    onSuccess: () => {
                        showSnackbar({
                            children:
                                !dataById?.worksession_by_pk?.isopen &&
                                !dataById?.worksession_by_pk?.updaterid
                                    ? "Mở thành công"
                                    : dataById?.worksession_by_pk?.isopen
                                    ? "Đóng thành công"
                                    : "Mở thành công",
                            variant: "filled",
                            severity: "success",
                        });
                        setSelected(null);
                    },
                }
            );
        }
    };

    if (isLoading) {
        return null;
    }

    return (
        <Paper sx={{ mt: 1 }}>
            <Modal open={openModal} disableEnforceFocus>
                <CardContainer width="90%" maxWidth={820}>
                    <Box sx={{ display: "flex", justifyContent: "center", m: 3 }}>
                        <Typography variant="h6" component="h2">
                            Tạo mới phiên làm việc
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
                            <MobileDatePicker
                                renderInput={(params) => <TextField fullWidth {...params} />}
                                label={"Ngày bắt đầu"}
                                value={startTime}
                                onChange={(newValue) => {
                                    setStartTime(newValue || null);
                                }}
                                DialogProps={{
                                    sx: popperSx,
                                }}
                                inputFormat="dd/MM/yyyy"
                                disabled={check}
                                minDate={tomorrowFns}
                            />
                            <MobileDatePicker
                                DialogProps={{
                                    sx: popperSx,
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        fullWidth
                                        {...params}
                                        helperText={
                                            startTime &&
                                            endTime &&
                                            startTime > endTime &&
                                            "Ngày cuối phải lớn hơn ngày đầu"
                                        }
                                    />
                                )}
                                label={"Ngày kết thúc"}
                                value={endTime}
                                onChange={(newValue) => {
                                    setEndTime(newValue || null);
                                }}
                                inputFormat="dd/MM/yyyy"
                                disabled={check || !startTime}
                                minDate={startTime}
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
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={check}
                                        onChange={(e) => tick(e.target.checked)}
                                    />
                                }
                                label="Tạo nhanh"
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
                                    setOpenModal(false);
                                    setStartTime(null);
                                    setEndTime(null);
                                }}
                            >
                                {"Trở về"}
                            </Button>
                            <Button
                                autoFocus
                                variant="contained"
                                type="submit"
                                disabled={!startTime || !endTime || startTime > endTime}
                            >
                                {"Tạo mới"}
                            </Button>
                        </Box>
                    </Grid>
                </CardContainer>
            </Modal>
            <Modal open={Boolean(selected)} disableEnforceFocus>
                {!isLoadingById ? (
                    <CardContainer width="90%" maxWidth={820}>
                        <Box sx={{ display: "flex", justifyContent: "center", m: 3 }}>
                            <Typography variant="h6" component="h2">
                                Phiên làm việc ngày{" "}
                                {format(
                                    dataById?.worksession_by_pk?.workdate
                                        ? new Date(dataById?.worksession_by_pk?.workdate)
                                        : new Date(),
                                    "dd/MM/yyyy"
                                )}
                            </Typography>
                        </Box>
                        <Grid
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
                                <DateTimePicker
                                    renderInput={(params) => <TextField fullWidth {...params} />}
                                    label={"Thời gian tạo"}
                                    value={dataById?.worksession_by_pk?.creationtime}
                                    onChange={() => {}}
                                    inputFormat="dd/MM/yyyy hh:mm:ss"
                                    readOnly
                                    DialogProps={{
                                        sx: popperSx,
                                    }}
                                />
                                <DateTimePicker
                                    renderInput={(params) => <TextField fullWidth {...params} />}
                                    label={"Thời gian thay đổi"}
                                    value={dataById?.worksession_by_pk?.updatetime}
                                    onChange={() => {}}
                                    inputFormat="dd/MM/yyyy hh:mm:ss"
                                    readOnly
                                    DialogProps={{
                                        sx: popperSx,
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
                                    id="creator"
                                    label={"Người tạo"}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    required
                                    fullWidth
                                    value={dataById?.worksession_by_pk?.creatorid || undefined}
                                />
                                <TextfieldBase
                                    id="creator"
                                    label={"Người thay đổi"}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    required
                                    fullWidth
                                    value={dataById?.worksession_by_pk?.updaterid || undefined}
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
                                    id="statud"
                                    label={"Trạng thái"}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    required
                                    fullWidth
                                    value={
                                        !dataById?.worksession_by_pk?.isopen &&
                                        !dataById?.worksession_by_pk?.updaterid
                                            ? "Chưa mở"
                                            : dataById?.worksession_by_pk?.isopen
                                            ? "Đang mở"
                                            : "Đang đóng"
                                    }
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
                                        setSelected(null);
                                    }}
                                >
                                    {"Trở về"}
                                </Button>
                                {!dataById?.worksession_by_pk?.isopen &&
                                !dataById?.worksession_by_pk?.updaterid &&
                                dataById?.worksession_by_pk?.shifts &&
                                dataById?.worksession_by_pk?.shifts.length === 0 ? (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => deleteWorkSession()}
                                    >
                                        Xóa phiên làm việc
                                    </Button>
                                ) : null}
                                <Button
                                    variant="contained"
                                    onClick={() => hanldeWorkSessionItem(selected)}
                                    disabled={
                                        format(
                                            dataById?.worksession_by_pk?.workdate
                                                ? new Date(dataById?.worksession_by_pk?.workdate)
                                                : new Date(),
                                            "yyyy/MM/dd"
                                        ) > format(new Date(), "yyyy/MM/dd")
                                    }
                                >
                                    {dataById?.worksession_by_pk?.isopen
                                        ? "Đóng phiên làm việc"
                                        : "Mở phiên làm việc"}
                                </Button>
                            </Box>
                        </Grid>
                    </CardContainer>
                ) : (
                    <div>cc</div>
                )}
            </Modal>
            <SchedulerOk data={appointments} locale={"vi-VN"}>
                <EditingState onCommitChanges={commitChanges} />
                <ViewState defaultCurrentDate={new Date()} />
                <MonthView />
                <Appointments appointmentComponent={Appointment} />
                <Toolbar
                    flexibleSpaceComponent={() => {
                        return (
                            <Box
                                sx={{
                                    display: "flex",
                                    flex: 1,
                                    mr: 2,
                                    justifyContent: "flex-end",
                                    alignItems: "center",
                                }}
                            >
                                <Grid container width={"30%"}>
                                    <Grid display="flex" item xs={6} alignItems="center">
                                        <Box
                                            borderRadius="5px"
                                            mr={2}
                                            height={20}
                                            width={20}
                                            bgcolor="#1e88e5"
                                        ></Box>
                                        {"Đang mở"}
                                    </Grid>
                                    <Grid display="flex" item xs={6} alignItems="center">
                                        <Box
                                            borderRadius="5px"
                                            mr={2}
                                            height={20}
                                            width={20}
                                            bgcolor="#fb8c00"
                                        ></Box>
                                        {"Đang đóng"}
                                    </Grid>
                                </Grid>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setOpenModal(true)}
                                >
                                    Tạo phiên làm việc
                                </Button>
                            </Box>
                        );
                    }}
                />
                <DateNavigator />
                <DragDropProvider />
                <TodayButton
                    messages={{
                        today: "Trở về  ngày hiện tại",
                    }}
                />
            </SchedulerOk>
        </Paper>
    );
};

export default WorkSession;
