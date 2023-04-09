import React from 'react';
import styled from 'styled-components';
import { HumanPlayer, Game, GameStatus, XiangqiViewer } from '../utils/xiangqi/Main';
import SimpleBoard from '../components/SimpleBoard';
import MoveHistory from '../components/MoveHistory';
import AnalysisMovesContainer from '../components/AnalysisMovesContainer';
import AnlysisWinDrawLossContainer from '../components/AnalysisWinDrawLossContainer';
import { SquareType } from '../utils/Types';

const xiangqiViewer = new XiangqiViewer();
// const p1 = new HumanPlayer(true);
// const p2 = new HumanPlayer(false);
// xiangqiViewer.initializeGame(p1, p2);

const Opening = () => {
    const [myboard, setMyboard] = React.useState<SquareType[] | null>(null);
    const [myfen, setMyfen] = React.useState<string | null>(null);
    const [isWhiteTurn, setIsWhiteTurn] = React.useState<boolean>(true);
    const [gameStatus, setGameStatus] = React.useState<GameStatus | null>(null);
    const [hoverMove, setHoverMove] = React.useState<string | null>(null);
    const [fenFormat, setFenFormat] = React.useState<'chessdb' | 'hdnum16'>('chessdb');
    const [analysisMode, setAnalysisMode] = React.useState<'moves' | 'win_draw_loss'>('moves');
    const [historyMoves, setHistoryMoves] = React.useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);
    const [maxIndex, setMaxIndex] = React.useState<number>(0);

    React.useEffect(() => {
        updateBoard();
    }, []);

    const updateCurrentIndex = (index: number) => {
        setCurrentIndex(index);
    }

    React.useEffect(() => {
        setMyboard(xiangqiViewer.get_move_at(currentIndex));
        setMyfen(xiangqiViewer.get_fen_at(currentIndex, fenFormat));
    }, [currentIndex]);

    React.useEffect(() => {
        if (analysisMode === 'moves') {
            setFenFormat('chessdb');
        } else if (analysisMode === 'win_draw_loss') {
            setFenFormat('hdnum16');
        }
    }, [analysisMode]);

    React.useEffect(() => {
        console.log('update fen')
        setMyfen(xiangqiViewer.get_fen_at(currentIndex, fenFormat));
    }, [fenFormat]);

    const updateBoard = () => {
        setMyboard(xiangqiViewer.getBoard());
        setMyfen(xiangqiViewer.getFen(fenFormat));
        setGameStatus(xiangqiViewer.getStatus());
        setIsWhiteTurn(xiangqiViewer.isWhiteTurn());
        setHistoryMoves(xiangqiViewer.get_list_international_notation());
        setCurrentIndex(xiangqiViewer.getMaxIndex());
        setMaxIndex(xiangqiViewer.getMaxIndex());
    }

    const updateOnlyBoard = () => {
        setMyboard(xiangqiViewer.getBoard());
    }

    const handleUndoMove = () => {
        const undo_made = xiangqiViewer.undoMove();
        if (undo_made) {
            updateBoard();
        }
    }

    const handleReverseBoard = () => {
        xiangqiViewer.reverseBoard();
        updateOnlyBoard();
    }

    const handleResetGame = () => {
        xiangqiViewer.resetGame();
        updateBoard();
    }

    const handleOnClickPiece = (rowIndex: number, colIndex: number) => {
        if (currentIndex < maxIndex) {
            console.log('cannot move, you are in history mode');
            return;
        }

        if (gameStatus !== GameStatus.PLAYING) {
            console.log('game over')
        }

        const uci = xiangqiViewer.handleClick(rowIndex, colIndex, true);

        if (uci) {
            updateBoard();
        } else {
            updateOnlyBoard();
        }
    }

    const handleOnClickUciNotation = (uci: string) => {
        const move_made = xiangqiViewer.make_move_from_uci(uci);
        if (move_made) {
            updateBoard();
        }
    }

    const handleOnClickInternationalNotation = (internationalNotation: string) => {
        const move_made = xiangqiViewer.make_move_from_international_notation(internationalNotation);
        if (move_made) {
            updateBoard();
        }
    }

    const handleSwitchAnalysisMode = () => {
        if (analysisMode === 'moves') {
            setAnalysisMode('win_draw_loss');
        } else if (analysisMode === 'win_draw_loss') {
            setAnalysisMode('moves');
        }
    }

    const handleOnMouseOverMove = (uci: string) => {
        console.log('mouse over', uci);
        setHoverMove(uci);
    }

    const handleOnMouseOutMove = () => {
        console.log('mouse out');
        setHoverMove(null);
    }

    const uciToIndex = (uci: string): number[]  => {
        const fromRow = 9 - parseInt(uci[1]);
        const fromCol = uci.charCodeAt(0) - 97;
        const toRow = 9 - parseInt(uci[3]);
        const toCol = uci.charCodeAt(2) - 97;

        const fromIndex = fromRow * 9 + fromCol;
        const toIndex = toRow * 9 + toCol;
        return [fromIndex, toIndex];
    }

    return (
        <StyledOpening>
            <div className="xiangqi-opening-side">
                <div className="xiangqi-opening-side-header">
                    <div className="xiangqi-opening-side-header-buttons">
                        <div onClick={handleUndoMove}>
                            <span className="xiangqi-opening-side-header-button">Undo</span>
                        </div>
                        <div onClick={handleReverseBoard}>
                            <span className="xiangqi-opening-side-header-button">Flip</span>
                        </div>
                        <div onClick={handleResetGame}>
                            <span className="xiangqi-opening-side-header-button">Init</span>
                        </div>
                        <div onClick={handleSwitchAnalysisMode}>
                            <span className="xiangqi-opening-side-header-button">Switch</span>
                        </div>
                    </div>
                </div>
                <div className="xiangqi-opening-side-history-moves">
                    <MoveHistory historyMoves={historyMoves} handleClickAtIndex={updateCurrentIndex} currentIndex={currentIndex} />
                </div>
            </div>
            <div className="xiangqi-opening-board">
                {myboard && <SimpleBoard board={myboard} handleOnClick={handleOnClickPiece} />}
            </div>
            <div className="xiangqi-opening-analysis">
                {analysisMode === 'moves' && myfen && <AnalysisMovesContainer fen={myfen} handleOnClick={handleOnClickUciNotation} handleOnMouseOver={handleOnMouseOverMove} handleOnMouseOut={handleOnMouseOutMove} />}
                {analysisMode === 'win_draw_loss' && myfen && <AnlysisWinDrawLossContainer fen={myfen} handleOnClick={handleOnClickInternationalNotation} />}
            </div>
        </StyledOpening>
    )
}

const StyledOpening = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;

    .xiangqi-opening-side {
        width: 20%;
        height: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;

        .xiangqi-opening-side-header {
            width: 100%;
            // height: 10%;

            display: flex;
            justify-content: center;
            align-items: center;

            .xiangqi-opening-side-header-buttons {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                // margin-bottom: 1rem;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
                user-select: none;
                cursor: pointer;
        
                background-color: black;
                width: 90%;
        
                div {
                    width: 25%;
                    height: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #dad8d6;
                    color: #312e2b;
                    font-size: 1.1rem;
                    font-weight: 600;
                    border-right: 1px solid rgba(0, 0, 0, 0.2);
        
                    &:hover {
                        background-color: #8b8987;
                    }
        
                    &:active {
                        background-color: #312e2b;
                    }
                }
        
                div:last-child {
                    border-right: none;
                }
            }
        }

        .xiangqi-opening-side-history-moves {
            width: 100%;
            // height: 90%;
        }
    }

    .xiangqi-opening-board {
        width: 50%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .xiangqi-opening-analysis {
        width: 30%;
        height: 100%;
    }
`;

export default Opening;