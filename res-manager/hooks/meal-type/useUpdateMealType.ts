import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { UpdateMealTypeMutation, UpdateMealTypeMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdateMealType = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        UpdateMealTypeMutation,
        GraphQLErrorType,
        UpdateMealTypeMutationVariables
    >(
        ["UpdateMealType"],
        async (variable) => {
            const result = queryClient.request<
                UpdateMealTypeMutation,
                UpdateMealTypeMutationVariables
            >(
                gql`
                    mutation UpdateMealType(
                        $id: Int = 10
                        $name: String = ""
                        $status: basic_status = ""
                    ) {
                        update_mealtype_by_pk(
                            pk_columns: { id: $id }
                            _set: { name: $name, status: $status }
                        ) {
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

export default useUpdateMealType;
