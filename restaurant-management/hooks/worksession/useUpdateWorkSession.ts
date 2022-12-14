import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    UpdateWorkSessionMutationMutation,
    UpdateWorkSessionMutationMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdateWorkSession = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        UpdateWorkSessionMutationMutation,
        GraphQLErrorType,
        UpdateWorkSessionMutationMutationVariables
    >(
        ["UpdateWorkSession"],
        async (variable) => {
            const result = queryClient.request<
                UpdateWorkSessionMutationMutation,
                UpdateWorkSessionMutationMutationVariables
            >(
                gql`
                    mutation UpdateWorkSessionMutation(
                        $id: Int = 10
                        $updaterid: Int = 10
                        $isopen: Boolean = false
                        $updatetime: timestamp = ""
                    ) {
                        update_worksession_by_pk(
                            pk_columns: { id: $id }
                            _set: {
                                isopen: $isopen
                                updaterid: $updaterid
                                updatetime: $updatetime
                            }
                        ) {
                            id
                        }
                        delete_itemoutofstock(where: { id: { _neq: 0 } }) {
                            returning {
                                id
                            }
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

export default useUpdateWorkSession;
