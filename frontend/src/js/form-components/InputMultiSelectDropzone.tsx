import * as React from "react";
import T from "i18n-react";
import styled from "@emotion/styled";
import { DropTarget } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

/*
  Can't use the dynamic <Dropzone> from './Dropzone' (the default export),
  because the dynamic generation of DropTargets will lead the nested InputMultiSelect
  to lose focus when re-rendering.

  And we're rerendering an InputMultiSelect potentially quite often.
*/
import { InnerZone } from "./Dropzone";

const Root = styled("div")`
  position: relative;
`;

const FileInput = styled("input")`
  display: none;
`;

const TopRight = styled("p")`
  margin: 0;
  font-size: ${({ theme }) => theme.font.tiny};
  color: ${({
    // @ts-ignore
    theme
  }) => theme.font.gray};
  position: absolute;
  top: -15px;
  right: 0;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const target = {
  // @ts-ignore
  drop: (props, monitor) => {
    const item = monitor.getItem();

    if (item && props.onDropFile) {
      props.onDropFile(item.files[0]);
    }
  }
};

// @ts-ignore
const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

export default DropTarget(
  [NativeTypes.FILE],
  target,
  collect
)(({ onDropFile, children, isOver, canDrop, connectDropTarget }) => {
  const fileInputRef = React.useRef(null);

  function onOpenFileDialog() {
    // @ts-ignore
    fileInputRef.current.click();
  }

  return (
    <Root>
      <// @ts-ignore
      InnerZone
        connectDropTarget={connectDropTarget}
        canDrop={canDrop}
        isOver={isOver}
      >
        {children}
      </InnerZone>
      <TopRight onClick={onOpenFileDialog}>
        {T.translate("inputMultiSelect.openFileDialog")}
        <FileInput
          ref={fileInputRef}
          type="file"
          onChange={e => {
            // @ts-ignore
            onDropFile(e.target.files[0]);
            // @ts-ignore
            fileInputRef.current.value = null;
          }}
        />
      </TopRight>
    </Root>
  );
});
