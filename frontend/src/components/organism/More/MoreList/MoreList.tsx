import React, { ReactNode, useCallback } from 'react';

import { logout } from 'store/reducers/member.reducer';
import { FaRegListAlt } from 'react-icons/fa';
import { FiLogOut, FiBell } from 'react-icons/fi';
import { IoIosFlask, IoIosHelpCircleOutline } from 'react-icons/io';
import { TiCogOutline } from 'react-icons/ti';
import { useDispatch } from 'react-redux';

import './MoreList.scss';

type Props = {
  icon: ReactNode;
  onClick?: () => void;
  children: ReactNode;
};

function MoreListItem({ icon, onClick, children }: Props) {
  return (
    <li onClick={onClick} className="more-list-item">
      <div className="more-list-item__icon">{icon}</div>
      <div>{children}</div>
    </li>
  )
}

function MoreList() {
  const dispatch = useDispatch();
  const onLogout = useCallback(() => {
    dispatch(logout());
    sessionStorage.removeItem('token');
  }, [dispatch]);

  return (
    <div className="more-list">
      <div className="more-list__line"></div>
      <ul>
        <MoreListItem icon={<FaRegListAlt />}>정보 변경</MoreListItem>
        <MoreListItem icon={<FiBell />}>공지사항</MoreListItem>
        <MoreListItem icon={<TiCogOutline />}>설정</MoreListItem>
        <MoreListItem icon={<IoIosHelpCircleOutline />}>도움말</MoreListItem>
        <MoreListItem icon={<IoIosFlask />}>실험실</MoreListItem>
        <MoreListItem onClick={onLogout} icon={<FiLogOut />}>
          로그아웃
        </MoreListItem>
      </ul>
    </div>
  );
}

export default MoreList;