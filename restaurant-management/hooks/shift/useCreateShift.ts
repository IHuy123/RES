import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { InsertShiftMutation, InsertShiftMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useCreateShift = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<InsertShiftMutation, GraphQLErrorType, InsertShiftMutationVariables>(
        ["CreateShift"],
        async (variable) => {
            const result = queryClient.request<InsertShiftMutation, InsertShiftMutationVariables>(
                gql`
                    mutation InsertShift($objects: [shift_insert_input!] = {}) {
                        insert_shift(objects: $objects) {
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

export default useCreateShift;
