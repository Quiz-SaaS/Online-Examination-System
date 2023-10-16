import React, { useState } from 'react';
import { Button, Skeleton, Modal, InputNumber, Transfer, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { changeStep, changeMode, removeQuestionFromMainQueue, changeBasicNewTestDetails, fetchSubjectWiseQuestion, pushQuestionToQueue } from '../../../actions/testAction';
import './newtest.css';
import Alert from '../../common/alert';
import apis from '../../../services/Apis';
import { Post } from '../../../services/axiosCall';

const GeneraterandomQuestion = ({ test, changeStep, changeBasicNewTestDetails, fetchSubjectWiseQuestion, pushQuestionToQueue, removeQuestionFromMainQueue, changeMode }) => {
    const [generating, setGenerating] = useState(false);
    const [autogenerate, setAutogenerate] = useState(true);
    const [activeQuestionId, setActiveQuestionId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    changeMode(test.mode);

    const handleSubmit = (e) => {
        e.preventDefault();
        const { no } = e.target.elements;
        if (no.value <= test.questionsAvailablebasedonSubject.length) {
            const qus = [];
            let allquestions = [...test.questionsAvailablebasedonSubject];
            let l = allquestions.length - 1;
            for (let i = no.value; i > 0; i--) {
                l = l - 1;
                const r = Math.floor(Math.random() * l);
                qus.push(allquestions[r]._id);
                allquestions.splice(r, 1);
            }
            pushQuestionToQueue(qus);
            setAutogenerate(false);
        } else {
            Alert('error', 'Error!', "You don't have enough questions to select.");
        }
    };

    const renderItem = (item) => {
        const customLabel = (
            <span className="custom-item">
                <Button shape="circle" onClick={() => setActiveQuestionId(item._id)} icon="info" style={{ background: 'linear-gradient(to right,rgb(80,190,189),rgb(0,153,153),rgb(0,153,203))', color: 'greenblue' }} size="small"></Button>
                {item.body}
            </span>
        );
        return {
            label: customLabel,
            value: item._id,
        };
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleChange = (targetKeys) => {
        pushQuestionToQueue(targetKeys);
    };

    return (
        <div>
            <Row>
                <Col span={5} style={{ padding: '20px 0px' }}>
                    <div className={`random-question-generation ${test.mode === 'random' ? 'notblind' : 'blind'}`}>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="no">Enter No. of questions</label>
                            <InputNumber id="no" style={{ width: '100%' }} placeholder="No of question" min={10} max={50} required />
                            <Button type="default" htmlType="submit" block disabled={!autogenerate}>
                                Generate Test Paper
                            </Button>
                        </form>
                    </div>
                </Col>
                <Col span={19} style={{ padding: '20px' }}>
                    <Transfer
                        disabled={test.mode === 'random'}
                        rowKey={(record) => record._id}
                        dataSource={test.questionsAvailablebasedonSubject}
                        listStyle={{
                            width: '45%',
                            height: 500,
                        }}
                        targetKeys={test.newtestFormData.testQuestions}
                        render={renderItem}
                        onChange={handleChange}
                    />
                </Col>
            </Row>
            <Modal
                destroyOnClose
                width="70%"
                style={{ top: '30px' }}
                title="Question details"
                visible={modalVisible}
                onOk={handleCancel}
                onCancel={handleCancel}
                footer={null}
            >
                <SingleQuestionDetails qid={activeQuestionId} />
            </Modal>
        </div>
    );
};

const mapStateToProps = (state) => ({
    test: state.test,
});

export default connect(mapStateToProps, {
    changeStep,
    changeBasicNewTestDetails,
    fetchSubjectWiseQuestion,
    pushQuestionToQueue,
    removeQuestionFromMainQueue,
    changeMode,
})(GeneraterandomQuestion);

const SingleQuestionDetails = ({ qid }) => {
    const [fetching, setFetching] = useState(false);
    const [qdetails, setQdetails] = useState(null);

    Post({
        url: apis.FETCH_SINGLE_QUESTION_BY_TRAINEE,
        data: {
            qid,
        },
    })
        .then((response) => {
            console.log(response);
            if (response.data.success) {
                setQdetails(response.data.data[0]);
            } else {
                Alert('error', 'Error !', response.data.message);
            }
            setFetching(false);
        })
        .catch((error) => {
            setFetching(false);
            console.log(error);
            Alert('error', 'Error !', 'Server Error');
        });

    const optn = ['A', 'B', 'C', 'D', 'E'];

    if (qdetails !== null) {
        return (
            <div>
                <div className="mainQuestionDetailsContaine">
                    <div className="questionDetailsBody">{qdetails.body}</div>
                    {qdetails.quesimg ? (
                        <div className="questionDetailsImageContainer">
                            <img alt="Question" className="questionDetailsImage" src={qdetails.quesimg} />
                        </div>
                    ) : null}
                    <div>
                        {qdetails.options.map((d, i) => {
                            return (
                                <div key={i}>
                                    <Row type="flex" justify="center" className="QuestionDetailsOptions">
                                        <Col span={2}>
                                            {d.isAnswer ? (
                                                <Button className="green" shape="circle">
                                                    {optn[i]}
                                                </Button>
                                            ) : (
                                                <Button type="primary" shape="circle">
                                                    {optn[i]}
                                                </Button>
                                            )}
                                        </Col>
                                        {d.optimg ? (
                                            <Col span={6} style={{ padding: '5px' }}>
                                                <img alt="options" className="questionDetailsImage" src={d.optimg} />
                                            </Col>
                                        ) : null}
                                        {d.optimg ? (
                                            <Col span={14}>{d.optbody}</Col>
                                        ) : (
                                            <Col span={20}>{d.optbody}</Col>
                                        )}
                                    </Row>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="skeletor-wrapper">
                <Skeleton active />
                <Skeleton active />
            </div>
        );
    }
};