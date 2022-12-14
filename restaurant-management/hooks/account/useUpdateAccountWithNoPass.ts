import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    UpdateAccountWithNoPassMutationMutation,
    UpdateAccountWithNoPassMutationMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdateAccountWithNoPass = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        UpdateAccountWithNoPassMutationMutation,
        GraphQLErrorType,
        UpdateAccountWithNoPassMutationMutationVariables
    >(
        ["UpdateAccountWithNoPass"],
        async (variable) => {
            const result = queryClient.request<
                UpdateAccountWithNoPassMutationMutation,
                UpdateAccountWithNoPassMutationMutationVariables
            >(
                gql`
                    mutation UpdateAccountWithNoPassMutation(
                        $id: Int = 10
                        $avatar: String = ""
                        $email: String = ""
                        $fullname: String = ""
                        $phone: String = ""
                        $roleid: Int = 10
                        $status: user_status = ""
                        $username: String = ""
                    ) {
                        update_account_by_pk(
                            pk_columns: { id: $id }
                            _set: {
                                avatar: $avatar
                                email: $email
                                fullname: $fullname
                                phone: $phone
                                roleid: $roleid
                                status: $status
                                username: $username
                            }
                        ) {
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

export default useUpdateAccountWithNoPass;
