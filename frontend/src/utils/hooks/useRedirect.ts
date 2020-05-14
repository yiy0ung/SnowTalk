import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { RootState } from "store/reducers";
import { resetUrl } from "store/reducers/core.reducer";

const useRedirect = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { pushUrl } = useSelector((state: RootState) => state.core);

  useEffect(() => {
    if (pushUrl !== '') {
      history.push(pushUrl);
      dispatch(resetUrl());
    }
  }, [dispatch, history, pushUrl]);
};

export default useRedirect;