import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    DeletePaymentmethodMutation,
    DeletePaymentmethodMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useDeletePaymentMethod = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        DeletePaymentmethodMutation,
        GraphQLErrorType,
        DeletePaymentmethodMutationVariables
    >(
        ["DeletePaymentmethod"],
        async (variable) => {
            const result = queryClient.request<
                DeletePaymentmethodMutation,
                DeletePaymentmethodMutationVariables
            >(
                gql`
                    mutation DeletePaymentmethod(
                        $id: Int = 10
                        $name: String = ""
                        $status: basic_status = ""
                    ) {
                        update_paymentmethod_by_pk(
                            pk_columns: { id: $id }
                            _set: { status: $status }
                        ) {
                            id
                            name
                            status
                        }
                    }
                `,
                variable
            );
            return result;
        },
        {
            onSuccess: () => {
                cache.invalidateQueries(queryKey);
            },
        }
    );
    return result;
};

export default useDeletePaymentMethod;
