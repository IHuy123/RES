import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    CreateAccountMutationMutation,
    CreateAccountMutationMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useCreateAccount = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        CreateAccountMutationMutation,
        GraphQLErrorType,
        CreateAccountMutationMutationVariables
    >(
        ["CreateAccount"],
        async (variable) => {
            const result = queryClient.request<
                CreateAccountMutationMutation,
                CreateAccountMutationMutationVariables
            >(
                gql`
                    mutation CreateAccountMutation(
                        $avatar: String = ""
                        $email: String = ""
                        $fullname: String = ""
                        $password: String = ""
                        $phone: String = ""
                        $roleid: Int = 10
                        $status: user_status = ""
                        $username: String = ""
                    ) {
                        insert_account_one(
                            object: {
                                avatar: $avatar
                                email: $email
                                fullname: $fullname
                                password: $password
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

export default useCreateAccount;
