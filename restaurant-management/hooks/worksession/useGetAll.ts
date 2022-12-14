import useQueryClient from "components/Table/hooks/useQueryClient";
import { GetAllWorkSessionQueryQuery } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetAllWorkSession = () => {
    const queryClient = useQueryClient();
    const result = useQuery<GetAllWorkSessionQueryQuery, unknown>(
        ["GetAllWorkSessionQuery"],
        async () => {
            const result = queryClient.request<GetAllWorkSessionQueryQuery>(gql`
                query GetAllWorkSessionQuery {
                    worksession {
                        creationtime
                        creatorid
                        id
                        isopen
                        updaterid
                        updatetime
                        workdate
                    }
                }
            `);
            return result;
        }
    );
    return result;
};

export default useGetAllWorkSession;
