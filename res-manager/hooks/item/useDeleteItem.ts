import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { DeleteItemMutation, DeleteItemMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useDeleteItem = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<DeleteItemMutation, GraphQLErrorType, DeleteItemMutationVariables>(
        ["DeleteItem"],
        async (variable) => {
            const result = queryClient.request<DeleteItemMutation, DeleteItemMutationVariables>(
                gql`
                    mutation DeleteItem($id: Int = 10, $name: String = "", $status: basic_status) {
                        update_item_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
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

export default useDeleteItem;
