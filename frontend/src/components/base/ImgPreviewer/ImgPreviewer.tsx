import React, { useCallback, useState, ChangeEvent } from 'react';
import defaultImg from 'assets/image/default-profile.jpg';

import './ImgPreviewer.scss';

type Props = {
  defaultImgUrl?: string;
  imgFile: File|null;
  setImgFile: (data: File|null) => void;
};

function ImgPreviewer({ defaultImgUrl = '', imgFile, setImgFile }: Props) {
  const [imgBase64, setImgBase64] = useState<string>(defaultImgUrl);

  const onChangeFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const render = new FileReader();

    if (e.target.files && e.target.files[0]) {
      render.readAsDataURL(e.target.files[0]);
      setImgFile(e.target.files[0]);
    }

    render.onloadend = () => {
      const base64 = render.result;

      if (base64) {
        setImgBase64(base64.toString());
      }
    }
  }, [setImgBase64, setImgFile]);

  const onRemoveImg = useCallback(() => {
    setImgBase64(defaultImgUrl);
    setImgFile(null);
  }, [defaultImgUrl, setImgFile]);

  return (
    <div className="preview">
      <div className="preview__img">
        <img 
          src={imgFile !== null ? imgBase64 : defaultImg}
          alt="profile-img"
        />
      </div>
      <div className="preview__content">
        <div>
          <label 
            htmlFor="file_input"
            className="preview__btn-label">업로드</label>
          <input 
            id="file_input"
            className="preview__btn" 
            type="file"
            onChange={onChangeFile} />
        </div>
        <div>
          <button 
            onClick={onRemoveImg}
            className="preview__btn-label">지우기</button>
        </div>
      </div>
    </div>
  );
}

export default ImgPreviewer;