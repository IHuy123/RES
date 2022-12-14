import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { format } from "date-fns";

export interface GraphQLErrorType extends Error {
    response: {
        status: number;
        errors: Array<{
            message: string;
            extensions: {
                path: string;
                code: string;
            };
        }>;
    };
}

export type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export const getTimeFromStringDate = (dateText: string) => {
    try {
        let dateConvert = new Date(dateText);
        let timeText = format(dateConvert, "MM/dd/yyyy HH:mm:ss");
        return timeText;
    } catch (e) {
        return e;
    }
};

export interface SuccessResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface IForm<T> {
    data: T;
    opened: boolean;
    handleClose: (type: "SAVE" | "CANCEL", data?: T, callback?: () => void) => void;
    isView?: boolean;
}
