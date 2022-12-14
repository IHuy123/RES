import useQueryClient from "components/Table/hooks/useQueryClient";
import { GetShiftByIdQuery, GetShiftByIdQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetShiftById = (id: number) => {
    const queryClient = useQueryClient();
    const result = useQuery<GetShiftByIdQuery, GetShiftByIdQueryVariables>(
        ["GetShiftById"],
        async () => {
            const result = queryClient.request<GetShiftByIdQuery, GetShiftByIdQueryVariables>(
                gql`
                    query GetShiftById($id: Int = 10) {
                        shift_by_pk(id: $id) {
                            closerid
                            endtime
                            id
                            isopen
                            name
                            openerid
                            starttime
                            status
                            checks {
                                id
                            }
                            worksession {
                                creationtime
                                creatorid
                                id
                                isopen
                                updaterid
                                updatetime
                                workdate
                            }
                            worksessionid
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
            enabled: id > 0,
        }
    );
    return result;
};

export default useGetShiftById;
