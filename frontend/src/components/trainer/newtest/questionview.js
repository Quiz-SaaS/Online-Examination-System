import React, { useState } from "react";
import { connect } from "react-redux";
import { Row, Col, Button } from "antd";
import { SecurePost } from "../../../services/axiosCall";
import apis from "../../../services/Apis";
import Alert from "../../common/alert";
import { useNavigate } from "react-router-dom";

function FinalQuestionView({ test }) {
  const [testId, setTestId] = useState(null);
  const navigate = useNavigate();

  const createTest = () => {
    SecurePost({
      url: apis.CREATE_TEST,
      data: {
        type: test.newtestFormData.testType,
        title: test.newtestFormData.testTitle,
        questions: test.newtestFormData.testQuestions,
        duration: test.newtestFormData.testDuration,
        subjects: test.newtestFormData.testSubject,
        organisation: test.newtestFormData.OrganisationName,
      },
    })
      .then((response) => {
        console.log(response.data);
        if (response.data.success) {
          Alert(
            "success",
            "Test paper Created Successfully!",
            "Please wait, you will automatically be redirected to conduct test page."
          );
          setTimeout(() => {
            setTestId(response.data.testid);
          }, 3000);
        } else {
          Alert("error", "Error!", response.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        Alert("error", "Error!", "Server Error");
      });
  };

  if (testId) {
    navigate(`/user/conducttest?testid=${testId}`);
  }

  return (
    <div>
      {test.newtestFormData.testQuestions.map((d, i) => {
        return <Q key={i + 1} _id={d} no={i + 1} />;
      })}
      <div style={{ width: "100%", padding: "10px" }}>
        <Button style={{ float: "right" }} type="primary" onClick={createTest}>
          Create Test
        </Button>
      </div>
    </div>
  );
}

function QuestionView(props) {
  const { _id, no, test } = props;
  const obj = test.questionsAvailablebasedonSubject.filter((hero) => {
    return hero._id === _id;
  });
  console.log(obj[0].weightage);
  const oo = ["A", "B", "C", "D", "E"];

  return (
    <div style={{ marginBottom: "20px" }}>
      <div>
        <div style={{ width: "100%" }}>
          <b style={{ float: "left" }}>Question No. {no})</b>
          <b style={{ float: "right" }}>Marks. {obj[0].weightage}</b>
        </div>
        <div style={{ padding: "5px 20px" }}>
          <br />
          {obj[0].body}
          {obj[0].quesimg ? <img alt="Question" src={obj[0].quesimg} /> : null}
        </div>
      </div>
      <Row>
        {obj[0].options.map((d, i) => {
          return (
            <Col key={i} span={12} style={{ padding: "5px 20px" }}>
              <b>{oo[i]} ) </b> {d.optbody}
              {d.optimg ? <img alt="Option" src={d.optimg} /> : null}
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

const mapStateToProps = (state) => ({
  test: state.test,
});

const Q = connect(mapStateToProps, null)(QuestionView);

export default connect(mapStateToProps, null)(FinalQuestionView);
