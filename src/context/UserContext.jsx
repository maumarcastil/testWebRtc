import { createContext, useEffect, useState } from "react";
import uuid from "react-native-uuid";
import { localStorage } from "../utils/localStorage";

export const UserContext = createContext({
    userId: "",
    userName: "",
    setUserName: (userName) => {},
});

export const UserProvider = ({ children }) => {
    const [userId] = useState(uuid.v4());
    const [userName, setUserName] = useState("")

    useEffect(() => {
        localStorage.setItem("userName", userName);
    }, [userName]);

    useEffect(() => {
        localStorage.setItem("userId", userId);
    }, [userId]);

    return (
        <UserContext.Provider value={{ userId, userName, setUserName }}>
            {children}
        </UserContext.Provider>
    );
};
