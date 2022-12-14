import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { DeleteTableMutation, DeleteTableMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useDeleteTable = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<DeleteTableMutation, GraphQLErrorType, DeleteTableMutationVariables>(
        ["DeleteTable"],
        async (variable) => {
            const result = queryClient.request<DeleteTableMutation, DeleteTableMutationVariables>(
                gql`
                    mutation DeleteTable(
                        $id: Int = 10
                        $name: String = ""
                        $status: table_status = ""
                    ) {
                        update_table_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
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

export default useDeleteTable;
