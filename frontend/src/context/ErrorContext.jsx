import { useState, useCallback, createContext } from "react";

export const ErrorContext = createContext({
  error: undefined,
  addError: () => {},
  removeError: () => {},
});

const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(undefined);

  const removeError = () => setError(undefined);

  const addError = (error) => setError(error?.message);

  const contextValue = {
    error,
    addError: useCallback((error) => addError(error), []),
    removeError: useCallback(() => removeError(), []),
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorProvider;
