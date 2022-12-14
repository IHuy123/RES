import { TextField, Typography, TextFieldProps } from "@mui/material";
import React from "react";

const TextfieldBase = React.forwardRef<
    HTMLInputElement,
    TextFieldProps & { maxLength?: number; count?: number }
>((props: TextFieldProps & { maxLength?: number; count?: number }, ref) => {
    const { required, label, helperText, maxLength, count, ...rest } = props;
    return (
        <TextField
            {...rest}
            ref={ref}
            helperText={helperText || (maxLength ? `${count}/${maxLength}` : undefined)}
            FormHelperTextProps={
                !helperText && maxLength
                    ? {
                          style: {
                              textAlign: "right",
                          },
                      }
                    : undefined
            }
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
        />
    );
});

export default TextfieldBase;
