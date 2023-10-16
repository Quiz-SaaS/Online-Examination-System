import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { LocaltestDone, fetchTestdata } from '../../../actions/traineeAction';
import './portal.css';
import apis from '../../../services/Apis';
import { Post } from '../../../services/axiosCall';
import Alert from '../../common/alert';

function Clock({ trainee, LocaltestDone, fetchTestdata }) {
    const [localMinutes, setLocalMinutes] = useState(trainee.m_left);
    const [localSeconds, setLocalSeconds] = useState(trainee.s_left);

    useEffect(() => {
        const c = setInterval(() => {
            console.log('i am done');
            let l = localMinutes;
            let s = localSeconds;
            if (l == 0 && s == 1) {
                clearInterval(c);
                endTest();
            } else {
                if (s == 0) {
                    s = 59;
                    l = l - 1;
                } else {
                    s = s - 1;
                }
                setLocalMinutes(l);
                setLocalSeconds(s);
            }
        }, 1000);
        return () => clearInterval(c);
    }, [localMinutes, localSeconds]);

    const endTest = () => {
        Post({
            url: `${apis.END_TEST}`,
            data: {
                testid: trainee.testid,
                userid: trainee.traineeid,
            },
        })
            .then((response) => {
                if (response.data.success) {
                    fetchTestdata(trainee.testid, trainee.traineeid);
                } else {
                    return Alert('error', 'Error!', response.data.message);
                }
            })
            .catch((error) => {
                return Alert('error', 'Error!', 'Error');
            });
    };

    return (
        <div className="clock-wrapper">
            <div className="clock-container">
                {localMinutes} : {localSeconds}
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    trainee: state.trainee,
});

export default connect(mapStateToProps, {
    LocaltestDone,
    fetchTestdata,
})(Clock);