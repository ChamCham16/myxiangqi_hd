import React from 'react';
import styled from 'styled-components';
import { XiangqiStateType, ScoresType } from '../utils/Types';

interface Props {
    fen: string;
}

const AnalysisGraphContainer = (props: Props) => {
    const [scores, setScores] = React.useState<ScoresType>([]);
    const [isAnalyzing, setIsAnalyzing] = React.useState<boolean>(false);

    React.useEffect(() => {
        console.log('analyzing score');
        handleAnalyze();
    }, [props.fen]);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        analyze(props.fen);
    }

    React.useEffect(() => {
        console.log('scores', scores);
    }, [scores]);

    const analyze = async (fen: string) => {
        const url = `http://www.chessdb.cn/chessdb.php?action=queryscore&board=${encodeURIComponent(fen)}`;
        // get the data from the url safely
        await fetch(url)
            .then(response => response.text())
            .then(data => {
                // check if 'unknown' is in the data
                if (!data.includes('unknown')) {
                    let raw_score = data.split(':')[1];
                    raw_score = raw_score.substring(0, raw_score.length - 1);
                    const score = Number(raw_score);
                    setScores((scores) => [...scores, { fen: fen, score: score }]);
                }
            })
            .catch(error => {
                console.log('error', error);
            }
            );

        setIsAnalyzing(false);
    }

    return (
        <StyledAnalysisGraphContainer>
            <p>Analysis Graph Container</p>
        </StyledAnalysisGraphContainer>
    )
};

const StyledAnalysisGraphContainer = styled.div`
`;

export default AnalysisGraphContainer;