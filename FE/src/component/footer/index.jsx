import { Facebook, Mail, Phone } from "lucide-react";
import { Layout, Row, Col, Typography, Space } from "antd";
import Logo from "../../assets/logo koi care.png";

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

export default function Footer() {
  return (
    <AntFooter style={{ backgroundColor: "#001529", color: "#fff" }}>
      <div className="w-full border-t py-8">
        {/* First Row: Contact and Information */}
        <Row gutter={[32, 32]} justify="center" style={{ padding: "0 16px" }}>
          <Col xs={24} md={6}>
            <div className="flex flex-col gap-2">
              <Text strong style={{ color: "#fff" }}>Customer Care</Text>
              <div className="flex items-center gap-2">
                <Phone size={20} strokeWidth={1} absoluteStrokeWidth />
                <Text style={{ color: "#fff" }}>093 370 45 67</Text>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={20} strokeWidth={1} />
                <Link href="mailto:sofn2004@gmail.com" style={{ color: "#fff" }}>
                  sofn2004@gmail.com
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Link href="#" style={{ color: "#fff" }}>
                  FAQ
                </Link>
              </div>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div className="flex flex-col gap-2">
              <Text strong style={{ color: "#fff" }}>Why KoiF</Text>
              <Text style={{ color: "#fff" }}>Track size of your koi
              </Text>
              <Text style={{ color: "#fff" }}>Manage all your fish</Text>
              <Text style={{ color: "#fff" }}>Food diary</Text>
              <Text style={{ color: "#fff" }}>Save photos</Text>
              <Text style={{ color: "#fff" }}>Monitor your pond</Text>
              <Text style={{ color: "#fff" }}>Simple charts</Text>

            </div>
          </Col>
          <Col xs={24} md={6}>
            <div className="flex flex-col gap-2">
              <Text strong style={{ color: "#fff" }}>About KoiF</Text>
              <Text style={{ color: "#fff" }}>Our Story</Text>
              <Text style={{ color: "#fff" }}>KoiF Blog</Text>
              <Text style={{ color: "#fff" }}>Career Opportunities</Text>
              <Text style={{ color: "#fff" }}>Visit Our Store</Text>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div className="flex flex-col gap-2">
              <Text strong style={{ color: "#fff" }}>Follow Us</Text>
              <Space direction="vertical">
                <Link href="https://www.facebook.com" target="_blank" style={{ color: "#fff" }}>
                  <Facebook size={20} color="white" strokeWidth={1.25} /> Facebook
                </Link>
              </Space>
            </div>
          </Col>
        </Row>

        {/* Bottom Row: Logo and Legal Information */}
        <div className="border-t mt-8 pt-4">
          <Row justify="space-between" align="middle" style={{ padding: "0 16px" }}>
            <Col xs={24} md={12} className="flex items-center gap-4">


              <Text style={{ color: "#fff" }}>© 2024 KoiF Inc.</Text>
            </Col>
            <Col xs={24} md={12} className="flex gap-4 justify-end">
              <Link href="#" style={{ color: "#fff" }}>Terms & Conditions</Link>
              <Link href="#" style={{ color: "#fff" }}>Privacy Policy</Link>
              <Link href="#" style={{ color: "#fff" }}>Accessibility</Link>
            </Col>
          </Row>
        </div>
      </div>
    </AntFooter>
  );
}
