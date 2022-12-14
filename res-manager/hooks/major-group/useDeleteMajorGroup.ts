import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { DeleteMajorGroupMutation, DeleteMajorGroupMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useDeleteMajorGroup = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        DeleteMajorGroupMutation,
        GraphQLErrorType,
        DeleteMajorGroupMutationVariables
    >(
        ["DeleteMajorGroup"],
        async (variable) => {
            const result = queryClient.request<
                DeleteMajorGroupMutation,
                DeleteMajorGroupMutationVariables
            >(
                gql`
                    mutation DeleteMajorGroup(
                        $id: Int = 10
                        $name: String = ""
                        $status: basic_status = ""
                    ) {
                        update_majorgroup_by_pk(
                            pk_columns: { id: $id }
                            _set: { status: $status }
                        ) {
                            id
                            name
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

export default useDeleteMajorGroup;
