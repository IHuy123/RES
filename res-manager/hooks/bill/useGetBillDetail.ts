import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { GetBillDetailQuery, GetBillDetailQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useGetBillDetail = () => {
    const queryClient = useCustomQueryClient();
    const result = useMutation<GetBillDetailQuery, GraphQLErrorType, GetBillDetailQueryVariables>(
        ["GetBillDetail"],
        async (variable) => {
            const result = queryClient.request<GetBillDetailQuery, GetBillDetailQueryVariables>(
                gql`
                    query GetBillDetail($id: Int = 10) {
                        billdetail_by_pk(id: $id) {
                            itemname
                            itemprice
                            quantity
                            subtotal
                            taxamount
                            amount
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

export default useGetBillDetail;
