import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { GetItemByAmountQuery, GetItemByAmountQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetItemByAmount = (start: string, end: string) => {
    const queryClient = useCustomQueryClient();
    const result = useQuery<GetItemByAmountQuery, GetItemByAmountQueryVariables>(
        ["GetItemByAmount", start, end],
        async () => {
            const result = queryClient.request<GetItemByAmountQuery, GetItemByAmountQueryVariables>(
                gql`
                    query GetItemByAmount($_gte: timestamp = "", $_lte: timestamp = "") {
                        item {
                            id
                            name
                            checkdetails_aggregate(
                                where: {
                                    check: {
                                        creationtime: { _gte: $_gte, _lte: $_lte }
                                        status: {}
                                    }
                                    status: { _eq: "SERVED" }
                                }
                            ) {
                                aggregate {
                                    sum {
                                        amount
                                    }
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

export default useGetItemByAmount;
