import React, { useState } from 'react';
import './newtrainer.css';
import { Input, Button, Select } from 'antd';
import { SecurePost } from '../../../services/axiosCall';
import apis from '../../../services/Apis';
import { connect } from 'react-redux';
import {
    ChangeTrainerConfirmDirty,
    ChangeTrainerModalState,
    ChangeTrainerTableData,
} from '../../../actions/adminAction';
import Alert from '../../../components/common/alert';
const { Option } = Select;

const NewTrainer = ({
    admin,
    ChangeTrainerConfirmDirty,
    ChangeTrainerModalState,
    ChangeTrainerTableData,
}) => {
    const [name, setName] = useState(admin.trainerdetails.name);
    const [emailid, setEmailid] = useState(admin.trainerdetails.emailid);
    const [contact, setContact] = useState(admin.trainerdetails.contact);
    const [password, setPassword] = useState(admin.trainerdetails.password);
    const [confirmpassword, setConfirmpassword] = useState(admin.trainerdetails.confirmpassword);
    const [prefix, setPrefix] = useState(admin.trainerdetails.prefix || '+91');

    const compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== password) {
            callback('passwords are not same !');
        } else {
            callback();
        }
    };

    const validateToNextPassword = (rule, value, callback) => {
        if (value && admin.TrainerconfirmDirty) {
            callback('Please confirm your password!');
        } else {
            callback();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const values = {
            name,
            emailid,
            contact: prefix + contact,
            password,
            confirmpassword,
        };
        console.log('Received values of form: ', values);
        SecurePost({
            url: `${apis.CREATE_TRAINER}`,
            data: {
                _id: admin.trainerId,
                name,
                password,
                emailid,
                contact: prefix + contact,
            },
        })
            .then((response) => {
                if (response.data.success) {
                    ChangeTrainerModalState(false, null, 'Register');
                    Alert('success', 'Success', response.data.message);
                    ChangeTrainerTableData();
                } else {
                    console.log(response.data);
                    ChangeTrainerModalState(false, null, 'Register');
                    return Alert('warning', 'Warning!', response.data.message);
                }
            })
            .catch((error) => {
                ChangeTrainerModalState(false, null, 'Register');
                return Alert('error', 'Error!', 'Server Error');
            });
    };

    return (
        <div className="register-trainer-form">
            <div className="register-trainer-form-body">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name</label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        required
                    />

                    {!admin.trainerId ? (
                        <>
                            <label htmlFor="emailid">E-mail</label>
                            <Input
                                id="emailid"
                                value={emailid}
                                onChange={(e) => setEmailid(e.target.value)}
                                placeholder="E-mail"
                                type="email"
                                required
                            />
                        </>
                    ) : null}

                    <label htmlFor="contact">Phone Number</label>
                    <Input
                        id="contact"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Phone Number"
                        addonBefore={
                            <Select style={{ width: 70 }} value={prefix} onChange={(value) => setPrefix(value)}>
                                <Option value="+91">+91</Option>
                            </Select>
                        }
                        required
                        minLength={10}
                        maxLength={10}
                    />

                    {!admin.trainerId ? (
                        <>
                            <label htmlFor="password">Password</label>
                            <Input.Password
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                onBlur={validateToNextPassword}
                            />

                            <label htmlFor="confirmpassword">Confirm Password</label>
                            <Input.Password
                                id="confirmpassword"
                                value={confirmpassword}
                                onChange={(e) => setConfirmpassword(e.target.value)}
                                placeholder="Confirm Password"
                                required
                                onBlur={compareToFirstPassword}
                            />
                        </>
                    ) : null}

                    <Button type="primary" htmlType="submit" block>
                        {admin.Trainermode}
                    </Button>
                </form>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    admin: state.admin,
});

export default connect(mapStateToProps, {
    ChangeTrainerConfirmDirty,
    ChangeTrainerModalState,
    ChangeTrainerTableData,
})(NewTrainer);