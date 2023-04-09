import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Constants } from '../utils/Constants';
import { SquareType } from '../utils/Types';
import { Board } from '../utils/xiangqi/Main';

interface Props {
    board: SquareType[];
    handleOnClick: (rowIndex: number, colIndex: number) => void;
    
}

const SimpleBoard = (props: Props) => {
    const [height, setHeight] = useState<number>(0);
    const [width, setWidth] = useState<number>(0);
    const [squareSize, setSquareSize] = useState<number>(0);
    const boardRef = useRef<HTMLDivElement>(null);

    // say something when board changes
    React.useEffect(() => {
        console.log('board changed');
    }, [props.board]);

    useEffect(() => {
        if (boardRef.current) {
            setHeight(boardRef.current.clientHeight);
            setWidth(boardRef.current.clientWidth);

            updateSquareSize(boardRef.current.clientHeight, boardRef.current.clientWidth);
        }
    }, [boardRef]);

    // set height and square size on window resize
    useEffect(() => {
        const handleResize = () => {
            if (boardRef.current) {
                setHeight(boardRef.current.clientHeight);
                setWidth(boardRef.current.clientWidth);

                updateSquareSize(boardRef.current.clientHeight, boardRef.current.clientWidth);
            }
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [boardRef]);

    const updateSquareSize = (height: number, width: number) => {
        let squareSizeBasedOnHeight = height / 10.5;
        let squareSizeBasedOnWidth = width / 9.5;

        // set square size based on which is smaller
        if (squareSizeBasedOnHeight < squareSizeBasedOnWidth) {
            setSquareSize(squareSizeBasedOnHeight);
        } else {
            setSquareSize(squareSizeBasedOnWidth);
        }
    };

    return (
        <StyledSimpleBoard >
            <div className="xiangqi-board">
                <Constants.BOARD ref={boardRef} />
            </div>

            <div className="xiangqi-pieces">
                <div className="pieces-container">
                    {
                        props.board.map((square, squareIndex) => {
                            const color = square.color;
                            const type = square.type
                            const indexRow = square.row;
                            const indexCol = square.col;
                            const appendix = square.appendix ? square.appendix : '';

                            const Piece = color && type ? Constants.PIECES[color][type] : null;

                            return <div className={`piece ${appendix}`} key={`${indexRow} ${indexCol}`} style={
                                {
                                    width: squareSize,
                                    height: squareSize,
                                }
                            } onClick={(e) => props.handleOnClick(indexRow, indexCol)}
                            >
                                {
                                    Piece && <Piece />
                                }
                            </div>
                        }
                        )
                    }
                </div>
            </div>
        </StyledSimpleBoard>
    )
};

const StyledSimpleBoard = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;

    .xiangqi-board {
        position: relative;
        height: 100%;
        // width: 100%;
    
        & > svg {
            width: 100%;
            height: 100%;
            border-radius: 10px;
        }
    }

    .xiangqi-pieces {
        position: absolute;
        // width: 100%;
        // height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .pieces-container {
            display: grid;
            grid-template-columns: repeat(9, 1fr);

            .piece {
                display: flex;
                justify-content: center;
                align-items: center;

                &:active {
                    background-color: wheat;
                }
                &:focus {
                    background-color: black;
                }
            }

            .last-move-start {
                // a small square around the piece, to indicate the start of the last move
                &::after {
                    content: '';
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: wheat;
                }
            }

            .last-move-end {
                background-color: wheat;
                border-radius: 10px;
            }

            .possible-move {
                // a small circle in the middle of the square
                &::after {
                    content: '';
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: black;
                }
            }

            .hover-move-start {
                &::after {
                    content: '';
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: wheat;
                }
            }

            .hover-move-end {
                &::after {
                    content: '';
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: black;
                }
            }
        }
    }
`;

export default SimpleBoard;