import useCustomQueryClient from "components/Table/hooks/useQueryClient";
import { UpdateShiftMutation, UpdateShiftMutationVariables } from "generated/graphql";
import { gql } from "graphql-request";
import { useMutation, useQueryClient } from "react-query";
import { GraphQLErrorType } from "utils/common";

const useUpdateShift = (queryKey: string) => {
    const queryClient = useCustomQueryClient();
    const cache = useQueryClient();
    const result = useMutation<UpdateShiftMutation, GraphQLErrorType, UpdateShiftMutationVariables>(
        ["UpdateShift"],
        async (variable) => {
            const result = queryClient.request<UpdateShiftMutation, UpdateShiftMutationVariables>(
                gql`
                    mutation UpdateShift(
                        $id: Int = 10
                        $name: String = ""
                        $status: basic_status = ""
                        $closerid: Int = 10
                        $endtime: time = ""
                        $isopen: Boolean = false
                        $openerid: Int = 10
                        $starttime: time = ""
                        $worksessionid: Int = 10
                    ) {
                        update_shift_by_pk(
                            pk_columns: { id: $id }
                            _set: {
                                status: $status
                                closerid: $closerid
                                endtime: $endtime
                                isopen: $isopen
                                name: $name
                                openerid: $openerid
                                starttime: $starttime
                                worksessionid: $worksessionid
                            }
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

export default useUpdateShift;
