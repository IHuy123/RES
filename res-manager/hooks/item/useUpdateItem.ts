import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { UpdateItemMutation, UpdateItemMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdateItem = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<UpdateItemMutation, GraphQLErrorType, UpdateItemMutationVariables>(
        ["UpdateItem"],
        async (variable) => {
            const result = queryClient.request<UpdateItemMutation, UpdateItemMutationVariables>(
                gql`
                    mutation UpdateItem($id: Int = 10, $_set: item_set_input = {}) {
                        update_item_by_pk(pk_columns: { id: $id }, _set: $_set) {
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

export default useUpdateItem;
