import { useEffect, useState } from "react";
import DefaultLayout from "../DefaultLayout";
import SidePanel from "@/components/SidePanel";
import { Layout } from "antd";
import { useCrudContext } from "@/context/crud";
import { useAppContext } from "@/context/appContext";

const { Content } = Layout;

const ContentBox = ({ children }) => {
  const { state: stateCrud, crudContextAction } = useCrudContext();
  const { state: stateApp } = useAppContext();
  const { isPanelClose } = stateCrud;
  const { panel } = crudContextAction;

  const [isSidePanelClose, setSidePanel] = useState(isPanelClose);

  useEffect(() => {
    let timer = [];
    if (isPanelClose) {
      timer = setTimeout(() => {
        setSidePanel(isPanelClose);
      }, 200);
    } else {
      setSidePanel(isPanelClose);
    }
    return () => clearTimeout(timer);
  }, [isPanelClose]);

  return (
    <Content
      className="whiteBox shadow layoutPadding"
      style={{
        margin: "73px auto",
        width: "100%",
        maxWidth: "100%",
        flex: "none",
        background: "linear-gradient(180deg, #ffffff 0%, #f9fafc 100%)",
        borderRadius: "16px",
        border: "1px solid #eaeaea",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.05)", 
        padding: "24px 28px",
        transition: "all 0.3s ease-in-out",
      }}
    >
      {children}
    </Content>
  );
};

export default function CrudLayout({
  children,
  config,
  sidePanelTopContent,
  sidePanelBottomContent,
  fixHeaderPanel,
}) {
  return (
    <DefaultLayout>
      <SidePanel
        config={config}
        topContent={sidePanelTopContent}
        bottomContent={sidePanelBottomContent}
        fixHeaderPanel={fixHeaderPanel}
      />
      <ContentBox>{children}</ContentBox>
    </DefaultLayout>
  );
}
