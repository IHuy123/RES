import useQueryClient from "components/Table/hooks/useQueryClient";
import { EmailExistQueryQuery, EmailExistQueryQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useEmailExist = (email: string) => {
    const queryClient = useQueryClient();
    const result = useQuery<EmailExistQueryQuery, EmailExistQueryQueryVariables>(
        ["EmailExistQuery", email],
        async () => {
            const result = queryClient.request<EmailExistQueryQuery, EmailExistQueryQueryVariables>(
                gql`
                    query EmailExistQuery($_eq: String = "") {
                        account(where: { email: { _eq: $_eq } }) {
                            id
                        }
                    }
                `,
                {
                    _eq: email,
                }
            );
            return result;
        },
        {
            enabled: email !== "",
        }
    );
    return result;
};

export default useEmailExist;
