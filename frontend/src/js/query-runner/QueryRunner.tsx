import React from "react";
import styled from "@emotion/styled";
import Hotkeys from "react-hot-keys";
import T from "i18n-react";

import Preview from "../preview/Preview";
import WithTooltip from "../tooltip/WithTooltip";

import QueryResults from "./QueryResults";
import QueryRunningSpinner from "./QueryRunningSpinner";
import QueryRunnerInfo from "./QueryRunnerInfo";
import QueryRunnerButton from "./QueryRunnerButton";

type PropsType = {
  queryRunner?: Record<string, any>;
  isQueryRunning: boolean;
  isButtonEnabled: boolean;
  buttonTooltipKey?: string | null;
  startQuery: Function;
  stopQuery: Function;
};

const Root = styled("div")`
  flex-shrink: 0;
  padding: 10px 20px 0 10px;
  border-top: 1px solid ${({ theme }) => theme.col.grayLight};
  display: flex;
  align-items: center;
  width: 100%;
`;

const Left = styled("div")`
  flex-grow: 1;
`;
const Right = styled("div")`
  flex-grow: 2;
  padding-left: 20px;
`;

const LoadingGroup = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const QueryRunner = (props: PropsType) => {
  const {
    queryRunner,
    startQuery,
    stopQuery,
    buttonTooltipKey,
    isQueryRunning,
    isButtonEnabled
  } = props;

  const btnAction = isQueryRunning ? stopQuery : startQuery;

  const isStartStopLoading =
    !!queryRunner &&
    //@ts-ignore
    (queryRunner.startQuery.loading || queryRunner.stopQuery.loading);

  return (
    <Root>
      <Hotkeys
        keyName="shift+enter"
        onKeyDown={() => {
          if (isButtonEnabled) btnAction();
        }}
      />
      <Preview />
      <Left>
        <WithTooltip
          text={buttonTooltipKey ? T.translate(buttonTooltipKey) : null}
        >
          <QueryRunnerButton
            onClick={btnAction}
            isStartStopLoading={isStartStopLoading}
            isQueryRunning={isQueryRunning}
            disabled={!isButtonEnabled}
          />
        </WithTooltip>
      </Left>
      <Right>
        <LoadingGroup>
          <QueryRunningSpinner isQueryRunning={isQueryRunning} />
          {!!queryRunner && <QueryRunnerInfo queryRunner={queryRunner} />}
        </LoadingGroup>
        {!!queryRunner &&
          //@ts-ignore
          !!queryRunner.queryResult &&
          //@ts-ignore
          !queryRunner.queryResult.error &&
          //@ts-ignore
          !queryRunner.queryResult.loading &&
          !isQueryRunning && (
            <QueryResults
              //@ts-ignore
              datasetId={queryRunner.queryResult.datasetId}
              //@ts-ignore
              resultCount={queryRunner.queryResult.resultCount}
              //@ts-ignore
              resultUrl={queryRunner.queryResult.resultUrl}
            />
          )}
      </Right>
    </Root>
  );
};

export default QueryRunner;
