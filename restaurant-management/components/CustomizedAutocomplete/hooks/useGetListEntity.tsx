import useQueryClient from "components/Table/hooks/useQueryClient";
import { gql } from "graphql-request";
import { useQuery } from "react-query";

const useGetListEntity = (entity: string, displayField: string, search: string) => {
    const quyeryClient = useQueryClient();
    search = `%${search}%`;
    return useQuery(["Get" + entity + displayField, search], async () => {
        return quyeryClient.request(
            gql`
            query GetEntityList($search: String = "%%") {
                ${entity}(limit: 100, where: {${displayField}: {_ilike: $search}}) {
                    key: id
                    value: ${displayField}
                }
            }
        `,
            { search: search }
        );
    });
};

export default useGetListEntity;
