import { ICheckBoxHeader, IColumn } from "../models";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { Autocomplete, Checkbox, TextField } from "@mui/material";
import useSnackbar from "components/Snackbar/useSnackbar";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const CheckboxesHeader: React.FC<ICheckBoxHeader> = (props: ICheckBoxHeader) => {
    const showSnackbar = useSnackbar();
    return (
        <Autocomplete
            multiple
            id="checkbox header"
            options={props.columns}
            disableCloseOnSelect
            value={props.selectedColumns as IColumn[]}
            isOptionEqualToValue={(option, value) => option.field === value.field}
            getOptionLabel={(option) => option.title}
            onChange={(event, newValue) => {
                if (newValue.length !== 0) {
                    newValue = newValue.sort((a, b) => {
                        return a.index - b.index;
                    });
                    props.setSelectedColumns([...newValue]);
                } else {
                    showSnackbar({
                        severity: "warning",
                        children: "Please select at least one columns to display.",
                    });
                }
            }}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option.title}
                </li>
            )}
            style={{ width: 500 }}
            renderTags={() => null}
            renderInput={(params) => (
                <TextField
                    {...params}
                    size="small"
                    variant="standard"
                    value={`${props.selectedColumns.length} hàng được chọn.`}
                    placeholder={`${props.selectedColumns.length} hàng được chọn.`}
                />
            )}
        />
    );
};
