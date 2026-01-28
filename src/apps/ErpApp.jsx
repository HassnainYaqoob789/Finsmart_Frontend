import { useLayoutEffect, useState } from "react";
import { useEffect } from "react";
import { selectAppSettings } from "@/redux/settings/selectors";
import { useDispatch, useSelector } from "react-redux";

import { Layout } from "antd";

import { useAppContext } from "@/context/appContext";

import Navigation from "@/apps/Navigation/NavigationContainer";

import HeaderContent from "@/apps/Header/HeaderContainer";
import PageLoader from "@/components/PageLoader";

import { settingsAction } from "@/redux/settings/actions";

import { selectSettings } from "@/redux/settings/selectors";

import AppRouter from "@/router/AppRouter";

import useResponsive from "@/hooks/useResponsive";

import storePersist from "@/redux/storePersist";

export default function ErpCrmApp() {
  const { Content } = Layout;
  const { isMobile } = useResponsive();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: "setting" }));
  }, []);

  const { isSuccess: settingIsloaded } = useSelector(selectSettings);

  if (settingIsloaded)
    return (
      <Layout hasSider>
        <Navigation />

        {isMobile ? (
          <Layout style={{ marginLeft: 0 }}>
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <HeaderContent />
            </div>
            <Content
              style={{
                margin: "40px auto 30px",
                overflow: "initial",
                width: "100%",
                padding: "0 25px",
                maxWidth: "none",
              }}
            >
              <AppRouter />
            </Content>
          </Layout>
        ) : (
          <Layout>
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                paddingBottom: "5px",
                background: "linear-gradient(90deg, #1E5BA8 0%, #00D9FF 100%)",

                borderBottom: "1px solid #e8e8e8",
              }}
            >
              <HeaderContent />
            </div>
            <Content
              style={{
                margin: "0px 240px 30px",
                overflow: "initial",
                width: "100%",
                padding: "0 50px",
                maxWidth: "84%",
              }}
            >
              <AppRouter />
            </Content>
          </Layout>
        )}
      </Layout>
    );
  else return <PageLoader />;
}
