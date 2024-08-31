import { createContext } from "preact";
import { useContext, useMemo, useState } from "preact/hooks";

const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const memoized = useMemo(() => ({ user, setUser }), [user]);

  return (
    <UserContext.Provider value={memoized}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
