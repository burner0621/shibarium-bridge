import React, { FC } from "react";
import { TabListItem } from "./Tabs.styled";

const Tab = ({ onClick, "data-label": label, activeTab }) => {
  const changeLabel = () => {
    onClick(label);
  };

  let className = "";

  if (activeTab === label) {
    className = "tab-active";
  }

  return (
    <TabListItem id={`${label}Tab`} className={className} onClick={changeLabel}>
      {label}
    </TabListItem>
  );
};

export default Tab;
