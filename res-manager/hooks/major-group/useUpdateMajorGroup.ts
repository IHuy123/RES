import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { UpdateMajorGroupMutation, UpdateMajorGroupMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdateMajorGroup = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        UpdateMajorGroupMutation,
        GraphQLErrorType,
        UpdateMajorGroupMutationVariables
    >(
        ["UpdateMajorGroup"],
        async (variable) => {
            const result = queryClient.request<
                UpdateMajorGroupMutation,
                UpdateMajorGroupMutationVariables
            >(
                gql`
                    mutation UpdateMajorGroup(
                        $id: Int = 10
                        $name: String = ""
                        $status: basic_status = ""
                    ) {
                        update_majorgroup_by_pk(
                            pk_columns: { id: $id }
                            _set: { name: $name, status: $status }
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

export default useUpdateMajorGroup;
