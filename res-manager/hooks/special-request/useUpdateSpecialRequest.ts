import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    UpdateSpecialRequestMutation,
    UpdateSpecialRequestMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdateSpecialRequest = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        UpdateSpecialRequestMutation,
        GraphQLErrorType,
        UpdateSpecialRequestMutationVariables
    >(
        ["UpdateSpecialRequest"],
        async (variable) => {
            const result = queryClient.request<
                UpdateSpecialRequestMutation,
                UpdateSpecialRequestMutationVariables
            >(
                gql`
                    mutation UpdateSpecialRequest(
                        $id: Int = 10
                        $_set: specialrequest_set_input = {}
                    ) {
                        update_specialrequest_by_pk(pk_columns: { id: $id }, _set: $_set) {
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

export default useUpdateSpecialRequest;
