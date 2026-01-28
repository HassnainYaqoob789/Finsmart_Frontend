import { ErpContextProvider } from "@/context/erp";

import { Layout } from "antd";
import { useSelector } from "react-redux";

const { Content } = Layout;

export default function ErpLayout({ children }) {
  return (
    <ErpContextProvider>
      <Content
        className="whiteBox shadow layoutPadding"
        style={{
          margin: "73px auto",
          width: "100%",
          minHeight: "600px",

          background: "linear-gradient(180deg, #ffffff 0%, #f9fafc 100%)", // ✨ soft white gradient
          borderRadius: "16px", // smooth corners
          border: "1px solid #e6e9ef", // subtle border
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.05)", // elegant Ant Design-like depth
          padding: "24px 28px", // consistent inner spacing
          transition: "all 0.3s ease-in-out", // smooth interaction
        }}
      >
        {children}
      </Content>
    </ErpContextProvider>
  );
}
