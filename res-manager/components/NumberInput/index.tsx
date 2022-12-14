import { Control, Controller, FieldValues, Path, RegisterOptions } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { TextField, Typography } from "@mui/material";

export interface INumberFormatInput<T extends FieldValues> {
    name: Path<T>;
    label: string;
    control: Control<T, any>;
    rules: Omit<RegisterOptions<T>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
    fullWidth?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    isShowNumberZero?: boolean;
    haveInitValue?: boolean;
}
export const CurrencyFormatInput = <T extends object>(props: INumberFormatInput<T>) => {
    const {
        label,
        name,
        fullWidth,
        disabled,
        readOnly,
        control,
        rules,
        required,
        haveInitValue = false,
    } = props;
    return (
        <Controller
            name={name}
            rules={rules}
            control={control}
            render={({ field: { value, ref, onChange }, fieldState: { error } }) => (
                <NumericFormat
                    inputRef={ref}
                    customInput={TextField}
                    thousandSeparator
                    valueIsNumericString
                    fullWidth={fullWidth}
                    suffix=" VND"
                    label={
                        <Typography>
                            {label}{" "}
                            {required && (
                                <span
                                    style={{
                                        color: "red",
                                    }}
                                >
                                    *
                                </span>
                            )}
                        </Typography>
                    }
                    InputProps={{
                        readOnly: readOnly,
                    }}
                    error={Boolean(error)}
                    disabled={disabled}
                    helperText={Boolean(error) && error?.message}
                    value={value !== 0 ? (value as number) : haveInitValue ? 0 : ""}
                    onValueChange={(v: any) => {
                        onChange((v.floatValue as any) || "");
                    }}
                />
            )}
        />
    );
};

export const NumberFormatInput = <T extends object>(props: INumberFormatInput<T>) => {
    const { label, name, fullWidth, control, readOnly, rules, required, isShowNumberZero } = props;
    return (
        <Controller
            name={name}
            render={({ field: { value, ref, onChange }, fieldState: { error } }) => (
                <NumericFormat
                    inputRef={ref}
                    customInput={TextField}
                    valueIsNumericString
                    fullWidth={fullWidth}
                    error={Boolean(error)}
                    helperText={Boolean(error) && error?.message}
                    label={
                        <Typography>
                            {label}{" "}
                            {required && (
                                <span
                                    style={{
                                        color: "red",
                                    }}
                                >
                                    *
                                </span>
                            )}
                        </Typography>
                    }
                    InputProps={{
                        readOnly: readOnly,
                    }}
                    value={
                        isShowNumberZero ? (value as number) : value !== 0 ? (value as number) : ""
                    }
                    onValueChange={(v: any) => {
                        onChange((v.floatValue as any) || "");
                    }}
                />
            )}
            rules={rules}
            control={control}
        />
    );
};
