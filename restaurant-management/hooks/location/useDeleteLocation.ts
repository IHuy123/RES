import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { DeleteLocationMutation, DeleteLocationMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useDeleteLocation = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        DeleteLocationMutation,
        GraphQLErrorType,
        DeleteLocationMutationVariables
    >(
        ["DeleteLocation"],
        async (variable) => {
            const result = queryClient.request<
                DeleteLocationMutation,
                DeleteLocationMutationVariables
            >(
                gql`
                    mutation DeleteLocation(
                        $id: Int = 10
                        $name: String = ""
                        $status: basic_status = ""
                    ) {
                        update_location_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
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

export default useDeleteLocation;
