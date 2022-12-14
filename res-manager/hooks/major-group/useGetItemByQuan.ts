import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { GetItemByQuanQuery, GetItemByQuanQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetItemByQuan = (start: string, end: string) => {
    const queryClient = useCustomQueryClient();
    const result = useQuery<GetItemByQuanQuery, GetItemByQuanQueryVariables>(
        ["GetItemByQuan", start, end],
        async () => {
            const result = queryClient.request<GetItemByQuanQuery, GetItemByQuanQueryVariables>(
                gql`
                    query GetItemByQuan($_gte: timestamp = "", $_lte: timestamp = "") {
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
                                        quantity
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

export default useGetItemByQuan;
