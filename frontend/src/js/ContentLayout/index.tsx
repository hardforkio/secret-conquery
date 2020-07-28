import React from "react";
import { Col, Row } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";

type ContentLayoutProps = {
  info: React.ReactNode;
  editor: React.ReactNode;
  tools: React.ReactNode;
};

export const ContentLayout: React.FC<ContentLayoutProps> = ({
  info,
  editor,
  tools
}) => (
  <div>
    <Row noGutters>
      <Col xs={12} md={12} lg={5} className="border-bottom border-right">
        {editor}
      </Col>
      <Col xs={12} md={8} lg={4} className="border-bottom border-right">
        {tools}
      </Col>
      <Col xs={12} md={4} lg={3} className="border-bottom border-right">
        {info}
      </Col>
    </Row>
  </div>
);
