import useQueryClient from "components/Table/hooks/useQueryClient";
import { CheckWsQuery, CheckWsQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useCheckWS = () => {
    const queryClient = useQueryClient();
    const result = useMutation<CheckWsQuery, GraphQLErrorType, CheckWsQueryVariables>(
        ["CheckWS"],
        async (variable) => {
            const result = queryClient.request<CheckWsQuery, CheckWsQueryVariables>(
                gql`
                    query CheckWS($_gte: date = "", $_lte: date = "") {
                        worksession(
                            where: { _not: { shifts: {} }, workdate: { _gte: $_gte, _lte: $_lte } }
                        ) {
                            id
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

export default useCheckWS;
