import { Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = (props: any) => {
    let { user } = useContext(AuthContext);
    const isLoggedIn = true; // localStorage.getItem('token');
    return user.username ? props.children : <Navigate to="/login" />;
};

export default PrivateRoute;