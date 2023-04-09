import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styled from 'styled-components';

const Nav = () => {
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <StyledNav className="navbar">
            <div className="container-fluid">
                <div>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/watch" className="nav-link">Watch</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/play" className="nav-link">Play</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/opening" className="nav-link">Opening</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <ul className="navbar-nav">
                        {/* if user not login, link to login and register. Else, link to profile and logout */}
                        {user.username ? (
                            <>
                                <li className="nav-item">
                                    <Link to="/profile" className="nav-link">{user.username}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/" className="nav-link" onClick={logoutUser}>Logout</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </StyledNav>
    )
};

const StyledNav = styled.nav`
    height: 100%;
    width: 100%;
    background-color: #f5f5f5;

    .container-fluid {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;

        .navbar-nav {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;

            .nav-item {
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                .nav-link {
                    color: black;
                    text-decoration: none;
                    padding: 0 1rem;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: all 0.3s ease;

                    &:hover {
                        background-color: #e0e0e0;
                        color: black;
                    }
                }
            }
        }
    }
`;

export default Nav;