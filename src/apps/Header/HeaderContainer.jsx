import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Layout } from "antd";

// import Notifications from '@/components/Notification';

import { LogoutOutlined, ToolOutlined, UserOutlined } from "@ant-design/icons";

import { selectCurrentAdmin } from "@/redux/auth/selectors";

import { FILE_BASE_URL } from "@/config/serverApiConfig";

import useLanguage from "@/locale/useLanguage";

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const { Header } = Layout;

  const translate = useLanguage();

  const ProfileDropdown = () => {
    const navigate = useNavigate();
    return (
      <div className="profileDropdown" onClick={() => navigate("/profile")}>
        <Avatar
          size="large"
          className="last"
          src={
            currentAdmin?.photo
              ? FILE_BASE_URL + currentAdmin?.photo
              : undefined
          }
          style={{
            color: "#f56a00",
            backgroundColor: currentAdmin?.photo ? "none" : "#fde3cf",
            boxShadow: "rgba(150, 190, 238, 0.35) 0px 0px 6px 1px",
          }}
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <div className="profileDropdownInfo">
          <p>
            {currentAdmin?.name} {currentAdmin?.surname}
          </p>
          <p>{currentAdmin?.email}</p>
        </div>
      </div>
    );
  };

  const DropdownMenu = ({ text }) => {
    return <span style={{}}>{text}</span>;
  };

  const items = [
    {
      label: <ProfileDropdown className="headerDropDownMenu" />,
      key: "ProfileDropdown",
    },
    {
      type: "divider",
    },
    {
      icon: <UserOutlined />,
      key: "settingProfile",
      label: (
        <Link to={"/profile"}>
          <DropdownMenu text={translate("profile_settings")} />
        </Link>
      ),
    },

    {
      icon: <LogoutOutlined />,
      key: "logout",
      label: <Link to={"/logout"}>{translate("logout")}</Link>,
    },
  ];

  return (
    <Header
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "flex-start",
        gap: "15px",
        background: "linear-gradient(90deg, #1E5BA8 0%, #00D9FF 100%)",
      }}
    >
      <Dropdown
        menu={{
          items,
          style: {
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            padding: "8px 0",
            animation: "fadeIn 0.25s ease",
          },
        }}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Avatar
          className="avatar-dropdown"
          src={
            currentAdmin?.photo
              ? FILE_BASE_URL + currentAdmin?.photo
              : undefined
          }
          style={{
            background: currentAdmin?.photo ? "none" : "#F5F7FA",
            color: "#1A1A1A",
            fontWeight: "700",
            fontSize: "16px",
            boxShadow: "0px 4px 12px rgba(79, 88, 102, 0.15)",
            cursor: "pointer",
            border: "2px solid #E5EBEF",
            transition: "all 0.3s ease",
          }}
          size="large"
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
      </Dropdown>

      {/* <AppsButton /> */}
    </Header>
  );
}

//  console.log(
//    '🚀 Welcome to FinSmart'
//  );
