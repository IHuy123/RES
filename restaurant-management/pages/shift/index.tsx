import {
    ViewState,
    AppointmentModel,
    EditingState,
    ChangeSet,
} from "@devexpress/dx-react-scheduler";
import {
    Scheduler,
    SchedulerProps,
    WeekView,
    Appointments,
    DateNavigator,
    Toolbar,
    TodayButton,
    ViewSwitcher,
    DayView,
} from "@devexpress/dx-react-scheduler-material-ui";
import { Button, Grid, MenuItem, Paper, Select } from "@mui/material";
import { alpha, Box, styled } from "@mui/system";
import ShiftCloneForm from "containers/shift/ShiftCloneForm";
import ShiftForm from "containers/shift/ShiftForm";
import ShiftUpdateForm from "containers/shift/ShiftUpdateForm";
import { format } from "date-fns";
import useGetAllShift from "hooks/shift/useGetAllShift";
import useGetAllWorkSession from "hooks/worksession/useGetAll";
import { useState, useEffect } from "react";

export const SchedulerOk: React.FC<SchedulerProps & { children: React.ReactNode }> = ({
    children,
    ...rest
}) => {
    return <Scheduler {...rest}>{children}</Scheduler>;
};

const PREFIX = "Demo";

const classes = {
    todayCell: `${PREFIX}-todayCell`,
    weekendCell: `${PREFIX}-weekendCell`,
    today: `${PREFIX}-today`,
    weekend: `${PREFIX}-weekend`,
};

const StyledWeekViewTimeTableCell = styled(WeekView.TimeTableCell)(({ theme }) => ({
    [`&.${classes.todayCell}`]: {
        backgroundColor: alpha(theme.palette.primary.main, 0.5),
        "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.54),
        },
        "&:focus": {
            backgroundColor: alpha(theme.palette.primary.main, 0.56),
        },
    },
    [`&.${classes.weekendCell}`]: {
        backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        "&:hover": {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        },
        "&:focus": {
            backgroundColor: alpha(theme.palette.action.disabledBackground, 0.04),
        },
    },
}));

const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)(({ theme }) => ({
    [`&.${classes.today}`]: {
        backgroundColor: alpha(theme.palette.primary.main, 0.56),
    },
    [`&.${classes.weekend}`]: {
        backgroundColor: alpha(theme.palette.action.disabledBackground, 0.06),
    },
}));

const Shift = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);
    const { data: dataWS } = useGetAllWorkSession();

    const [selected, setSelected] = useState<number>(0);

    const DayScaleCell = (props: WeekView.DayScaleCellProps) => {
        const { startDate } = props;
        const index = dataWS?.worksession?.findIndex(
            (x) =>
                format(x?.workdate ? new Date(x?.workdate) : new Date(), "yyyy/MM/dd") ===
                format(startDate, "yyyy/MM/dd")
        );
        if (index !== -1) {
            return <StyledWeekViewDayScaleCell {...props} className={classes.today} />;
        }
        return <StyledWeekViewDayScaleCell {...props} className={classes.weekend} />;
    };

    const TimeTableCell = (props: WeekView.TimeTableCellProps) => {
        const { startDate } = props;
        const index = dataWS?.worksession?.findIndex(
            (x) =>
                format(x?.workdate ? new Date(x?.workdate) : new Date(), "yyyy/MM/dd") ===
                format(startDate || new Date(), "yyyy/MM/dd")
        );
        if (index !== -1) {
            return <StyledWeekViewTimeTableCell {...props} className={classes.todayCell} />;
        }
        return <StyledWeekViewTimeTableCell {...props} className={classes.weekendCell} />;
    };

    const Appointment: React.FC = (props: any) => {
        const { children, style, data, ...restProps } = props;
        return (
            <Appointments.Appointment
                {...restProps}
                style={{
                    ...style,
                    backgroundColor: data.backgroundColor,
                    color: data.color,
                    fontSize: 15,
                }}
                onDoubleClick={() => setSelected(data.id)}
            >
                {children}
            </Appointments.Appointment>
        );
    };

    const { data, isLoading } = useGetAllShift();

    const [open, setOpen] = useState(false);
    const [openClone, setOpenClone] = useState(false);

    const appointments: AppointmentModel[] | undefined = data?.shift
        ?.filter((x) => x.status === "ACTIVE")
        .map((x) => {
            const starttime = x.starttime.split(":");
            const endtime = x.endtime.split(":");
            return {
                startDate: new Date(
                    new Date(x.worksession.workdate).getFullYear(),
                    new Date(x.worksession.workdate).getMonth(),
                    new Date(x.worksession.workdate).getDate(),
                    starttime[0],
                    starttime[1],
                    starttime[2]
                ),
                endDate: new Date(
                    new Date(x.worksession.workdate).getFullYear(),
                    new Date(x.worksession.workdate).getMonth(),
                    new Date(x.worksession.workdate).getDate(),
                    endtime[0],
                    endtime[1],
                    endtime[2]
                ),
                // content:
                //     !x.updaterid && !x.isopen ? (
                //         <Box sx={{ p: 1 }}>
                //             <Box>
                //                 <Typography variant="inherit">
                //                     Thời gian tạo:{" "}
                //                     {format(new Date(x.creationtime), "dd/MM/yyyy hh:mm:ss")}
                //                 </Typography>
                //                 <Typography variant="inherit">Trạng thái: Mới tạo</Typography>
                //             </Box>
                //         </Box>
                //     ) : x.isopen ? (
                //         <Box sx={{ p: 1 }}>
                //             <Box>
                //                 <Typography variant="inherit">
                //                     Thời gian mở:{" "}
                //                     {x.updatetime
                //                         ? format(new Date(x.updatetime), "dd/MM/yyyy hh:mm:ss")
                //                         : "Chưa xử lí"}
                //                 </Typography>
                //                 <Typography variant="inherit">Trạng thái: Đang mở</Typography>
                //             </Box>
                //         </Box>
                //     ) : (
                //         <Box sx={{ p: 1 }}>
                //             <Box>
                //                 <Typography variant="inherit">
                //                     Thời gian đóng:{" "}
                //                     {format(new Date(x.creationtime), "dd/MM/yyyy hh:mm:ss")}
                //                 </Typography>
                //                 <Typography variant="inherit">Trạng thái: Đã đóng</Typography>
                //             </Box>
                //         </Box>
                //     ),
                id: x.id,
                title: x.name,
                backgroundColor:
                    !x.isopen && !x.openerid ? "#fb8c00" : x.isopen ? "#1e88e5" : "#fb8c00",
            };
        });

    const commitChanges = (changes: ChangeSet) => {
        // eslint-disable-next-line no-console
        console.log(changes);
    };

    if (isLoading) {
        return null;
    }
    return (
        <Paper sx={{ mt: 1 }}>
            <ShiftForm opened={open} action={() => setOpen(false)} />
            <ShiftCloneForm opened={openClone} action={() => setOpenClone(false)} />
            <ShiftUpdateForm
                id={selected}
                opened={Boolean(selected)}
                action={() => setSelected(0)}
            />
            <SchedulerOk data={appointments} locale={"vi-VN"}>
                <EditingState onCommitChanges={commitChanges} />
                <ViewState defaultCurrentDate={new Date()} />
                <WeekView
                    cellDuration={120}
                    timeTableCellComponent={TimeTableCell}
                    dayScaleCellComponent={DayScaleCell}
                />
                <DayView />
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
                                <Grid container width={"40%"}>
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
                                    onClick={() => setOpen(true)}
                                    sx={{
                                        mr: 1,
                                    }}
                                >
                                    Tạo ca làm việc
                                </Button>
                                <Button
                                    variant="contained"
                                    color="warning"
                                    onClick={() => setOpenClone(true)}
                                >
                                    Sao chép ca làm việc
                                </Button>
                            </Box>
                        );
                    }}
                />
                <DateNavigator />
                <ViewSwitcher
                    switcherComponent={(props) => {
                        return (
                            <Select
                                id="demo-simple-select"
                                value={props.currentView.name}
                                onChange={(e) => {
                                    props.onChange(e.target.value);
                                }}
                            >
                                {props.availableViews.map((x) => {
                                    return (
                                        <MenuItem key={x.name} value={x.name}>
                                            {x.displayName.toUpperCase() === "WEEK"
                                                ? "Hiển thị theo tuần"
                                                : x.displayName.toUpperCase() === "DAY"
                                                ? "Hiển thị theo ngày"
                                                : ""}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        );
                    }}
                />
                <TodayButton
                    messages={{
                        today: "Trở về  ngày hiện tại",
                    }}
                />
            </SchedulerOk>
        </Paper>
    );
};

export default Shift;
