import React, { ReactNode, useState, useCallback } from 'react';
import './DropdownMenu.scss';

type Props = {
  component: ReactNode;
  children: ReactNode;
};

function DropdownMenu({ children, component }: Props) {
  const [open, setOpen] = useState(false);

  const onOpenMenu = useCallback(() => {
    setOpen(true);
  }, []);

  const onCloseMenu = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <div 
      className="dropdown-menu" 
      tabIndex={0}
      onBlur={onCloseMenu} >
      <div className="dropdown-menu__btn" onClick={onOpenMenu}>
        {component}
      </div>
      <div className="dropdown-menu__hidden">
        <ul 
          className="hidden-menu"
          style={ open ? { display: 'block' }:{} } 
        >
          {children}
        </ul>
      </div>
    </div>
  );
}

export default DropdownMenu;