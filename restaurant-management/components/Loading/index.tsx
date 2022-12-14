import { Box } from "@mui/material";
import React, { memo } from "react";
import ReactLoading from "react-loading";

export type LoadingType = {
    isLoading: boolean;
    children?: React.ReactNode;
};

const LoadingCustomize = (props: LoadingType) => {
    const { isLoading, children } = props;
    return (
        <React.Fragment>
            {isLoading && (
                <Box
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,.5)",
                        zIndex: "99999",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ReactLoading type={"spin"} color={"#fff"} height={50} width={50} />
                </Box>
            )}
            {children}
        </React.Fragment>
    );
};

export default memo(LoadingCustomize);
