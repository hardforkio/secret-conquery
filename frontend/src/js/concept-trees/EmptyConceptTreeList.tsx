import React from "react";
import styled from "@emotion/styled";
import T from "i18n-react";

const Root = styled("div")`
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-left: 10px;
`;

const MsgContainer = styled("div")`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const Msg = styled("div")`
  width: 400px;
  white-space: initial;
`;

const Message = styled("p")`
  font-size: ${({ theme }) => theme.font.lg};
  margin: 10px 0 0;
  font-weight: 400;
`;

const SubMessage = styled("p")`
  font-size: ${({ theme }) => theme.font.md};
  margin: 0 0 10px;
`;

const Preview = styled("div")`
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.col.grayVeryLight};
  width: ${//@ts-ignore
  ({ width }) => width}px;
  height: 20px;
  margin: 3px 0;
`;

const Container = styled("div")`
  padding-left: 20px;
  display: flex;
  flex-direction: column;
`;

export default () => (
  <Root>
    <MsgContainer>
      <Msg>
        <Message>{T.translate("conceptTreeList.noTrees")}</Message>
        <SubMessage>
          {T.translate("conceptTreeList.noTreesExplanation")}
        </SubMessage>
      </Msg>
    </MsgContainer>
    <Preview
      //@ts-ignore
      width={200}
    />
    <Preview
      //@ts-ignore
      width={100}
    />
    <Container>
      <Preview
        //@ts-ignore
        width={250}
      />
      <Preview
        //@ts-ignore
        width={150}
      />
      <Preview
        //@ts-ignore
        width={300}
      />
      <Container>
        <Preview
          //@ts-ignore
          width={200}
        />
        <Preview
          //@ts-ignore
          width={50}
        />
      </Container>
    </Container>
    <Preview
      //@ts-ignore
      width={350}
    />
    <Preview
      //@ts-ignore
      width={200}
    />
    <Preview
      //@ts-ignore
      width={300}
    />
    <Preview
      //@ts-ignore
      width={250}
    />
  </Root>
);
