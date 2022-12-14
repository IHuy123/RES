import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    CreatePaymentmethodMutation,
    CreatePaymentmethodMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useCreatePaymentMethod = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        CreatePaymentmethodMutation,
        GraphQLErrorType,
        CreatePaymentmethodMutationVariables
    >(
        ["CreatePaymentmethod"],
        async (variable) => {
            const result = queryClient.request<
                CreatePaymentmethodMutation,
                CreatePaymentmethodMutationVariables
            >(
                gql`
                    mutation CreatePaymentmethod($name: String = "", $status: basic_status = "") {
                        insert_paymentmethod_one(object: { name: $name, status: $status }) {
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

export default useCreatePaymentMethod;
