import React from 'react';
import styled from 'styled-components';
import { AllKnownMovesType } from '../utils/Types';

interface Props {
    allKnownMoves: AllKnownMovesType;
}

const AnalysisGraph = (props: Props) => {

    return (
        <StyledAnalysisGraph>
            <p>Analysis Graph</p>
        </StyledAnalysisGraph>
    )
};

const StyledAnalysisGraph = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
    height: 90%;
`;

export default AnalysisGraph;
