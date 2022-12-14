import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { DeleteVoidReasonMutation, DeleteVoidReasonMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useDeleteVoidReason = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        DeleteVoidReasonMutation,
        GraphQLErrorType,
        DeleteVoidReasonMutationVariables
    >(
        ["DeleteVoidReason"],
        async (variable) => {
            const result = queryClient.request<
                DeleteVoidReasonMutation,
                DeleteVoidReasonMutationVariables
            >(
                gql`
                    mutation DeleteVoidReason(
                        $id: Int = 10
                        $name: String = ""
                        $status: basic_status = ""
                    ) {
                        update_voidreason_by_pk(
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

export default useDeleteVoidReason;
