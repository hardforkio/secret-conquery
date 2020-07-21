import * as React from "react";
import styled from "@emotion/styled";
import T from "i18n-react";

import InfoTooltip from "../../tooltip/InfoTooltip";

import DropzoneWithFileInput from "../../form-components/DropzoneWithFileInput";

import Modal from "../../modal/Modal";
import ErrorMessage from "../../error-message/ErrorMessage";
import FaIcon from "../../icon/FaIcon";

import CSVColumnPicker from "./CSVColumnPicker";

const Root = styled("div")`
  text-align: center;
`;

const Error = styled("div")`
  margin: 20px 0;
`;

const ErrorMessageSub = styled(ErrorMessage)`
  font-size: ${({ theme }) => theme.font.sm};
  margin: 0;
`;

const Success = styled("div")`
  margin: 25px 0;
`;

const StyledFaIcon = styled(FaIcon)`
  font-size: 40px;
  display: block;
  margin: 0 auto 10px;
  color: ${({ theme }) => theme.col.green};
`;

const SuccessMsg = styled("p")`
  margin: 0;
`;

const SxDropzoneWithFileInput = styled(DropzoneWithFileInput)`
  padding: 40px;
  width: 100%;
  cursor: pointer;
`;

type PropsT = {
  loading: boolean;
  success: Record<string, any> | null;
  error: Record<string, any> | null;
  onClose: Function;
  onUpload: Function;
};

export default ({ loading, success, error, onClose, onUpload }: PropsT) => {
  const [file, setFile] = React.useState(null);

  //@ts-ignore
  function onDrop(_, monitor) {
    const item = monitor.getItem();

    if (item.files) {
      setFile(item.files[0]);
    }
  }

  return (
    <Modal
      //@ts-ignore
      onClose={onClose}
      closeIcon
      headline={
        <>
          {T.translate("uploadQueryResultsModal.headline")}
          <InfoTooltip
            //@ts-ignore
            text={T.translate("uploadQueryResultsModal.formatInfo.text")}
          />
        </>
      }
    >
      <Root>
        {success ? (
          <Success>
            <StyledFaIcon icon="check-circle" />
            <SuccessMsg>
              {T.translate("uploadQueryResultsModal.uploadSucceeded")}
            </SuccessMsg>
          </Success>
        ) : (
          <div>
            {file && (
              <CSVColumnPicker
                //@ts-ignore
                file={file}
                loading={loading}
                //@ts-ignore
                onUpload={onUpload}
                onReset={() => setFile(null)}
              />
            )}
            {!file && (
              <SxDropzoneWithFileInput
                onDrop={onDrop}
                //@ts-ignore
                onSelectFile={setFile}
              >
                {() => T.translate("uploadQueryResultsModal.dropzone")}
              </SxDropzoneWithFileInput>
            )}
            {error && (
              <Error>
                <ErrorMessage
                  //@ts-ignore
                  message={T.translate("uploadQueryResultsModal.uploadFailed")}
                />
                <ErrorMessageSub
                  //@ts-ignore
                  message={T.translate(
                    "uploadQueryResultsModal.uploadFailedSub"
                  )}
                />
              </Error>
            )}
          </div>
        )}
      </Root>
    </Modal>
  );
};
