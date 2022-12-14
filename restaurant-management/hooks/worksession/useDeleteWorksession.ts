import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    DeleteWorksessionMutationMutation,
    DeleteWorksessionMutationMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useDeleteWorksession = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        DeleteWorksessionMutationMutation,
        GraphQLErrorType,
        DeleteWorksessionMutationMutationVariables
    >(
        ["DeleteWorkSession"],
        async (variable) => {
            const result = queryClient.request<
                DeleteWorksessionMutationMutation,
                DeleteWorksessionMutationMutationVariables
            >(
                gql`
                    mutation DeleteWorksessionMutation($id: Int = 10) {
                        delete_worksession_by_pk(id: $id) {
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

export default useDeleteWorksession;
