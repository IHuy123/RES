import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    GetBillByTimeWithCloseQuery,
    GetBillByTimeWithCloseQueryVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetBillByTimeWithClose = (start: string, end: string) => {
    const queryClient = useCustomQueryClient();
    const result = useQuery<GetBillByTimeWithCloseQuery, GetBillByTimeWithCloseQueryVariables>(
        ["GetBillByTimeWithClose", start, end],
        async () => {
            const result = queryClient.request<
                GetBillByTimeWithCloseQuery,
                GetBillByTimeWithCloseQueryVariables
            >(
                gql`
                    query GetBillByTimeWithClose($_gte: timestamp = "", $_lte: timestamp = "") {
                        bill_aggregate(
                            where: {
                                creationtime: { _gte: $_gte, _lte: $_lte }
                                status: { _eq: "CLOSED" }
                            }
                        ) {
                            aggregate {
                                count
                            }
                        }
                    }
                `,
                {
                    _gte: start,
                    _lte: end,
                }
            );
            return result;
        }
    );
    return result;
};

export default useGetBillByTimeWithClose;
