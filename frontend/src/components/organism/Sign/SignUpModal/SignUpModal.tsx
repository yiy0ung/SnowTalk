import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

import server from 'config/server';
import useInput from 'utils/hooks/useInput';
import { FileState } from 'utils/types/entity.type';
import { fetchSignUpAsync, fetchUpdateProfileAsync } from 'store/reducers/member.reducer';
import unknowProfileImg from 'assets/image/default-profile.jpg';
import { ImgPreviewer } from 'components/base/ImgPreviewer';
import { SimpleInput } from 'components/base/SimpleInput';
import { Button } from 'components/base/Button';

import './SignUpModal.scss';

const validate = {
  all: (id: string, pw: string, name: string) => {
    if (!id || !pw || !name) {
      return '아이디, 비밀번호, 이름을 무조건 입력해주세요!';
    }
  },
  id: (text: string) => {
    if (!(/^[a-zA-Z0-9]{6,20}$/.test(text))) {
      return '아이디는 6~20자의 알파벳, 숫자로만 조합가능합니다';
    }
  },
  pw: (text: string) => {
    if (!(/^[a-zA-Z0-9]{5,20}$/.test(text))) {
      return '비밀번호는 5~20자의 알파벳, 숫자로만 조합가능합니다';
    }
  },
  name: (text: string) => {
    if (text.length > 40) {
      return '이름은 40자 미만으로만 가능합니다';
    }
  },
};

type Props = {
  visible: boolean;
  type: 'signup'|'update';
  onClose: () => void;
  defaultData?: {
    name: string;
    intro: string;
    profileImg: FileState|null;
  }
};

function SignUpModal({
  visible,
  type, 
  onClose, 
  defaultData = { name: '', intro: '', profileImg: null },
}: Props) {
  const dispatch = useDispatch();
  const currentProfileImg = defaultData.profileImg?.idx || null;
  const defaultImgUrl = defaultData.profileImg ? `${server.imgServer}/${defaultData.profileImg.name}` 
    : unknowProfileImg;

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
    const error = validate.all(id.value, pw.value, name.value)
      || validate.id(id.value)
      || validate.pw(pw.value)
      || validate.name(name.value)
      || null;
      
    if (error) {
      Swal.fire({
        icon: 'error',
        title: '양식을 맞춰주세요',
        text: error,
      });
      return;
    }

    dispatch(fetchSignUpAsync.request({
      id: id.value,
      pw: pw.value,
      name: name.value,
      intro: intro.value,
      file: uploadedFile,
    }));

    onCloseView();
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
