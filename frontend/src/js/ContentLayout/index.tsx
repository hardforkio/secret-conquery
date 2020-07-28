import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import styles from "./layout.module.scss";
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
  <div className={styles.outer}>
    <div className={styles.topBar}>{menu}</div>
    <div className={styles.content}>
      <div className={styles.editor}>{editor}</div>
      <div className={styles.toolSection}>
        <div className={cn(styles.tools, styles.item)}>{tools}</div>
        <div className={cn(styles.info, styles.item)}>{info}</div>
      </div>
    </div>
  </div>
);
