import React, { useState } from "react";

import { ConfirmModal } from "components/ConfirmModel";

import { ITableData, IColumn } from "../models";

import { ModeEdit, Delete, RemoveRedEye, Settings } from "@mui/icons-material";
import {
    TableRow,
    TableCell,
    Tooltip,
    IconButton,
    styled,
    tableCellClasses,
    Box,
} from "@mui/material";
import { getTimeFromStringDate } from "utils/common";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
    [`&.${tableCellClasses.paddingNone}`]: {
        padding: "5px 16px",
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:nth-of-type(even)": {
        backgroundColor: theme.palette.common.white,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));
export const TableData = <T extends Record<string, any>>(
    props: ITableData<T> & { children?: React.ReactNode }
) => {
    const [open, setOpen] = useState<boolean>(false);
    const [type, setType] = useState<"DELETE" | "CHANGE_STATUS">("DELETE");
    const [selectedToDeleteRow, setSelectedToDeleteRow] = useState<any>(null);
    const [selectedToChangeStatusRow, setSelectedToChangeStatusRow] = useState<any>(null);
    const handleClose = async (
        e: React.MouseEvent<HTMLButtonElement | MouseEvent>,
        action: "CONFIRM" | "CANCEL"
    ) => {
        if (action === "CONFIRM") {
            if (type === "DELETE") {
                if (props.action?.onDeleteRecord) {
                    props.action?.onDeleteRecord(selectedToDeleteRow, () => {
                        props.refetchPage();
                    });
                }
            } else if (type === "CHANGE_STATUS") {
                if (props.action?.onChangeStatus) {
                    props.action?.onChangeStatus(selectedToChangeStatusRow, () => {
                        props.refetchPage();
                    });
                }
            }
        }
        setOpen(false);
    };
    return (
        <React.Fragment>
            <ConfirmModal
                open={open}
                message={
                    type === "DELETE"
                        ? "Bạn có muốn thực hiện xóa?"
                        : "Bạn có muốn thực hiện chuyển trạng thái?"
                }
                handleClose={handleClose}
            />
            {props.rows?.map((row: T, indexRow: number) => {
                return (
                    <StyledTableRow key={row.id}>
                        {props.columns.map((column: IColumn, index: number) => {
                            const { render, link, renderLink } = column;
                            if (render !== undefined) {
                                if (column.type === "object") {
                                    return (
                                        <StyledTableCell
                                            width={column.width || 205}
                                            key={index}
                                            padding={"none"}
                                        >
                                            {render(
                                                row[column.field]
                                                    ? row[column.field][column.subField || ""]
                                                    : "",
                                                row.id
                                            )}
                                        </StyledTableCell>
                                    );
                                }
                                return (
                                    <StyledTableCell
                                        width={column.width || 205}
                                        key={index}
                                        padding={"none"}
                                    >
                                        {render(row[column.field], row.id)}
                                    </StyledTableCell>
                                );
                            }
                            if (column.type === "index") {
                                return (
                                    <StyledTableCell width={column.width || 205} key={index}>
                                        {!link ? (
                                            props.page * props.limit + (indexRow + 1)
                                        ) : (
                                            <a href={`${link}/${row.id}`}>
                                                {props.page * props.limit + (indexRow + 1)}
                                            </a>
                                        )}
                                    </StyledTableCell>
                                );
                            }
                            if (column.type === "object") {
                                return (
                                    <StyledTableCell
                                        width={column.width || 205}
                                        key={index}
                                        padding={"none"}
                                    >
                                        {row[column.field]
                                            ? row[column.field][column.subField || ""]
                                            : ""}
                                    </StyledTableCell>
                                );
                            }
                            if (column.type === "timestamp") {
                                return (
                                    <StyledTableCell
                                        width={column.width || 205}
                                        key={index}
                                        padding={"none"}
                                    >
                                        {row[column.field]
                                            ? row[column.field][column.subField || ""]
                                                ? row[column.field][column.subField || ""]
                                                : getTimeFromStringDate(row[column.field]) ||
                                                  row[column.field]
                                            : ""}
                                    </StyledTableCell>
                                );
                            }
                            return (
                                <StyledTableCell
                                    width={column.width || 205}
                                    key={index}
                                    padding={"none"}
                                >
                                    {link ? (
                                        <a href={`${link}/${row.id}`}>{row[column.field]}</a>
                                    ) : renderLink !== undefined ? (
                                        <a href={`${renderLink(row)}`}>{row[column.field]}</a>
                                    ) : (
                                        row[column.field]
                                    )}
                                </StyledTableCell>
                            );
                        })}
                        {(props.isHaveActionDelete ||
                            props.isHaveActionEdit ||
                            props.isHaveActionView ||
                            props.isHaveActionChangeStatus) && (
                            <StyledTableCell
                                width={205}
                                padding={"none"}
                                sx={{
                                    position: "sticky",
                                    right: 0,
                                    backgroundColor: "white",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    {props.isHaveActionEdit && (
                                        <Tooltip title={String("Chỉnh sửa")}>
                                            <IconButton
                                                size="large"
                                                onClick={() => {
                                                    if (props.action?.onEdit) {
                                                        props.action?.onEdit(row, () => {
                                                            props.refetchPage();
                                                        });
                                                    }
                                                }}
                                            >
                                                <ModeEdit />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {props.isHaveActionView && (
                                        <Tooltip title={String("Xem chi tiết")}>
                                            <IconButton
                                                size="large"
                                                onClick={() => {
                                                    if (props.action?.onView) {
                                                        props.action?.onView(row);
                                                    }
                                                }}
                                            >
                                                <RemoveRedEye />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {props.isHaveActionDelete && (
                                        <Tooltip title={String("Xóa")}>
                                            <IconButton
                                                size="large"
                                                onClick={() => {
                                                    setType("DELETE");
                                                    setOpen(true);
                                                    setSelectedToDeleteRow(row);
                                                }}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {props.isHaveActionChangeStatus && (
                                        <Tooltip title={String("Thay đổi trạng thái")}>
                                            <IconButton
                                                size="large"
                                                onClick={() => {
                                                    setType("CHANGE_STATUS");
                                                    setOpen(true);
                                                    setSelectedToChangeStatusRow(row);
                                                }}
                                            >
                                                <Settings />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            </StyledTableCell>
                        )}
                    </StyledTableRow>
                );
            })}
        </React.Fragment>
    );
};
