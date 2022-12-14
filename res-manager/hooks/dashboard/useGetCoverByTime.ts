import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { GetCoverByTimeQuery, GetCoverByTimeQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetCoverByTime = (start: string, end: string) => {
    const queryClient = useCustomQueryClient();
    const result = useQuery<GetCoverByTimeQuery, GetCoverByTimeQueryVariables>(
        ["GetCoverByTime", start, end],
        async () => {
            const result = queryClient.request<GetCoverByTimeQuery, GetCoverByTimeQueryVariables>(
                gql`
                    query GetCoverByTime($_gte: timestamp = "", $_lte: timestamp = "") {
                        check_aggregate(
                            where: {
                                creationtime: { _gte: $_gte, _lte: $_lte }
                                status: { _eq: "CLOSED" }
                            }
                        ) {
                            aggregate {
                                sum {
                                    cover
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

export default useGetCoverByTime;
