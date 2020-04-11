import { useEffect } from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";

import { RootState } from "store/reducers";
import { existToken } from "utils/token";
import link from "config/link";

const useAuth = () => {
  const { isLogin } = useSelector((store: RootState) => store.member);
  const history = useHistory();

  useEffect(() => {
    const notToken = existToken() === null;

    if (!isLogin && notToken) {
      history.push(link.sign);
    }
  }, [history, isLogin]);
};

export default useAuth;
