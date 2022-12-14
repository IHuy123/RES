import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { QuanQueryQuery, QuanQueryQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetKK = (start: string, end: string) => {
    const queryClient = useCustomQueryClient();
    const result = useQuery<QuanQueryQuery, QuanQueryQueryVariables>(
        ["QuanQuery", start, end],
        async () => {
            const result = queryClient.request<QuanQueryQuery, QuanQueryQueryVariables>(
                gql`
                    query QuanQuery(
                        $limit: Int = 5
                        $offset: Int = 0
                        $direction: order_by = desc
                        $x: timestamp = "01/01/2022"
                        $y: timestamp = "12/31/2022"
                    ) {
                        search_articles(
                            args: { x: $x, y: $y }
                            limit: $limit
                            offset: $offset
                            order_by: { id: $direction }
                            where: { _and: [] }
                        ) {
                            id
                            name
                            quantity
                            averagetime
                        }
                    }
                `,
                {
                    x: start,
                    y: end,
                }
            );
            return result;
        }
    );
    return result;
};

export default useGetKK;
