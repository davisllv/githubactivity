import React, { createContext, useContext, useState } from "react";
import { IData } from "../Pages/Homepage";

export interface IAppContext {
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  repositoryName: string;
  setRepositoryName: React.Dispatch<React.SetStateAction<string>>;
  userDataList: Array<IData>;
  setUserDataList: React.Dispatch<React.SetStateAction<IData[]>>;
}

export const AppContext = createContext({} as IAppContext);
const AppProvider: React.FC = ({ children }) => {
  const [userName, setUserName] = useState("");
  const [repositoryName, setRepositoryName] = useState("");
  const [userDataList, setUserDataList] = useState<IData[]>([]);
  return (
    <AppContext.Provider
      value={{
        userName,
        setUserName,
        repositoryName,
        setRepositoryName,
        userDataList,
        setUserDataList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export function useAppContext(): IAppContext {
  const context = useContext(AppContext);
  return context;
}
export default AppProvider;
