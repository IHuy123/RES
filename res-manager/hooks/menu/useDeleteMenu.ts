import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { DeleteMenuMutation, DeleteMenuMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useDeleteMenu = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<DeleteMenuMutation, GraphQLErrorType, DeleteMenuMutationVariables>(
        ["DeleteMenu"],
        async (variable) => {
            const result = queryClient.request<DeleteMenuMutation, DeleteMenuMutationVariables>(
                gql`
                    mutation DeleteMenu($id: Int = 10, $name: String = "", $status: basic_status) {
                        update_menu_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
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

export default useDeleteMenu;
