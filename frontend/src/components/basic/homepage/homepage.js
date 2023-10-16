import React from "react";
import "./homepage.css";
import "./homepage.jpeg";
import { connect } from "react-redux";
import Login from "../login/login";
import HomepageHeader from "../header/header";
import auth from "../../../services/AuthServices";
import { useNavigate } from "react-router-dom";

function Homepage(props) {
  const navigate = useNavigate();

  if (auth.retriveToken() && auth.retriveToken() !== "undefined") {
    console.log("Logged In");
    return navigate("/user/home");
  } else {
    console.log("Not Logged In");
    return (
      <div>
        <div className="parallax">
          <HomepageHeader />
          <Login />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, {})(Homepage);
