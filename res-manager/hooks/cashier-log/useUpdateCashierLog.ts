import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { UpdateCashierLogMutation, UpdateCashierLogMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdateCashierLog = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        UpdateCashierLogMutation,
        GraphQLErrorType,
        UpdateCashierLogMutationVariables
    >(
        ["UpdateCashierLog"],
        async (variable) => {
            const result = queryClient.request<
                UpdateCashierLogMutation,
                UpdateCashierLogMutationVariables
            >(
                gql`
                    mutation UpdateCashierLog($id: Int = 10, $isverify: Boolean = false) {
                        update_cashierlog_by_pk(
                            pk_columns: { id: $id }
                            _set: { isverify: $isverify }
                        ) {
                            isverify
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

export default useUpdateCashierLog;
