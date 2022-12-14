import { Avatar, Dialog, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";

export type DialogImageShowType = {
    open: boolean;
    handleClose: () => void;
    avatarSrc: string;
};

const DialogImageShow = ({ open, avatarSrc, handleClose }: DialogImageShowType) => {
    return (
        <Dialog open={open}>
            <Box
                sx={{
                    textAlign: "right",
                }}
            >
                <IconButton onClick={() => handleClose()}>
                    <ClearIcon />
                </IconButton>
            </Box>
            {avatarSrc !== undefined && (
                <Avatar
                    src={avatarSrc}
                    variant="square"
                    sx={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            )}
        </Dialog>
    );
};

export default DialogImageShow;
