import { Chip as MaterialChip, ChipProps as MaterialChipProps } from "@mui/material";
import React from "react";

export interface ChipBaseProps extends MaterialChipProps {}
const ChipBase = React.forwardRef<HTMLDivElement, ChipBaseProps>((props: ChipBaseProps, ref) => {
    return (
        <MaterialChip
            style={{
                color: "white",
                fontWeight: "400",
                cursor: "pointer",
                textTransform: "uppercase",
            }}
            {...props}
            ref={ref}
        />
    );
});

export default ChipBase;
