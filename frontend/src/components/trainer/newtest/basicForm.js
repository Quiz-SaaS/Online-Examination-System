import React, { useState } from 'react';
import { connect } from 'react-redux';
import { InputNumber, Input, Button, Select } from 'antd';
import { changeStep, changeBasicNewTestDetails } from '../../../actions/testAction';
import { SecurePost } from '../../../services/axiosCall';
import './newtest.css';
import apis from '../../../services/Apis';
const { Option } = Select;

const BasicTestForm = ({ test, admin, changeStep, changeBasicNewTestDetails }) => {
    const [checkingName, setCheckingName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const { type, title, duration, organisation, subjects } = e.target.elements;
        changeBasicNewTestDetails({
            testType: type.value,
            testTitle: title.value,
            testDuration: duration.value,
            OrganisationName: organisation.value,
            testSubject: subjects.value,
        });
        changeStep(1);
    };

    const validateTestName = (rule, value, callback) => {
        if (value.length >= 5) {
            setCheckingName('validating');
            SecurePost({
                url: apis.CHECK_TEST_NAME,
                data: {
                    testname: value,
                },
            })
                .then((data) => {
                    console.log(data);
                    if (data.data.success) {
                        if (data.data.can_use) {
                            setCheckingName('success');
                            callback();
                        } else {
                            setCheckingName('error');
                            callback('Another test exist with same name.');
                        }
                    } else {
                        setCheckingName('success');
                        callback();
                    }
                })
                .catch((ee) => {
                    console.log(ee);
                    setCheckingName('success');
                    callback();
                });
        } else {
            callback();
        }
    };

    return (
        <div className="basic-test-form-outer">
            <div className="basic-test-form-inner">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="type">Test Type</label>
                    <Select id="type" defaultValue={test.newtestFormData.testType} required>
                        <Option value="pre-test">Pre Test</Option>
                        <Option value="post-test">Post Test</Option>
                    </Select>
                    <label htmlFor="title">Test Title</label>
                    <Input
                        id="title"
                        defaultValue={test.newtestFormData.testTitle}
                        required
                        minLength={5}
                        addonAfter={checkingName}
                        onChange={(e) => validateTestName(null, e.target.value, () => {})}
                        placeholder="Test Title"
                    />
                    <label htmlFor="subjects">Subjects</label>
                    <Select
                        id="subjects"
                        defaultValue={test.newtestFormData.testSubject}
                        required
                        mode="multiple"
                        placeholder="Select one or more subjects"
                        style={{ width: '100%' }}
                        allowClear={true}
                        optionFilterProp="s"
                    >
                        {admin.subjectTableData.map((item) => (
                            <Option key={item._id} value={item._id} s={item.topic}>
                                {item.topic}
                            </Option>
                        ))}
                    </Select>
                    <label htmlFor="duration">Test Duration ( Min. test duration-60m )</label>
                    <InputNumber
                        id="duration"
                        defaultValue={test.newtestFormData.testDuration}
                        required
                        min={60}
                        max={180}
                        placeholder="Test Duration"
                        style={{ width: '100%' }}
                    />
                    <label htmlFor="organisation">Organisation Name</label>
                    <Input id="organisation" defaultValue={test.newtestFormData.OrganisationName} placeholder="Organisation Name" />
                    <Button type="primary" htmlType="submit" block>
                        Next
                    </Button>
                </form>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    test: state.test,
    admin: state.admin,
});

export default connect(mapStateToProps, {
    changeStep,
    changeBasicNewTestDetails,
})(BasicTestForm);