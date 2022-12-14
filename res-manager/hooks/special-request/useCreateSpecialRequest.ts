import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    CreateSpecialRequestMutation,
    CreateSpecialRequestMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useCreateSpecialRequest = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        CreateSpecialRequestMutation,
        GraphQLErrorType,
        CreateSpecialRequestMutationVariables
    >(
        ["CreateSpecialRequest"],
        async (variable) => {
            const result = queryClient.request<
                CreateSpecialRequestMutation,
                CreateSpecialRequestMutationVariables
            >(
                gql`
                    mutation CreateSpecialRequest($object: specialrequest_insert_input = {}) {
                        insert_specialrequest_one(object: $object) {
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

export default useCreateSpecialRequest;
