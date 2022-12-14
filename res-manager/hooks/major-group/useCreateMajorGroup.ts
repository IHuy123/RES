import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { CreateMajorGroupMutation, CreateMajorGroupMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useCreateMajorGroup = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        CreateMajorGroupMutation,
        GraphQLErrorType,
        CreateMajorGroupMutationVariables
    >(
        ["CreateMajorGroup"],
        async (variable) => {
            const result = queryClient.request<
                CreateMajorGroupMutation,
                CreateMajorGroupMutationVariables
            >(
                gql`
                    mutation CreateMajorGroup($name: String = "", $status: basic_status = "") {
                        insert_majorgroup_one(object: { name: $name, status: $status }) {
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

export default useCreateMajorGroup;
