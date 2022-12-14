import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import {
    UpdateSettingMutationMutation,
    UpdateSettingMutationMutationVariables,
} from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdateSetting = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<
        UpdateSettingMutationMutation,
        GraphQLErrorType,
        UpdateSettingMutationMutationVariables
    >(
        ["UpdateSetting"],
        async (variable) => {
            const result = queryClient.request<
                UpdateSettingMutationMutation,
                UpdateSettingMutationMutationVariables
            >(
                gql`
                    mutation UpdateSettingMutation(
                        $address: String = ""
                        $restaurantimage: String = ""
                        $restaurantname: String = ""
                        $taxvalue: Int
                        $id: Int = 10
                    ) {
                        update_systemsetting_by_pk(
                            pk_columns: { id: $id }
                            _set: {
                                address: $address
                                restaurantimage: $restaurantimage
                                restaurantname: $restaurantname
                                taxvalue: $taxvalue
                            }
                        ) {
                            id
                            restaurantimage
                            restaurantname
                            taxvalue
                            address
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

export default useUpdateSetting;
