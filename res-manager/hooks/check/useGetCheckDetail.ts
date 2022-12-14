import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { GetCheckDetailQuery, GetCheckDetailQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useGetCheckDetail = () => {
    const queryClient = useCustomQueryClient();
    const result = useMutation<GetCheckDetailQuery, GraphQLErrorType, GetCheckDetailQueryVariables>(
        ["GetCheckDetail"],
        async (variable) => {
            const result = queryClient.request<GetCheckDetailQuery, GetCheckDetailQueryVariables>(
                gql`
                    query GetCheckDetail($id: Int = 10) {
                        checkdetail_by_pk(id: $id) {
                            amount
                            checkid
                            completiontime
                            id
                            isreminded
                            itemid
                            itemprice
                            note
                            quantity
                            starttime
                            status
                            subtotal
                            taxamount
                            voidreason {
                                name
                            }
                            item {
                                name
                            }
                        }
                    }
                `,
                {
                    id: variable.id,
                }
            );
            return result;
        }
    );
    return result;
};

export default useGetCheckDetail;
