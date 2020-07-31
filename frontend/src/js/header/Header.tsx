import React from "react";
import T from "i18n-react";
import styled from "@emotion/styled";
import { connect } from "react-redux";
import DatasetSelector from "../dataset/DatasetSelector";
import { Col, Row } from "reactstrap";

const Root = styled("header")`
  background-color: ${({ theme }) => theme.col.graySuperLight};
  color: ${({ theme }) => theme.col.blueGrayDark};
  border-bottom: 1px solid ${({ theme }) => theme.col.grayMediumLight};
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.3);
`;

const Logo = styled("div")`
  height: 50px;
  width: ${({ theme }) => theme.img.logoWidth};
  background-image: url(${({ theme }) => theme.img.logo});
  background-repeat: no-repeat;
  background-position-y: 50%;
  background-size: ${({ theme }) => theme.img.logoBackgroundSize};
`;

const Headline = styled("h1")`
  font-size: ${({ theme }) => theme.font.md};
  font-weight: 300;
`;

type PropsType = {
  version: string;
  isDevelopment: boolean;
};

// TODO: Show version somewhere
class Header extends React.Component<PropsType> {
  render() {
    return (
      <Row
        noGutters
        tag={Root}
        className="align-items-center d-flex w-100 justify-content-between p-2"
      >
        <Col xs={0} sm={6} className="align-items-center d-flex">
          <div className="d-none d-sm-block">
            <Logo title={this.props.version} />
          </div>
          <div className="d-none d-md-block">
            <Headline className="px-2 my-0">{T.translate("headline")}</Headline>
          </div>
        </Col>
        <Col
          sm={{ size: 6 }}
          md={{ size: 4, offset: 2 }}
          lg={{ size: 3, offset: 3 }}
        >
          <DatasetSelector />
        </Col>
      </Row>
    );
  }
}

//@ts-ignore

const mapStateToProps = state => {
  return {
    version: state.startup.config.version,
    isDevelopment: !state.startup.config.production || false
  };
};

export default connect(mapStateToProps, {})(Header);
