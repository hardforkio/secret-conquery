import React from "react";
import { ContentLayout } from "./index";
export default {
  title: "ContentLayout"
};

const Box = ({ text, color }: { text: string; color: string }) => (
  <div style={{ backgroundColor: color }}>Info {text}</div>
);

export const Layout = () => (
  <ContentLayout
    info={<Box text="Info" color="grey" />}
    editor={<Box text="Editor" color="blue" />}
    tools={<Box text="Tools" color="red" />}
  />
);
