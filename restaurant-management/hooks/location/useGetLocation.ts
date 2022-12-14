import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { GetLocationQuery, GetLocationQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useGetLocation = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<GetLocationQuery, GraphQLErrorType, GetLocationQueryVariables>(
        ["GetLocation"],
        async (variable) => {
            const result = queryClient.request<GetLocationQuery, GetLocationQueryVariables>(
                gql`
                    query GetLocation($id: Int = 10) {
                        location_by_pk(id: $id) {
                            status
                        }
                    }
                `,
                variable
            );
            return result;
        },
        {
            onSuccess: () => {
                cache.invalidateQueries(queryKey);
            },
        }
    );
    return result;
};

export default useGetLocation;
