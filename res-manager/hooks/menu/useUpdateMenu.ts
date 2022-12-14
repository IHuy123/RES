import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { UpdateMenuMutation, UpdateMenuMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdateMenu = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<UpdateMenuMutation, GraphQLErrorType, UpdateMenuMutationVariables>(
        ["UpdateMenu"],
        async (variable) => {
            const result = queryClient.request<UpdateMenuMutation, UpdateMenuMutationVariables>(
                gql`
                    mutation UpdateMenu($id: Int = 10, $_set: menu_set_input = {}) {
                        update_menu_by_pk(pk_columns: { id: $id }, _set: $_set) {
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

export default useUpdateMenu;
