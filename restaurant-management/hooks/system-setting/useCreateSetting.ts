import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    CreateSettingMutationMutation,
    CreateSettingMutationMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useCreateSetting = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        CreateSettingMutationMutation,
        GraphQLErrorType,
        CreateSettingMutationMutationVariables
    >(
        ["CreateSetting"],
        async (variable) => {
            const result = queryClient.request<
                CreateSettingMutationMutation,
                CreateSettingMutationMutationVariables
            >(
                gql`
                    mutation CreateSettingMutation(
                        $address: String = ""
                        $restaurantimage: String = ""
                        $restaurantname: String = ""
                        $taxvalue: Int
                    ) {
                        insert_systemsetting_one(
                            object: {
                                address: $address
                                restaurantimage: $restaurantimage
                                restaurantname: $restaurantname
                                taxvalue: $taxvalue
                            }
                        ) {
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

export default useCreateSetting;
