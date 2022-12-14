import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { UpdateLocationMutation, UpdateLocationMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdateLocation = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        UpdateLocationMutation,
        GraphQLErrorType,
        UpdateLocationMutationVariables
    >(
        ["UpdateLocation"],
        async (variable) => {
            const result = queryClient.request<
                UpdateLocationMutation,
                UpdateLocationMutationVariables
            >(
                gql`
                    mutation UpdateLocation(
                        $id: Int = 10
                        $name: String = ""
                        $status: basic_status = ""
                    ) {
                        update_location_by_pk(
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

export default useUpdateLocation;
