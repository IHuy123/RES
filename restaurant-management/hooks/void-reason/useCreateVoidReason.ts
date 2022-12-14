import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { CreateVoidReasonMutation, CreateVoidReasonMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useCreateVoidReason = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        CreateVoidReasonMutation,
        GraphQLErrorType,
        CreateVoidReasonMutationVariables
    >(
        ["CreateVoidreason"],
        async (variable) => {
            const result = queryClient.request<
                CreateVoidReasonMutation,
                CreateVoidReasonMutationVariables
            >(
                gql`
                    mutation CreateVoidReason($name: String = "", $status: basic_status = "") {
                        insert_voidreason_one(object: { name: $name, status: $status }) {
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

export default useCreateVoidReason;
