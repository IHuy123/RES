import useQueryClient from "components/Table/hooks/useQueryClient";
import { ShiftQueryQuery } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetAllShift = () => {
    const queryClient = useQueryClient();
    const result = useQuery<ShiftQueryQuery, unknown>(["ShiftQuery"], async () => {
        const result = queryClient.request<ShiftQueryQuery>(gql`
            query ShiftQuery {
                shift {
                    closerid
                    endtime
                    id
                    isopen
                    name
                    openerid
                    starttime
                    status
                    worksession {
                        id
                        isopen
                        workdate
                    }
                }
            }
        `);
        return result;
    });
    return result;
};

export default useGetAllShift;
