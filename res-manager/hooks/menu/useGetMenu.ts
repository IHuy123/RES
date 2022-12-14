import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { GetMenuDfsMutation, GetMenuDfsMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";

const useGetMenuDf = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<GetMenuDfsMutation, GetMenuDfsMutationVariables>(
        ["GetMenuDf"],
        async () => {
            const result = queryClient.request<GetMenuDfsMutation, GetMenuDfsMutationVariables>(
                gql`
                    mutation GetMenuDfs {
                        update_menu(
                            where: { id: { _is_null: false } }
                            _set: { isdefault: false }
                        ) {
                            returning {
                                id
                            }
                        }
                    }
                `
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

export default useGetMenuDf;
