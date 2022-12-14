import useQueryClient from "components/Table/hooks/useQueryClient";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetAccount = () => {
    const queryClient = useQueryClient();
    const result = useQuery(["abc"], async () => {
        const result = queryClient.request(gql`
            query MyQuery {
                account {
                    avatar
                }
            }
        `);
        return result;
    });
    return result;
};

export default useGetAccount;
