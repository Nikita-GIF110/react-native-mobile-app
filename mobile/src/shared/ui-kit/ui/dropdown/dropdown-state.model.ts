import React from "react";

export const useDropdownState = () => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return {
    openMenu,
    closeMenu,
    visible,
  };
};
