import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { GetPmQuery, GetPmQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetPM = (start: string, end: string) => {
    const queryClient = useCustomQueryClient();
    const result = useQuery<GetPmQuery, GetPmQueryVariables>(["GetPM", start, end], async () => {
        const result = queryClient.request<GetPmQuery, GetPmQueryVariables>(
            gql`
                query GetPM($_gte: timestamp = "", $_lte: timestamp = "") {
                    paymentmethod {
                        id
                        name
                        billpayments_aggregate(
                            where: {
                                bill: {
                                    creationtime: { _gte: $_gte, _lte: $_lte }
                                    status: { _eq: "CLOSED" }
                                }
                            }
                        ) {
                            aggregate {
                                count
                            }
                        }
                    }
                }
            `,
            {
                _gte: start,
                _lte: end,
            }
        );
        return result;
    });
    return result;
};

export default useGetPM;
