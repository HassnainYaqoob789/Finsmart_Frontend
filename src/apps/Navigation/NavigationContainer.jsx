import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Drawer, Layout, Menu } from "antd";
import { useAppContext } from "@/context/appContext";
import useLanguage from "@/locale/useLanguage";
import logoIcon from "@/style/images/finSmart_new.png";
import useResponsive from "@/hooks/useResponsive";

import {
  SettingOutlined,
  CustomerServiceOutlined,
  ContainerOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  GoldOutlined,
  TagOutlined,
  TagsOutlined,
  UserOutlined,
  CreditCardOutlined,
  MenuOutlined,
  FileOutlined,
  ShopOutlined,
  FilterOutlined,
  ProductOutlined,
  WalletOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";
import { selectCurrentAdmin } from "@/redux/auth/selectors";
import { useSelector } from "react-redux";

const { Sider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
}

function Sidebar({ collapsible, isMobile = false }) {
  let location = useLocation();
  const currentAdmin = useSelector(selectCurrentAdmin);

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const [currentPath, setCurrentPath] = useState(location.pathname.slice(1));

  const translate = useLanguage();
  const navigate = useNavigate();
  const items =
    currentAdmin.email === "admin@finsmart.com"
      ? [
        {
          key: "admin",
          icon: <SettingOutlined />,
          label: <Link to={"/admin"}>Admin Users</Link>,
        },
      ]
      : [
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: <Link to={"/"}>{translate("dashboard")}</Link>,
        },
        {
          key: "product",
          icon: <ShopOutlined />,
          label: <Link to={"/product"}>Product</Link>,
        },
        {
          key: "product-category",
          icon: <ProductOutlined />,
          label: <Link to={"/product-category"}>Product Category</Link>,
        },
        {
          key: "customer",
          icon: <UserOutlined />,
          label: <Link to={"/customer"}>{translate("all customers")}</Link>,
        },
        {
          key: "invoice",
          icon: <FileOutlined />,
          label: <Link to={"/invoice"}>{translate("all invoices")}</Link>,
        },
        {
          key: "create",
          icon: <FileSyncOutlined />,
          label: <Link to={"/invoice/create"}>{translate("new invoice")}</Link>,
        },

        // {
        //   key: "quote",
        //   icon: <FileSyncOutlined />,
        //   label: <Link to={"/quote"}>Quotation</Link>,
        // },
        {
          key: "payment",
          icon: <WalletOutlined />,
          label: <Link to={"/payment"}>{translate("payments")}</Link>,
        },
      ];

  useEffect(() => {
    if (location)
      if (currentPath !== location.pathname) {
        if (location.pathname === "/") {
          setCurrentPath("dashboard");
        } else setCurrentPath(location.pathname.slice(1));
      }
  }, [location, currentPath]);

  useEffect(() => {
    if (isNavMenuClose) {
      setLogoApp(isNavMenuClose);
    }
    const timer = setTimeout(() => {
      if (!isNavMenuClose) {
        setLogoApp(isNavMenuClose);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isNavMenuClose]);
  const onCollapse = () => {
    navMenu.collapse();
  };

  return (
    <Sider
      collapsible={collapsible}
      collapsed={collapsible ? isNavMenuClose : collapsible}
      onCollapse={onCollapse}
      className="navigation"
      width={256}
      style={{
        // overflow: "auto",
        // height: "100vh",
        backgroundColor: "#0D1B2A",
        position: isMobile ? "absolute" : "fixed",
        // bottom: '20px',
      }}
      theme={"light"}
    >
      <div
        className="logo"
        onClick={() => navigate("/")}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px",
          borderRadius: "4px",
          marginTop: "22px",
        }}
      >
        <img
          src={logoIcon}
          alt="Logo"
          style={{
            width: "157px",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>
      <Menu
        items={items}
        mode="inline"
        theme={"light"}
        selectedKeys={[currentPath]}
        style={{
          width: 256,
          backgroundColor: "#0D1B2A",
        }}
      />
    </Sider>
  );
}

function MobileSidebar() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        className="mobile-sidebar-btn"
        style={{ ["marginLeft"]: 25 }}
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer
        width={250}
        placement={"left"}
        closable={false}
        onClose={onClose}
        open={visible}
      >
        <Sidebar collapsible={false} isMobile={true} />
      </Drawer>
    </>
  );
}
