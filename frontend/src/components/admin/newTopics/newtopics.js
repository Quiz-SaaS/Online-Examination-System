import React, { useState } from 'react';
import './newtopic.css';
import { Input, Button } from 'antd';
import { connect } from 'react-redux';
import { SecurePost } from '../../../services/axiosCall';
import apis from '../../../services/Apis';
import Alert from '../../../components/common/alert';
import {
    ChangeSubjectConfirmDirty,
    ChangeSubjectTableData,
    ChangeSubjectModalState,
} from '../../../actions/adminAction';

const NewTopics = ({ admin, ChangeSubjectConfirmDirty, ChangeSubjectTableData, ChangeSubjectModalState }) => {
    const [topic, setTopic] = useState(admin.subjectDetails.topic);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (topic) {
            console.log('Received values of form: ', topic);
            SecurePost({
                url: `${apis.CREATE_SUBJECT}`,
                data: {
                    _id: admin.SubjectId,
                    topic: topic,
                },
            })
                .then((response) => {
                    if (response.data.success) {
                        ChangeSubjectModalState(false, null, 'New Topic');
                        Alert('success', 'Success', response.data.message);
                        ChangeSubjectTableData();
                    } else {
                        ChangeSubjectModalState(false, null, 'New Topic');
                        return Alert('warning', 'Warning!', response.data.message);
                    }
                })
                .catch((error) => {
                    ChangeSubjectModalState(false, null, 'New Topic');
                    return Alert('error', 'Error!', 'Server Error');
                });
        }
    };

    return (
        <div className="register-subject-form">
            <div className="register-trainer-form-body">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="topic">Topic Name</label>
                    <Input
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Topic Name"
                        required
                    />
                    <Button type="primary" htmlType="submit" block>
                        {admin.Subjectmode}
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
    ChangeSubjectConfirmDirty,
    ChangeSubjectTableData,
    ChangeSubjectModalState,
})(NewTopics);