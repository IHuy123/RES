import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { UpdateVoidreasonMutation, UpdateVoidreasonMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdateVoidreason = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        UpdateVoidreasonMutation,
        GraphQLErrorType,
        UpdateVoidreasonMutationVariables
    >(
        ["UpdateVoidreason"],
        async (variable) => {
            const result = queryClient.request<
                UpdateVoidreasonMutation,
                UpdateVoidreasonMutationVariables
            >(
                gql`
                    mutation UpdateVoidreason(
                        $id: Int = 10
                        $name: String = ""
                        $status: basic_status = ""
                    ) {
                        update_voidreason_by_pk(
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

export default useUpdateVoidreason;
