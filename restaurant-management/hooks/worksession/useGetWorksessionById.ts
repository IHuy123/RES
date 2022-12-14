import useQueryClient from "components/Table/hooks/useQueryClient";
import { GetWorksessionByIdQuery, GetWorksessionByIdQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetWorksessionById = (id: number | null) => {
    const queryClient = useQueryClient();
    const result = useQuery<GetWorksessionByIdQuery, GetWorksessionByIdQueryVariables>(
        ["GetWorksessionById"],
        async () => {
            const result = queryClient.request<
                GetWorksessionByIdQuery,
                GetWorksessionByIdQueryVariables
            >(
                gql`
                    query GetWorksessionById($id: Int = 10) {
                        worksession_by_pk(id: $id) {
                            creationtime
                            creatorid
                            id
                            isopen
                            updaterid
                            updatetime
                            workdate
                            shifts {
                                id
                                isopen
                                status
                            }
                        }
                    }
                `,
                {
                    id: id,
                }
            );
            return result;
        },
        {
            enabled: Boolean(id),
        }
    );
    return result;
};

export default useGetWorksessionById;
