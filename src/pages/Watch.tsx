import React from 'react';
import styled from 'styled-components';
import SimpleBoard from '../components/SimpleBoard';
import { SquareType, XiangqiGameType } from '../utils/Types';
import { XiangqiViewer } from '../utils/xiangqi/Main';
import AnalysisMovesContainer from '../components/AnalysisMovesContainer';
import MoveHistory from '../components/MoveHistory';
import { AuthContext } from '../context/AuthContext';

const xiangqiViewer = new XiangqiViewer();

const Watch = () => {
    const { user, authTokens } = React.useContext(AuthContext);
    const [agame, setAgame] = React.useState<XiangqiGameType | null>(null);
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);
    const [myboard, setMyboard] = React.useState<SquareType[] | null>(null);
    const [myfen, setMyfen] = React.useState<string | null>(null);
    const [historyMoves, setHistoryMoves] = React.useState<string[]>([]);
    const [maxIndex, setMaxIndex] = React.useState<number>(0);
    const [hoverMove, setHoverMove] = React.useState<string | null>(null);

    const updateGameState = () => {
        setMyboard(xiangqiViewer.get_move_at(currentIndex));
        setMyfen(xiangqiViewer.get_fen_at(currentIndex));
    }

    React.useEffect(() => {
        updateGameState();
    }, [currentIndex]);

    const handleOnClickPiece = (rowIndex: number, colIndex: number) => {
        console.log(`rowIndex: ${rowIndex}, colIndex: ${colIndex}`);
    }

    const handlePreviousMove = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    }

    const handleNextMove = () => {
        if (currentIndex < xiangqiViewer.getMaxIndex()) {
            setCurrentIndex(currentIndex + 1);
        }
    }

    const updateCurrentIndex = (index: number) => {
        setCurrentIndex(index);
    }

    React.useEffect(() => {
        getRandomGame();
    }, []);

    React.useEffect(() => {
        console.log('got a game');
        if (agame) {
            xiangqiViewer.load_from_international_notation(agame.GAME.split(' '));
            updateGameState();
            setHistoryMoves(xiangqiViewer.get_list_international_notation());
            setCurrentIndex(0);
            setMaxIndex(xiangqiViewer.getMaxIndex());
        }
    }, [agame]);

    const getRandomGame = async () => {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}api/xnote/random`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access}`
            },
        });
        let data = await response.json();
        console.log(data);
        setAgame(data);
    }

    const handleOnClickMove = (uci: string) => {
        console.log('uci', uci);
    }

    const handleOnMouseOverMove = (uci: string) => {
        // e.preventDefault();
        // console.log('mouse over', uci);
        setHoverMove(uci);
    }

    const handleOnMouseOutMove = () => {
        // e.preventDefault();
        // console.log('mouse out', e);
        setHoverMove(null);
    }

    const uciToIndex = (uci: string): { startIndex: number, endIndex: number } => {
        const startRow = 9 - parseInt(uci[1]);
        const startCol = uci.charCodeAt(0) - 97;
        const endRow = 9 - parseInt(uci[3]);
        const endCol = uci.charCodeAt(2) - 97;

        const startIndex = startRow * 9 + startCol;
        const endIndex = endRow * 9 + endCol;
        return { startIndex, endIndex };
    }

    // keyboard listener
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                handlePreviousMove();
            } else if (event.key === 'ArrowRight') {
                handleNextMove();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [currentIndex]);

    return (
        <StyledWatch>
            <div className="xiangqi-watch-side">
                <div className="xiangqi-watch-side-header">
                    <div className="xiangqi-watch-side-header-color">
                        <div className="xiangqi-watch-side-header-color-white">
                            <span className="xiangqi-watch-side-header-color-label" >
                                {agame && agame.REDPLAYER}
                            </span>
                        </div>
                        <div className="xiangqi-watch-side-header-color-black">
                            <span className="xiangqi-watch-side-header-color-label" >
                                {agame && agame.BLACKPLAYER}
                            </span>
                        </div>
                    </div>
                    <div className="xiangqi-watch-side-header-buttons">
                        <div className="xiangqi-watch-side-header-button" onClick={getRandomGame}>
                            <span>Random</span>
                        </div>
                    </div>
                </div>
                <div className="xiangqi-watch-side-history-moves">
                    <MoveHistory historyMoves={historyMoves} handleClickAtIndex={updateCurrentIndex} currentIndex={currentIndex} />
                </div>
            </div>
            <div className="xiangqi-watch-board">
                {myboard && <SimpleBoard board={myboard} handleOnClick={handleOnClickPiece} />}
                <div className="xiangqi-watch-board-overlay"></div>
            </div>
            <div className="xiangqi-watch-analysis">
                {myfen && <AnalysisMovesContainer fen={myfen} handleOnClick={handleOnClickMove} handleOnMouseOver={handleOnMouseOverMove} handleOnMouseOut={handleOnMouseOutMove} />}
            </div>
        </StyledWatch>
    )
}

const StyledWatch = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;

    --whiteBg: #dad8d6;
    --whiteCl: #312e2b;
    --drawBg: #8b8987;
    --drawCl: #e7e6e5;
    --blackBg: #312e2b;
    --blackCl: hsla(0,0%,100%,.8);

    .xiangqi-watch-board {
        width: 50%;
        height: 100%;

        position: relative;

        .xiangqi-watch-board-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0);
            // border-radius: 10px;
        }
    }

    .xiangqi-watch-side {
        width: 25%;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .xiangqi-watch-side-header {
            width: 100%;
            height: 20%;

            display: flex;
            flex-direction: column;
            align-items: center;

            .xiangqi-watch-side-header-color {
                width: 90%;
                height: 100%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                // align-items: center;

                div {
                    user-select: none;
                    cursor: default;
                }

                .xiangqi-watch-side-header-color-white {
                    width: 50%;
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    background-color: var(--whiteBg);
                    color: var(--whiteCl);
                }

                .xiangqi-watch-side-header-color-black {
                    width: 50%;
                    height: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    background-color: var(--blackBg);
                    color: var(--blackCl);
                }

                .xiangqi-watch-side-header-color-label {
                    font-size: 1.1rem;
                    line-height: 2.3rem;
                    padding: 0 .5rem
                }
            }

            .xiangqi-watch-side-header-buttons {
                width: 90%;
                height: 100%;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.1);
                border-top: 1px solid rgba(0, 0, 0, 0.2);
                margin: 1rem 0 1rem 0;
    
                .xiangqi-watch-side-header-button {
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
        }

        .xiangqi-watch-side-history-moves {
            width: 100%;
            height: 80%;
        }
    }

    .xiangqi-watch-analysis {
        width: 25%;
        height: 100%;
    }
`;

export default Watch;