import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    UpdatePaymentmethodMutation,
    UpdatePaymentmethodMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdatePaymentMethod = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        UpdatePaymentmethodMutation,
        GraphQLErrorType,
        UpdatePaymentmethodMutationVariables
    >(
        ["UpdatePaymentmethod"],
        async (variable) => {
            const result = queryClient.request<
                UpdatePaymentmethodMutation,
                UpdatePaymentmethodMutationVariables
            >(
                gql`
                    mutation UpdatePaymentmethod(
                        $id: Int = 10
                        $name: String = ""
                        $status: basic_status = ""
                    ) {
                        update_paymentmethod_by_pk(
                            pk_columns: { id: $id }
                            _set: { name: $name, status: $status }
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

export default useUpdatePaymentMethod;
