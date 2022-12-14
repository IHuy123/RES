import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { CreateItemMutation, CreateItemMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useCreateItem = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<CreateItemMutation, GraphQLErrorType, CreateItemMutationVariables>(
        ["CreateItem"],
        async (variable) => {
            const result = queryClient.request<CreateItemMutation, CreateItemMutationVariables>(
                gql`
                    mutation CreateItem($object: item_insert_input = {}) {
                        insert_item_one(object: $object) {
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

export default useCreateItem;
