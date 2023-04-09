import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import { I_AM, RoomStateType, XIANGQI_STATUS } from '../utils/Types';
import { HumanPlayer, XiangqiViewer, GameStatus } from '../utils/xiangqi/Main';
import { SquareType } from '../utils/Types';
import SimpleBoard from '../components/SimpleBoard';
import MoveHistory from '../components/MoveHistory';

const xiangqiViewer = new XiangqiViewer();

const PlayVsHuman = () => {
    const { user, authTokens } = React.useContext(AuthContext);
    const [roomName, setRoomName] = React.useState<string | null>(null);
    const [roomSocket, setRoomSocket] = React.useState<WebSocket | null>(null);
    const location = useLocation();
    const [fenFormat, setFenFormat] = React.useState<'chessdb' | 'hdnum16'>('chessdb');
    const [myboard, setMyboard] = React.useState<SquareType[] | null>(xiangqiViewer.getBoard());
    const [myfen, setMyfen] = React.useState<string | null>(xiangqiViewer.getFen(fenFormat));
    const [gameStatus, setGameStatus] = React.useState<GameStatus | null>(null);
    const [roomState, setRoomState] = React.useState<RoomStateType | null>(null);
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
    const [whoAmI, setWhoAmI] = React.useState<I_AM>(I_AM.SPECTATOR);
    const [historyMoves, setHistoryMoves] = React.useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);
    const [maxIndex, setMaxIndex] = React.useState<number>(0);

    React.useEffect(() => {
        console.log('roomState', roomState);
    }, [roomState]);

    React.useEffect(() => {
        console.log('isPlaying changed')

        if (isPlaying && roomState?.white_player && roomState?.black_player) {
            console.log('start new game');
            const p1 = new HumanPlayer(true, roomState.white_player.username);
            const p2 = new HumanPlayer(false, roomState.black_player.username);
            xiangqiViewer.initializeGame(p1, p2);
            xiangqiViewer.load_from_fen(roomState.fen);
            updateBoard();
        }

        else {
            console.log('game status: ', roomState?.game_status);
        }
    }, [isPlaying]);

    const updateBoard = () => {
        setMyboard(xiangqiViewer.getBoard());
        setMyfen(xiangqiViewer.getFen(fenFormat));
        setGameStatus(xiangqiViewer.getStatus());
        setHistoryMoves(xiangqiViewer.get_list_international_notation());
        setCurrentIndex(xiangqiViewer.getMaxIndex());
        setMaxIndex(xiangqiViewer.getMaxIndex());
    }

    const updateOnlyBoard = () => {
        setMyboard(xiangqiViewer.getBoard());
    }

    const isMyTurn = (): boolean => {
        if (roomState) {
            if (roomState.is_white_turn && whoAmI === I_AM.WHITE) {
                return true;
            }
            else if (!roomState.is_white_turn && whoAmI === I_AM.BLACK) {
                return true;
            }
        }

        return false;
    }

    const handleOnClickPiece = (rowIndex: number, colIndex: number) => {
        if (currentIndex < maxIndex) {
            console.log('cannot move, you are in history mode');
            return;
        }

        if (whoAmI === I_AM.SPECTATOR) {
            console.log('you are spectator');
            return;
        }

        if (!isPlaying) {
            console.log('game not started')
            return;
        }

        if (!isMyTurn()) {
            console.log('not your turn')
            return;
        }

        // check status from backend
        if (roomState && roomState.game_status !== XIANGQI_STATUS.PLAYING) {
            console.log('game over')
            return;
        }

        // check status from frontend
        if (gameStatus !== GameStatus.PLAYING) {
            return;
        }

        const uci = xiangqiViewer.handleClick(rowIndex, colIndex, true);
        updateBoard();
        if (uci) {
            // send move to server
            if (roomSocket) {
                roomSocket.send(JSON.stringify({
                    'type': 'xiangqi_move',
                    'message': {
                        'uci': uci,
                    }
                }));
            }
        }
    }

    // get room and connect
    React.useEffect(() => {
        const params = new URLSearchParams(location.search);
        const room = params.get('room');
        if (room) {
            setRoomName(room);

            if (roomSocket) {
                roomSocket.close();
            }

            connectToRoom(room);
        }
    }, [location]);

    const connectToRoom = (slug: string) => {
        const url = `${process.env.REACT_APP_SOCKET_DOMAIN}ws/room/${slug}/`;
        const room_socket = new WebSocket(
            url + '?token=' + authTokens.access
        );

        room_socket.onopen = () => {
            console.log('connected to room');
        }

        room_socket.onmessage = handleMessage;

        room_socket.onclose = (e) => {
            console.log('Chat socket closed unexpectedly');
        };

        room_socket.onerror = (e) => {
            console.error('Chat socket error');
        };

        setRoomSocket(room_socket);
    }

    const handleMessage = (e: MessageEvent) => {
        const data = JSON.parse(e.data);
        console.log('Data:', data);

        if (data.type === 'room_state') {
            const curRoomState: RoomStateType = data.message;
            setRoomState(curRoomState);
            setIsPlaying(curRoomState.game_status === XIANGQI_STATUS.PLAYING);

            // handle start game
            if (!isPlaying) {
                if (curRoomState.white_player && curRoomState.white_player.username === user?.username) {
                    setWhoAmI(I_AM.WHITE);
                    xiangqiViewer.reverseBoard(false);
                    updateOnlyBoard();
                }
                else if (curRoomState.black_player && curRoomState.black_player.username === user?.username) {
                    setWhoAmI(I_AM.BLACK);
                    xiangqiViewer.reverseBoard(true);
                    updateOnlyBoard();
                }
                else {
                    setWhoAmI(I_AM.SPECTATOR);
                    xiangqiViewer.reverseBoard(false);
                    updateOnlyBoard();
                }
            }
        }

        else if (data.type === 'xiangqi_move') {
            const curRoomState: RoomStateType = data.message.room_state;
            setRoomState(curRoomState);
            setIsPlaying(curRoomState.game_status === XIANGQI_STATUS.PLAYING);

            if (myfen !== curRoomState.fen) {
                const uci = data.message.uci;
                const move_made = xiangqiViewer.make_move_from_uci(uci);
                if (!move_made) {
                    console.log('invalid move, try loading from fen!');
                    xiangqiViewer.load_from_fen(data.message.room_state.fen);
                }
                updateBoard();
            }
        }
    }

    const handleSetSide = (isWhite: boolean) => {
        if (isPlaying) {
            return;
        }

        if (roomSocket) {
            roomSocket.send(JSON.stringify({
                'type': 'xiangqi_side',
                'message': {
                    'isWhite': isWhite,
                }
            }));
        }
    }

    const handleReady = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const value = e.currentTarget.children[0].textContent;
        if (value === 'Start') {
            e.currentTarget.children[0].textContent = 'Waiting...';
        } else if (value === 'Waiting...') {
            e.currentTarget.children[0].textContent = 'Start';
        }
        

        if (roomSocket) {
            roomSocket.send(JSON.stringify({
                'type': 'xiangqi_ready',
                'message': 'ready',
            }));
        }
    }

    const handleResign = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (roomSocket) {
            roomSocket.send(JSON.stringify({
                'type': 'xiangqi_resign',
                'message': 'resign',
            }));
        }
    }

    // close the socket when the component unmounts
    React.useEffect(() => {
        return () => {
            if (roomSocket) {
                roomSocket.close();
            }
        }
    }, [roomSocket]);

    // For play-vs-human-history-moves component

    const updateCurrentIndex = (index: number) => {
        setCurrentIndex(index);
    }

    React.useEffect(() => {
        setMyboard(xiangqiViewer.get_move_at(currentIndex));
    }, [currentIndex]);

    return (
        <StyledPlayVsHuman>
            <div className="play-vs-human-history-moves">
                <MoveHistory historyMoves={historyMoves} handleClickAtIndex={updateCurrentIndex} currentIndex={currentIndex} />
            </div>
            <div className="play-vs-human-board">
                {myboard && <SimpleBoard board={myboard} handleOnClick={handleOnClickPiece} />}
                {(!isPlaying || currentIndex < maxIndex) && <div className="play-vs-human-board-overlay"></div>}
            </div>
            <div className="play-vs-human-side">
                <div className="play-vs-human-side-color">
                    <div className="play-vs-human-side-color-white" onClick={() => handleSetSide(true)}>
                        <span className="play-vs-human-side-color-label" >
                            {`${roomState?.white_player? roomState.white_player.username : '-.-'}`}
                        </span>
                    </div>
                    <div className="play-vs-human-side-color-black" onClick={() => handleSetSide(false)}>
                        <span className="play-vs-human-side-color-label" >
                            {`${roomState?.black_player? roomState.black_player.username : '-.-'}`}
                        </span>
                    </div>
                </div>
                <div className="play-vs-human-side-ready">
                    {(whoAmI !== I_AM.SPECTATOR && roomState?.game_status !== XIANGQI_STATUS.PLAYING && roomState?.white_player && roomState?.black_player) && (
                        <button className="play-vs-human-side-ready-button" onClick={(e) => handleReady(e)}>
                            <span>Start</span>
                        </button>
                    )}
                    {(whoAmI !== I_AM.SPECTATOR && isPlaying) && (
                        <button className="play-vs-human-side-ready-button" onClick={(e) => handleResign(e)}>
                            <span>Resign</span>
                        </button>
                    )}
                </div>
                <div className="play-vs-human-side-status">
                    {roomState?.game_status === XIANGQI_STATUS.PLAYING && (
                        <span>Playing</span>
                    )}
                    {roomState?.game_status === XIANGQI_STATUS.WAITING && (
                        <span>Waiting</span>
                    )}
                    {roomState?.game_status === XIANGQI_STATUS.DRAW && (
                        <span>Draw!</span>
                    )}
                    {roomState?.game_status === XIANGQI_STATUS.WHITEWIN && (
                        <span>White win!</span>
                    )}
                    {roomState?.game_status === XIANGQI_STATUS.BLACKWIN && (
                        <span>Black win!</span>
                    )}
                    {roomState?.game_status === XIANGQI_STATUS.WHITERESIGN && (
                        <span>Black win (white resign)!</span>
                    )}
                    {roomState?.game_status === XIANGQI_STATUS.BLACKRESIGN && (
                        <span>White win (black resign)!</span>
                    )}
                </div>
            </div>
        </StyledPlayVsHuman>
    )
};

const StyledPlayVsHuman = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
    height: 100%;

    --whiteBg: #dad8d6;
    --whiteCl: #312e2b;
    --drawBg: #8b8987;
    --drawCl: #e7e6e5;
    --blackBg: #312e2b;
    --blackCl: hsla(0,0%,100%,.8);

    .play-vs-human-history-moves {
        width: 25%;
        height: 100%;
    }

    .play-vs-human-board {
        width: 50%;
        height: 100%;

        position: relative;

        .play-vs-human-board-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.1);
            // border-radius: 10px;
        }
    }

    .play-vs-human-side {
        width: 25%;
        height: 100%;

        display: flex;
        flex-direction: column;
        // justify-content: center;
        align-items: center;

        .play-vs-human-side-color {
            width: 90%;
            height: 10%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            // align-items: center;

            div {
                user-select: none;
                cursor: pointer;
            }

            .play-vs-human-side-color-white {
                width: 50%;
                height: 100%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                background-color: var(--whiteBg);
                color: var(--whiteCl);

                &:hover {
                    width: 100%;
                    transition: width .3s;
                }
            }

            .play-vs-human-side-color-black {
                width: 50%;
                height: 100%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                background-color: var(--blackBg);
                color: var(--blackCl);

                &:hover {
                    width: 100%;
                    transition: width .3s;
                }
            }

            .play-vs-human-side-color-label {
                font-size: 1.1rem;
                line-height: 2.3rem;
                padding: 0 .5rem
            }
        }

        .play-vs-human-side-ready {
            width: 90%;
            height: 10%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.1);
            border-top: 1px solid rgba(0, 0, 0, 0.2);

            .play-vs-human-side-ready-button {
                user-select: none;
                cursor: pointer;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.1);

                &:hover {
                    background-color: rgba(0, 0, 0, 0.2);
                    transition: background-color .3s;
                }

                &:active {
                    background-color: rgba(0, 0, 0, 0.5);
                }

                span {
                    font-size: 1.1rem;
                    line-height: 2.3rem;
                    padding: 0 .5rem
                }
            }
        }

        .play-vs-human-side-status {
            width: 90%;
            height: 10%;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.1);
            border-top: 1px solid rgba(0, 0, 0, 0.2);

            span {
                font-size: 1.1rem;
                line-height: 2.3rem;
                padding: 0 .5rem
            }
        }
    }
`;

export default PlayVsHuman;