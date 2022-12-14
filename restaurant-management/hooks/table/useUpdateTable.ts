import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { UpdateTableMutation, UpdateTableMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdateTable = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<UpdateTableMutation, GraphQLErrorType, UpdateTableMutationVariables>(
        ["UpdateTable"],
        async (variable) => {
            const result = queryClient.request<UpdateTableMutation, UpdateTableMutationVariables>(
                gql`
                    mutation UpdateTable($id: Int = 10, $_set: table_set_input = {}) {
                        update_table_by_pk(pk_columns: { id: $id }, _set: $_set) {
                            id
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

export default useUpdateTable;
