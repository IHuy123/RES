import React from "react";

import { Button, Grid, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { IForm } from "utils/common";
import CardContainer from "components/Card/Container";
import { GetBillDetailQuery } from "generated/graphql";
import TextfieldBase from "components/BaseTextField";
// import CRUDTable from "components/Table";

const BillDetailForm: React.FC<IForm<GetBillDetailQuery["billdetail_by_pk"]>> = (
    props: IForm<GetBillDetailQuery["billdetail_by_pk"]>
) => {
    const { data } = props;

    return (
        <Modal open={props.opened}>
            <CardContainer width="90%" maxWidth={820}>
                <Box sx={{ display: "flex", justifyContent: "center", m: 3 }}>
                    <Typography variant="h6" component="h2">
                        Chi tiết hóa đơn
                    </Typography>
                </Box>
                <Grid
                    sx={{
                        "& > :not(style)": {
                            m: 2,
                            display: "flex",
                        },
                    }}
                >
                    <Grid
                        item
                        xs={12}
                        gap={3}
                        display="flex"
                        sx={{
                            flexWrap: { xs: "wrap", md: "nowrap" },
                        }}
                    >
                        <TextfieldBase
                            id="itemname"
                            label={"Tên món ăn"}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            value={data?.itemname}
                        />
                        <TextfieldBase
                            id="taxamount"
                            label={"Tổng thuế"}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            value={data?.taxamount}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        gap={3}
                        display="flex"
                        sx={{
                            flexWrap: { xs: "wrap", md: "nowrap" },
                        }}
                    >
                        <TextfieldBase
                            id="price"
                            label={"Giá món ăn"}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            value={data?.itemprice}
                        />
                        <TextfieldBase
                            id="quantity"
                            label={"Số lượng"}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            value={data?.quantity}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        gap={3}
                        display="flex"
                        sx={{
                            flexWrap: { xs: "wrap", md: "nowrap" },
                        }}
                    >
                        <TextfieldBase
                            id="subtotal"
                            label={"Tổng"}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            value={data?.subtotal}
                        />
                        <TextfieldBase
                            id="amount"
                            label={"Tổng"}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                            value={data?.amount}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        gap={3}
                        display="flex"
                        sx={{
                            flexWrap: { xs: "wrap", md: "nowrap" },
                        }}
                    >
                        {/* <CRUDTable
                            entity="checkdetailspecialrequest"
                            queryKey="checkdetailspecialrequestqr"
                            title="Yêu cầu đặc biệt"
                            firstOrderField="id"
                            columns={[
                                {
                                    field: "id",
                                    title: "STT",
                                    index: 1,
                                    type: "index",
                                    disableSort: true,
                                    disableFilter: true,
                                },
                                {
                                    field: "specialrequest",
                                    title: "Yêu cầu đặc biệt",
                                    index: 2,
                                    type: "object",
                                    subField: "name",
                                    subFieldType: "string",
                                },
                            ]}
                        /> */}
                    </Grid>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column-reverse", sm: "row" },
                            justifyContent: "center",
                            mx: "auto",
                            p: 1,
                            m: 1,
                            "& > :not(style)": { m: 1 },
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() => {
                                props.handleClose("CANCEL", undefined, () => {});
                            }}
                        >
                            {"Trở về"}
                        </Button>
                    </Box>
                </Grid>
            </CardContainer>
        </Modal>
    );
};

export default React.memo(BillDetailForm);
