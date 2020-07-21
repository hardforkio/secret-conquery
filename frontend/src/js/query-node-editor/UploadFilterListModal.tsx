import React from "react";
import styled from "@emotion/styled";
import T from "i18n-react";

import Modal from "../modal/Modal";
import ScrollableList from "../scrollable-list/ScrollableList";
import FaIcon from "../icon/FaIcon";

const Root = styled("div")`
  padding: 0 0 10px;
`;
const Section = styled("div")`
  padding: 10px 20px;
`;
const Msg = styled("p")`
  margin: 10px 0 5px;
`;
const BigIcon = styled(FaIcon)`
  font-size: 20px;
  margin-right: 10px;
`;
const ErrorIcon = styled(BigIcon)`
  color: ${({ theme }) => theme.col.red};
`;
const SuccessIcon = styled(BigIcon)`
  color: ${({ theme }) => theme.col.green};
`;
const CenteredIcon = styled(FaIcon)`
  text-align: center;
`;

type PropsType = {
  loading: boolean;
  resolved: Record<string, any>;
  error: Record<string, any>;
  onClose: Function;
};

// @ts-ignore
const selectResolvedItemsCount = resolved => {
  return resolved &&
    resolved.resolvedFilter &&
    resolved.resolvedFilter.value &&
    resolved.resolvedFilter.value.length
    ? resolved.resolvedFilter.value.length
    : 0;
};

// @ts-ignore
const selectUnresolvedItemsCount = resolved => {
  return resolved && resolved.unknownCodes && resolved.unknownCodes.length
    ? resolved.unknownCodes.length
    : 0;
};

export default ({ loading, resolved, error, onClose }: PropsType) => {
  const resolvedItemsCount = selectResolvedItemsCount(resolved);
  const unresolvedItemsCount = selectUnresolvedItemsCount(resolved);

  const hasUnresolvedItems = unresolvedItemsCount > 0;
  const hasResolvedItems = resolvedItemsCount > 0;

  return (
    <Modal
      // @ts-ignore
      onClose={onClose}
      doneButton
      headline={T.translate("uploadFilterListModal.headline")}
    >
      <Root>
        {loading && <CenteredIcon icon="spinner" />}
        {error && (
          <p>
            <ErrorIcon icon="exclamation-circle" />
            {T.translate("uploadConceptListModal.error")}
          </p>
        )}
        {resolved && (
          <Section>
            {hasResolvedItems && (
              <Msg>
                <SuccessIcon icon="check-circle" />
                {T.translate("uploadConceptListModal.resolvedCodes", {
                  context: resolvedItemsCount
                })}
              </Msg>
            )}
            {hasUnresolvedItems && (
              <>
                <Msg>
                  <ErrorIcon icon="exclamation-circle" />
                  <span
                    dangerouslySetInnerHTML={{
                      // @ts-ignore
                      __html: T.translate(
                        "uploadConceptListModal.unknownCodes",
                        {
                          context: unresolvedItemsCount
                        }
                      )
                    }}
                  />
                </Msg>
                <ScrollableList
                  maxVisibleItems={3}
                  fullWidth
                  // @ts-ignore
                  items={resolved.unknownCodes}
                />
              </>
            )}
          </Section>
        )}
      </Root>
    </Modal>
  );
};
