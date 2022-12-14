export interface ITable {
    maxWidth?: string;
    enableSelection?: boolean;
    enableFilter?: boolean;
    sort?: boolean;
    queryKey: string;
    title?: string;
    defaultFilter?: string;
    defaultFilterForCount?: string;
    args?: string;
    headerColor?: "primary" | "secondary" | "standard";
    initParam?: string;
    action?: {
        onAdd?: (callback: Function) => void;
        onEdit?: (rowData: any, callback: Function) => void;
        onView?: (rowData: any) => void;
        onChangeStatus?: (rowData: any, callback: Function) => void;
        onDeleteRecord?: (rowData: any) => void;
        onDeleteWithGroup?: boolean;
    };
    columns: IColumn[];
    entity: string;
    firstOrderField: string;
    typeOrder?: "asc" | "desc";
}

export interface IColumn {
    align?: "left" | "right" | "center";
    title: string;
    field: string;
    subField?: string;
    subFieldType?:
        | "number"
        | "string"
        | "object"
        | "timestamp"
        | "date"
        | "time"
        | "boolean"
        | "enum";
    render?: (data?: any, id?: number) => React.ReactElement;
    renderLink?: (data?: any) => string;
    disableSort?: boolean;
    disableFilter?: boolean;
    customSort?: (data?: Record<number, string | number>) => React.ReactElement;
    customFilter?: (data?: Record<number, string | number>) => React.ReactElement;
    type?:
        | "index"
        | "number"
        | "string"
        | "object"
        | "timestamp"
        | "date"
        | "time"
        | "boolean"
        | "enum";
    enumValue?: Array<{ key: string; value: string }>;
    enumBooleanValue?: Array<{ key: boolean; value: string }>;
    editable?: "never" | "onAdd" | "onEdit";
    index: number;
    link?: string;
    disable?: boolean;
    width?: string;
}

export interface ICheckBoxHeader {
    columns: IColumn[];
    selectedColumns: IColumn[];
    setSelectedColumns: any;
}

export interface ITableHeader {
    headerColor?: "primary" | "secondary" | "standard";
    columns: IColumn[];
    isHaveAction?: boolean;
    enableSort?: boolean;
    orderBy: {
        field: string;
        order: Order;
    };
    createSortHandler: (field: string, direction: Order) => void;
}

export interface ITableData<T> {
    rows?: T[];
    columns: IColumn[];
    isHaveActionChangeStatus: boolean;
    isHaveActionDelete: boolean;
    isHaveActionEdit: boolean;
    isHaveActionView: boolean;
    rowPerPage: number;
    page: number;
    limit: number;
    refetchPage: () => void;
    action?: {
        onAdd?: (callback: Function) => void;
        onEdit?: (rowData: any, callback: Function) => void;
        onView?: (rowData: any) => void;
        onDeleteRecord?: (rowData: any, callback: Function) => void;
        onChangeStatus?: (rowData: any, callback: Function) => void;
        onDeleteWithGroup?: boolean;
    };
}

export type Order = "asc" | "desc";

export interface IFilterTable {
    columns: IColumn[];
    filters: Record<
        string,
        {
            value:
                | string
                | Array<{ key: string; value: string }>
                | Array<{ key: boolean; value: string }>;
            type: TypeRecord;
        }
    >;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    isHaveAction: boolean;
    onTimeHandleChange: (date: Date | null, name: string) => void;
    onEnumHandleChange: (name: string, data: Array<{ key: string; value: string }>) => void;
    onBooleanEnumHandleChange: (name: string, data: Array<{ key: boolean; value: string }>) => void;
}

export type TypeRecord = string | "date" | "timestamp" | "time" | boolean | "enum";
