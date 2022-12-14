import { IFilterTable, IColumn } from "../models";

import {
    TableRow,
    TableCell,
    TextField,
    Autocomplete,
    Checkbox,
    Popper,
    PopperProps,
} from "@mui/material";
import { MobileDatePicker, TimePicker } from "@mui/x-date-pickers";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import useSnackbar from "components/Snackbar/useSnackbar";
import { popperSx } from "containers/shift/ShiftCloneForm";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const FilterTable: React.FC<IFilterTable> = (props: IFilterTable) => {
    const showSnackbar = useSnackbar();
    return (
        <TableRow>
            {props.columns?.map((column: IColumn, index: number) => {
                if (column.disableFilter) {
                    return <TableCell width={column.width || 205} key={index}></TableCell>;
                }
                if (column.type === "enum") {
                    const key = column.field;
                    return (
                        <TableCell key={index} width={column.width || 205}>
                            <Autocomplete
                                multiple
                                id="filter"
                                options={column.enumValue || []}
                                disableCloseOnSelect
                                value={
                                    props.filters[key].value as Array<{
                                        key: string;
                                        value: string;
                                    }>
                                }
                                isOptionEqualToValue={(option, value) => option.key === value.key}
                                getOptionLabel={(option) => option.value}
                                onChange={(event, newValue) => {
                                    if (newValue.length !== 0) {
                                        props.onEnumHandleChange(key, newValue);
                                    } else {
                                        showSnackbar({
                                            severity: "warning",
                                            children:
                                                "Please select at least one columns to display.",
                                        });
                                    }
                                }}
                                fullWidth
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox
                                            size="small"
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            // style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.value}
                                    </li>
                                )}
                                PopperComponent={PopperMy}
                                renderTags={() => null}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        variant="standard"
                                        value={`${props.filters[key].value.length} hàng được chọn.`}
                                        placeholder={
                                            props.filters[key].value.length ===
                                            column.enumValue?.length
                                                ? ""
                                                : `${props.filters[key].value.length} hàng được chọn.`
                                        }
                                    />
                                )}
                            />
                        </TableCell>
                    );
                }
                if (column.type === "boolean") {
                    const key = column.field;
                    return (
                        <TableCell key={index} width={column.width || 205}>
                            <Autocomplete
                                multiple
                                id="filterBoolean"
                                options={column.enumBooleanValue || []}
                                disableCloseOnSelect
                                value={
                                    props.filters[key].value as Array<{
                                        key: boolean;
                                        value: string;
                                    }>
                                }
                                isOptionEqualToValue={(option, value) => option.key === value.key}
                                getOptionLabel={(option) => option.value}
                                onChange={(event, newValue) => {
                                    if (newValue.length !== 0) {
                                        props.onBooleanEnumHandleChange(key, newValue);
                                    } else {
                                        showSnackbar({
                                            severity: "warning",
                                            children:
                                                "Please select at least one columns to display.",
                                        });
                                    }
                                }}
                                fullWidth
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox
                                            size="small"
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            // style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.value}
                                    </li>
                                )}
                                PopperComponent={PopperMy}
                                renderTags={() => null}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        variant="standard"
                                        value={`${props.filters[key].value.length} hàng được chọn.`}
                                        placeholder={
                                            props.filters[key].value.length ===
                                            column.enumBooleanValue?.length
                                                ? ""
                                                : `${props.filters[key].value.length} hàng được chọn.`
                                        }
                                    />
                                )}
                            />
                        </TableCell>
                    );
                }
                if (column.type === "time") {
                    const key = column.field;
                    return (
                        <TableCell key={index} width={column.width || 205}>
                            <TimePicker
                                value={
                                    props.filters[key].value === ""
                                        ? null
                                        : new Date(props.filters[key].value as string)
                                }
                                ampm={false}
                                openTo="hours"
                                views={["hours", "minutes", "seconds"]}
                                inputFormat="HH:mm:ss"
                                mask="__:__:__"
                                onChange={(date) => props.onTimeHandleChange(date, key)}
                                renderInput={(params) => (
                                    <TextField size="small" variant="standard" {...params} />
                                )}
                            />
                        </TableCell>
                    );
                }
                if (column.type === "date") {
                    const key = column.field;
                    return (
                        <TableCell key={index} width={column.width || 205}>
                            <MobileDatePicker
                                value={
                                    props.filters[key].value === ""
                                        ? null
                                        : new Date(props.filters[key].value as string)
                                }
                                DialogProps={{
                                    sx: popperSx,
                                }}
                                onChange={(date) => props.onTimeHandleChange(date, key)}
                                renderInput={(params) => (
                                    <TextField size="small" variant="standard" {...params} />
                                )}
                            />
                        </TableCell>
                    );
                } else if (column.type === "object") {
                    const key = column.field + "_" + column.subField;
                    return column.subFieldType === "enum" ? (
                        <TableCell key={index} width={column.width || 205}>
                            <Autocomplete
                                multiple
                                id="filter"
                                options={column.enumValue || []}
                                disableCloseOnSelect
                                value={
                                    props.filters[key].value as Array<{
                                        key: string;
                                        value: string;
                                    }>
                                }
                                isOptionEqualToValue={(option, value) => option.key === value.key}
                                getOptionLabel={(option) => option.value}
                                onChange={(event, newValue) => {
                                    if (newValue.length !== 0) {
                                        props.onEnumHandleChange(key, newValue);
                                    } else {
                                        showSnackbar({
                                            severity: "warning",
                                            children:
                                                "Please select at least one columns to display.",
                                        });
                                    }
                                }}
                                fullWidth
                                renderOption={(props, option, { selected }) => (
                                    <li {...props}>
                                        <Checkbox
                                            size="small"
                                            icon={icon}
                                            checkedIcon={checkedIcon}
                                            // style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option.value}
                                    </li>
                                )}
                                PopperComponent={PopperMy}
                                renderTags={() => null}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        size="small"
                                        variant="standard"
                                        value={`${props.filters[key].value.length} hàng được chọn.`}
                                        placeholder={
                                            props.filters[key].value.length ===
                                            column.enumValue?.length
                                                ? ""
                                                : `${props.filters[key].value.length} hàng được chọn.`
                                        }
                                    />
                                )}
                            />
                        </TableCell>
                    ) : (
                        <TableCell key={index} width={column.width || 205}>
                            <TextField
                                size="small"
                                variant="standard"
                                type="text"
                                name={key}
                                value={props.filters[key].value}
                                onChange={props.onChange}
                            />
                        </TableCell>
                    );
                }
                return (
                    <TableCell key={index} width={column.width || 205}>
                        <TextField
                            size="small"
                            variant="standard"
                            type="text"
                            name={column.field}
                            value={props.filters[column.field].value}
                            onChange={props.onChange}
                        />
                    </TableCell>
                );
            })}
            {props.isHaveAction && (
                <TableCell
                    sx={{
                        position: "sticky",
                        right: 0,
                        backgroundColor: "white",
                    }}
                    width={205}
                ></TableCell>
            )}
        </TableRow>
    );
};

const PopperMy = function (props: PopperProps) {
    return (
        <Popper
            {...props}
            style={{
                width: "fit-content",
            }}
            placement="bottom-start"
        />
    );
};
