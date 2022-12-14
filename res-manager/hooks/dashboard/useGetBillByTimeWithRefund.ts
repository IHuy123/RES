import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    GetBillByTimeWithRefundQuery,
    GetBillByTimeWithRefundQueryVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetBillByTimeWithRefund = (start: string, end: string) => {
    const queryClient = useCustomQueryClient();
    const result = useQuery<GetBillByTimeWithRefundQuery, GetBillByTimeWithRefundQueryVariables>(
        ["GetBillByTimeWithRefund", start, end],
        async () => {
            const result = queryClient.request<
                GetBillByTimeWithRefundQuery,
                GetBillByTimeWithRefundQueryVariables
            >(
                gql`
                    query GetBillByTimeWithRefund($_gte: timestamp = "", $_lte: timestamp = "") {
                        bill_aggregate(
                            where: {
                                creationtime: { _gte: $_gte, _lte: $_lte }
                                status: { _eq: "REFUND" }
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

export default useGetBillByTimeWithRefund;
