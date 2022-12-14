import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { GetMajorGroupQuery, GetMajorGroupQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useGetMajorGroup = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<GetMajorGroupQuery, GraphQLErrorType, GetMajorGroupQueryVariables>(
        ["GetMajorGroup"],
        async (variable) => {
            const result = queryClient.request<GetMajorGroupQuery, GetMajorGroupQueryVariables>(
                gql`
                    query GetMajorGroup($id: Int = 10) {
                        majorgroup_by_pk(id: $id) {
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

export default useGetMajorGroup;
