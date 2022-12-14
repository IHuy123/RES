import useQueryClient from "components/Table/hooks/useQueryClient";
import { GetSystemSettingQuery } from "generated/graphql";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetSystemSetting = () => {
    const queryClient = useQueryClient();
    const result = useQuery<GetSystemSettingQuery, unknown>(["GetSystemSetting"], async () => {
        const result = queryClient.request<GetSystemSettingQuery>(gql`
            query GetSystemSetting {
                systemsetting {
                    address
                    id
                    restaurantimage
                    restaurantname
                    taxvalue
                }
            }
        `);
        return result;
    });
    return result;
};

export default useGetSystemSetting;
