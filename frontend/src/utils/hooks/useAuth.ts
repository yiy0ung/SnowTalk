import { useEffect } from "react";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "store/reducers";
import { existToken } from "utils/token";
import link from "config/link";

const useAuth = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { isLogin } = useSelector((store: RootState) => store.member);

  useEffect(() => {
    const notToken = existToken() === null;

    if (!isLogin && notToken) {
      history.push(link.sign);
    }
  }, [dispatch, history, isLogin]);
};

export default useAuth;
