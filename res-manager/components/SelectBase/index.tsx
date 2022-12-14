import { FormControl, FormControlProps, InputLabel, Select } from "@mui/material";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

export interface ReactHookFormSelectProps<T extends FieldValues> extends FormControlProps {
    name: Path<T>;
    label: string;
    control: Control<T>;
    children: any;
    readOnly?: boolean;
}
const ReactHookFormSelect = <T extends FieldValues>(props: ReactHookFormSelectProps<T>) => {
    const { name, label, control, children, readOnly, ...rest } = props;
    const labelId = `${name}-label`;
    return (
        <FormControl {...rest}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Controller
                render={({ field: { value, ref, onChange } }) => (
                    <Select
                        inputRef={ref}
                        ref={ref}
                        labelId={labelId}
                        id={name}
                        label={label}
                        readOnly={readOnly}
                        value={value}
                        onChange={(value) => {
                            onChange(value);
                        }}
                    >
                        {children}
                    </Select>
                )}
                name={name}
                control={control}
            />
        </FormControl>
    );
};
export default ReactHookFormSelect;
