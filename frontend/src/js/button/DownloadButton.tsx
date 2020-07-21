import * as React from "react";

import { getStoredAuthToken } from "../authorization/helper";

import IconButton from "./IconButton";

type PropsType = {
  url: string;
  className?: string;
  // @ts-ignore
  children?: React.Node;
  ending: string;
};

// @ts-ignore
function getIcon(ending: string) {
  return "download";

  // TODO: RE-Enable this with better icons (maybe "regular style" when we can afford it)
  // switch (ending) {
  //   case "csv":
  //     return "file-csv";
  //   case "zip":
  //     return "file-archive";
  //   default:
  //     return "file-alt";
  // }
}

const DownloadButton = ({
  url,
  className,
  children,
  ending,
  ...restProps
}: PropsType) => {
  const authToken = getStoredAuthToken();

  const href = `${url}?access_token=${encodeURIComponent(authToken || "")}`;

  const icon = getIcon(ending);

  return (
    /* eslint-disable */
    <a href={href} className={className}>
      < // @ts-ignore
        IconButton icon={icon} {...restProps}>
        {children}
      </IconButton>
    </a>
    /* eslint-enable */
  );
};

export default DownloadButton;
