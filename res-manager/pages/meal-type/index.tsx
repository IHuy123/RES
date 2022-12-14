import CRUDTable from "components/Table";
import { IColumn } from "components/Table/models";
import { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import ChipBase from "components/Chip";
import { BASIC_ENUM } from "utils/enums";
import useSnackbar from "components/Snackbar/useSnackbar";
import MealTypeForm, { MealtypeMutationType } from "containers/meal-type/MealTypeForm";
import useCreateMealtype from "hooks/meal-type/useCreateMealType";
import useUpdateMealType from "hooks/meal-type/useUpdateMealType";
import useDeleteMealType from "hooks/meal-type/useDeleteMealType";

const MealType: NextPage = () => {
    useEffect(() => {
        const userJson = localStorage.getItem("manager-user");
        if (!userJson) {
            window.location.replace("https://binhtruongthanh.tech/login");
        }
    }, []);
    const initData: MealtypeMutationType = {
        id: 0,
        name: "",
        status: BASIC_ENUM.ACTIVE,
    };

    const { mutate: mutateCreate } = useCreateMealtype("MealtypeQuery");
    const { mutate: mutateUpdate } = useUpdateMealType("MealtypeQuery");
    const { mutate: mutateDelete } = useDeleteMealType("MealtypeQuery");
    const showSnackbar = useSnackbar();
    const [data, setData] = useState<MealtypeMutationType>(initData);
    const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
    const addRowData = () => {
        setIsOpenForm(true);
        setData(initData);
    };
    const updateRowData = (rowData: MealtypeMutationType) => {
        const data: MealtypeMutationType = {
            name: rowData.name,
            id: rowData.id,
            status: rowData.status,
        };
        setIsOpenForm(true);
        setData(data);
    };
    const deleteRowData = (rowData: MealtypeMutationType) => {
        if (rowData.status === BASIC_ENUM.INACTIVE) {
            showSnackbar({
                children: "Loại bữa ăn này hiện đã ngừng hoạt động!",
                severity: "error",
            });
        } else {
            mutateDelete(
                {
                    id: rowData.id,
                    status: BASIC_ENUM.INACTIVE,
                },
                {
                    onSuccess: () => {
                        showSnackbar({
                            children: "Xóa thành công",
                            severity: "success",
                        });
                    },
                    onError: () => {
                        showSnackbar({
                            children: "Xóa thất bại",
                            severity: "error",
                        });
                    },
                }
            );
        }
    };

    const [isViewAction, setViewAction] = useState<boolean>(false);

    const columns: IColumn[] = [
        {
            field: "id",
            title: "STT",
            index: 1,
            type: "index",
            disableSort: true,
            disableFilter: true,
        },
        {
            field: "name",
            title: "Tên bữa ăn",
            index: 2,
            type: "string",
        },
        {
            field: "status",
            title: "Trạng thái",
            index: 3,
            type: "enum",
            enumValue: [
                {
                    key: BASIC_ENUM.ACTIVE,
                    value: "Đang hoạt động",
                },
                {
                    key: BASIC_ENUM.INACTIVE,
                    value: "Không hoạt động",
                },
            ],
            render: (status: string) => {
                if (status === BASIC_ENUM.ACTIVE) {
                    return (
                        <ChipBase
                            color={"success"}
                            label={"Đang hoạt động"}
                            size="small"
                            sx={{
                                fontSize: 14,
                                minWidth: "150px",
                            }}
                        />
                    );
                }
                return (
                    <ChipBase
                        color={"error"}
                        label={"Không hoạt động"}
                        size="small"
                        sx={{
                            fontSize: 14,
                            minWidth: "150px",
                        }}
                    />
                );
            },
        },
    ];

    const handleClose = useCallback(
        (type: "SAVE" | "CANCEL", data?: MealtypeMutationType, clearErrors?: Function) => {
            if (type === "SAVE") {
                if (data) {
                    if (!data.id) {
                        data.id = undefined;
                        mutateCreate(data, {
                            onSuccess: () => {
                                showSnackbar({
                                    children: "Thêm mới thành công",
                                    severity: "success",
                                });
                            },
                            onError: () => {
                                showSnackbar({
                                    children: "Thêm mới thất bại",
                                    severity: "error",
                                });
                            },
                        });
                    } else {
                        mutateUpdate(data, {
                            onSuccess: () => {
                                showSnackbar({
                                    children: "Chỉnh sửa thành công",
                                    severity: "success",
                                });
                            },
                            onError: () => {
                                showSnackbar({
                                    children: "Chỉnh sửa thất bại",
                                    severity: "error",
                                });
                            },
                        });
                    }
                }
            }
            if (clearErrors) {
                clearErrors();
            }
            resetData();
            setViewAction(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const viewRowData = (rowData: MealtypeMutationType) => {
        const data: MealtypeMutationType = {
            name: rowData.name,
            status: rowData.status,
            id: rowData.id,
        };
        setIsOpenForm(true);
        setData(data);
        setViewAction(true);
    };

    const resetData = () => {
        setData(initData);
        setIsOpenForm(false);
    };

    return (
        <>
            <MealTypeForm
                opened={isOpenForm}
                isView={isViewAction}
                data={data}
                handleClose={handleClose}
            />
            <CRUDTable
                queryKey="MealtypeQuery"
                columns={columns}
                title={"Quản lý bữa ăn"}
                entity="mealtype"
                firstOrderField="id"
                sort
                enableFilter
                maxWidth="100%"
                action={{
                    onView: (rowData: MealtypeMutationType) => viewRowData(rowData),
                    onAdd: () => addRowData(),
                    onEdit: (rowData: MealtypeMutationType) => updateRowData(rowData),
                    onDeleteRecord: (rowData: MealtypeMutationType) => deleteRowData(rowData),
                }}
            />
        </>
    );
};

export default MealType;
