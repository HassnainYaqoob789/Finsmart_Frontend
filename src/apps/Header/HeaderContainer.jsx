import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Layout } from "antd";

// import Notifications from '@/components/Notification';

import { LogoutOutlined, ToolOutlined, UserOutlined } from "@ant-design/icons";

import { selectCurrentAdmin } from "@/redux/auth/selectors";
import storePersist from '@/redux/storePersist';


import { FILE_BASE_URL } from "@/config/serverApiConfig";

import useLanguage from "@/locale/useLanguage";

export default function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin);
  const { Header } = Layout;

  const auth = storePersist.get('auth');
  let login_enviroment = auth?.current?.mode || "No Mode"
  console.log("checkmode", login_enviroment)
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

  // Dot color: green = production, yellow = sandbox, grey = unknown
  const dotColor =
    login_enviroment?.toLowerCase() === "production"
      ? "#22c55e"
      : login_enviroment?.toLowerCase() === "sandbox"
        ? "#facc15"
        : "#94a3b8";

  const hasPulse =
    login_enviroment?.toLowerCase() === "production" ||
    login_enviroment?.toLowerCase() === "sandbox";

  return (
    <Header
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "15px",
        background: "linear-gradient(90deg, #1E5BA8 0%, #00D9FF 100%)",
      }}
    >
      {/* Environment Badge with color-coded pulsing dot */}

      {currentAdmin.email === "admin@finsmart.com" ? <></> : <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.15))",
            color: "#ffffff",
            fontWeight: "700",
            fontSize: "13.5px",
            padding: "7px 16px",
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.45)",
            backdropFilter: "blur(8px)",
            textTransform: "uppercase",
            letterSpacing: "0.6px",
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
            lineHeight: "1.6",
            whiteSpace: "nowrap",
          }}
        >
          {/* Color dot */}
          <span
            style={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              display: "inline-block",
              flexShrink: 0,
              backgroundColor: dotColor,
              animation: hasPulse ? "envPulse 1.8s ease-in-out infinite" : "none",
            }}
          />

          {login_enviroment + " Environment" || "No Mode"}

          {/* Pulse keyframe injected inline */}
          <style>{`
          @keyframes envPulse {
            0%   { box-shadow: 0 0 0 0px ${dotColor}99; }
            70%  { box-shadow: 0 0 0 6px ${dotColor}00; }
            100% { box-shadow: 0 0 0 0px ${dotColor}00; }
          }
        `}</style>
        </div>
      </>
      }
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