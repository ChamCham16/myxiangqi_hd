import React from 'react';
import styled from 'styled-components';
import { AllMovesPlayedByMastersType } from '../utils/Types';
import { AuthContext } from '../context/AuthContext';
import AnalysisWinDrawLoss from './AnalysisWinDrawLoss';

interface Props {
    fen: string;
    handleOnClick: (moveName: string) => void;
}

const AnlysisWinDrawLossContainer = (props: Props) => {
    const { authTokens } = React.useContext(AuthContext);
    const [allKnownMoves, setAllKnownMoves] = React.useState<AllMovesPlayedByMastersType>([]);
    const [isAnalyzing, setIsAnalyzing] = React.useState<boolean>(false);

    React.useEffect(() => {
        console.log('analyzing moves', 'startFen_' + props.fen + '_endFen');
        handleAnalyze();
    }, [props.fen]);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        analyze(props.fen);
    }

    const analyze = async (fen: string) => {
        let response = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}api/xnote/opening-book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens.access}`
            },
            body: JSON.stringify({
                fen: fen,
            }),
        });
        let data = await response.json();
        console.log(data);

        if (data) {
            setAllKnownMoves(data);
        }

        setIsAnalyzing(false);
    }

    React.useEffect(() => {
        console.log('allKnownMoves', allKnownMoves);
    }, [allKnownMoves]);

    return (
        <StyledAnalysisWinDrawLossContainer>
            {isAnalyzing ? <p>analyzing...</p> : <AnalysisWinDrawLoss allKnownMoves={allKnownMoves} handleOnClick={props.handleOnClick} />}
        </StyledAnalysisWinDrawLossContainer>
    )
}

const StyledAnalysisWinDrawLossContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
    height: 100%;
    width: 100%;
`;

export default AnlysisWinDrawLossContainer;