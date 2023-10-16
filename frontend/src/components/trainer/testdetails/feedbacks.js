import React from "react";
import { Card, Rate, Avatar, Comment } from "antd";

export default function FeedBacks({ feedbacks }) {
    console.log(feedbacks);
    return (
        <div>
            <Card>
                <div className="download-section">
                    <h3>
                        <b>Feedbacks</b>
                    </h3>
                    <div>
                        {feedbacks.map((feedback, index) => (
                            <Card key={index} style={{ marginBottom: "10px" }}>
                                <Comment
                                    author={`${feedback.userid.name} - ${feedback.userid.organisation} `}
                                    avatar={
                                        <Avatar
                                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                            alt={feedback.userid.name}
                                        />
                                    }
                                    content={
                                        <span>
                                            <Rate size="small" disabled defaultValue={feedback.rating} />
                                            <p>{feedback.feedback}</p>
                                        </span>
                                    }
                                />
                            </Card>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
}