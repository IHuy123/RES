import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    DeleteSpecialRequestMutation,
    DeleteSpecialRequestMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useDeleteSpecialRequest = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        DeleteSpecialRequestMutation,
        GraphQLErrorType,
        DeleteSpecialRequestMutationVariables
    >(
        ["DeleteSpecialRequest"],
        async (variable) => {
            const result = queryClient.request<
                DeleteSpecialRequestMutation,
                DeleteSpecialRequestMutationVariables
            >(
                gql`
                    mutation DeleteSpecialRequest(
                        $id: Int = 10
                        $name: String = ""
                        $status: basic_status
                    ) {
                        update_specialrequest_by_pk(
                            pk_columns: { id: $id }
                            _set: { status: $status }
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

export default useDeleteSpecialRequest;
