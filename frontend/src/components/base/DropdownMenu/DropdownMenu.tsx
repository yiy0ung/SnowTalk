import React, { ReactNode, useRef, useState, useCallback } from 'react';
import './DropdownMenu.scss';

type Props = {
  component: ReactNode;
  children: ReactNode;
};

function DropdownMenu({ children, component }: Props) {
  const [open, setOpen] = useState(false);

  const onToggleMenu = useCallback(() => {
    setOpen(!open);
  }, [open]);

  return (
    <div className="dropdown-menu">
      <div className="dropdown-menu__btn" onClick={onToggleMenu}>
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