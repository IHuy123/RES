import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { DeleteShiftMutation, DeleteShiftMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useDeleteShift = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<DeleteShiftMutation, GraphQLErrorType, DeleteShiftMutationVariables>(
        ["DeleteShift"],
        async (variable) => {
            const result = queryClient.request<DeleteShiftMutation, DeleteShiftMutationVariables>(
                gql`
                    mutation DeleteShift(
                        $id: Int = 10
                        $name: String = ""
                        $status: basic_status = ""
                    ) {
                        update_shift_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
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

export default useDeleteShift;
