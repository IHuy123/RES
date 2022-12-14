import { ROUTES } from "utils/routes";

export const routes = [
    {
        id: 1,
        name: "Quản lý tài khoản",
        path: ROUTES.ACCOUNT,
        icon: "/admin/images/account.png",
    },
    {
        id: 2,
        name: "Quản lý nhà hàng",
        icon: "/admin/images/management.png",
        children: [
            {
                id: 2.1,
                name: "Quản lý ca làm việc",
                path: ROUTES.SHIFT,
                icon: "/admin/images/select.png",
            },
            {
                id: 2.2,
                name: "Quản lý phiên làm việc",
                path: ROUTES.WORKSESSION,
                icon: "/admin/images/select.png",
            },
            {
                id: 2.3,
                name: "Quản lý khu vực",
                path: ROUTES.LOCATION,
                icon: "/admin/images/select.png",
            },
            {
                id: 2.4,
                name: "Quản lý bàn ăn",
                path: ROUTES.TABLE,
                icon: "/admin/images/select.png",
            },
        ],
    },
    {
        id: 3,
        name: "Lý do hủy",
        path: ROUTES.VOID_REASON,
        icon: "/admin/images/price-list.png",
    },
    {
        id: 4,
        name: "Cấu hình chung",
        icon: "/admin/images/settings.png",
        children: [
            {
                id: 4.1,
                name: "Thông tin nhà hàng",
                path: ROUTES.SETTING,
                icon: "/admin/images/settings.png",
            },
            {
                id: 4.2,
                name: "Phân quyền hệ thống",
                path: ROUTES.ROLE,
                icon: "/admin/images/account.png",
            },
        ],
    },
    {
        id: 5,
        name: "Phương thức thanh toán",
        path: ROUTES.PAYMENT_METHOD,
        icon: "/admin/images/deposit.png",
    },
];
