import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

export interface IConfirmModel {
    message: string;
    open: boolean;
    handleClose: (
        e: React.MouseEvent<HTMLButtonElement | MouseEvent>,
        action: "CONFIRM" | "CANCEL"
    ) => void;
}
export const ConfirmModal: React.FC<IConfirmModel> = (props: IConfirmModel) => {
    const { open, handleClose, message } = props;
    return (
        <Dialog open={open}>
            <DialogTitle>{"Bạn có chắc chắn với hành động của mình?"}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={(e) => handleClose(e, "CANCEL")} color="secondary">
                    {"Hủy"}
                </Button>
                <Button onClick={(e) => handleClose(e, "CONFIRM")} color="primary" autoFocus>
                    {"Đồng ý"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
