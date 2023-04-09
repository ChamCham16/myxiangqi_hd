import React from "react";
import styled from "styled-components";

interface Props {
    historyMoves: string[];
    handleClickAtIndex: (index: number) => void;
    currentIndex: number;
}

const MoveHistory = (props: Props) => {

    const handlePreviousMove = () => {
        if (props.currentIndex > 0) {
            props.handleClickAtIndex(props.currentIndex - 1);
        }
    }

    const handleNextMove = () => {
        if (props.currentIndex < props.historyMoves.length) {
            props.handleClickAtIndex(props.currentIndex + 1);
        }
    }

    const handleClickAtIndex = (index: number) => {
        if (index >= 0 && index <= props.historyMoves.length) {
            props.handleClickAtIndex(index);
        }
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
    }, [props.currentIndex]);

    return (
        <StyledMoveHistory>
            <div className="move-history-buttons">
                <div onClick={(e) => handleClickAtIndex(0)}>
                    <span className="move-history-button" >{`Start`}</span>
                </div>
                <div onClick={handlePreviousMove}>
                    <span className="move-history-button" >{`Prev`}</span>
                </div>
                <div onClick={handleNextMove}>
                    <span className="move-history-button" >{`Next`}</span>
                </div>
                <div onClick={(e) => handleClickAtIndex(props.historyMoves.length)}>
                    <span className="move-history-button" >{`End`}</span>
                </div>
            </div>
            <div className="move-history-notations">
                {
                    props.historyMoves.map((item, index) => {
                        let class_name = index % 2 === 0 ? "white" : "black";
                        if (index + 1 === props.currentIndex) {
                            class_name += " current";
                        }
                        return <div className={`${class_name}`} key={index} onClick={(e) => handleClickAtIndex(index + 1)}>
                            <span className="move-history-notation" >{item}</span>
                        </div>
                    })
                }
            </div>
        </StyledMoveHistory>
    )
}

const StyledMoveHistory = styled.div`
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;

    .move-history-buttons {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
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

    .move-history-notations {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        margin-bottom: 1rem;
        overflow: auto;
        // height: 100%;
        width: 90%;
        font-size: 1.1rem;
        font-weight: 600;
        user-select: none;
        cursor: pointer;

        --whiteBg: #dad8d6;
        --whiteCl: #312e2b;
        --drawBg: #8b8987;
        --drawCl: #e7e6e5;
        --blackBg: #312e2b;
        --blackCl: hsla(0,0%,100%,.8);

        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #dad8d6;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }

        div {
            margin-bottom: 1rem;
        }

        .white {
            width: 100%;
            text-align: center;
            background-color: var(--whiteBg);
            color: var(--whiteCl);
            // border-radius: 2rem 0 0 2rem;

            &:hover {
                background-color: var(--drawBg);
            }
        }

        .black {
            width: 100%;
            text-align: center;
            background-color: var(--blackBg);
            color: var(--blackCl);
            // border-radius: 0 2rem 2rem 0;

            &:hover {
                background-color: var(--drawBg);
            }
        }

        .white.current {
            color: #8db57a;

            span {
                border: 1px solid #8db57a;
            }
        }

        .black.current {
            color: #8db57a;

            span {
                border: 1px solid #8db57a;
            }
        }

        .move-history-notation {
            font-size: 1.1rem;
            line-height: 2.3rem;
            padding: 0 .5rem
        }
    }
`;

export default MoveHistory;