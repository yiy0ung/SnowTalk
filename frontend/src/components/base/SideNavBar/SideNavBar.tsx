import React, { ReactNode } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  FaUser,
  FaCommentDots,
  FaEllipsisH,
  FaRegSmileWink,
  FaRegCalendarCheck,
  FaRegBell,
} from 'react-icons/fa';
import { AiOutlineMenu } from 'react-icons/ai';
import link from '../../../config/link';

import './SideNavBar.scss';

type Props = {
  history: any;
  match: any;
  location: any;
  path: string;
  children: ReactNode;
};

const NavItem = withRouter(({ location, path, children }: Props) => {
  const { pathname } = location;
  return (
    <div className={`side-nav__nav-item ${path === pathname ? 'active-nav-btn':''}`}>
      <Link to={path}>
        {children}
      </Link>
    </div>
  );
});

function SideNavBar() {
  return (
    <div className="side-nav">
      <div className="side-nav__main-nav">
        <NavItem path={link.friend}><FaUser /></NavItem>
        <NavItem path={link.home}><FaCommentDots /></NavItem>
        <NavItem path={link.more}><FaEllipsisH /></NavItem>
      </div>

      <div>
        <div className="side-nav__item">
          <FaRegSmileWink />
        </div>
        <div className="side-nav__item">
          <FaRegCalendarCheck />
        </div>
        <div className="side-nav__item">
          <FaRegBell />
        </div>
        <div className="side-nav__item">
          <AiOutlineMenu />
        </div>
      </div>
    </div>
  );
}

export default withRouter(SideNavBar);