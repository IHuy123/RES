import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { DeleteMealtypeMutation, DeleteMealtypeMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useDeleteMealType = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        DeleteMealtypeMutation,
        GraphQLErrorType,
        DeleteMealtypeMutationVariables
    >(
        ["DeleteMealType"],
        async (variable) => {
            const result = queryClient.request<
                DeleteMealtypeMutation,
                DeleteMealtypeMutationVariables
            >(
                gql`
                    mutation DeleteMealtype(
                        $id: Int = 10
                        $name: String = ""
                        $status: basic_status = ""
                    ) {
                        update_mealtype_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
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

export default useDeleteMealType;
