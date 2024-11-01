import React from "react";
import { Card, Avatar, Row, Col, Typography } from "antd";
import nam from "./../../assets/1.jpg";
import tien from "./../../assets/2.jpg";
import anh from "./../../assets/3.jpg";
import nguyen from "./../../assets/4.jpg";
import backgroud from "./../../assets/wallpaper.jpg";
const { Title, Text } = Typography;

const teamMembers = [
  { name: "Nam", role: "Front-End", image: nam },
  { name: "Tien", role: "Back-End", image: tien },
  { name: "Vy Anh", role: "Front-End", image: anh },
  { name: "Nguyen", role: "Front-End", image: nguyen },
];

const TeamSection = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900  
    " style={{
      backgroundImage: `url(${backgroud})`, // Set the background image
      backgroundSize: "cover", // Cover the entire container
      backgroundPosition: "center", // Center the image
    }}>
      <div className="w-full max-w-4xl bg-white rounded-xl p-8 shadow-xl">
        <Title level={2} className="text-center">
          My Team
        </Title>
        <hr className="w-24 my-3 mx-auto" />

        <Row gutter={[16, 16]} justify="center">
          {teamMembers.map((member, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card bordered={false} className="text-center">
                <Avatar
                  src={member.image}
                  size={100}
                  style={{ marginBottom: "16px" }}
                />
                <Title level={4}>{member.name}</Title>
                <Text type="secondary">{member.role}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default TeamSection;
