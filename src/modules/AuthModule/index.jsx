import useLanguage from "@/locale/useLanguage";
import { Layout, Row, Col, Divider } from "antd";
import AuthLayout from "@/layout/AuthLayout";
// import logo from "../../style/images/dashboardLogo.png";
// import logo from "../../style/images/bglogo_lighter.png";
import logo from "../../style/images/bgImg_multip.png";
import loginBG_img from "../../style/images/loginBG_img.png";

const { Content } = Layout;

const AuthModule = ({ authContent, AUTH_TITLE, isForRegistre = false }) => {
  const translate = useLanguage();

  return (
    <AuthLayout>
      <Row style={{ minHeight: "100vh" }}>
        {/* LEFT SIDE - Background Image */}
        <Col
          xs={0}
          md={12}
          style={{
            backgroundImage: `url(${loginBG_img})`, // 👈 change this path
            // backgroundColor:'#0D1B2A',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        <Col
          xs={24}
          md={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
            padding: isForRegistre ? "40px 30px" : "80px 40px",
          }}
        >
          <Content
            style={{
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 30 }}>
              <img src={logo} alt="Logo" height={70} />
            </div>

            {/* <Title level={1}>{translate(AUTH_TITLE)}</Title> */}
            <Divider />
            <div className="site-layout-content">{authContent}</div>
          </Content>
        </Col>
      </Row>
    </AuthLayout>
  );
};

export default AuthModule;
