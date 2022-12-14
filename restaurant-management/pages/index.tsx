import { NextPage } from "next";
import React, { useEffect } from "react";

const Home: NextPage = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);
    // const initData: AccountDTO = {
    //     email: "",
    //     phone: "",
    //     username: "",
    //     fullName: "",
    //     avatar: "",
    //     roleId: 0,
    //     restaurantId: 0,
    // };
    // const [data, setData] = useState<AccountDTO>(initData);
    // const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
    // const addRowData = async () => {
    //     setIsOpenForm(true);
    //     setData(initData);
    // };
    // const [isViewAction, setViewAction] = useState<boolean>(false);

    // const columns: IColumn[] = [
    //     {
    //         field: "id",
    //         title: "STT",
    //         index: 1,
    //         type: "index",
    //         disableSort: true,
    //         disableFilter: true,
    //         width: "80px",
    //     },
    //     {
    //         field: "username",
    //         title: "Username",
    //         index: 2,
    //         type: "string",
    //         width: "120px",
    //     },
    //     {
    //         field: "status",
    //         title: "Status",
    //         index: 3,
    //         type: "enum",
    //         width: "120px",
    //         enumValue: [
    //             {
    //                 key: "ONLINE",
    //                 value: "ONLINE",
    //             },
    //             {
    //                 key: "OFFLINE",
    //                 value: "OFFLINE",
    //             },
    //             {
    //                 key: "INACTIVE",
    //                 value: "INACTIVE",
    //             },
    //         ],
    //         render: (status: string) => {
    //             if (status === "ONLINE") {
    //                 return (
    //                     <ChipBase
    //                         color={"success"}
    //                         label={"ONLINE"}
    //                         size="small"
    //                         sx={{
    //                             fontSize: 12,
    //                         }}
    //                     />
    //                 );
    //             }
    //             if (status === "OFFLINE") {
    //                 return (
    //                     <ChipBase
    //                         color={"error"}
    //                         label={"OFFLINE"}
    //                         size="small"
    //                         sx={{
    //                             fontSize: 12,
    //                         }}
    //                     />
    //                 );
    //             }
    //             if (status === "INACTIVE") {
    //                 return (
    //                     <ChipBase
    //                         color={"warning"}
    //                         label={"INACTIVE"}
    //                         size="small"
    //                         sx={{
    //                             fontSize: 12,
    //                         }}
    //                     />
    //                 );
    //             }
    //             return (
    //                 <ChipBase
    //                     color={"warning"}
    //                     label={"INACTIVE"}
    //                     size="small"
    //                     sx={{
    //                         fontSize: 12,
    //                     }}
    //                 />
    //             );
    //         },
    //     },
    //     {
    //         field: "fullName",
    //         title: "Full Name",
    //         index: 4,
    //         type: "string",
    //         width: "160px",
    //     },
    //     {
    //         field: "email",
    //         title: "Email",
    //         index: 5,
    //         type: "string",
    //         width: "160px",
    //     },
    //     {
    //         field: "phone",
    //         title: "Phone Number",
    //         index: 6,
    //         type: "string",
    //         width: "160px",
    //     },
    //     {
    //         index: 7,
    //         field: "restaurant",
    //         title: "Restaurant",
    //         type: "object",
    //         subField: "name",
    //         subFieldType: "string",
    //         disableSort: true,
    //     },
    //     {
    //         index: 7,
    //         field: "role",
    //         title: "Role",
    //         type: "object",
    //         subField: "name",
    //         subFieldType: "string",
    //         width: "100px",
    //         disableSort: true,
    //     },
    //     {
    //         index: 8,
    //         field: "roleId",
    //         type: "number",
    //         title: "roleId",
    //         disable: true,
    //     },
    //     {
    //         index: 9,
    //         field: "restaurantId",
    //         type: "number",
    //         title: "restaurantId",
    //         disable: true,
    //     },
    //     {
    //         index: 10,
    //         field: "avatar",
    //         type: "string",
    //         title: "avatar",
    //         disable: true,
    //     },
    // ];

    // const handleClose = useCallback(
    //     (type: "SAVE" | "CANCEL", data?: AccountDTO, clearErrors?: Function) => {
    //         if (type === "SAVE") {
    //             if (data) {
    //                 // createBranch(data);
    //             }
    //         } else {
    //             resetData();
    //         }
    //         if (clearErrors) {
    //             clearErrors();
    //         }
    //         setViewAction(false);
    //     },
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     []
    // );

    // const viewRowData = (rowData: AccountDTO) => {
    //     const breed: AccountDTO = {
    //         username: rowData.username,
    //         email: rowData.email,
    //         phone: rowData.phone,
    //         id: rowData.id,
    //         fullName: rowData.fullName,
    //         roleId: rowData.roleId,
    //         restaurantId: rowData.restaurantId,
    //         avatar: rowData.avatar,
    //     };
    //     setIsOpenForm(true);
    //     setData(breed);
    //     setViewAction(true);
    // };

    // const resetData = () => {
    //     setData(initData);
    //     setIsOpenForm(false);
    // };

    return (
        <>
            {/* <AccountForm
                opened={isOpenForm}
                isView={isViewAction}
                data={data}
                handleClose={handleClose}
            />
            <CRUDTable
                queryKey="AccountQuery"
                columns={columns}
                title={"Account Management"}
                entity="account"
                firstOrderField="id"
                sort
                enableFilter
                action={{
                    onView: (rowData: AccountDTO) => viewRowData(rowData),
                    onAdd: () => addRowData(),
                    onChangeStatus: (rowData: AccountDTO) => {},
                }}
            /> */}
        </>
    );
};

export default Home;
