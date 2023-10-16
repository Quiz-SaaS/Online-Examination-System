import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import Icon from "@ant-design/icons";
import "./login.css";
import { connect } from "react-redux";
import { login } from "../../../actions/loginAction";
import auth from "../../../services/AuthServices";
import Alert from "../../common/alert";
import { useNavigate } from "react-router-dom";

const Login = ({ user, login }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const values = { email, password };
    console.log("Received values of form: ", values);
    auth
      .LoginAuth(email, password)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          login(response.data.user);
          auth.storeToken(response.data.token);
          setIsLoggedIn(true);
        } else {
          return Alert("error", "Error!", response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        return Alert("error", "Error!", "Server Error");
      });
  };

  if (isLoggedIn) {
    navigate(user.userOptions[0].link);
  }
  return (
    <div className="login-container">
      <div className="login-inner">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <Form.Item hasFeedback>
            <Input
              id="email"
              name="email"
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            />
          </Form.Item>
          <label htmlFor="password">Password</label>
          <Form.Item hasFeedback>
            <Input
              id="password"
              name="password"
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  login,
})(Login);