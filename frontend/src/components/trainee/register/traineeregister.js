import React, { useState } from 'react';
import './trainerRegister.css';
import { Row, Col, Input, Button, Select, Typography } from 'antd';
import Icon from '@ant-design/icons';
import queryString from 'query-string';
import apis from '../../../services/Apis';
import { Post } from '../../../services/axiosCall';
import Alert from '../../common/alert';
const { Option } = Select;
const { Title } = Typography;

const TraineeRegister = ({ location }) => {
    const [inform, setInform] = useState(true);
    const [testid, setTestId] = useState(null);
    const [user, setUser] = useState(null);
    const [formValues, setFormValues] = useState({
        name: '',
        email: '',
        prefix: '+91',
        contact: '',
        organisation: '',
        location: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        Post({
            url: apis.REGISTER_TRAINEE_FOR_TEST,
            data: {
                name: formValues.name,
                emailid: formValues.email,
                contact: `${formValues.prefix}${formValues.contact}`,
                organisation: formValues.organisation,
                testid,
                location: formValues.location,
            },
        })
            .then((data) => {
                console.log(data.data);
                if (data.data.success) {
                    setInform(false);
                    setUser(data.data.user);
                } else {
                    resetFields();
                    Alert('error', 'Error!', data.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
                resetFields();
                Alert('error', 'Error!', 'Server Error');
            });
    };

    const resendMail = () => {
        Post({
            url: apis.RESEND_TRAINER_REGISTRATION_LINK,
            data: {
                id: user._id,
            },
        })
            .then((response) => {
                if (response.data.success) {
                    Alert('success', 'Success!', 'Email has been sent to your email');
                } else {
                    Alert('error', 'Error!', response.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
                Alert('error', 'Error!', 'Server Error');
            });
    };

    const resetFields = () => {
        setFormValues({
            name: '',
            email: '',
            prefix: '+91',
            contact: '',
            organisation: '',
            location: '',
        });
    };

    const prefixSelector = (
        <Select style={{ width: 70 }} value={formValues.prefix} onChange={(value) => setFormValues({ ...formValues, prefix: value })}>
            <Option value="+91">+91</Option>
        </Select>
    );

    const params = queryString.parse(location.search);
    console.log(params);
    setTestId(params.testid);

    return (
        <div className="trainee-registration-form-wrapper">
            {inform ? (
                <div className="trainee-registration-form-inner">
                    <form onSubmit={handleSubmit} className="login-form">
                        <Row>
                            <Col span={12} style={{ padding: '5px' }}>
                                <label htmlFor="name">Name</label>
                                <Input
                                    id="name"
                                    value={formValues.name}
                                    onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Name"
                                    required
                                />
                            </Col>
                            <Col span={12} style={{ padding: '5px' }}>
                                <label htmlFor="email">Email Id</label>
                                <Input
                                    id="email"
                                    value={formValues.email}
                                    onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Email Id"
                                    type="email"
                                    required
                                />
                            </Col>
                            <Col span={12} style={{ padding: '5px' }}>
                                <label htmlFor="contact">Phone Number</label>
                                <Input
                                    id="contact"
                                    value={formValues.contact}
                                    onChange={(e) => setFormValues({ ...formValues, contact: e.target.value })}
                                    addonBefore={prefixSelector}
                                    placeholder="Phone Number"
                                    required
                                    minLength={10}
                                    maxLength={10}
                                />
                                <label htmlFor="organisation">Organisation</label>
                                <Input
                                    id="organisation"
                                    value={formValues.organisation}
                                    onChange={(e) => setFormValues({ ...formValues, organisation: e.target.value })}
                                    prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Organisation"
                                    required
                                />
                            </Col>
                            <Col span={12} style={{ padding: '5px' }}>
                                <label htmlFor="location">Location</label>
                                <Input
                                    id="location"
                                    value={formValues.location}
                                    onChange={(e) => setFormValues({ ...formValues, location: e.target.value })}
                                    prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Location"
                                    required
                                />
                            </Col>
                            <Col span={12} style={{ paddingTop: '33px' }}>
                                <Button style={{ width: '100%' }} type="primary" htmlType="submit" className="login-form-button">
                                    Register
                                </Button>
                            </Col>
                        </Row>
                    </form>
                </div>
            ) : (
                <div className="reasendmail-container-register">
                    <Title style={{ color: '#fff' }} level={4}>
                        An email containing your test link has been sent to {user.emailid}
                    </Title>
                    <Button type="primary" onClick={resendMail}>
                        Resend Mail
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TraineeRegister;