import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { CreateMenuItemMutation, CreateMenuItemMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useCreateMenuItem = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        CreateMenuItemMutation,
        GraphQLErrorType,
        CreateMenuItemMutationVariables
    >(
        ["CreateMenuItem"],
        async (variable) => {
            const result = queryClient.request<
                CreateMenuItemMutation,
                CreateMenuItemMutationVariables
            >(
                gql`
                    mutation CreateMenuItem($object: menuitem_insert_input = {}) {
                        insert_menuitem_one(object: $object) {
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

export default useCreateMenuItem;
