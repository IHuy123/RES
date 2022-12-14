import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { CreateTableMutation, CreateTableMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useCreateTable = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<CreateTableMutation, GraphQLErrorType, CreateTableMutationVariables>(
        ["CreateTable"],
        async (variable) => {
            const result = queryClient.request<CreateTableMutation, CreateTableMutationVariables>(
                gql`
                    mutation CreateTable($object: table_insert_input = {}) {
                        insert_table_one(object: $object) {
                            id
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

export default useCreateTable;
