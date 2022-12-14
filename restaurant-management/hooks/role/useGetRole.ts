import useQueryClient from "components/Table/hooks/useQueryClient";
import { GetRoleQueryQuery } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetRole = () => {
    const queryClient = useQueryClient();
    const result = useQuery<GetRoleQueryQuery, unknown>(["GetRoleQuery"], async () => {
        const result = queryClient.request<GetRoleQueryQuery>(gql`
            query GetRoleQuery {
                role {
                    name
                    id
                    accounts_aggregate {
                        aggregate {
                            count
                        }
                    }
                }
            }
        `);
        return result;
    });
    return result;
};

export default useGetRole;
