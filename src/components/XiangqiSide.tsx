import React from 'react';
import styled from 'styled-components';
import { MainXiangqiStateType } from '../utils/Types';

interface Props {
  roomSocket: WebSocket | null;
  xiangqiState: MainXiangqiStateType;
}

const XiangqiSide = (props: Props) => {
  const handleColor = (color: string) => {
    // send color to room
    if (props.roomSocket) {
      props.roomSocket.send(JSON.stringify({
        'type': 'xiangqi_color',
        'message': color
      }));
    }
  }

  const handleStart = () => {
    console.log('start clicked');
    // if white and black are set, send start to room
    if (props.roomSocket && props.xiangqiState.white && props.xiangqiState.black && (props.xiangqiState.isWhite || props.xiangqiState.isBlack)) {
      props.roomSocket.send(JSON.stringify({
        'type': 'xiangqi_start',
        'message': 'start'
      }));
    }
  }

  return (
    <StyledXiangqiSide>
      <button id='white-button' onClick={() => handleColor('white')}>{`Red: ${props.xiangqiState.white_name}`}</button>
      <button id='black-button' onClick={() => handleColor('black')}>{`Black: ${props.xiangqiState.black_name}`}</button>
      {/* check if white and black is set then add button start */}
      {props.xiangqiState.white && props.xiangqiState.black && !props.xiangqiState.isStarted && (
        <button onClick={handleStart}>Start</button>
      )}
      {/* if game started, show something */}
      {props.xiangqiState.isStarted && (
        <div>
          <p>Game started</p>
          <p>White: {props.xiangqiState.white}</p>
          <p>Black: {props.xiangqiState.black}</p>
        </div>
      )}
    </StyledXiangqiSide>
  )
};

const StyledXiangqiSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;

  button {
    width: 100%;
    height: 50px;
    margin: 10px;
  }

  #white-button {
    // beauty red color
    background-color: #ff4d4d;

    &:hover {
      background-color: #ff4d4d;
    }

    &:active {
      background-color: #ff1a1a;
    }
  }

  #black-button {
    // dark color (lighter than black)
    background-color: #4d4d4d;

    &:hover {
      background-color: #4d4d4d;
    }

    &:active {
      background-color: #1a1a1a;
    }
`;

export default XiangqiSide;