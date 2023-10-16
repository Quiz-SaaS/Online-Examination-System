import React, { useState } from 'react';
import './answer.css';
import { connect } from 'react-redux';
import { Post } from '../../../services/axiosCall';
import apis from '../../../services/Apis';
import Alert from '../../common/alert';
import { Rate, Input, Button } from 'antd';
import { FeedbackStatus } from '../../../actions/traineeAction';

const { TextArea } = Input;

function Feedback({ trainee, FeedbackStatus }) {
    const [star, setStar] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStarChange = (star) => {
        console.log(star);
        setStar(star);
    };

    const onCommentChange = (comment) => {
        setComment(comment.target.value);
    };

    const submitFeedback = () => {
        setLoading(true);
        if (star !== 0 && comment.length > 0) {
            Post({
                url: apis.GIVE_FEEDBACK,
                data: {
                    testid: trainee.testid,
                    userid: trainee.traineeid,
                    rating: star,
                    feedback: comment,
                },
            })
                .then((response) => {
                    if (response.data.success) {
                        setLoading(false);
                        Alert('success', 'Success', 'Thanks for your feedback');
                        FeedbackStatus(true);
                    } else {
                        setLoading(false);
                        Alert('error', 'Failed', response.data.message);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    Alert('error', 'Failed', 'Server Error');
                    setLoading(false);
                });
        } else {
            // handle error
        }
    };

    const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

    return (
        <div className="feedbackFormHolder">
            <div className="pp">
                <span>
                    <Rate tooltips={desc} onChange={handleStarChange} value={star} />
                    {star ? <span className="ant-rate-text">{desc[star - 1]}</span> : ''}
                </span>
            </div>
            <div className="pp">
                <TextArea rows={4} onChange={onCommentChange} value={comment} />
            </div>
            <div className="pp">
                <Button type="primary" onClick={submitFeedback} loading={loading}>
                    Submit
                </Button>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    trainee: state.trainee,
});

export default connect(mapStateToProps, {
    FeedbackStatus,
})(Feedback);