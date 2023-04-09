const Board = require('../assets/board.svg');

const BlackAdvisor = require('../assets/pieces/black/advisor.svg');
const BlackCannon = require('../assets/pieces/black/cannon.svg');
const BlackChariot = require('../assets/pieces/black/chariot.svg');
const BlackElephant = require('../assets/pieces/black/elephant.svg');
const BlackGeneral = require('../assets/pieces/black/general.svg');
const BlackHorse = require('../assets/pieces/black/horse.svg');
const BlackSoldier = require('../assets/pieces/black/soldier.svg');
const RedAdvisor = require('../assets/pieces/red/advisor.svg');
const RedCannon = require('../assets/pieces/red/cannon.svg');
const RedChariot = require('../assets/pieces/red/chariot.svg');
const RedElephant = require('../assets/pieces/red/elephant.svg');
const RedGeneral = require('../assets/pieces/red/general.svg');
const RedHorse = require('../assets/pieces/red/horse.svg');
const RedSoldier = require('../assets/pieces/red/soldier.svg');

export class Constants {
    public static readonly INITIAL_BOARD = [
        [141, 151, 131, 121, 111, 122, 132, 152, 142],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 161, 0, 0, 0, 0, 0, 162, 0],
        [101, 0, 102, 0, 103, 0, 104, 0, 105],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [201, 0, 202, 0, 203, 0, 204, 0, 205],
        [0, 261, 0, 0, 0, 0, 0, 262, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [241, 251, 231, 221, 211, 222, 232, 252, 242]
    ];

    public static readonly pieceTypeMap = {
        0: 'soldier',
        1: 'general',
        2: 'advisor',
        3: 'elephant',
        4: 'chariot',
        5: 'horse',
        6: 'cannon'
    } as { [key: number]: string };

    public static readonly pieceColorMap = {
        1: 'black',
        2: 'white'
    } as { [key: number]: string };

    public static decodePiece(piece: number): { color: string | null, type: string | null } {
        if (piece === 0) {
            return { color: null, type: null };
        }
        else {
            const pieceInfo = String(piece).split('');
            const pieceColor = this.pieceColorMap[Number(pieceInfo[0])];
            const pieceType = this.pieceTypeMap[Number(pieceInfo[1])];
            return { color: pieceColor, type: pieceType };
        }
    }

    public static readonly BOARD = Board.ReactComponent;

    public static readonly PIECES = {
        black: {
            advisor: BlackAdvisor.ReactComponent,
            cannon: BlackCannon.ReactComponent,
            chariot: BlackChariot.ReactComponent,
            elephant: BlackElephant.ReactComponent,
            general: BlackGeneral.ReactComponent,
            horse: BlackHorse.ReactComponent,
            soldier: BlackSoldier.ReactComponent
        } as { [key: string]: React.FC },
        white: {
            advisor: RedAdvisor.ReactComponent,
            cannon: RedCannon.ReactComponent,
            chariot: RedChariot.ReactComponent,
            elephant: RedElephant.ReactComponent,
            general: RedGeneral.ReactComponent,
            horse: RedHorse.ReactComponent,
            soldier: RedSoldier.ReactComponent
        } as { [key: string]: React.FC }
    } as { [key: string]: { [key: string]: React.FC } };
}