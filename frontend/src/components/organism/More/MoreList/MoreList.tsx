import React, { ReactNode, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegListAlt } from 'react-icons/fa';
import { TiCogOutline } from 'react-icons/ti';
import { FiLogOut, FiBell } from 'react-icons/fi';
import { IoIosFlask, IoIosHelpCircleOutline } from 'react-icons/io';

import { RootState } from 'store/reducers';
import { logout } from 'store/reducers/member.reducer';
import { unsubscribeChatSocket } from 'store/reducers/chatSocket.reducer';
import { SignUpModal } from 'components/organism/Sign/SignUpModal';

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
  const { member } = useSelector((state: RootState) => state.member);
  const [visible, setVisible] = useState(false);

  const onLogout = useCallback(() => {
    dispatch(logout());
    dispatch(unsubscribeChatSocket());
    sessionStorage.removeItem('token');
  }, [dispatch]);

  return (
    <div className="more-list">
      <div className="more-list__line"></div>
      <ul>
        <MoreListItem onClick={() => setVisible(true)} icon={<FaRegListAlt />}>
          정보 변경
        </MoreListItem>
        <MoreListItem icon={<FiBell />}>공지사항</MoreListItem>
        <MoreListItem icon={<TiCogOutline />}>설정</MoreListItem>
        <MoreListItem icon={<IoIosHelpCircleOutline />}>도움말</MoreListItem>
        <MoreListItem icon={<IoIosFlask />}>실험실</MoreListItem>
        <MoreListItem onClick={onLogout} icon={<FiLogOut />}>
          로그아웃
        </MoreListItem>
      </ul>
      <SignUpModal 
        visible={visible} 
        onClose={() => setVisible(false)}
        type="update"
        defaultData={{
          name: member.name,
          intro: member.intro,
          profileImg: member.profileImg,
        }} />

    </div>
  );
}

export default MoreList;