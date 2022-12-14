import {
    Box,
    Paper,
    Toolbar,
    Typography,
    Tooltip,
    IconButton,
    TableContainer,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    TablePagination,
    Table,
    LabelDisplayedRowsArgs,
} from "@mui/material";
import React, { ChangeEvent } from "react";
import { useState } from "react";
import useTableQuery from "./hooks/useTableQuery";
import { ITable, Order, TypeRecord } from "./models";
import { TableHeader } from "./TableHeader";
import { TableData } from "./TableData";
import { AddBoxRounded } from "@mui/icons-material";
import { CheckboxesHeader } from "./CheckboxesHeader";
import { IColumn } from "./models";
import { FilterTable } from "./FilterTable";
import GraphQLQueryClientContextProvider from "./context/QueryClientContext";
import CachedIcon from "@mui/icons-material/Cached";
import { useQueryClient } from "react-query";
const HasuraTable = (props: ITable & { children?: React.ReactNode }) => {
    const cache = useQueryClient();
    const {
        columns,
        entity,
        firstOrderField,
        typeOrder = "desc",
        defaultFilter,
        defaultFilterForCount,
        queryKey,
    } = props;
    const [paging, setPaging] = useState<{ offset: number; limit: number }>({
        offset: 0,
        limit: 10,
    });

    const [selectedColumns, setSelectedColumns] = useState<IColumn[]>([...columns]);
    const [orderBy, setOrderBy] = useState<{ field: string; order: Order }>({
        field: firstOrderField,
        order: typeOrder,
    });

    const generateFilter = () => {
        let fields = columns
            .filter((column) => !column.disable)
            .filter((column) => !column.disableFilter)
            .map((column) => {
                if (column.type === "object") {
                    return {
                        type: column.type,
                        value: column.field + "_" + column.subField,
                    };
                }
                return {
                    type: column.type,
                    value: column.field,
                };
            });
        let obj: Record<
            string,
            {
                value:
                    | string
                    | Array<{ key: string; value: string }>
                    | Array<{ key: boolean; value: string }>;
                type: TypeRecord;
            }
        > = {};
        fields.forEach((field) => {
            if (field.type === "enum") {
                const index: number = columns?.findIndex((x: IColumn) => x.field === field.value);
                if (index !== -1) {
                    const value = columns[index].enumValue || [];
                    obj[field.value] = {
                        value: value,
                        type: "enum",
                    };
                }
            } else if (field.type === "boolean") {
                const index: number = columns?.findIndex((x: IColumn) => x.field === field.value);
                if (index !== -1) {
                    const value = columns[index].enumBooleanValue || [];
                    obj[field.value] = {
                        value: value,
                        type: "boolean",
                    };
                }
            } else if (field.type === "object") {
                const index: number = columns?.findIndex(
                    (x: IColumn) =>
                        x.field === field.value.split("_")[0] &&
                        x.subField === field.value.split("_")[1]
                );
                if (index !== -1 && columns[index].subFieldType === "enum") {
                    const value = columns[index].enumValue || [];
                    obj[field.value] = {
                        value: value,
                        type: "object",
                    };
                } else {
                    obj[field.value] = {
                        value: "",
                        type: field.type || "string",
                    };
                }
            } else {
                obj[field.value] = {
                    value: "",
                    type: field.type || "string",
                };
            }
        });
        return obj;
    };

    const [filters, setFilters] = useState(generateFilter());

    const onHandleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        filters[name].value = value;
        setFilters({ ...filters });
    };

    const onTimeHandleChange = (date: Date | null, name: string) => {
        if (date != null) {
            filters[name].value = String(date);
            setFilters({ ...filters });
        }
    };

    const onEnumHandleChange = (name: string, data: Array<{ key: string; value: string }>) => {
        filters[name].value = data;
        setFilters({ ...filters });
    };

    const onBooleanEnumHandleChange = (
        name: string,
        data: Array<{ key: boolean; value: string }>
    ) => {
        filters[name].value = data;
        setFilters({ ...filters });
    };

    const { isLoading, data, isError, refetch } = useTableQuery(
        queryKey,
        [...selectedColumns],
        paging.limit,
        paging.offset,
        entity,
        orderBy.field,
        orderBy.order,
        filters,
        defaultFilter,
        defaultFilterForCount
    );

    const refetchPage = () => {
        cache.invalidateQueries(queryKey, undefined, {
            cancelRefetch: false,
        });
        setPaging(() => {
            return {
                offset: 0,
                limit: 10,
            };
        });
    };

    const onAddHandler = () => {
        if (props.action?.onAdd) {
            props.action?.onAdd(() => {
                refetchPage();
            });
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPaging(() => {
            return {
                offset: newPage,
                limit: 10,
            };
        });
        refetch();
    };

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setPaging(() => {
            return {
                offset: 0,
                limit: parseInt(event.target.value, 10),
            };
        });
        refetch();
    };

    const createSortHandler = (field: string, direction: Order) => {
        setOrderBy({
            ...orderBy,
            field: field,
            order: direction === "asc" ? "desc" : "asc",
        });
    };

    const total = data
        ? data[`${entity}_aggregate`]
            ? data[`${entity}_aggregate`]["aggregate"]
                ? data[`${entity}_aggregate`]["aggregate"]["count"]
                : 0
            : 0
        : 0;

    const emptyRows = data ? paging.limit - (data[entity] ? data[entity].length : 0) : 0;

    const labelDisplayedRows = (paginationInfo: LabelDisplayedRowsArgs) => {
        const { from, to, count } = paginationInfo;
        return String(`${from}–${to} của ${count}`);
        // return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
    };

    if (isError) {
        return <div>error</div>;
    }

    return (
        <GraphQLQueryClientContextProvider>
            <Box sx={{ width: "100%" }}>
                <Paper
                    sx={{
                        mb: 2,
                        overflowX: "auto",
                        maxWidth: { md: "calc(100vw - 250px)", xs: "90vw" },
                        // maxWidth: "100%",
                    }}
                >
                    <Toolbar
                        sx={{
                            pl: { sm: 2 },
                            pr: { xs: 1, sm: 1 },
                        }}
                    >
                        <Typography
                            sx={{ flex: "1 1 100%" }}
                            variant="h6"
                            id="tableTitle"
                            component="div"
                        >
                            {`${props.title}`}
                        </Typography>
                        <React.Fragment>
                            <CheckboxesHeader
                                selectedColumns={selectedColumns.filter((col) => !col.disable)}
                                setSelectedColumns={setSelectedColumns}
                                columns={columns.filter((col) => !col.disable)}
                            />
                            <Tooltip title={"Tải lại"}>
                                <IconButton size="large" onClick={() => refetchPage()}>
                                    <CachedIcon />
                                </IconButton>
                            </Tooltip>
                            {!!props?.action?.onAdd && (
                                <Tooltip title={"Thêm mới"}>
                                    <IconButton size="large" onClick={() => onAddHandler()}>
                                        <AddBoxRounded />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </React.Fragment>
                    </Toolbar>
                    <TableContainer
                        sx={{
                            width: "100%",
                            margin: "0 auto",
                        }}
                    >
                        <Table aria-label="simple table" style={{ tableLayout: "fixed" }}>
                            <TableHeader
                                enableSort={props.sort}
                                columns={selectedColumns.filter((col) => !col.disable)}
                                isHaveAction={
                                    !!props?.action?.onEdit ||
                                    !!props?.action?.onDeleteRecord ||
                                    !!props?.action?.onView ||
                                    !!props?.action?.onChangeStatus
                                }
                                orderBy={orderBy}
                                createSortHandler={createSortHandler}
                            />
                            <TableBody>
                                {props.enableFilter && (
                                    <FilterTable
                                        onChange={onHandleChange}
                                        filters={filters}
                                        columns={selectedColumns.filter((col) => !col.disable)}
                                        isHaveAction={
                                            !!props?.action?.onDeleteRecord ||
                                            !!props?.action?.onEdit ||
                                            !!props?.action?.onView ||
                                            !!props?.action?.onChangeStatus
                                        }
                                        onTimeHandleChange={onTimeHandleChange}
                                        onEnumHandleChange={onEnumHandleChange}
                                        onBooleanEnumHandleChange={onBooleanEnumHandleChange}
                                    />
                                )}
                                {isLoading ? (
                                    <TableRow
                                        style={{
                                            height: 53 * (paging.limit || 10),
                                        }}
                                    >
                                        <TableCell colSpan={selectedColumns.length + 1}>
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                sx={{
                                                    width: {
                                                        md: "calc(100vw - (250px * 1.4) - 10px)",
                                                        xs: "90vw",
                                                    },
                                                }}
                                            >
                                                <CircularProgress />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <React.Fragment>
                                        <TableData
                                            rowPerPage={paging.limit}
                                            rows={data[entity] || []}
                                            columns={selectedColumns.filter((col) => !col.disable)}
                                            isHaveActionChangeStatus={
                                                !!props?.action?.onChangeStatus
                                            }
                                            isHaveActionDelete={!!props?.action?.onDeleteRecord}
                                            isHaveActionEdit={!!props?.action?.onEdit}
                                            isHaveActionView={!!props?.action?.onView}
                                            page={paging?.offset}
                                            limit={paging?.limit}
                                            action={props.action}
                                            refetchPage={refetchPage}
                                        />
                                        {emptyRows > 0 && (
                                            <TableRow
                                                style={{
                                                    height: 53 * emptyRows,
                                                }}
                                            >
                                                <TableCell
                                                    colSpan={
                                                        !!props?.action?.onDeleteRecord ||
                                                        !!props?.action?.onEdit ||
                                                        !!props?.action?.onView ||
                                                        !!props?.action?.onChangeStatus
                                                            ? selectedColumns.filter(
                                                                  (column) => !column.disable
                                                              ).length + 1
                                                            : selectedColumns.filter(
                                                                  (column) => !column.disable
                                                              ).length
                                                    }
                                                >
                                                    <Box
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        fontSize="17px"
                                                        color="#B0B0B0"
                                                        sx={{
                                                            width: {
                                                                md: "calc(100vw - (250px * 1.4) - 10px)",
                                                                xs: "90vw",
                                                            },
                                                        }}
                                                    >
                                                        {emptyRows === paging.limit &&
                                                            `Không có dữ liệu nào hiện tại`}
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={total}
                        rowsPerPage={paging.limit}
                        page={Math.min(total, paging.offset)}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelDisplayedRows={labelDisplayedRows}
                        labelRowsPerPage={"Số hàng mỗi trang:"}
                    />
                </Paper>
            </Box>
        </GraphQLQueryClientContextProvider>
    );
};

const CRUDTable = (props: ITable & { children?: React.ReactNode }) => {
    return <HasuraTable {...props} />;
};

export default CRUDTable;
