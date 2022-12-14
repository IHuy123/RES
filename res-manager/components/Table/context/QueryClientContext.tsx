import { ReactNode, useCallback, useState, useMemo, createContext } from "react";

import { GraphQLClient } from "graphql-request";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

interface QueryClientContextProps {
    queryClient: GraphQLClient;
    updateQueryClient: (token: string) => void;
}

export const GraphQLQueryClientContext = createContext({} as QueryClientContextProps);
const GraphQLQueryClientContextProvider = ({ children }: { children: ReactNode }) => {
    const defaultQueryClient = useMemo(() => {
        const queryClient = new GraphQLClient(publicRuntimeConfig.NEXT_PUBLIC_HASURA_END_POINT, {
            headers: {
                "x-hasura-admin-secret": publicRuntimeConfig.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
            },
        });
        return queryClient;
    }, []);

    const [queryClient, setQueryClient] = useState<GraphQLClient>(defaultQueryClient);

    const updateQueryClient = useCallback((token: string) => {
        const queryClient = new GraphQLClient(publicRuntimeConfig.NEXT_PUBLIC_HASURA_END_POINT, {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-hasura-admin-secret": publicRuntimeConfig.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
            },
        });
        setQueryClient(queryClient);
    }, []);

    const memoValue = useMemo(() => {
        return {
            queryClient,
            updateQueryClient,
        };
    }, [queryClient, updateQueryClient]);

    return (
        <GraphQLQueryClientContext.Provider value={memoValue}>
            {children}
        </GraphQLQueryClientContext.Provider>
    );
};

export default GraphQLQueryClientContextProvider;
