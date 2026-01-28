import React from "react";
import { Form, Input, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import useLanguage from "@/locale/useLanguage";
// import "./LoginForm.css";

export default function LoginForm() {
  const translate = useLanguage();

  return (
    <div className="login-form">
      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Enter a valid email" },
        ]}
      >
        <Input
          prefix={<UserOutlined className="input-icon" />}
          placeholder="Email"
          size="large"
          className="simple-input"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please enter your password" }]}
      >
        <Input.Password
          prefix={<LockOutlined className="input-icon" />}
          placeholder="Password"
          size="large"
          className="simple-input"
        />
      </Form.Item>

      <div className="login-form-footer">
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{translate("Remember me")}</Checkbox>
        </Form.Item>
        <a href="/forgetpassword" className="forgot-link">
          {translate("Forgot password")}
        </a>
      </div>
    </div>
  );
}
