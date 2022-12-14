import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    DeleteSettingMutationMutation,
    DeleteSettingMutationMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useDeleteSetting = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        DeleteSettingMutationMutation,
        GraphQLErrorType,
        DeleteSettingMutationMutationVariables
    >(
        ["DeleteSetting"],
        async (variable) => {
            const result = queryClient.request<
                DeleteSettingMutationMutation,
                DeleteSettingMutationMutationVariables
            >(
                gql`
                    mutation DeleteSettingMutation($id: Int = 10) {
                        delete_systemsetting_by_pk(id: $id) {
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

export default useDeleteSetting;
