import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { GetBillByTimeQueryVariables, GetBillByTimeQuery } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetBillByTime = (start: string, end: string, index?: number) => {
    const queryClient = useCustomQueryClient();
    const result = useQuery<GetBillByTimeQuery, GetBillByTimeQueryVariables>(
        ["GetBillByTime" + index, start, end],
        async () => {
            const result = queryClient.request<GetBillByTimeQuery, GetBillByTimeQueryVariables>(
                gql`
                    query GetBillByTime($_gte: timestamp = "", $_lte: timestamp = "") {
                        bill_aggregate(where: { creationtime: { _gte: $_gte, _lte: $_lte } }) {
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
        }
    );
    return result;
};

export default useGetBillByTime;
