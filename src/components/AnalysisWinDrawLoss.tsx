import React from "react";
import styled from "styled-components";
import { AllMovesPlayedByMastersType } from "../utils/Types";

interface Props {
    allKnownMoves: AllMovesPlayedByMastersType;
    handleOnClick: (moveName: string) => void;
}

const AnalysisWinDrawLoss = (props: Props) => {
    return (
        <StyledAnalysisWinDrawLoss>
            {props.allKnownMoves.map((move, index) => {
                return (
                    <div className="statistic-row" key={index}>
                        <div className="statistic-row-move" onClick={() => props.handleOnClick(move.move)}>{move.move}</div>
                        {/* <div className="statistic-row-games">{move.games}</div> */}
                        <div className="statistic-row-component">
                            <div className="statistic-row-white" style={{ width: `${100 * move.wins / move.games}%` }}>
                                <span className="statistic-row-percent-label" >{move.wins}</span>
                            </div>
                            <div className="statistic-row-draw" style={{ width: `${100 * move.draws / move.games}%` }}>
                                <span className="statistic-row-percent-label" >{move.draws}</span>
                            </div>
                            <div className="statistic-row-black" style={{ width: `${100 * move.losses / move.games}%` }}>
                                <span className="statistic-row-percent-label" >{move.losses}</span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </StyledAnalysisWinDrawLoss>
    );
};

const StyledAnalysisWinDrawLoss = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
    height: 100%;
    overflow: auto;

    &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
            background-color: #dad8d6;
            width: 0.1rem;
            border-radius: 1rem;
        }
    }

    .statistic-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        user-select: none;

        .statistic-row-move {
            width: 20%;
            text-align: center;
            font-size: 1.1rem;
            // font-family: 'Courier New', Courier, monospace;
            border: 1px solid #e0e0e0;
            background-color: #f5f1f2;
            margin-left: 1rem;
            margin-right: 1rem;
            cursor: pointer;

            font-size: 1.1rem;
            font-weight: 600;

            &:hover {
                background-color: #e0e0e0;
            }

            &:active {
                background-color: #dad8d6;
            }
        }

        .statistic-row-games {
            width: 20%;
            text-align: center;
            font-size: 1.1rem;
            // font-family: 'Courier New', Courier, monospace;
            border: 1px solid #e0e0e0;
            background-color: #f5f1f2;
            margin-right: 1rem;
        }

        .statistic-row-component {
            width: 80%;
            height: 100%;

            --openingLink: #0b5987;
            --whiteBg: #dad8d6;
            --whiteCl: #312e2b;
            --drawBg: #8b8987;
            --drawCl: #e7e6e5;
            --blackBg: #312e2b;
            --blackCl: hsla(0,0%,100%,.8);
            border-radius: 10px;
            display: flex;
            flex-grow: 1;
            font-size: 1.1rem;
            font-weight: 600;
            overflow: hidden;

            div {
                height: 100%;
            }

            .statistic-row-white {
                background-color: var(--whiteBg);
                color: var(--whiteCl);
                text-align: left
            }
            
            .statistic-row-draw {
                background-color: var(--drawBg);
                color: var(--drawCl);
                text-align: center
            }
            
            .statistic-row-black {
                background-color: var(--blackBg);
                color: var(--blackCl);
                text-align: right
            }

            .statistic-row-percent-label {
                font-size: 1.1rem;
                line-height: 2.3rem;
                padding: 0 .5rem
            }
        }
    }
`;

export default AnalysisWinDrawLoss;