import Header from "../../component/header";
import Footer from "../../component/footer";
import VipPackage from "../../component/vipPackage";
import { Button, Row, Col, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import landing1 from "../../assets/landing 1.png";

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const features = [
    {
      title: "Track size of your koi",
      description: "Daily track and monitor the growth of your koi fish.",
    },
    {
      title: "Manage all your fish",
      description: "Keep track and overview of all your koi fish in one app.",
    },
    {
      title: "Food diary",
      description:
        "Track and save the type and number of feeding moments and feeding details.",
    },
    {
      title: "Save photos",
      description:
        "Save photos for all of your koi fish to monitor growth and health of your koi fish.",
    },
    {
      title: "Monitor your pond",
      description:
        "Daily monitor the quality and health (ammonia, nitrite, phosphate etc.) of your koi ponds.",
    },
    {
      title: "Simple charts",
      description:
        "Simple charts allow you to easily see how your koi are growing and developing.",
    },
  ];

  return (
    <div className="home bg-gray-950 text-slate-50">
      <Header />

      <div className="main-content max-w-screen-2xl text-base mx-auto px-8 flex items-center justify-center gap-10 pt-28">
        <div className="basis-1/2">
          <Title level={1} style={{ color: "#fff" }}>
            Manage & monitor your Koi
          </Title>
          <Paragraph style={{ color: "#d1d5db", fontSize: "18px" }}>
            Would you like to monitor the growth, feeding and health of your Koi?
            Log from anywhere, always available, including photos and easy charts.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              navigate("/signin");
            }}
          >
            Sign In Now
          </Button>
        </div>
        <div className="basis-1/2">
          <img id="carouselImage" src={landing1} alt="" />
        </div>
      </div>

      <div id="features" className="pt-36 px-8">
        <Title level={2} style={{ textAlign: "center", color: "#fff" }}>
          KoiF allows you to:
        </Title>
        <Row gutter={[16, 16]} justify="center">
          {features.map((feature, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <Card
                hoverable
                style={{
                  backgroundColor: "#1f2937",
                  color: "#fff",
                  borderRadius: "8px",
                }}
              >
                <Title level={4} style={{ color: "#fff" }}>
                  {feature.title}
                </Title>
                <Paragraph style={{ color: "#d1d5db" }}>
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div id="advertisements" className="flex flex-col mt-8 items-center pt-24 px-8">
        <Title level={1} style={{ color: "#fff" }}>
          Advertisements
        </Title>
        <VipPackage />
      </div>

      <div id="aboutus" className="pt-24 px-8 flex flex-col items-center justify-center">
        <Title level={1} style={{ color: "#fff" }}>
          About Us
        </Title>
        <Paragraph style={{ color: "#d1d5db", textIndent: "2em" }}>
          Welcome to < strong>KoiF</strong>, your trusted partner for Koi fish
          care services at home. We understand the passion and dedication required
          to maintain the beauty and health of Koi fish, and {`we're`} here to
          make that journey easier for you.
        </Paragraph>
        <Paragraph style={{ color: "#d1d5db", textIndent: "2em" }}>
          Our platform acts as a bridge between Koi enthusiasts and professional
          care solutions. With our advanced tools, we help you accurately calculate
          key parameters for your Koi fish and pond, ensuring a thriving aquatic
          environment.
        </Paragraph>
        <Paragraph style={{ color: "#d1d5db", textIndent: "2em" }}>
          Whether {`you're`} a seasoned Koi keeper or just starting out, < strong>KoiF</strong>{" "}
          is here to support you every step of the way. Let us take the guesswork
          out of Koi care, so you can focus on enjoying the vibrant beauty of your fish.
        </Paragraph>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
