import React from "react";
import styled from "styled-components";
import { AllKnownMovesType, XiangqiStateType } from '../utils/Types';
import AnalysisMoves from './AnalysisMoves';

interface Props {
    fen: string;
    handleOnClick: (uci: string) => void;
    handleOnMouseOver: (uci: string) => void;
    handleOnMouseOut: () => void;
}

const AnalysisMovesContainer = (props: Props) => {
    const [allKnownMoves, setAllKnownMoves] = React.useState<AllKnownMovesType>([]);
    const [isAnalyzing, setIsAnalyzing] = React.useState<boolean>(false);

    React.useEffect(() => {
        console.log('analyzing moves');
        handleAnalyze();
    }, [props.fen]);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        analyze(props.fen);
    }

    const analyze = async (fen: string) => {
        const url = `http://www.chessdb.cn/chessdb.php?action=queryall&board=${encodeURIComponent(fen)}`;
        // get the data from the url safely
        await fetch(url)
            .then(response => response.text())
            .then(data => {
                if (!data.includes('unknown')) {
                    // remove the last character (the problem is of chessdb)
                    data = data.substring(0, data.length - 1);

                    const __allKnownMoves = data.split('|').map((move: string) => {
                        const moveData = move.split(',');
                        const moveName = moveData[0] ? moveData[0].split(':')[1] : '';
                        const moveScore = moveData[1] ? moveData[1].split(':')[1] : '';
                        const moveRank = moveData[2] ? moveData[2].split(':')[1] : '';
                        const moveNote = moveData[3] ? moveData[3].split(':')[1] : '';
                        const moveWinrate = moveData[4] ? moveData[4].split(':')[1] : '';
                        return {
                            'name': moveName,
                            'score': Number(moveScore),
                            'rank': Number(moveRank),
                            'winrate': moveWinrate,
                            'note': moveNote
                        }
                    });
                    setAllKnownMoves(() => __allKnownMoves);
                }
                else {
                    setAllKnownMoves(() => []);
                }
            })
            .catch(error => {
                console.log('error', error);
            }
            );

        // q: ok, now that analyze is done, set isAnalyzing to false
        // a: ok
        setIsAnalyzing(false);
    };

    return <StyledAnalysisContainer>
        {isAnalyzing ? <p>analyzing...</p> : <AnalysisMoves allKnownMoves={allKnownMoves} handleOnClick={props.handleOnClick} handleOnMouseOver={props.handleOnMouseOver} handleOnMouseOut={props.handleOnMouseOut} />}
    </StyledAnalysisContainer>;
};

const StyledAnalysisContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
    height: 100%;
    // width: 100%;
`;

export default AnalysisMovesContainer;