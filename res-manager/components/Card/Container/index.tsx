import React from "react";
import { Card } from "@mui/material";
export type ICardContainerType = {
    width?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
    height?: string | number;
    maxHeight?: string;
    overflowY?: string;
    children: React.ReactNode;
    margin?: number;
};

const CardContainer = React.forwardRef<HTMLDivElement, ICardContainerType>(
    (props: ICardContainerType, ref) => {
        const {
            width = "50%",
            minWidth = 280,
            maxWidth = "auto",
            height = "unset",
            overflowY = "unset",
            children,
            maxHeight = "auto",
            margin = 1,
        } = props;
        return (
            <Card
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: width,
                    minWidth: minWidth,
                    maxWidth: maxWidth,
                    height: height,
                    maxHeight: maxHeight,
                    overflowY: overflowY,
                    mx: "auto",
                    p: 1,
                    m: margin,
                    borderRadius: 1,
                }}
                ref={ref}
                tabIndex={-1}
            >
                {children}
            </Card>
        );
    }
);

export default CardContainer;
