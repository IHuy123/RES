import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { GetBillQuery, GetBillQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetBill = (id: number) => {
    const queryClient = useCustomQueryClient();
    const result = useQuery<GetBillQuery, GetBillQueryVariables>(
        ["GetBill"],
        async () => {
            const result = queryClient.request<GetBillQuery, GetBillQueryVariables>(
                gql`
                    query GetBill($id: Int = 10) {
                        bill_by_pk(id: $id) {
                            billno
                            check {
                                checkno
                            }
                            checkid
                            creationtime
                            creatorid
                            guestname
                            id
                            note
                            status
                            subtotal
                            totalamount
                            totaltax
                            updaterid
                            updatetime
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

export default useGetBill;
