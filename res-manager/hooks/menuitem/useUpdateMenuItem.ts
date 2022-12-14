import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { UpdateMenuItemMutation, UpdateMenuItemMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdateMenuItem = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        UpdateMenuItemMutation,
        GraphQLErrorType,
        UpdateMenuItemMutationVariables
    >(
        ["UpdateMenuItem"],
        async (variable) => {
            const result = queryClient.request<
                UpdateMenuItemMutation,
                UpdateMenuItemMutationVariables
            >(
                gql`
                    mutation UpdateMenuItem($id: Int = 10, $_set: menuitem_set_input = {}) {
                        update_menuitem_by_pk(pk_columns: { id: $id }, _set: $_set) {
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

export default useUpdateMenuItem;
