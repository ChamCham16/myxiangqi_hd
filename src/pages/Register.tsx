import React from "react";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const registerUser = async (e: any) => {
        e.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}api/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: e.target.username.value,
                email: e.target.email.value,
                password1: e.target.password1.value,
                password2: e.target.password2.value,
            }),
        });
        const data = await response.json();

        console.log(response.status);

        if (response.status === 201) {
            navigate("/login");
        } else {
            alert(data.message);
        }
    };

    return (
        <StyledRegister>
            <div className="form-signup">
                <form onSubmit={registerUser}>
                    <h1 className="form-header">Register</h1>
                    <input type="text" name='username' id="inputUsername" className="form-control" placeholder="Username" required />
                    <input type="email" name='email' id="inputEmail" className="form-control" placeholder="Email" required />
                    <input type="password" name='password1' id="inputPassword1" className="form-control" placeholder="Password" required />
                    <input type="password" name='password2' id="inputPassword2" className="form-control" placeholder="Confirm Password" required />
                    <button className="form-button" type="submit">Sign up</button>
                </form>
            </div>
        </StyledRegister>
    );
};

const StyledRegister = styled.div`
    .form-signup {
        width: 100%;
        max-width: 330px;
        padding: 15px;
        margin: auto;
    }

    .form-header {
        margin-bottom: 10px;
        font-weight: 400;
        line-height: 1.2;
        color: #495057;
        text-align: center;
    }

    .form-control {
        width: 100%;
        position: relative;
        box-sizing: border-box;
        height: auto;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ced4da;
        border-radius: 0.25rem;
        margin-bottom: 10px;
    }

    .form-button {
        width: 100%;
        padding: 10px;
        font-size: 16px;
        font-weight: 400;
        line-height: 1.2;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        user-select: none;
        border: 1px solid transparent;
        border-radius: 0.25rem;
        color: #fff;
        background-color: #007bff;
        border-color: #007bff;
        cursor: pointer;
    }
`;

export default Register;