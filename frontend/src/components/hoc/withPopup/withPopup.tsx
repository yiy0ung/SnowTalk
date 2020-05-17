import React, { ClassicComponentClass, FC, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from 'store/reducers';
import { closePopUp } from 'store/reducers/core.reducer';

import './withPopup.scss';

const withPopup = (PageComponent: ClassicComponentClass<any>|FC<any>) => {
  const WithPopup = () => {
    const dispatch = useDispatch();
    const { popup } = useSelector((state: RootState) => state.core);

    const onClose = useCallback(() => {
      dispatch(closePopUp());
    }, [dispatch]);
    
    return (
      <>
        <PageComponent />
        <div className="popup-wrap" style={popup.visible ? {}:{display: 'none'}}>
          <div className="popup">
            <div className="popup__title">{popup.title}</div>
            <div className="popup__message">{popup.message}</div>
            <div className="popup__btnGroup">
              <button onClick={onClose}>확인</button>
            </div>
          </div>
        </div>
      </>
    )
  };

  return WithPopup;
}

export default withPopup;