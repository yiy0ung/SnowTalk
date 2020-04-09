import { useState, useCallback } from "react";

const useInput = (init: any) => {
  const [value, setValue] = useState<ReturnType<typeof init>>(init);

  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return { value, setValue, onChange };
};

export default useInput
