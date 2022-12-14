import { Stack, Switch, Typography, SwitchProps } from "@mui/material";
import { Controller, Control, Path, FieldValues } from "react-hook-form";
export interface ISwitchBase<T extends FieldValues> extends SwitchProps {
    control: Control<T, any>;
    name: Path<T>;
    label: string;
    isreadonly?: boolean;
}
const SwitchBase = <T extends {}>(props: ISwitchBase<T>) => {
    const { control, name, label, isreadonly, ...rest } = props;
    return (
        <Stack direction="row" alignItems={"center"} spacing={0}>
            <Typography
                sx={{
                    p: 1,
                }}
            >
                {label}:
            </Typography>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Switch
                        {...rest}
                        onChange={
                            !isreadonly
                                ? (e) => {
                                      field.onChange(e.target.checked);
                                  }
                                : undefined
                        }
                        checked={Boolean(field.value) || false}
                    />
                )}
            />
        </Stack>
    );
};

export default SwitchBase;
