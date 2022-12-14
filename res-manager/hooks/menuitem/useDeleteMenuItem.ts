import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { DeleteMenuItemMutation, DeleteMenuItemMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useDeleteMenuItem = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        DeleteMenuItemMutation,
        GraphQLErrorType,
        DeleteMenuItemMutationVariables
    >(
        ["DeleteMenuItem"],
        async (variable) => {
            const result = queryClient.request<
                DeleteMenuItemMutation,
                DeleteMenuItemMutationVariables
            >(
                gql`
                    mutation DeleteMenuItem($_eq: Int = 10) {
                        delete_menuitem(where: { id: { _eq: $_eq } }) {
                            returning {
                                id
                            }
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

export default useDeleteMenuItem;
