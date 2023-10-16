import React, { useState, useEffect } from 'react';
import './backbone.css';
import { connect } from 'react-redux';
import AllTrainer from '../admin/allTrainer/alltrainer';
import AllTopics from '../admin/allTopics/alltopics.js';
import AllQuestions from '../trainer/allquestions/allquestion';
import AllTests from '../trainer/alltests/alltest';
import ConductTest from '../trainer/conducttest/conducttest';
import NewTest from '../trainer/newtest/newtest';
import auth from '../../services/AuthServices';
import Welcome from './welcome';
import ErrorPage from './errorPage';
import { login, logout } from '../../actions/loginAction';
import { changeActiveRoute } from '../../actions/useraction';
import Alert from '../common/alert';
import { Link, useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import { Layout, Menu, Button, Tooltip } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, LogoutOutlined } from '@ant-design/icons';
import main from './main.jpg';

const { Header, Sider, Content } = Layout;

function Dashboard({ user, changeActiveRoute, login, logout }) {
    const [localIsLoggedIn, setLocalIsLoggedIn] = useState(user.isLoggedIn);
    const [collapsed, setCollapsed] = useState(true);

    const toggle = () => {
        setCollapsed(!collapsed);
    };

    const logOut = () => {
        auth.deleteToken();
        window.location.href = '/';
    };

    const location = useLocation();
    const params = useParams();

    useEffect(() => {
        console.log(localIsLoggedIn);
        const t = auth.retriveToken();
        if (localIsLoggedIn) {
        } else if (t && t !== 'undefined') {
            auth
                .FetchAuth(t)
                .then((response) => {
                    console.log(response.data);
                    login(response.data.user);
                    setLocalIsLoggedIn(true);
                    const obj = user.userOptions.find((o, i) => {
                        if (o.link === `/user/${params.options}`) {
                            return o;
                        }
                    });
                    const tt = user.userOptions.indexOf(obj);
                    if (tt === -1) {
                        window.location.href = `${user.userOptions[0].link}`;
                    } else {
                        changeActiveRoute(String(tt));
                    }
                })
                .catch((error) => {
                    console.log(error);
                    Alert('warning', 'Warning!', 'Server Error.');
                    auth.deleteToken();
                    window.location.href = '/';
                });
        } else {
            window.location = '/';
        }
    }, [localIsLoggedIn, login, changeActiveRoute, params.options, user.userOptions]);

    let torender = null;
    if (params.options === 'listtrainers') {
        torender = <AllTrainer />;
    } else if (params.options === 'listsubjects') {
        torender = <AllTopics />;
    } else if (params.options === 'listquestions') {
        torender = <AllQuestions />;
    } else if (params.options === 'listtests') {
        torender = <AllTests />;
    } else if (params.options === 'home') {
        torender = <Welcome />;
    } else if (params.options === 'newtest') {
        torender = <NewTest />;
    } else if (params.options === 'conducttest') {
        const queryParams = queryString.parse(location.search);
        console.log(queryParams);
        torender = <ConductTest {...queryParams} />;
    } else {
        torender = <ErrorPage />;
    }

    const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

    return (
        <Layout>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: 'hidden',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    zIndex: 5,
                }}
            >
                <div className="logo11" />
                <Menu defaultSelectedKeys={[user.activeRoute]} mode="inline" theme="dark">
                    {user.userOptions.map((d, i) => {
                        return (
                            <Menu.Item key={i}>
                                <d.icon />
                                <span>{d.display}</span>
                                <Link to={d.link}></Link>
                            </Menu.Item>
                        );
                    })}
                </Menu>
            </Sider>
            <Layout>
                <Header theme="dark" style={{ position: 'fixed', width: '100vw', paddingLeft: '10px', zIndex: '1000' }}>
                    <div>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: toggle,
                            style: { color: '#fff', fontSize: '20px' },
                        })}
                    </div>
                    <ul className="user-options-list">
                        <li>
                            <Tooltip placement="bottom" title="Log Out">
                                <Button type="primary" size="large" shape="circle" onClick={logOut} className="logout-button">
                                    <LogoutOutlined />
                                </Button>
                            </Tooltip>
                        </li>
                        <li>
                            <img src={main} alt="company logo" className="d-logo" />
                        </li>
                    </ul>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        marginTop: '80px',
                        background: 'rgb(205,217,225)',
                        minHeight: '100vh',
                        marginLeft: '95px',
                    }}
                >
                    <div style={{ width: '100%' }}>{torender}</div>
                </Content>
            </Layout>
        </Layout>
    );
}

const mapStateToProps = (state) => ({
    user: state.user,
});

export default connect(mapStateToProps, {
    changeActiveRoute,
    login,
    logout,
})(Dashboard);