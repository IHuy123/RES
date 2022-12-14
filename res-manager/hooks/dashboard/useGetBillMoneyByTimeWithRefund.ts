import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    GetBillMoneyByTimeWithRefundQuery,
    GetBillMoneyByTimeWithRefundQueryVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetBillMoneyByTimeWithRefund = (start: string, end: string) => {
    const queryClient = useCustomQueryClient();
    const result = useQuery<
        GetBillMoneyByTimeWithRefundQuery,
        GetBillMoneyByTimeWithRefundQueryVariables
    >(["GetBillMoneyByTimeWithRefund", start, end], async () => {
        const result = queryClient.request<
            GetBillMoneyByTimeWithRefundQuery,
            GetBillMoneyByTimeWithRefundQueryVariables
        >(
            gql`
                query GetBillMoneyByTimeWithRefund($_gte: timestamp = "", $_lte: timestamp = "") {
                    bill_aggregate(
                        where: {
                            creationtime: { _gte: $_gte, _lte: $_lte }
                            status: { _eq: "REFUND" }
                        }
                    ) {
                        aggregate {
                            sum {
                                totalamount
                            }
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
    });
    return result;
};

export default useGetBillMoneyByTimeWithRefund;
