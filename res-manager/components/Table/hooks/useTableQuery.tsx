import useQueryClient from "components/Table/hooks/useQueryClient";
import { useQuery } from "react-query";
import { gql } from "graphql-request";
import { IColumn, Order, TypeRecord } from "../models";

const useTableQuery = (
    queryKey: string,
    columns: IColumn[],
    limit: number = 5,
    offset = 0,
    entity: string,
    orderBy: string,
    direction: Order,
    filters: Record<
        string,
        {
            value:
                | string
                | Array<{ key: string; value: string }>
                | Array<{ key: boolean; value: string }>;
            type: TypeRecord;
        }
    >,
    args?: string,
    defaultFilter?: string,
    defaultFilterForCount?: string
) => {
    offset = limit * offset;
    const queryClient = useQueryClient();
    const variable: Record<string, string | number | boolean> = {
        limit,
        offset,
        direction,
    };
    let filterString: string = "";
    let filterStringInline: string = "";
    if (filters) {
        Object.keys(filters).forEach((key) => {
            if (filters[key].type === "enum") {
                const orStatement: string = (
                    filters[key].value as Array<{ key: string; value: string }>
                )
                    .map((x) => {
                        return `{${key}: {_eq: "${x.key}"}}`;
                    })
                    .join(", ");
                filterStringInline = filterStringInline + `{_or: [${orStatement}]}, `;
            } else if (filters[key].type === "boolean") {
                const orStatement: string = (
                    filters[key].value as Array<{ key: boolean; value: string }>
                )
                    .map((x) => {
                        return `{${key}: {_eq: "${String(x.key)}"}}`;
                    })
                    .join(", ");
                filterStringInline = filterStringInline + `{_or: [${orStatement}]}, `;
            } else {
                let isIgnore: boolean = false;
                let subFieldName: string | undefined = undefined;
                let subFieldType: string | undefined = undefined;
                let fieldName: string | undefined = undefined;
                if (filters[key].type === "string" && filters[key].value.toString() !== "") {
                    variable[key] = `%${filters[key].value}%`;
                } else if (filters[key].type === "number") {
                    if (Number(filters[key].value as string) != 0) {
                        variable[key] = Number(filters[key].value);
                    } else {
                        isIgnore = true;
                    }
                } else if (
                    filters[key].type === "date" ||
                    filters[key].type === "timestamp" ||
                    filters[key].type === "time"
                ) {
                    if (!filters[key].value) {
                        isIgnore = true;
                    } else {
                        let date = new Date(filters[key].value as string);
                        if (filters[key].type === "time") {
                            variable[
                                key
                            ] = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                        } else if (filters[key].type === "date") {
                            variable[key] = `${date.getFullYear()}-${date.getMonth() + 1}-${
                                date.getDay() - 1
                            }`;
                        } else {
                            variable[key] = filters[key].value as string;
                        }
                    }
                } else if (filters[key].type === "object") {
                    let index = [...columns].findIndex(
                        (x) => x.field === key.split("_")[0] && x.subField === key.split("_")[1]
                    );

                    subFieldType = columns[index].subFieldType;
                    subFieldName = key.split("_")[1];
                    fieldName = key.split("_")[0];
                    if (subFieldType === "string") {
                        variable[`${key}`] = `%${filters[key].value}%`;
                    } else if (subFieldType === "number") {
                        if (Number(filters[key].value) != 0) {
                            variable[`${key}`] = Number(filters[key].value);
                        } else {
                            isIgnore = true;
                        }
                    }
                }
                if (!isIgnore) {
                    if (
                        filters[key].type !== "index" &&
                        filters[key].type !== "object" &&
                        filters[key].value.toString() !== ""
                    ) {
                        filterString =
                            filterString +
                            " $" +
                            key +
                            ": " +
                            (filters[key].type === "string"
                                ? "String"
                                : filters[key].type === "date"
                                ? "date"
                                : filters[key].type === "timestamp"
                                ? "timestamp"
                                : filters[key].type === "time"
                                ? "time"
                                : filters[key].type == "boolean"
                                ? "boolean"
                                : "Int") +
                            ",";
                        filterStringInline =
                            filterStringInline +
                            "{" +
                            key +
                            ": {" +
                            (filters[key].type === "string" ? "_ilike" : "_eq") +
                            ": $" +
                            key +
                            "}},";
                    }
                    if (filters[key].type === "object") {
                        if (subFieldType === "enum") {
                            const orStatement: string = (
                                filters[key].value as Array<{ key: string; value: string }>
                            )
                                .map((x) => {
                                    return `{${subFieldName}: {_eq: "${x.key}"}}`;
                                })
                                .join(", ");
                            filterStringInline =
                                filterStringInline + `{${fieldName}: {_or: [${orStatement}]}}, `;
                        } else {
                            filterString =
                                filterString +
                                " $" +
                                key +
                                ": " +
                                (typeof variable[`${key}`] === "string" ? "String" : "Int") +
                                ",";
                            filterStringInline =
                                filterStringInline +
                                "{" +
                                fieldName +
                                ": {" +
                                (subFieldName || "") +
                                ": {" +
                                (typeof variable[`${key}`] === "string" ? "_ilike" : "_eq") +
                                ": $" +
                                key +
                                "}}},";
                        }
                    }
                }
            }
        });
    }

    let queryString = "";
    [...columns].forEach((col, index) => {
        if (col.type === "object") {
            queryString = queryString + col.field + " {\n" + "      " + col.subField + "\n    }";
        } else {
            if (index === columns.length - 1) {
                queryString = queryString + col.field;
            } else {
                queryString = queryString + col.field + "\n    ";
            }
        }
    });
    if (defaultFilter) {
        filterStringInline += defaultFilter;
    }
    const result = useQuery(
        [
            queryKey,
            limit,
            offset,
            direction,
            defaultFilter,
            defaultFilterForCount,
            args,
            ...Object.keys(filters)
                .filter((x) => filters[x].type !== "index")
                .map((x) => filters[x].value),
        ],
        async () => {
            const result = await queryClient.request(
                gql`query ${queryKey}($limit: Int = 5, $offset: Int = 0, $direction: order_by = desc, ${filterString}) {
                ${entity}(${
                    args ? `args: ${args},` : ""
                }limit: $limit, offset: $offset, order_by: {${orderBy}: $direction}, where: {_and: [${filterStringInline}]}) {
                    ${queryString}
                }
                ${entity}_aggregate(${args ? `args: ${args},` : ""}where: {_and:[${
                    defaultFilterForCount ? defaultFilterForCount + ", " : ""
                }${filterStringInline} ]}) {
                    aggregate {
                        count
                    }
                }
            }`,
                variable
            );
            return result;
        }
    );
    return result;
};

export default useTableQuery;
