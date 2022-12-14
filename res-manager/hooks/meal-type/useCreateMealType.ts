import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { CreateMealTypeMutation, CreateMealTypeMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useCreateMealtype = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        CreateMealTypeMutation,
        GraphQLErrorType,
        CreateMealTypeMutationVariables
    >(
        ["CreateMealtype"],
        async (variable) => {
            const result = queryClient.request<
                CreateMealTypeMutation,
                CreateMealTypeMutationVariables
            >(
                gql`
                    mutation CreateMealType($name: String = "", $status: basic_status = "") {
                        insert_mealtype_one(object: { name: $name, status: $status }) {
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

export default useCreateMealtype;
