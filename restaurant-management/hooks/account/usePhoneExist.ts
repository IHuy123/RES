import useQueryClient from "components/Table/hooks/useQueryClient";
import { PhoneExistQueryQuery, PhoneExistQueryQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const usePhoneExist = (phone: string) => {
    const queryClient = useQueryClient();
    const result = useQuery<PhoneExistQueryQuery, PhoneExistQueryQueryVariables>(
        ["PhoneExistQuery", phone],
        async () => {
            const result = queryClient.request<PhoneExistQueryQuery, PhoneExistQueryQueryVariables>(
                gql`
                    query PhoneExistQuery($_eq: String = "") {
                        account(where: { phone: { _eq: $_eq } }) {
                            id
                        }
                    }
                `,
                {
                    _eq: phone,
                }
            );
            return result;
        },
        {
            enabled: phone !== "",
        }
    );
    return result;
};

export default usePhoneExist;
