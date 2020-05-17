import React, { ClassicComponentClass, FC, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';

import { RootState } from 'store/reducers';
import { PopupData, closePopUp } from 'store/reducers/core.reducer';
import { Toast } from 'components/base/Toast';

import './withToast.scss';
import { Dispatch } from 'redux';

interface State {
  popupList: (PopupData&{id: number})[];
}

interface MapState {
  popup: PopupData;
}

interface MapDispatch {
  closePopup: Function;
}

const withToast = (PageComponent: ClassicComponentClass<any>|FC<any>) => {

  const WithToastFc = () => {
    const dispatch = useDispatch();
    const { popup: popupState } = useSelector((state: RootState) => state.core);
    const [popupList, setPopupList] = useState<(PopupData&{id: number})[]>([]);
    let popupData: (PopupData&{id: number})[] = [];

    useEffect(() => {
      console.log('useEffect: ', popupList);
      if (popupState.visible) {
        const newPopup = { id: Math.random(), ...popupState };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        popupData = [...popupList, newPopup];

        dispatch(closePopUp());
        setPopupList(popupData);

        setTimeout(() => {
          console.log("list: ", popupData);
          console.log("remove: ", newPopup.id);
          popupData = popupData.filter(popup => popup.id !== newPopup.id);
          console.log("removed list", popupData);
          setPopupList(popupData);
        }, 3000);
      }
    }, [dispatch, popupState, popupList]);
  
    const toastList = popupList.map((popup) => 
      <Toast
        key={popup.id}
        title={popup.title} 
        message={popup.message} 
        level={popup.level} />);
  
    return (
      <>
        <PageComponent />
        <div className="toast-list">
          {toastList}
        </div>
      </>
    )
  }

  return WithToastFc;
};

export default withToast;

  // class WithToast extends React.Component<MapState&MapDispatch> {
  //   state: State = {
  //     popupList: [],
  //   };

  //   componentDidUpdate() {
  //     const { popupList } = this.state;
  //     const { popup: popupState, closePopup } = this.props;
  //     console.log(popupState);
  //     if (popupState.visible) {
  //       const newPopup = { id: Math.random(), ...popupState };
  //       let newList = [...popupList, newPopup];
  //       console.log('create new Popup', newPopup);

  //       this.setState({
  //         popupList: newList,
  //       });
        
  //       console.log("set popup list");
  //       closePopup();
  //       console.log("dispatch close");

  //       setTimeout(() => {
  //         console.log("list: ", newList);
  //         console.log("remove: ", newPopup.id);
  //         newList = newList.filter(popup => popup.id !== newPopup.id);
  //         console.log("removed list", newList);
  //         this.setState({
  //           popupList: newList,
  //         })
  //       }, 3000);
  //     }
  //   }
  
  //   render() {
  //     const toastList = this.state.popupList.map((popup) => 
  //       <Toast
  //         key={popup.id}
  //         title={popup.title} 
  //         message={popup.message} 
  //         level={popup.level} />);

  //     return (
  //       <>
  //         <PageComponent />
  //         <div className="toast-list">
  //           {toastList}
  //         </div>
  //       </>
  //     )
  //   }
  // }

  // const mapStateToProps = (state: RootState): MapState => ({
  //   popup: state.core.popup,
  // });

  // const mapDispatchToProps = (dispatch: Dispatch): MapDispatch => ({
  //   closePopup: () => dispatch(closePopUp()),
  // });

  // return connect(mapStateToProps, mapDispatchToProps)(WithToast);

// const onRemovePopup = useCallback((id: number) => {
//   console.log("list: ", popupList);
//   console.log("remove: ", id);
//   const newList = popupList.filter(popup => popup.id !== id);
//   console.log("removed list", newList);
//   setPopupList(newList);
// }, [popupList]);