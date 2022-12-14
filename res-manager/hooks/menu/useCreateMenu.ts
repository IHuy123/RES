import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { CreateMenuMutation, CreateMenuMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useCreateMenu = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<CreateMenuMutation, GraphQLErrorType, CreateMenuMutationVariables>(
        ["CreateMenu"],
        async (variable) => {
            const result = queryClient.request<CreateMenuMutation, CreateMenuMutationVariables>(
                gql`
                    mutation CreateMenu($object: menu_insert_input = {}) {
                        insert_menu_one(object: $object) {
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

export default useCreateMenu;
