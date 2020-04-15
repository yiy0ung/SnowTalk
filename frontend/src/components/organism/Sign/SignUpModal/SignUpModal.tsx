import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import server from 'config/server';
import useInput from 'utils/hooks/useInput';
import { ProfileImg } from 'utils/types/entity.type';
import { fetchSignUpAsync, fetchUpdateProfileAsync } from 'store/reducers/auth.reducer';
import unknowProfileImg from 'assets/image/default-profile.jpg';
import { ImgPreviewer } from 'components/base/ImgPreviewer';
import { SimpleInput } from 'components/base/SimpleInput';
import { Button } from 'components/base/Button';

import './SignUpModal.scss';

type Props = {
  visible: boolean;
  type: 'signup'|'update';
  onClose: () => void;
  defaultData?: {
    name: string;
    intro: string;
    profileImg: ProfileImg|null;
  }
};

function SignUpModal({
  visible,
  type, 
  onClose, 
  defaultData = { name: '', intro: '', profileImg: null },
}: Props) {
  const currentProfileImg = defaultData.profileImg?.idx || null;
  const defaultImgUrl = defaultData.profileImg ? `${server.imgServer}/${defaultData.profileImg.name}` 
  : unknowProfileImg;
  const dispatch = useDispatch();

  const id = useInput('');
  const pw = useInput('');
  const name = useInput(defaultData.name);
  const intro = useInput(defaultData.intro);
  const [uploadedFile, setUploadedFile] = useState<File|null|number>(currentProfileImg);
  const [imgBase64, setImgBase64] = useState<string>(defaultImgUrl);

  const form = type === 'signup'? {
    name: '회원가입',
    confirmText: '가입',
    signInfoVisible: true,
  } : {
    name: '정보변경',
    confirmText: '수정',
    signInfoVisible: false,
  };

  const onCloseView = useCallback(() => {
    if (form.signInfoVisible) {
      id.setValue('');
      pw.setValue('');
      name.setValue('');
      intro.setValue('');
    }

    setUploadedFile(currentProfileImg);
    setImgBase64(defaultImgUrl);
    
    onClose();
  }, [form.signInfoVisible, currentProfileImg, defaultImgUrl, onClose, id, pw, name, intro]);

  const onChangeProfileImg = useCallback((file: File|null) => {
    setUploadedFile(file);
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
        file: uploadedFile,
      }));
      onCloseView();
    }
  }, [dispatch, id.value, intro.value, name.value, uploadedFile, pw.value, onCloseView]);

  const handleUpdateProfile = useCallback(() => {
    dispatch(fetchUpdateProfileAsync.request({
      name: name.value,
      intro: intro.value,
      file: uploadedFile,
    }));
    onCloseView();
  }, [dispatch, intro.value, name.value, uploadedFile, onCloseView]);

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
                imgFile={uploadedFile}
                setImgFile={onChangeProfileImg}
                imgBase64={imgBase64}
                setImgBase64={setImgBase64} />
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
