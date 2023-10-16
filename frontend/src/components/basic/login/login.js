import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import Icon from "@ant-design/icons";
import "./login.css";
import { connect } from "react-redux";
import { login } from "../../../actions/loginAction";
import auth from "../../../services/AuthServices";
import Alert from "../../common/alert";
import { useNavigate } from "react-router-dom";

const Login = ({ form, user, login }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        auth
          .LoginAuth(values.email, values.password)
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
      }
    });
  };

  const { getFieldDecorator } = form;
  if (isLoggedIn) {
    navigate(user.userOptions[0].link);
  }
  return (
    <div className="login-container">
      <div className="login-inner">
        <Form onSubmit={handleSubmit}>
          <Form.Item label="Email" hasFeedback>
            {getFieldDecorator("email", {
              rules: [
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Username"
              />
            )}
          </Form.Item>
          <Form.Item label="Password" hasFeedback>
            {getFieldDecorator("password", {
              rules: [
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

const LoginForm = Form.create({ name: "login" })(Login);

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  login,
})(LoginForm);
