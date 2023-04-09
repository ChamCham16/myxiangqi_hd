import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Constants } from '../utils/Constants';

interface Props {
    board: number[][]; // board state
    handleOnClick: (rowIndex: number, colIndex: number, color: string | null) => void;
}

const CoreBoard = (props: Props) => {
    const [height, setHeight] = useState<number>(0);
    const [width, setWidth] = useState<number>(0);
    const [squareSize, setSquareSize] = useState<number>(0);
    const boardRef = useRef<HTMLDivElement>(null);
    // ClickedPiece has the following structure: { rowIndex: number, colIndex: number, color: string | null }
    const [clickedPiece, setClickedPiece] = useState<{ rowIndex: number, colIndex: number, color: string | null } | null>(null);

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
        <StyledCoreBoard >
            <div className="xiangqi-board">
                <Constants.BOARD ref={boardRef} />
            </div>

            <div className="xiangqi-pieces">
                <div className="pieces-container">
                    {props.board.map((row, rowIndex) => {
                        return row.map((piece, pieceIndex) => {
                            const { color, type } = Constants.decodePiece(piece);
                            // set piece, if color or type is empty, piece is null
                            const Piece = color && type ? Constants.PIECES[color][type] : null;

                            return <div className="piece" key={`${rowIndex} ${pieceIndex}`} style={
                                {
                                    width: squareSize,
                                    height: squareSize,
                                }
                            } onClick={(e) => props.handleOnClick(rowIndex, pieceIndex, color)}
                            // onMouseEnter={(e) => console.log(`${color} ${type}`)}  
                            >
                                {
                                    Piece && <Piece />
                                }
                            </div>
                        }
                        )
                    })}
                </div>
            </div>
        </StyledCoreBoard>
    )
};

const StyledCoreBoard = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;

    .xiangqi-board {
        position: relative;
        height: 100%;
        width: 100%;

    
        & > svg {
            width: 100%;
            height: 100%;
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

                // &:hover {
                //     border: 4px dotted black;
                // }
                &:active {
                    background-color: wheat;
                }
                &:focus {
                    background-color: black;
                }
            }
        }
    }
`;

export default CoreBoard;