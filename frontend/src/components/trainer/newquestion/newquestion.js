import React, { useState } from "react";
import "./newquestion.css";
import {
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  Checkbox,
  Modal,
  Upload,
  InputNumber,
} from "antd";
import Icon from "@ant-design/icons";
import { connect } from "react-redux";
import {
  ChangeQuestionConfirmDirty,
  ChangeQuestionTableData,
  ChangeQuestionModalState,
} from "../../../actions/trainerAction";
import { SecurePost } from "../../../services/axiosCall";
import apis from "../../../services/Apis";
import Alert from "../../../components/common/alert";
import auth from "../../../services/AuthServices";

function NewQuestion(props) {
  const [questionDetails, setQuestionDetails] = useState({
    questionimage: null,
    options: [
      {
        image: null,
        body: null,
        isAnswer: false,
      },
      {
        image: null,
        body: null,
        isAnswer: false,
      },
      {
        image: null,
        body: null,
        isAnswer: false,
      },
      {
        image: null,
        body: null,
        isAnswer: false,
      },
    ],
  });

  const [adding, setAdding] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [fifthoptioAddButtonVisible, setFifthoptioAddButtonVisible] =
    useState(true);

  const addfifthOption = () => {
    setFifthoptioAddButtonVisible(false);
    setQuestionDetails((prevState) => ({
      ...prevState,
      options: [
        ...prevState.options,
        {
          image: null,
          body: null,
          isAnswer: false,
        },
      ],
    }));
  };

  const Customalert = () => {
    Modal.confirm({
      title: "Confirm",
      content: "Empty options cannot be set as an answer",
      okText: "I understand",
      cancelText: null,
    });
  };

  const OptionTextChange = (e, i) => {
    const newOptions = [...questionDetails.options];
    newOptions[i] = {
      ...questionDetails.options[i],
      body: e.target.value,
    };

    if (
      (newOptions[i].image === "undefined" ||
        newOptions[i].image === undefined ||
        newOptions[i].image === null ||
        newOptions[i].image === "null") &&
      (newOptions[i].body === "undefined" ||
        newOptions[i].body === undefined ||
        newOptions[i].body === "null" ||
        newOptions[i].body === "" ||
        newOptions[i].body === null)
    ) {
      newOptions[i] = {
        ...questionDetails.options[i],
        isAnswer: false,
      };
    }

    setQuestionDetails((prevState) => ({
      ...prevState,
      options: newOptions,
    }));
  };

  const AnswerOptionSwitch = (e, i) => {
    if (
      (questionDetails.options[i].body !== "" &&
        questionDetails.options[i].body !== null) ||
      (questionDetails.options[i].image !== null &&
        questionDetails.options[i].image !== "undefined" &&
        questionDetails.options[i].image !== undefined)
    ) {
      const newOptions = [...questionDetails.options];
      newOptions[i] = {
        ...questionDetails.options[i],
        isAnswer: e.target.checked,
      };

      setQuestionDetails((prevState) => ({
        ...prevState,
        options: newOptions,
      }));
    } else {
      Customalert();
      return;
    }
  };

  const OptionImageonChange = (f, i) => {
    const newOptions = [...questionDetails.options];

    if (!f) {
      delete newOptions[i].image;
      newOptions[i].image = null;
    } else {
      newOptions[i] = {
        ...questionDetails.options[i],
        image: `${apis.BASE}/${f.link}`,
      };
    }

    setSubmitDisabled(false);

    if (
      (newOptions[i].image === "undefined" ||
        newOptions[i].image === undefined ||
        newOptions[i].image === null ||
        newOptions[i].image === "null") &&
      (newOptions[i].body === "undefined" ||
        newOptions[i].body === undefined ||
        newOptions[i].body === "null" ||
        newOptions[i].body === "" ||
        newOptions[i].body === null)
    ) {
      newOptions[i] = {
        ...questionDetails.options[i],
        isAnswer: false,
      };
    }

    setQuestionDetails((prevState) => ({
      ...prevState,
      options: newOptions,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let f = 1;
        let ans = 0;
        let opts = [];

        questionDetails.options.forEach((element, i) => {
          opts.push({
            optbody: element.body,
            optimg: element.image,
            isAnswer: element.isAnswer,
          });

          if (
            (element.image === "undefined" ||
              element.image === undefined ||
              element.image === null ||
              element.image === "null") &&
            (element.body === "" ||
              element.body === null ||
              element.body === "null" ||
              element.body === "undefined" ||
              element.body === undefined)
          ) {
            f = 0;
          }
          if (element.isAnswer) {
            ans = ans + 1;
          }
        });

        if (f) {
          if (!ans) {
            Alert(
              "warning",
              "Warning!",
              "There must be at least one right answer"
            );
          } else {
            setAdding(true);

            SecurePost({
              url: apis.CREATE_QUESTIONS,
              data: {
                body: values.questionbody,
                options: opts,
                quesimg: questionDetails.questionimage,
                subject: values.subject,
                explanation: values.explanation,
                weightage: values.waitage,
              },
            })
              .then((response) => {
                setAdding(false);

                if (response.data.success) {
                  props.ChangeQuestionModalState(false);
                  Alert("success", "Success", response.data.message);
                  props.ChangeQuestionTableData(props.trainer.selectedSubjects);
                } else {
                  props.ChangeQuestionModalState(false);
                  props.form.resetFields();
                  return Alert("warning", "Warning!", response.data.message);
                }
              })
              .catch((error) => {
                props.form.resetFields();
                setAdding(false);
                setQuestionDetails({
                  questionimage: null,
                  options: [
                    {
                      image: null,
                      body: null,
                      isAnswer: false,
                    },
                    {
                      image: null,
                      body: null,
                      isAnswer: false,
                    },
                    {
                      image: null,
                      body: null,
                      isAnswer: false,
                    },
                    {
                      image: null,
                      body: null,
                      isAnswer: false,
                    },
                  ],
                });

                props.ChangeQuestionModalState(false);
                return Alert("error", "Error!", "Server Error");
              });
          }
        } else {
          Alert("warning", "Warning!", "Please fill all the options");
        }
      }
    });
  };

  const changeqImage = (f) => {
    setQuestionDetails((prevState) => ({
      ...prevState,
      questionimage: f.link ? `${apis.BASE}/${f.link}` : null,
    }));

    setSubmitDisabled(false);
  };

  const upl = () => {
    setSubmitDisabled(true);
  };

  const ExplanationChange = (e) => {};

  const { getFieldDecorator } = props.form;
  const { Option } = Select;
  const { TextArea } = Input;
  const QuestionImageprops = {
    name: "file",
    action: `${apis.BASE}${apis.FILE_UPLOAD}?Token=${auth.retriveToken()}`,
    listType: "picture",
  };

  return (
    <div className="register-subject-form">
      <div className="register-trainer-form-body">
        <Form onSubmit={handleSubmit}>
          <div>
            <Row>
              <Col span={8}>
                <Form.Item label="Subject" hasFeedback>
                  {getFieldDecorator("subject", {
                    rules: [
                      {
                        required: true,
                        message: "Please select any subject!",
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      placeholder="Select a subject"
                      optionFilterProp="s"
                    >
                      {props.admin.subjectTableData.map((d, i) => (
                        <Option key={d._id} s={d.topic} value={d._id}>
                          {d.topic}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={18}>
                <Form.Item label="Question" hasFeedback>
                  {getFieldDecorator("questionbody", {
                    rules: [
                      { required: true, message: "Please type question!" },
                    ],
                  })(<TextArea rows={5} />)}
                </Form.Item>
              </Col>
              <Col span={6} style={{ padding: "0px 20px" }}>
                <Form.Item label="Question Image">
                  <Upload
                    {...QuestionImageprops}
                    beforeUpload={upl}
                    onRemove={changeqImage}
                    onSuccess={changeqImage}
                  >
                    <Button>
                      <Icon type="upload" /> Upload
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={18}>
                <Form.Item label="Explanation" hasFeedback>
                  {getFieldDecorator("explanation", {
                    rules: [
                      {
                        required: true,
                        message: "Please type Explanation for the answers!",
                      },
                    ],
                  })(<TextArea onChange={ExplanationChange} rows={3} />)}
                </Form.Item>
              </Col>
              <Col offset={2} span={4}>
                <Form.Item label="Weightage" hasFeedback>
                  {getFieldDecorator("waitage", {
                    rules: [
                      { required: true, message: "Please enter the marks" },
                    ],
                  })(<InputNumber min={1} max={2} />)}
                </Form.Item>
              </Col>
            </Row>
            <div style={{ paddingTop: "20px" }}>
              {questionDetails.options.map((option, i) => (
                <Row key={i} className="">
                  <Col offset={1} span={13}>
                    <Form.Item label={`option${i + 1}`}>
                      <TextArea
                        value={questionDetails.options[i].body}
                        onChange={(e) => OptionTextChange(e, i)}
                        rows={3}
                      />
                    </Form.Item>
                  </Col>
                  <Col offset={2} span={6} style={{ textAlign: "center" }}>
                    <Form.Item label={`Option${i + 1} Image`}>
                      <Upload
                        {...QuestionImageprops}
                        beforeUpload={upl}
                        onRemove={() => OptionImageonChange(null, i)}
                        onSuccess={(f) => OptionImageonChange(f, i)}
                      >
                        <Button>
                          <Icon type="upload" /> Upload
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col span={2} style={{ padding: "55px 10px" }}>
                    <Form.Item>
                      <Checkbox
                        checked={questionDetails.options[i].isAnswer}
                        onChange={(e) => AnswerOptionSwitch(e, i)}
                      ></Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
              ))}
            </div>
            <Row>
              <Col span={12}>
                {fifthoptioAddButtonVisible ? (
                  <Button type="primary" onClick={addfifthOption}>
                    Add 5th option
                  </Button>
                ) : null}
              </Col>
            </Row>
            <Row>
              <Col offset={20} span={4}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={submitDisabled}
                    loading={adding}
                    block
                  >
                    Create Question
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  trainer: state.trainer,
  admin: state.admin,
});

export default connect(mapStateToProps, {
  ChangeQuestionConfirmDirty,
  ChangeQuestionModalState,
  ChangeQuestionTableData,
})(NewQuestion);
