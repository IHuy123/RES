import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { GetCheckQuery, GetCheckQueryVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetCheck = (id: number) => {
    const queryClient = useCustomQueryClient();
    const result = useQuery<GetCheckQuery, GetCheckQueryVariables>(
        ["GetCheck"],
        async () => {
            const result = queryClient.request<GetCheckQuery, GetCheckQueryVariables>(
                gql`
                    query GetCheck($id: Int = 10) {
                        check_by_pk(id: $id) {
                            accountid
                            checkno
                            cover
                            creationtime
                            creatorid
                            guestname
                            id
                            note
                            shiftid
                            status
                            subtotal
                            tableid
                            totalamount
                            totaltax
                            updaterid
                            updatetime
                            voidreasonid
                            shift {
                                name
                            }
                            account {
                                fullname
                            }
                            table {
                                name
                                location {
                                    name
                                }
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

export default useGetCheck;
