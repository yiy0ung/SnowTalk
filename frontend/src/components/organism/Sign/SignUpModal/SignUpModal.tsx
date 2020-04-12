import React, { useCallback } from 'react';

import useInput from 'utils/hooks/useInput';
import { SimpleInput } from 'components/base/SimpleInput';
import { Button } from 'components/base/Button';

import './SignUpModal.scss';

type Props = {
  visible: boolean;
  type: 'signup'|'update';
  onClose: () => void;
};

function SignUpModal({ visible, type, onClose }: Props) {
  const id = useInput('');
  const pw = useInput('');
  const name = useInput('');
  const intro = useInput('');

  const form = type === 'signup'? {
    name: '회원가입',
    confirmText: '등록',
    signInfoVisible: true,
  }: {
    name: '회원수정',
    confirmText: '수정',
    signInfoVisible: false,
  };

  const onCloseView = useCallback(() => {
    id.setValue('');
    pw.setValue('');
    name.setValue('');
    intro.setValue('');
    
    onClose();
  }, [id, intro, name, onClose, pw]);

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

          </div>
        </div>

        <div className="signup-modal__foot">
          <div>
            <Button type="primary" onClick={() => {}}>
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
