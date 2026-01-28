import { ConfigProvider } from "antd";

export default function Localization({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1E88E5", // Main theme blue
          colorPrimaryHover: "#1E5BFF",
          colorPrimaryActive: "#0E2EB5",
          colorTextLightSolid: "#FFFFFF",
          borderRadius: 0,
        },
        components: {
          Button: {
            colorPrimaryBg: "#1E88E5",
            colorPrimaryText: "#FFFFFF",
            colorPrimaryHover: "#1E5BFF",
          },
          Menu: {
            itemSelectedBg: "#1E88E5",
            itemSelectedColor: "#FFFFFF",
            itemColor: "#FFFFFF",
          },
          Tabs: {
            itemSelectedColor: "#FFFFFF", // Active tab text white
            itemActiveColor: "#FFFFFF",
            itemHoverColor: "#1E88E5",
            inkBarColor: "#1E88E5", // Active underline color
            itemSelectedBg: "#1E88E5", // 💙 Active tab background
          },
          
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
