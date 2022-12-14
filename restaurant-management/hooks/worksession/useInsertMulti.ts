import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    InsertMultiWorkSessionMutation,
    InsertMultiWorkSessionMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useInsertMulti = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        InsertMultiWorkSessionMutation,
        GraphQLErrorType,
        InsertMultiWorkSessionMutationVariables
    >(
        ["InsertMultiWorkSession"],
        async (variable) => {
            const result = queryClient.request<
                InsertMultiWorkSessionMutation,
                InsertMultiWorkSessionMutationVariables
            >(
                gql`
                    mutation InsertMultiWorkSession($objects: [worksession_insert_input!] = {}) {
                        insert_worksession(objects: $objects) {
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

export default useInsertMulti;
