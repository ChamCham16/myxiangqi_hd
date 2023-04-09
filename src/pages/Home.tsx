import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { user, authTokens } = useContext(AuthContext);

    return (
        <StyledHome>
            <div className='xiangqi-info'>
                {`Hello, ${user && user.username}!`}
            </div>
        </StyledHome>
    )
};

const StyledHome = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
    height: 100%;

    .xiangqi-info {
        width: 10%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .xiangqi-game-view {
        width: 90%;
        height: 100%;
    }
`;

export default Home;