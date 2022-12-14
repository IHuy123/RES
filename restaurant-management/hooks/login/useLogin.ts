import useQueryClient from "components/Table/hooks/useQueryClient";
import { LoginQueryQuery, LoginQueryQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useLogin = () => {
    const queryClient = useQueryClient();
    const result = useMutation<LoginQueryQuery, GraphQLErrorType, LoginQueryQueryVariables>(
        ["LoginQuery"],
        async (variable) => {
            const result = queryClient.request<LoginQueryQuery, LoginQueryQueryVariables>(
                gql`
                    query LoginQuery($_eq: String = "") {
                        account(where: { username: { _eq: $_eq } }) {
                            avatar
                            email
                            fullname
                            id
                            password
                            phone
                            roleid
                            role {
                                id
                                name
                            }
                            status
                            username
                        }
                    }
                `,
                variable
            );
            return result;
        }
    );
    return result;
};

export default useLogin;
