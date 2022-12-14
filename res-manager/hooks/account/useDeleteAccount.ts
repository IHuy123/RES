import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    DeleteAccountMutationMutation,
    DeleteAccountMutationMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useDeleteAccount = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        DeleteAccountMutationMutation,
        GraphQLErrorType,
        DeleteAccountMutationMutationVariables
    >(
        ["DeleteAccount"],
        async (variable) => {
            const result = queryClient.request<
                DeleteAccountMutationMutation,
                DeleteAccountMutationMutationVariables
            >(
                gql`
                    mutation DeleteAccountMutation($id: Int = 10, $status: user_status = "") {
                        update_account_by_pk(pk_columns: { id: $id }, _set: { status: $status }) {
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
                cache.invalidateQueries("GetRoleQuery");
            },
        }
    );
    return result;
};

export default useDeleteAccount;
