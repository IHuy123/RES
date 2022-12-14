import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { GetMealTypeQuery, GetMealTypeQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useGetMealType = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<GetMealTypeQuery, GraphQLErrorType, GetMealTypeQueryVariables>(
        ["GetMealType"],
        async (variable) => {
            const result = queryClient.request<GetMealTypeQuery, GetMealTypeQueryVariables>(
                gql`
                    query GetMealType($id: Int = 10) {
                        mealtype_by_pk(id: $id) {
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

export default useGetMealType;
