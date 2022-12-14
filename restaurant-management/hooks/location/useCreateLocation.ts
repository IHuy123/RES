import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { CreateLocationMutation, CreateLocationMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useCreateLocation = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        CreateLocationMutation,
        GraphQLErrorType,
        CreateLocationMutationVariables
    >(
        ["CreateLocation"],
        async (variable) => {
            const result = queryClient.request<
                CreateLocationMutation,
                CreateLocationMutationVariables
            >(
                gql`
                    mutation CreateLocation($name: String = "", $status: basic_status = "") {
                        insert_location_one(object: { name: $name, status: $status }) {
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

export default useCreateLocation;
