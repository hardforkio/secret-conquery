import React from "react";
import { ContentLayout } from "./index";
import { loremIpsum } from "lorem-ipsum";

export default {
  title: "ContentLayout"
};

const Box: React.FC<{
  text?: string;
  title: string;
  words?: number;
  color: string;
  style?: any;
}> = ({ text, words = 1, color, style, title }) => (
  <div
    style={{
      ...style,
      backgroundColor: color,
      overflow: "auto",
      height: "100%"
    }}
  >
    <div>
      <h2>{title}</h2>
      {text}
    </div>
    {loremIpsum({ count: words })}
  </div>
);

export const Layout = () => (
  <ContentLayout
    info={<Box title="Info" color="grey" />}
    editor={<Box title="Editor" color="cyan" />}
    tools={<Box title="Tools" color="red" />}
  />
);

export const LayoutWithContent = () => (
  <ContentLayout
    info={<Box title="Info" words={50} color="grey" />}
    editor={<Box title="Editor" words={50} color="cyan" />}
    tools={<Box title="Tools" words={50} color="red" />}
  />
);
