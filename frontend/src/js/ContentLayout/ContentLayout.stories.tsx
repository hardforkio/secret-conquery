import React from "react";
import { ContentLayout } from "./index";
export default {
  title: "ContentLayout"
};

const Box: React.FC<{ text: string; color: string; style?: any }> = ({
  text,
  color,
  style
}) => <div style={{ ...style, backgroundColor: color }}>Info {text}</div>;

export const Layout = () => (
  <ContentLayout
    info={<Box text="Info" color="grey" />}
    editor={<Box text="Editor" color="blue" />}
    tools={<Box text="Tools" color="red" />}
  />
);

export const LayoutWithContent = () => (
  <ContentLayout
    info={<Box style={{ height: "1200px" }} text="Info" color="grey" />}
    editor={<Box text="Editor" color="blue" />}
    tools={<Box text="Tools" color="red" />}
  />
);
