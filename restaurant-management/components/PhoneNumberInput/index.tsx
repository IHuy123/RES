import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import PhoneCustomSelect, { StyledOption } from "components/PhoneCustomSelect";
import { countries } from "configurations/phoneCode";
import Image from "next/image";
import React from "react";

export interface IPhoneNumberInput {
    label?: string;
    fullWidth?: boolean;
    placeHolder?: string;
    inputRef: React.Ref<any> | undefined;
    error: boolean;
    helperText?: string | undefined;
    phoneCodeSelected: string | undefined;
    handleChangePhoneCodeSelected: (value: string) => void;
    variant?: "outlined" | "filled" | "standard";
}
const PhoneNumberInput = (props: IPhoneNumberInput) => {
    const {
        label,
        error,
        fullWidth,
        placeHolder,
        inputRef,
        helperText = "",
        variant = "outlined",
        handleChangePhoneCodeSelected,
        phoneCodeSelected,
        ...rest
    } = props;

    return (
        <Box display="flex" columnGap="12px">
            <PhoneCustomSelect
                onChange={handleChangePhoneCodeSelected}
                value={phoneCodeSelected ?? ""}
            >
                {countries.map((c) => (
                    <StyledOption key={`${c.code}-${c.phone}`} value={c.phone}>
                        <Box marginRight={"10px"} display="inline-block">
                            <Image
                                loading="lazy"
                                width="15"
                                height="10.5"
                                src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                                alt={`Flag of ${c.label}`}
                            />
                        </Box>
                        ({c.code}) +{c.phone}
                    </StyledOption>
                ))}
            </PhoneCustomSelect>
            <TextField
                label={label ? label : "Phone number"}
                type="text"
                fullWidth={fullWidth}
                error={error}
                helperText={helperText}
                variant={variant}
                placeholder={placeHolder || "9XXXXXXXX"}
                inputRef={inputRef}
                {...rest}
            />
        </Box>
    );
};
export default PhoneNumberInput;
