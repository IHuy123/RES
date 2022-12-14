import useQueryClient from "components/Table/hooks/useQueryClient";
import { CheckWsFromToQuery, CheckWsFromToQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useGetWSFromTo = () => {
    const queryClient = useQueryClient();
    const result = useMutation<CheckWsFromToQuery, GraphQLErrorType, CheckWsFromToQueryVariables>(
        ["CheckWSFromTo"],
        async (variable) => {
            const result = queryClient.request<CheckWsFromToQuery, CheckWsFromToQueryVariables>(
                gql`
                    query CheckWSFromTo($_gte: date = "", $_lte: date = "") {
                        worksession(where: { workdate: { _gte: $_gte, _lte: $_lte } }) {
                            id
                            workdate
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

export default useGetWSFromTo;
