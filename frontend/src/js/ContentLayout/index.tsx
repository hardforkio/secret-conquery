import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./layout.module.scss";
import Div100vh from "react-div-100vh";
import cn from "classnames";

type ContentLayoutProps = {
  info: React.ReactNode;
  editor: React.ReactNode;
  tools: React.ReactNode;
  menu?: React.ReactNode;
};

export const ContentLayout: React.FC<ContentLayoutProps> = ({
  menu = "This is the menu",
  info,
  editor,
  tools
}) => (
  <Div100vh>
    <div className={styles.outer}>
      <div className={styles.menu}>{menu}</div>
      <div className={styles.content}>
        <div className={cn(styles.editor, "border")}>{editor}</div>
        <div className={styles.toolSection}>
          <div className={cn(styles.tools, "border")}>{tools}</div>
          <div className={cn(styles.info, "border")}>{info}</div>
        </div>
      </div>
    </div>
  </Div100vh>
);
