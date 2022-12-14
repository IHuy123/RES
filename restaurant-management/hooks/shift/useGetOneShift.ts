import useQueryClient from "components/Table/hooks/useQueryClient";
import { ShiftByWsQueryQuery, ShiftByWsQueryQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useGetOneShift = () => {
    const queryClient = useQueryClient();
    const result = useMutation<ShiftByWsQueryQuery, GraphQLErrorType, ShiftByWsQueryQueryVariables>(
        ["ShiftByWSQuery"],
        async (variable) => {
            const result = queryClient.request<ShiftByWsQueryQuery, ShiftByWsQueryQueryVariables>(
                gql`
                    query ShiftByWSQuery($_eq: Int = 10) {
                        shift(where: { worksessionid: { _eq: $_eq } }) {
                            endtime
                            starttime
                            name
                            status
                            closerid
                            id
                            isopen
                            openerid
                            worksessionid
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

export default useGetOneShift;
