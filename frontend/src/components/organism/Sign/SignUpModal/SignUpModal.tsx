import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import useInput from 'utils/hooks/useInput';
import { ImgPreviewer } from 'components/base/ImgPreviewer';
import { SimpleInput } from 'components/base/SimpleInput';
import { Button } from 'components/base/Button';

import './SignUpModal.scss';
import { fetchSignUpAsync } from 'store/reducers/auth.reducer';
import Swal from 'sweetalert2';

type Props = {
  visible: boolean;
  type: 'signup'|'update';
  onClose: () => void;
  defaultData?: {
    name: string;
    intro: string;
    profileImgUrl: string;
  }
};

function SignUpModal({
  visible,
  type, 
  onClose, 
  defaultData = { name: '', intro: '', profileImgUrl: '' },
}: Props) {
  const dispatch = useDispatch();

  const id = useInput('');
  const pw = useInput('');
  const name = useInput(defaultData.name);
  const intro = useInput(defaultData.intro);
  const [profileImg, setProfileImg] = useState<File|null>(null);

  const form = type === 'signup'? {
    name: '회원가입',
    confirmText: '가입',
    signInfoVisible: true,
  } : {
    name: '회원수정',
    confirmText: '수정',
    signInfoVisible: false,
  };

  const onCloseView = useCallback(() => {
    id.setValue('');
    pw.setValue('');
    name.setValue('');
    intro.setValue('');
    setProfileImg(null);
    
    onClose();
  }, [id, intro, name, onClose, pw]);

  const onChangeProfileImg = useCallback((file: File|null) => {
    setProfileImg(file);
  }, []);

  const handleSignUp = useCallback(() => {
    if (!id.value || !pw.value || !name.value) {
      Swal.fire({
        icon: 'error',
        title: '필수 요소가 빠져있습니다',
        text: '아이디, 비밀번호, 이름을 무조건 입력해주세요!'
      });
      return;
    } else {
      dispatch(fetchSignUpAsync.request({
        id: id.value,
        pw: pw.value,
        name: name.value,
        intro: intro.value,
        file: profileImg,
      }));
      onCloseView();
    }
  }, [dispatch, id.value, intro.value, name.value, profileImg, pw.value, onCloseView]);

  const handleUpdateProfile = useCallback(() => {

  }, []);

  return (
    <div className="signup-modal-bg" style={visible ? {}:{display: 'none'}}>
      <div className="signup-modal">
        <div>
          <div className="signup-modal__title">{form.name}</div>
          {
            (form.signInfoVisible === true) && (
              <div className="signup-modal__column">
                <div className="signup-modal__subtitle">로그인 정보</div>
                <div>
                  <SimpleInput value={id.value} onChange={id.onChange} placeholder="아이디" />
                </div>
                <div>
                  <SimpleInput value={pw.value} onChange={pw.onChange} placeholder="비밀번호" />
                </div>
              </div>
            )
          }
          <div className="signup-modal__column">
            <div className="signup-modal__subtitle">회원 정보</div>
            <div>
              <SimpleInput value={name.value} onChange={name.onChange} placeholder="이름" />
            </div>
            <div>
              <SimpleInput value={intro.value} onChange={intro.onChange} placeholder="소개" />
            </div>
          </div>

          <div className="signup-modal__column">
            <div className="signup-modal__subtitle">프로필 이미지</div>
            <div className="signup-modal__content">
              <ImgPreviewer 
                defaultImgUrl={defaultData.profileImgUrl} 
                imgFile={profileImg}
                setImgFile={onChangeProfileImg} />
            </div>
          </div>
        </div>

        <div className="signup-modal__foot">
          <div>
            <Button 
              type="primary" 
              onClick={form.signInfoVisible === true ? handleSignUp : handleUpdateProfile} >
              {form.confirmText}
            </Button>
          </div>
          <div>
            <Button type="secondary" onClick={onCloseView}>취소</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpModal;
