import React, { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

type UserType = {
    username?: string;
    user_id?: number;
};

type AuthTokensType = {
    access: string;
    refresh: string;
};

type AuthContextType = {
    user: UserType;
    authTokens: AuthTokensType;
    loginUser: (e: any) => void;
    logoutUser: () => void;
};

const initialState: AuthContextType = {
    user: {},
    authTokens: { access: "", refresh: "" },
    loginUser: (e: any) => { },
    logoutUser: () => { },
};

export const AuthContext = createContext<AuthContextType>(initialState);

export const AuthProvider = (props: any) => {
    let [authTokens, setAuthTokens] = useState(localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens") || "") : "");
    let [user, setUser] = useState(localStorage.getItem("authTokens") ? jwt_decode(JSON.parse(localStorage.getItem("authTokens") || "").access) : {});
    let [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // post request to login
    let loginUser = async (e: any) => {
        e.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}api/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value,
            }),
        });
        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
            navigate("/");
        } else {
            alert(data.message);
        }
    };

    let logoutUser = () => {
        setAuthTokens("");
        setUser({});
        localStorage.removeItem("authTokens");
        navigate("/login");
    };

    let updateTokens = async () => {
        console.log('update tokens')
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}api/users/login/refresh`, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh: authTokens.refresh,
            }),
        });
        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
        } else {
            logoutUser();
        }
    }

    useEffect(() => {
        if (authTokens) {
            const interval = setInterval(() => {
                updateTokens();
            }, 1000 * 60 * 4);
            return () => clearInterval(interval);
        }
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider
            value={{
                user: user,
                authTokens: authTokens,
                loginUser: loginUser,
                logoutUser: logoutUser,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};