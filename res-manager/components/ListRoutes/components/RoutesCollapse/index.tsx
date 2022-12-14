import React from "react";
import {
    ListItemIcon,
    ListItem,
    Divider,
    ListItemText,
    List,
    Collapse,
    useTheme,
} from "@mui/material";
import Image from "next/image";
export type RoutesCollapseType = {
    openChildren: { fatherIndex: number; selectedChildIndex: number; isOpen: boolean };
    fatherId: number;
    item: { id: number; name: string; path: string; icon: string }[];
    handleListItemClick: (
        index: number,
        path: string | undefined,
        hasChildren: boolean,
        fatherIndex: number
    ) => void;
};

const RoutesCollapse: React.FC<RoutesCollapseType> = (props: RoutesCollapseType) => {
    const theme = useTheme();

    const { openChildren, fatherId, item, handleListItemClick } = props;
    return (
        <Collapse
            in={openChildren.fatherIndex == fatherId && openChildren.isOpen}
            timeout="auto"
            style={{
                minHeight: "auto",
            }}
            unmountOnExit
        >
            <List component="div" disablePadding>
                {item?.map((itemChildren) => {
                    return (
                        <ListItem
                            button
                            sx={{ pl: 3 }}
                            key={itemChildren?.id}
                            style={
                                openChildren.selectedChildIndex === itemChildren.id
                                    ? {
                                          transition: "ease-in-out .4s",
                                          borderRight: `3px solid ${theme.palette.primary.main}`,
                                      }
                                    : {}
                            }
                            selected={openChildren.selectedChildIndex === itemChildren.id}
                            onClick={() =>
                                handleListItemClick(
                                    itemChildren.id,
                                    itemChildren.path,
                                    false,
                                    fatherId
                                )
                            }
                        >
                            <ListItemIcon
                                style={{
                                    minWidth: "50px",
                                }}
                            >
                                <Image
                                    src={itemChildren?.icon}
                                    width={30}
                                    height={30}
                                    alt={"icon"}
                                />
                            </ListItemIcon>
                            <ListItemText primary={`${itemChildren?.name}`} />
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
        </Collapse>
    );
};
export default RoutesCollapse;
