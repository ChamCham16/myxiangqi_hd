import React from 'react';
import styled from 'styled-components';
import { AllKnownMovesType } from '../utils/Types';

interface Props {
    allKnownMoves: AllKnownMovesType;
    handleOnClick: (moveName: string) => void;
    handleOnMouseOver: (moveName: string) => void;
    handleOnMouseOut: () => void;
}

const AnalysisMoves = (props: Props) => {
    return (
        <StyledAnalysisMoves>
            <div className="analysis-header">
                <div>Move</div>
                <div>Score</div>
                <div>Rank</div>
                <div>Winrate</div>
                {/* <div>Note</div> */}
            </div>
            <div className="analysis-body">
                {props.allKnownMoves.map((move, index) => {
                    return (
                        <div
                            className="analysis-row"
                            onClick={() => props.handleOnClick(move.name)}
                            // on mouse over, say the move name
                            onMouseOver={() => props.handleOnMouseOver(move.name)}
                            // on mouse out, say nothing
                            onMouseOut={() => props.handleOnMouseOut()}
                            key={index}>
                            <div>
                                <span className="analysis-row-percent-label" >{move.name}</span>
                            </div>
                            <div>
                                <span className="analysis-row-percent-label" >{move.score}</span>
                            </div>
                            <div>
                                <span className="analysis-row-percent-label" >{move.rank}</span>
                            </div>
                            <div>
                                <span className="analysis-row-percent-label" >{move.winrate}</span>
                            </div>
                            {/* <div>{move.note}</div> */}
                        </div>
                    )
                })}
            </div>
        </StyledAnalysisMoves>
    )
};

const StyledAnalysisMoves = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
    height: 100%;
    
    .analysis-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        user-select: none;
        font-size: 1.1rem;
        font-weight: 600;
        color: #312e2b;
        border-bottom: 1px solid #dad8d6;

        div {
            height: 100%;
            width: 25%;
            text-align: center;
        }
    }

    .analysis-body {
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

        .analysis-row {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            border-radius: 20px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            
            &:nth-child(odd) {
                background-color: white;
            }

            div {
                height: 100%;
                width: 25%;
                text-align: center;
                border-right: 1px solid #dad8d6;

                .analysis-row-percent-label {
                    font-size: 1.1rem;
                    line-height: 2.3rem;
                    padding: 0 .5rem
                }

                &:last-child {
                    border-right: none;
                }
            }

            &:hover {
                background-color: #dad8d6;
            }
        }
    }
}
`;

export default AnalysisMoves;