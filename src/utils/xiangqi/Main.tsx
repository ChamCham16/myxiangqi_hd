import { SquareType } from "../Types";

export class Square {
    // row: top -> down: 0 -> 9
    // col: left -> right: 0 -> 8

    private _piece: Piece | null = null;
    private _row: number;
    private _col: number;

    constructor(row: number, col: number, piece: Piece | null = null) {
        this._row = row;
        this._col = col;
        this._piece = piece;
    }

    public setPiece(piece: Piece | null) {
        this._piece = piece;
    }

    public getPiece(): Piece | null {
        return this._piece;
    }

    public isPiece(pieceType: string, white: boolean): boolean {
        if (this._piece) {
            return this._piece.getType() === pieceType && this._piece.isWhite() === white;
        }
        return false;
    }

    public setRow(row: number) {
        this._row = row;
    }

    public getRow(): number {
        return this._row;
    }

    public setCol(col: number) {
        this._col = col;
    }

    public getCol(): number {
        return this._col;
    }

    public getType(): string | null {
        if (this._piece) {
            return this._piece.getType();
        }
        return null;
    }

    public getColor(): string | null {
        if (this._piece) {
            return this._piece.isWhite() ? 'white' : 'black';
        }
        return null;
    }

    public getIdentifier(): string | null {
        if (this._piece) {
            return this._piece.getIdentifier();
        }
        return null;
    }

    public isOccupied(): boolean {
        return this._piece !== null;
    }

    public getUci(): string {
        // row: bottom -> up: 0 -> 9
        // col: left -> right: 'a' -> 'i'
        return String.fromCharCode(97 + this._col) + (9 - this._row);
    }
}

export abstract class Piece {
    private _killed: boolean = false;
    private _white: boolean = false;
    private _identifier: string = '.';

    constructor(white: boolean) {
        this._white = white;
    }

    public isWhite(): boolean {
        return this._white;
    }

    public setWhite(white: boolean) {
        this._white = white;
    }

    public isKilled(): boolean {
        return this._killed;
    }

    public setKilled(killed: boolean) {
        this._killed = killed;
    }

    public getIdentifier(): string {
        return this._identifier;
    }

    public setIdentifier(identifier: string) {
        this._identifier = identifier;
    }

    public getType(): string {
        return this.constructor.name.toLowerCase();
    }

    public abstract canMove(board: Board, start: Square, end: Square): boolean;

    public static createPiece(identifier: string): Piece {
        if (identifier.toLowerCase() === 'k') {
            return new General(identifier === identifier.toUpperCase());
        } else if (identifier.toLowerCase() === 'a') {
            return new Advisor(identifier === identifier.toUpperCase());
        } else if (identifier.toLowerCase() === 'b') {
            return new Elephant(identifier === identifier.toUpperCase());
        } else if (identifier.toLowerCase() === 'n') {
            return new Horse(identifier === identifier.toUpperCase());
        } else if (identifier.toLowerCase() === 'r') {
            return new Chariot(identifier === identifier.toUpperCase());
        } else if (identifier.toLowerCase() === 'c') {
            return new Cannon(identifier === identifier.toUpperCase());
        } else if (identifier.toLowerCase() === 'p') {
            return new Soldier(identifier === identifier.toUpperCase());
        } else {
            throw new Error('Invalid fen');
        }
    }
}

export class Soldier extends Piece {
    constructor(white: boolean) {
        super(white);
        this.setIdentifier('p');
    }

    public canMove(board: Board, start: Square, end: Square): boolean {
        if (this.isKilled()) {
            return false;
        }

        if (this.isWhite()) {
            // move forward
            if (end.getRow() === start.getRow() - 1 && end.getCol() === start.getCol()) {
                return true;
            }
            // move left or right (cross river)
            if (end.getRow() === start.getRow() && Math.abs(end.getCol() - start.getCol()) === 1 && start.getRow() <= 4) {
                return true;
            }
        } else {
            // move forward
            if (end.getRow() === start.getRow() + 1 && end.getCol() === start.getCol()) {
                return true;
            }
            // move left or right (cross river)
            if (end.getRow() === start.getRow() && Math.abs(end.getCol() - start.getCol()) === 1 && start.getRow() >= 5) {
                return true;
            }
        }

        return false;
    }
}

export class Cannon extends Piece {
    constructor(white: boolean) {
        super(white);
        this.setIdentifier('c');
    }

    public canMove(board: Board, start: Square, end: Square): boolean {
        if (this.isKilled()) {
            return false;
        }

        if (end.isOccupied()) {
            if (start.getRow() === end.getRow()) {
                // check if there is only one piece in between
                let count = 0;
                for (let i = Math.min(start.getCol(), end.getCol()) + 1; i < Math.max(start.getCol(), end.getCol()); i++) {
                    if (board.isOccupiedAt(start.getRow(), i)) {
                        count++;
                    }
                }
                return count === 1;
            }
            else if (start.getCol() === end.getCol()) {
                // check if there is only one piece in between
                let count = 0;
                for (let i = Math.min(start.getRow(), end.getRow()) + 1; i < Math.max(start.getRow(), end.getRow()); i++) {
                    if (board.isOccupiedAt(i, start.getCol())) {
                        count++;
                    }
                }
                return count === 1;
            }
        }
        else {
            if (start.getRow() === end.getRow()) {
                // check if there is any piece in between
                for (let i = Math.min(start.getCol(), end.getCol()) + 1; i < Math.max(start.getCol(), end.getCol()); i++) {
                    if (board.isOccupiedAt(start.getRow(), i)) {
                        return false;
                    }
                }
                return true;
            }
            else if (start.getCol() === end.getCol()) {
                // check if there is any piece in between
                for (let i = Math.min(start.getRow(), end.getRow()) + 1; i < Math.max(start.getRow(), end.getRow()); i++) {
                    if (board.isOccupiedAt(i, start.getCol())) {
                        return false;
                    }
                }
                return true;
            }
        }

        return false;
    }
}

export class Chariot extends Piece {
    constructor(white: boolean) {
        super(white);
        this.setIdentifier('r');
    }

    public canMove(board: Board, start: Square, end: Square): boolean {
        if (this.isKilled()) {
            return false;
        }

        // check if on one row or one column
        if (start.getRow() === end.getRow()) {
            // check if there is any piece in between
            for (let i = Math.min(start.getCol(), end.getCol()) + 1; i < Math.max(start.getCol(), end.getCol()); i++) {
                if (board.isOccupiedAt(start.getRow(), i)) {
                    return false;
                }
            }
            return true;
        }
        else if (start.getCol() === end.getCol()) {
            // check if there is any piece in between
            for (let i = Math.min(start.getRow(), end.getRow()) + 1; i < Math.max(start.getRow(), end.getRow()); i++) {
                if (board.isOccupiedAt(i, start.getCol())) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }
}

export class Horse extends Piece {
    constructor(white: boolean) {
        super(white);
        this.setIdentifier('n');
    }

    public canMove(board: Board, start: Square, end: Square): boolean {
        if (this.isKilled()) {
            return false;
        }

        if (Math.abs(end.getCol() - start.getCol()) === 1 && Math.abs(end.getRow() - start.getRow()) === 2) {
            if (!board.isOccupiedAt((end.getRow() + start.getRow()) / 2, start.getCol())) {
                return true;
            }
        }
        else if (Math.abs(end.getCol() - start.getCol()) === 2 && Math.abs(end.getRow() - start.getRow()) === 1) {
            if (!board.isOccupiedAt(start.getRow(), (end.getCol() + start.getCol()) / 2)) {
                return true;
            }
        }
        return false;
    }
}

export class Elephant extends Piece {
    constructor(white: boolean) {
        super(white);
        this.setIdentifier('b');
    }

    public canMove(board: Board, start: Square, end: Square): boolean {
        if (this.isKilled()) {
            return false;
        }

        if (this.isWhite()) {
            if (end.getRow() >= 5) {
                if (Math.abs(end.getCol() - start.getCol()) === 2 && Math.abs(end.getRow() - start.getRow()) === 2) {
                    if (!board.isOccupiedAt((end.getRow() + start.getRow()) / 2, (end.getCol() + start.getCol()) / 2)) {
                        return true;
                    }
                }
            }
        } else {
            if (end.getRow() <= 4) {
                if (Math.abs(end.getCol() - start.getCol()) === 2 && Math.abs(end.getRow() - start.getRow()) === 2) {
                    if (!board.isOccupiedAt((end.getRow() + start.getRow()) / 2, (end.getCol() + start.getCol()) / 2)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }
}

export class Advisor extends Piece {
    constructor(white: boolean) {
        super(white);
        this.setIdentifier('a');
    }

    public canMove(board: Board, start: Square, end: Square): boolean {
        if (this.isKilled()) {
            return false;
        }

        if (this.isWhite()) {
            if (end.getRow() >= 7 && end.getRow() <= 9 && end.getCol() >= 3 && end.getCol() <= 5) {
                if (Math.abs(end.getCol() - start.getCol()) === 1 && Math.abs(end.getRow() - start.getRow()) === 1) {
                    return true;
                }
            }
        } else {
            if (end.getRow() >= 0 && end.getRow() <= 2 && end.getCol() >= 3 && end.getCol() <= 5) {
                if (Math.abs(end.getCol() - start.getCol()) === 1 && Math.abs(end.getRow() - start.getRow()) === 1) {
                    return true;
                }
            }
        }

        return false;
    }
}

export class General extends Piece {
    constructor(white: boolean) {
        super(white);
        this.setIdentifier('k');
    }

    public canMove(board: Board, start: Square, end: Square): boolean {
        if (this.isKilled()) {
            return false;
        }

        if (this.isWhite()) {
            if (end.getRow() >= 7 && end.getRow() <= 9 && end.getCol() >= 3 && end.getCol() <= 5) {
                if (Math.abs(end.getCol() - start.getCol()) + Math.abs(end.getRow() - start.getRow()) === 1) {
                    return true;
                }
            }
        } else {
            if (end.getRow() >= 0 && end.getRow() <= 2 && end.getCol() >= 3 && end.getCol() <= 5) {
                if (Math.abs(end.getCol() - start.getCol()) + Math.abs(end.getRow() - start.getRow()) === 1) {
                    return true;
                }
            }
        }

        return false;
    }
}

export class Board {
    private _squares: Square[][] = [];

    constructor(board_fen: string) {
        this.initBoardFromFen(board_fen);
    }

    public getSquare(row: number, col: number): Square {
        return this._squares[row][col];
    }

    public getSquareFromUci(uci: string): Square {
        const row = 9 - parseInt(uci[1], 10);
        const col = uci.charCodeAt(0) - 'a'.charCodeAt(0);
        return this.getSquare(row, col);
    }

    public getGeneral(white: boolean): Square | null {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 9; j++) {
                const square = this.getSquare(i, j);
                if (square.isOccupied()) {
                    const piece = square.getPiece();
                    if (piece instanceof General && piece.isWhite() === white) {
                        return square;
                    }
                }
            }
        }
        return null;
    }

    public isOccupiedAt(row: number, col: number): boolean {
        return this._squares[row][col].isOccupied();
    }

    public initBoardFromFen(fen: string) {
        const rows = fen.split('/');
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const squares: Square[] = [];
            let col = 0;
            for (let j = 0; j < row.length; j++) {
                const piece = row[j];
                if (piece >= '1' && piece <= '9') {
                    for (let k = 0; k < Number(piece); k++) {
                        squares.push(new Square(i, col, null));
                        col++;
                    }
                } else {
                    squares.push(new Square(i, col, Piece.createPiece(piece)));
                    col++;
                }
            }
            this._squares.push(squares);
        }
    }

    public getBoardFen(): string {
        let fen = '';
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const square = this.getSquare(row, col);
                const piece = square.getPiece();
                if (piece) {
                    fen += piece.isWhite() ? piece.getIdentifier().toUpperCase() : piece.getIdentifier();
                } else {
                    fen += '.';
                }
            }
            if (row < 9) {
                fen += '/';
            }
        }

        // print fen with / as new line
        // console.log(fen.replace(/\//g, '\n'));

        // replace all the dots with the number of dots
        fen = fen.replace(/\.+/g, (dots) => {
            return dots.length.toString();
        });

        return fen;
    }

    public getBoard() {
        return this._squares;
    }
}

export abstract class Player {
    private _whiteSide: boolean = false;
    private _humanPlayer: boolean = false;
    private _name: string = 'anonymous';

    public isWhiteSide(): boolean {
        return this._whiteSide;
    }

    public setWhiteSide(whiteSide: boolean) {
        this._whiteSide = whiteSide;
    }

    public isHumanPlayer(): boolean {
        return this._humanPlayer;
    }

    public setHumanPlayer(humanPlayer: boolean) {
        this._humanPlayer = humanPlayer;
    }

    public getName(): string {
        return this._name;
    }

    public setName(name: string) {
        this._name = name;
    }
}

export class HumanPlayer extends Player {
    constructor(whiteSide: boolean, name: string = 'anonymous') {
        super();
        this.setWhiteSide(whiteSide);
        this.setHumanPlayer(true);
        this.setName(name);
    }
}

export class ComputerPlayer extends Player {
    constructor(whiteSide: boolean) {
        super();
        this.setWhiteSide(whiteSide);
        this.setHumanPlayer(false);
    }
}

export class Move {
    private _player: Player;
    private _start: Square;
    private _end: Square;
    private _pieceMoved: Piece | null;
    private _pieceKilled: Piece | null = null;

    constructor(player: Player, start: Square, end: Square) {
        this._player = player;
        this._start = start;
        this._end = end;
        this._pieceMoved = start.getPiece();
    }

    public getPlayer(): Player {
        return this._player;
    }

    public getStart(): Square {
        return this._start;
    }

    public getEnd(): Square {
        return this._end;
    }

    public setPieceKilled(pieceKilled: Piece) {
        this._pieceKilled = pieceKilled;
    }

    public getPieceKilled(): Piece | null {
        return this._pieceKilled;
    }

    public getPieceMoved(): Piece | null {
        return this._pieceMoved;
    }

    public getUci(): string {
        return this._start.getUci() + this._end.getUci();
    }

}

export enum GameStatus {
    WAITING = 0,
    PLAYING = 1,
    DRAW = 2,
    WHITEWIN = 3,
    BLACKWIN = 4,
}

export class Notation {
    private static readonly INTERNATIONAL_TO_TYPE: { [key: string]: string } = {
        'p': 'soldier',
        'k': 'general',
        'a': 'advisor',
        'e': 'elephant',
        'r': 'chariot',
        'h': 'horse',
        'c': 'cannon',
    }

    private static readonly TYPE_TO_INTERNATIONAL: { [key: string]: string } = {
        'soldier': 'p',
        'general': 'k',
        'advisor': 'a',
        'elephant': 'e',
        'chariot': 'r',
        'horse': 'h',
        'cannon': 'c',
    }

    private static readonly PIECE_TYPE: { [key: string]: string } = {
        SOLDIER: 'soldier',
        GENERAL: 'general',
        ADVISOR: 'advisor',
        ELEPHANT: 'elephant',
        CHARIOT: 'chariot',
        HORSE: 'horse',
        CANNON: 'cannon',
    }

    public translate_international_to_uci(board: Board, white: boolean, notation: string): string {
        let pieceType: string;
        let startRow: number = -1;
        let startCol: number = -1;
        let endRow: number = -1;
        let endCol: number = -1;

        if (white) {
            if (notation[0] === '+' || notation[0] === '-') {
                pieceType = Notation.INTERNATIONAL_TO_TYPE[notation[1].toLowerCase()];

                // there is one column that has two pieces of the same type, find fromCol
                for (let row = 0; row < 10; row++) {
                    for (let col = 0; col < 9; col++) {
                        const square = board.getSquare(row, col);
                        if (square.isPiece(pieceType, white)) {
                            // check if the remaining rows have the same piece
                            let hasSamePiece = false;
                            for (let i = row + 1; i < 10; i++) {
                                const square = board.getSquare(i, col);
                                if (square.isPiece(pieceType, white)) {
                                    hasSamePiece = true;
                                    break;
                                }
                            }

                            if (hasSamePiece) {
                                startCol = col;
                                break;
                            }
                        }
                    }
                }

                // find fromRow, if +, fromRow is the first row that has the piece, if -, fromRow is the last row that has the piece
                if (notation[0] === '+') {
                    for (let i = 0; i < 10; i++) {
                        const square = board.getSquare(i, startCol);
                        if (square.isPiece(pieceType, white)) {
                            startRow = i;
                            break;
                        }
                    }
                }
                else if (notation[0] === '-') {
                    for (let i = 9; i >= 0; i--) {
                        const square = board.getSquare(i, startCol);
                        if (square.isPiece(pieceType, white)) {
                            startRow = i;
                            break;
                        }
                    }
                }
            } else {
                pieceType = Notation.INTERNATIONAL_TO_TYPE[notation[0].toLowerCase()];
                startCol = 9 - parseInt(notation[1]);
                if (pieceType.toLowerCase() === Notation.PIECE_TYPE.ADVISOR) {
                    let operator = notation[2];
                    if (startCol === 4) {
                        startRow = 8;
                    } else {
                        if (operator === '+') {
                            startRow = 9;
                        } else {
                            startRow = 7;
                        }
                    }
                } else if (pieceType.toLowerCase() === Notation.PIECE_TYPE.ELEPHANT) {
                    let operator = notation[2];
                    if (startCol === 2 || startCol === 6) {
                        if (operator === '+') {
                            startRow = 9;
                        } else {
                            startRow = 5;
                        }
                    } else {
                        startRow = 7;
                    }
                } else {
                    // find fromRow
                    for (let i = 0; i < 10; i++) {
                        const square = board.getSquare(i, startCol);
                        if (square.isPiece(pieceType, white)) {
                            startRow = i;
                            break;
                        }
                    }
                }
            }

            if (pieceType.toLowerCase() === Notation.PIECE_TYPE.CHARIOT ||
                pieceType.toLowerCase() === Notation.PIECE_TYPE.GENERAL ||
                pieceType.toLowerCase() === Notation.PIECE_TYPE.CANNON ||
                pieceType.toLowerCase() === Notation.PIECE_TYPE.SOLDIER) {
                const operator = notation[2];
                const toValue = parseInt(notation[3]);
                if (operator === '+') {
                    endCol = startCol;
                    endRow = startRow - toValue;
                }
                else if (operator === '-') {
                    endCol = startCol;
                    endRow = startRow + toValue;
                }
                else if (operator === '=') {
                    endRow = startRow;
                    endCol = 9 - toValue;
                }
            }

            else if (pieceType.toLowerCase() === Notation.PIECE_TYPE.ADVISOR ||
                pieceType.toLowerCase() === Notation.PIECE_TYPE.ELEPHANT) {
                const operator = notation[2];
                const toValue = parseInt(notation[3]);
                if (operator === '+') {
                    endCol = 9 - toValue;
                    endRow = startRow - Math.abs(startCol - endCol);
                }
                else if (operator === '-') {
                    endCol = 9 - toValue;
                    endRow = startRow + Math.abs(startCol - endCol);
                }
            }

            else if (pieceType.toLowerCase() === Notation.PIECE_TYPE.HORSE) {
                const operator = notation[2];
                const toValue = parseInt(notation[3]);
                if (operator === '+') {
                    endCol = 9 - toValue;
                    endRow = startRow - (3 - Math.abs(startCol - endCol));
                }
                else if (operator === '-') {
                    endCol = 9 - toValue;
                    endRow = startRow + (3 - Math.abs(startCol - endCol));
                }
            }
        } else {
            if (notation[0] === '+' || notation[0] === '-') {
                pieceType = Notation.INTERNATIONAL_TO_TYPE[notation[1].toLowerCase()];

                // there is one column that has two pieces of the same type, find fromCol
                for (let row = 0; row < 10; row++) {
                    for (let col = 0; col < 9; col++) {
                        const square = board.getSquare(row, col);
                        if (square.isPiece(pieceType, white)) {
                            // check if the remaining rows have the same piece
                            let hasSamePiece = false;
                            for (let i = row + 1; i < 10; i++) {
                                const square = board.getSquare(i, col);
                                if (square.isPiece(pieceType, white)) {
                                    hasSamePiece = true;
                                    break;
                                }
                            }

                            if (hasSamePiece) {
                                startCol = col;
                                break;
                            }
                        }
                    }
                }

                // find fromRow, if +, fromRow is the first row that has the piece, if -, fromRow is the last row that has the piece
                if (notation[0] === '-') {
                    for (let i = 0; i < 10; i++) {
                        const square = board.getSquare(i, startCol);
                        if (square.isPiece(pieceType, white)) {
                            startRow = i;
                            break;
                        }
                    }
                }
                else if (notation[0] === '+') {
                    for (let i = 9; i >= 0; i--) {
                        const square = board.getSquare(i, startCol);
                        if (square.isPiece(pieceType, white)) {
                            startRow = i;
                            break;
                        }
                    }
                }
            } else {
                pieceType = Notation.INTERNATIONAL_TO_TYPE[notation[0].toLowerCase()];
                startCol = parseInt(notation[1]) - 1;
                if (pieceType.toLowerCase() === Notation.PIECE_TYPE.ADVISOR) {
                    let operator = notation[2];
                    if (startCol === 4) {
                        startRow = 1;
                    } else {
                        if (operator === '+') {
                            startRow = 0;
                        } else {
                            startRow = 2;
                        }
                    }
                } else if (pieceType.toLowerCase() === Notation.PIECE_TYPE.ELEPHANT) {
                    let operator = notation[2];
                    if (startCol === 2 || startCol === 6) {
                        if (operator === '+') {
                            startRow = 0;
                        } else {
                            startRow = 4;
                        }
                    } else {
                        startRow = 2;
                    }
                } else {
                    // find fromRow
                    for (let i = 0; i < 10; i++) {
                        const square = board.getSquare(i, startCol);
                        if (square.isPiece(pieceType, white)) {
                            startRow = i;
                            break;
                        }
                    }
                }
            }

            if (pieceType.toLowerCase() === Notation.PIECE_TYPE.CHARIOT ||
                pieceType.toLowerCase() === Notation.PIECE_TYPE.GENERAL ||
                pieceType.toLowerCase() === Notation.PIECE_TYPE.CANNON ||
                pieceType.toLowerCase() === Notation.PIECE_TYPE.SOLDIER) {
                const operator = notation[2];
                const toValue = parseInt(notation[3]);
                if (operator === '+') {
                    endCol = startCol;
                    endRow = startRow + toValue;
                }
                else if (operator === '-') {
                    endCol = startCol;
                    endRow = startRow - toValue;
                }
                else if (operator === '=') {
                    endRow = startRow;
                    endCol = toValue - 1;
                }
            }

            else if (pieceType.toLowerCase() === Notation.PIECE_TYPE.ADVISOR ||
                pieceType.toLowerCase() === Notation.PIECE_TYPE.ELEPHANT) {
                const operator = notation[2];
                const toValue = parseInt(notation[3]);
                if (operator === '+') {
                    endCol = toValue - 1;
                    endRow = startRow + Math.abs(startCol - endCol);
                }
                else if (operator === '-') {
                    endCol = toValue - 1;
                    endRow = startRow - Math.abs(startCol - endCol);
                }
            }

            else if (pieceType.toLowerCase() === Notation.PIECE_TYPE.HORSE) {
                const operator = notation[2];
                const toValue = parseInt(notation[3]);
                if (operator === '+') {
                    endCol = toValue - 1;
                    endRow = startRow + (3 - Math.abs(startCol - endCol));
                }
                else if (operator === '-') {
                    endCol = toValue - 1;
                    endRow = startRow - (3 - Math.abs(startCol - endCol));
                }
            }
        }

        const uci = String.fromCharCode(97 + startCol) + (9 - startRow) + String.fromCharCode(97 + endCol) + (9 - endRow);
        return uci;
    }

    public translate_uci_to_international(board: Board, uci: string): string | null {
        const startCol = uci.charCodeAt(0) - 97;
        const startRow = 9 - parseInt(uci[1]);
        const endCol = uci.charCodeAt(2) - 97;
        const endRow = 9 - parseInt(uci[3]);

        const startSquare = board.getSquare(startRow, startCol);
        const startPiece = startSquare.getPiece();
        if (!startPiece) {
            console.log('no piece on start square')
            return null;
        }

        const pieceColor = startPiece.isWhite()
        const pieceType = startPiece.getType();

        let uci_piece_type: string = Notation.TYPE_TO_INTERNATIONAL[pieceType].toUpperCase();

        // count the number of pieces of the same type and color on startCol
        let count = 0;
        for (let i = 0; i < 10; i++) {
            const square = board.getSquare(i, startCol);
            if (square.isPiece(pieceType, pieceColor)) {
                count++;
            }
        }

        if (pieceColor) {
            if (count === 1) {
                if (pieceType.toLowerCase() === Notation.PIECE_TYPE.CHARIOT ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.CANNON ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.SOLDIER ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.GENERAL) {
                    if (startRow === endRow) {
                        return uci_piece_type + (9 - startCol) + '=' + (9 - endCol);
                    } else {
                        if (startRow < endRow) {
                            return uci_piece_type + (9 - startCol) + '-' + (endRow - startRow);
                        } else {
                            return uci_piece_type + (9 - startCol) + '+' + (startRow - endRow);
                        }
                    }
                } else if (pieceType.toLowerCase() === Notation.PIECE_TYPE.ADVISOR ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.ELEPHANT ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.HORSE) {
                    if (startRow < endRow) {
                        return uci_piece_type + (9 - startCol) + '-' + (9 - endCol);
                    } else {
                        return uci_piece_type + (9 - startCol) + '+' + (9 - endCol);
                    }
                }
            } else if (count === 2) {
                // check if the piece is the first or second piece on the column
                let isUpper = true;
                for (let i = 0; i < startRow; i++) {
                    const square = board.getSquare(i, startCol);
                    if (square.isPiece(pieceType, pieceColor)) {
                        isUpper = false;
                        break;
                    }
                }

                if (pieceType.toLowerCase() === Notation.PIECE_TYPE.CHARIOT ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.CANNON ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.SOLDIER) {
                    if (startRow === endRow) {
                        return (isUpper ? '+' : '-') + uci_piece_type + '=' + (9 - endCol);
                    } else {
                        if (startRow < endRow) {
                            return (isUpper ? '+' : '-') + uci_piece_type + '-' + (endRow - startRow);
                        } else {
                            return (isUpper ? '+' : '-') + uci_piece_type + '+' + (startRow - endRow);
                        }
                    }
                } else if (pieceType.toLowerCase() === Notation.PIECE_TYPE.ADVISOR ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.ELEPHANT) {
                    if (startRow < endRow) {
                        return uci_piece_type + (9 - startCol) + '-' + (9 - endCol);
                    } else {
                        return uci_piece_type + (9 - startCol) + '+' + (9 - endCol);
                    }
                } else if (pieceType.toLowerCase() === Notation.PIECE_TYPE.HORSE) {
                    if (startRow < endRow) {
                        return (isUpper ? '+' : '-') + uci_piece_type + '-' + (9 - endCol);
                    } else {
                        return (isUpper ? '+' : '-') + uci_piece_type + '+' + (9 - endCol);
                    }
                }
            }
        } else {
            if (count === 1) {
                if (pieceType.toLowerCase() === Notation.PIECE_TYPE.CHARIOT ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.CANNON ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.SOLDIER ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.GENERAL) {
                    if (startRow === endRow) {
                        return uci_piece_type + (startCol + 1) + '=' + (endCol + 1);
                    } else {
                        if (startRow < endRow) {
                            return uci_piece_type + (startCol + 1) + '+' + (endRow - startRow);
                        } else {
                            return uci_piece_type + (startCol + 1) + '-' + (startRow - endRow);
                        }
                    }
                } else if (pieceType.toLowerCase() === Notation.PIECE_TYPE.ADVISOR ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.ELEPHANT ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.HORSE) {
                    if (startRow < endRow) {
                        return uci_piece_type + (startCol + 1) + '+' + (endCol + 1);
                    } else {
                        return uci_piece_type + (startCol + 1) + '-' + (endCol + 1);
                    }
                }
            } else if (count === 2) {
                // check if the piece is the first or second piece on the column
                let isUpper = true;
                for (let i = 9; i > startRow; i--) {
                    const square = board.getSquare(i, startCol);
                    if (square.isPiece(pieceType, pieceColor)) {
                        isUpper = false;
                        break;
                    }
                }

                if (pieceType.toLowerCase() === Notation.PIECE_TYPE.CHARIOT ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.CANNON ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.SOLDIER) {
                    if (startRow === endRow) {
                        return (isUpper ? '+' : '-') + uci_piece_type + '=' + (endCol + 1);
                    } else {
                        if (startRow < endRow) {
                            return (isUpper ? '+' : '-') + uci_piece_type + '+' + (endRow - startRow);
                        } else {
                            return (isUpper ? '+' : '-') + uci_piece_type + '-' + (startRow - endRow);
                        }
                    }
                } else if (pieceType.toLowerCase() === Notation.PIECE_TYPE.ADVISOR ||
                    pieceType.toLowerCase() === Notation.PIECE_TYPE.ELEPHANT) {
                    if (startRow < endRow) {
                        return uci_piece_type + (startCol + 1) + '+' + (endCol + 1);
                    } else {
                        return uci_piece_type + (startCol + 1) + '-' + (endCol + 1);
                    }
                } else if (pieceType.toLowerCase() === Notation.PIECE_TYPE.HORSE) {
                    if (startRow < endRow) {
                        return (isUpper ? '+' : '-') + uci_piece_type + '+' + (endCol + 1);
                    } else {
                        return (isUpper ? '+' : '-') + uci_piece_type + '-' + (endCol + 1);
                    }
                }
            }
        }

        console.log('im here')

        return null;
    }
}

export class Game extends Notation {
    private static readonly STARTING_BOARD_FEN: string = 'rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR';
    private _players: Player[];
    private _board: Board;
    private _currentPlayer: Player;
    private _gameStatus: GameStatus;
    private _moves: Move[];
    private _internationalNotations: string[] = [];
    private _selectedSquare: Square | null = null;
    private _reverseBoard: boolean = false;

    constructor(p1: Player, p2: Player) {
        super();
        this._players = [p1, p2];
        this._board = new Board(Game.STARTING_BOARD_FEN);
        if (p1.isWhiteSide()) {
            this._currentPlayer = p1;
        } else {
            this._currentPlayer = p2;
        }
        this._gameStatus = GameStatus.PLAYING;
        this._moves = [];
    }

    public whoIsPlaying(): { white: string, black: string } {
        return {
            white: this._players[0].getName(),
            black: this._players[1].getName(),
        };
    }

    public initializeGame(p1: Player, p2: Player) {
        this._players = [p1, p2];
        this._board = new Board(Game.STARTING_BOARD_FEN);
        if (p1.isWhiteSide()) {
            this._currentPlayer = p1;
        } else {
            this._currentPlayer = p2;
        }
        this._gameStatus = GameStatus.PLAYING;
        this._moves = [];
        this._internationalNotations = [];
    }

    public resetGame() {
        this._board = new Board(Game.STARTING_BOARD_FEN);
        if (this._players[0].isWhiteSide()) {
            this._currentPlayer = this._players[0];
        } else {
            this._currentPlayer = this._players[1];
        }
        this._gameStatus = GameStatus.PLAYING;
        this._moves = [];
        this._internationalNotations = [];
        this._selectedSquare = null;
    }

    public getCurrentPlayer(): Player {
        return this._currentPlayer;
    }

    public getStatus(): GameStatus {
        return this._gameStatus;
    }

    public setStatus(status: GameStatus) {
        this._gameStatus = status;
    }

    public isEndGame(): boolean {
        return this._gameStatus !== GameStatus.PLAYING;
    }

    private make_move(move: Move): boolean {
        // check if the move is valid corresponding to piece type
        if (!this.isValidMove(move)) {
            console.log('Invalid move');
            return false;
        }

        this.makeMove(move);
        // check if the player is in check
        const isCheck = this.isCheck(move.getPlayer().isWhiteSide());

        // check if general face to face
        const isGeneralFaceToFace = this.isGeneralFaceToFace();

        if (!isCheck && !isGeneralFaceToFace) {
            // check if opponent is in check
            const isOpponentCheck = this.isCheck(!move.getPlayer().isWhiteSide());

            // check if opponent is in checkmate
            const isOpponentCheckMate = this.isCheckmate(!move.getPlayer().isWhiteSide());

            if (isOpponentCheck && isOpponentCheckMate) {
                // check color and set game status
                if (move.getPlayer().isWhiteSide()) {
                    this._gameStatus = GameStatus.WHITEWIN;
                } else {
                    this._gameStatus = GameStatus.BLACKWIN;
                }
            }

            // console.log('isOpponentCheck', isOpponentCheck)
            // console.log('isOpponentCheckMate', isOpponentCheckMate)

            return true;
        } else {
            this.undoMove();
            return false;
        }
    }

    public playerMove(player: Player, startRow: number, startCol: number, endRow: number, endCol: number): boolean {
        const move = new Move(player, this._board.getSquare(startRow, startCol), this._board.getSquare(endRow, endCol));

        return this.make_move(move);
    }

    private getInternationalNotation(move: Move): string {
        const uci = move.getUci();
        const international_notation = this.translate_uci_to_international(this.getBoard(), uci);
        if (international_notation === null) {
            return 'null';
        }
        return international_notation;
    }

    private pushMove(move: Move) {
        this._moves.push(move);
        this._internationalNotations.push(this.getInternationalNotation(move));
    }

    private popMove(): Move | undefined {
        const last_move = this._moves.pop();
        this._internationalNotations.pop();

        return last_move;
    }

    private makeMove(move: Move) {
        const destPiece = move.getEnd().getPiece();
        if (destPiece !== null) {
            destPiece.setKilled(true);
            move.setPieceKilled(destPiece);
        }

        // store the move
        this.pushMove(move);

        // move the piece
        move.getEnd().setPiece(move.getStart().getPiece());
        move.getStart().setPiece(null);

        if (destPiece !== null && destPiece instanceof General) {
            if (move.getPlayer().isWhiteSide()) {
                this._gameStatus = GameStatus.WHITEWIN;
            } else {
                this._gameStatus = GameStatus.BLACKWIN;
            }
        }

        // switch player
        if (this._currentPlayer === this._players[0]) {
            this._currentPlayer = this._players[1];
        } else {
            this._currentPlayer = this._players[0];
        }

        // reset selected square
        this.setSelectedSquare(null);
    }

    private isValidMove(move: Move): boolean {
        // check if source is empty
        const sourcePiece = move.getStart().getPiece();
        if (sourcePiece === null) {
            // console.log('source is empty')
            return false;
        }

        // check if the player is correct
        const player = move.getPlayer();
        if (player !== this._currentPlayer) {
            // console.log('player is not correct')
            return false;
        }

        // check if player is moving the correct color
        if (player.isWhiteSide() !== sourcePiece.isWhite()) {
            // console.log('player is not moving the correct color')
            return false;
        }

        const destPiece = move.getEnd().getPiece();
        // check if the destination is not the same color
        if (destPiece !== null && destPiece.isWhite() === sourcePiece.isWhite()) {
            // console.log('destination is not the same color')
            return false;
        }

        // check if the move is valid
        if (!sourcePiece.canMove(this._board, move.getStart(), move.getEnd())) {
            // console.log('move is not valid')
            return false;
        }

        return true;
    }

    private isValidAfterMove(move: Move): boolean {
        this.makeMove(move);

        // check if the player is in check
        const isCheck = this.isCheck(move.getPlayer().isWhiteSide());

        // check if general face to face
        const isGeneralFaceToFace = this.isGeneralFaceToFace();

        // undo move
        this.undoMove();

        return !isCheck && !isGeneralFaceToFace;
    }

    public isCheck(white: boolean): boolean {
        const general = this._board.getGeneral(white);

        if (general === null) {
            return false;
        }

        // for each piece, if piece is opposite color and piece can move to general's position, return True
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = this._board.getSquare(row, col).getPiece();
                if (piece !== null && piece.isWhite() !== white) {
                    if (piece.canMove(this._board, this._board.getSquare(row, col), general)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private isGeneralFaceToFace(): boolean {
        const whiteGeneral = this._board.getGeneral(true);
        const blackGeneral = this._board.getGeneral(false);

        if (whiteGeneral === null || blackGeneral === null) {
            return false;
        }

        if (whiteGeneral.getCol() !== blackGeneral.getCol()) {
            return false;
        }

        for (let row = blackGeneral.getRow() + 1; row < whiteGeneral.getRow(); row++) {
            if (this._board.isOccupiedAt(row, blackGeneral.getCol())) {
                return false;
            }
        }

        return true;
    }

    public isStalemate(white: boolean): boolean {
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const square = this._board.getSquare(row, col);
                const piece = square.getPiece();
                // check color of piece
                if (piece !== null && piece.isWhite() === white) {
                    const moves = this.getValidMoves(square);

                    // # for each possible move, if move is not check, return True
                    for (let i = 0; i < moves.length; i++) {
                        if (this.isValidAfterMove(moves[i])) {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }

    public isCheckmate(white: boolean): boolean {
        return this.isCheck(white) && this.isStalemate(white);
    }

    private getValidMoves(square: Square): Move[] {
        const piece = square.getPiece();
        const moves: Move[] = [];

        if (piece !== null) {
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 9; col++) {
                    const move = new Move(this._currentPlayer, square, this._board.getSquare(row, col));
                    if (this.isValidMove(move)) {
                        moves.push(move);
                    }
                }
            }
        }

        return moves;
    }

    public undoMove(): boolean {
        if (this._moves.length > 0) {
            const lastMove = this.popMove();
            // make sure the move is not null
            if (lastMove === undefined) {
                return false;
            }

            const start = lastMove.getStart();
            const end = lastMove.getEnd();
            const pieceMoved = lastMove.getPieceMoved();
            const pieceKilled = lastMove.getPieceKilled();

            start.setPiece(pieceMoved);
            end.setPiece(pieceKilled);

            if (pieceKilled !== null) {
                pieceKilled.setKilled(false);
            }

            if (this._currentPlayer === this._players[0]) {
                this._currentPlayer = this._players[1];
            } else {
                this._currentPlayer = this._players[0];
            }

            this.setStatus(GameStatus.PLAYING)

            return true;
        }

        return false;
    }

    public getBoard(): Board {
        return this._board;
    }

    public get_1d_board(): SquareType[] {
        const appendixs: string[][] = [];

        for (let row = 0; row < 10; row++) {
            appendixs.push([]);
            for (let col = 0; col < 9; col++) {
                appendixs[row].push('');
            }
        }

        if (this._moves.length > 0) {
            const lastMove = this._moves[this._moves.length - 1];

            const startRow = lastMove.getStart().getRow();
            const startCol = lastMove.getStart().getCol();
            const endRow = lastMove.getEnd().getRow();
            const endCol = lastMove.getEnd().getCol();

            appendixs[startRow][startCol] += ' last-move-start';
            appendixs[endRow][endCol] += ' last-move-end';
        }

        if (this._selectedSquare !== null) {
            const all_valid_moves = this.getValidMoves(this._selectedSquare);

            for (let i = 0; i < all_valid_moves.length; i++) {
                const row = all_valid_moves[i].getEnd().getRow();
                const col = all_valid_moves[i].getEnd().getCol();

                appendixs[row][col] += ' possible-move';
            }
        }

        const board: SquareType[] = [];
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const square = this._board.getSquare(row, col);
                const appendix = appendixs[row][col];

                board.push({
                    row: square.getRow(),
                    col: square.getCol(),
                    type: square.getType(),
                    color: square.getColor(),
                    appendix: appendix,
                })
            }
        }

        if (this._reverseBoard) {
            board.reverse();
        }

        return board;
    }

    private setSelectedSquare(square: Square | null): void {
        this._selectedSquare = square;
    }

    public reverseBoard(requestBlackSide: boolean | null = null): void {
        if (requestBlackSide === null) {
            this._reverseBoard = !this._reverseBoard;
        }

        else {
            this._reverseBoard = requestBlackSide;
        }
    }

    public handleClick(row: number, col: number, isMakeMove: boolean = true): boolean | string {
        if (this._selectedSquare === null) {
            const square = this._board.getSquare(row, col);
            const piece = square.getPiece();

            if (piece !== null && piece.isWhite() === this._currentPlayer.isWhiteSide()) {
                this.setSelectedSquare(square);
            }

            return false;
        } else {
            const endSquare = this._board.getSquare(row, col);
            const endPiece = endSquare.getPiece();

            if (endPiece !== null && endPiece.isWhite() === this._currentPlayer.isWhiteSide()) {
                this.setSelectedSquare(endSquare);
                return false;
            }

            const move = new Move(this._currentPlayer, this._selectedSquare, endSquare);

            if (isMakeMove) {
                if (this.make_move(move)) {
                    return move.getUci();
                }

                else {
                    return false;
                }
            }

            else {
                if (this.isValidMove(move) && this.isValidAfterMove(move)) {
                    return move.getUci();
                }

                else {
                    return false;
                }
            }
        }
    }

    public make_move_from_uci(uci: string): boolean {
        const move = new Move(this._currentPlayer, this._board.getSquareFromUci(uci.slice(0, 2)), this._board.getSquareFromUci(uci.slice(2, 4)));
        return this.make_move(move);
    }

    public make_move_from_international_notation(internationalNotation: string): boolean {
        const uci = this.translate_international_to_uci(this.getBoard(), this._currentPlayer.isWhiteSide(), internationalNotation);
        return this.make_move_from_uci(uci);
    }

    public get_fen_chessdb_format(): string {
        const board_fen = this._board.getBoardFen();
        const turn = this._currentPlayer.isWhiteSide() ? 'w' : 'b';
        const moves: string[] = this.get_list_uci();

        if (moves.length === 0) {
            return board_fen + ' ' + turn + ' moves'
        }

        return board_fen + ' ' + turn + ' moves ' + moves.join(' ');
    }

    public get_fen_hdnum16_format(): string {
        const moves: string[] = this._internationalNotations;

        if (moves.length === 0) {
            return 'moves'
        }

        return 'moves ' + moves.join(' ');
    }

    public get_fen(format: string = 'chessdb') {
        if (format === 'chessdb') {
            return this.get_fen_chessdb_format();
        } else if (format === 'hdnum16') {
            return this.get_fen_hdnum16_format();
        } else {
            throw new Error('Invalid format');
        }
    }

    public get_list_uci(): string[] {
        return this._moves.map(move => move.getUci());
    }

    public get_list_international_notation(): string[] {
        return this._internationalNotations;
    }

    public isWhiteTurn(): boolean {
        return this._currentPlayer.isWhiteSide();
    }
}

export class XiangqiViewer {
    private _game: Game;
    private _history: SquareType[][];
    private _fens: string[];
    private _fens_hdnum16: string[];

    constructor() {
        this._game = new Game(new ComputerPlayer(true), new ComputerPlayer(false));
        this._history = [this._game.get_1d_board()];
        this._fens = [this._game.get_fen_chessdb_format()];
        this._fens_hdnum16 = [this._game.get_fen_hdnum16_format()];
    }

    private updateHistory(): void {
        this._history.push(this._game.get_1d_board());
        this._fens.push(this._game.get_fen_chessdb_format());
        this._fens_hdnum16.push(this._game.get_fen_hdnum16_format());
    }

    public resetGame(): void {
        this._game.resetGame();
        this._history = [this._game.get_1d_board()];
        this._fens = [this._game.get_fen_chessdb_format()];
        this._fens_hdnum16 = [this._game.get_fen_hdnum16_format()];
    }

    public initializeGame(p1: Player, p2: Player): void {
        this._game.initializeGame(p1, p2);
        this._history = [this._game.get_1d_board()];
        this._fens = [this._game.get_fen_chessdb_format()];
        this._fens_hdnum16 = [this._game.get_fen_hdnum16_format()];
    }

    public reverseBoard(requestBlackSide: boolean | null = null): void {
        this._game.reverseBoard(requestBlackSide);
    }

    public whoIsPlaying(): { white: string, black: string } {
        return this._game.whoIsPlaying();
    }

    public getBoard(): SquareType[] | null {
        // return this.get_move_at(this.getMaxIndex());
        return this._game.get_1d_board();
    }

    public getFen(format: string = 'chessdb'): string | null {
        return this.get_fen_at(this.getMaxIndex(), format);
    }

    public isWhiteTurn(): boolean {
        return this._game.isWhiteTurn();
    }

    public getStatus(): GameStatus {
        return this._game.getStatus();
    }

    public handleClick(row: number, col: number, isMakeMove: boolean = true): boolean | string {
        const uci = this._game.handleClick(row, col, isMakeMove);

        if (uci && isMakeMove) {
            this.updateHistory();
        }

        return uci
    }

    public undoMove(): boolean {
        if (this._history.length > 1) {
            this._history.pop();
            this._fens.pop();
            this._fens_hdnum16.pop();
            return this._game.undoMove();
        }

        return false;
    }

    public make_move_from_uci(uci: string): boolean {
        const move_made = this._game.make_move_from_uci(uci);

        if (move_made) {
            this.updateHistory();
        }

        return move_made
    }

    public make_move_from_international_notation(internationalNotation: string): boolean {
        const move_made = this._game.make_move_from_international_notation(internationalNotation);

        if (move_made) {
            this.updateHistory();
        }

        return move_made
    }

    public load_from_fen(fen: string, format: string = 'chessdb'): void {
        if (format === 'chessdb') {
            this.load_from_chessdb_format(fen);
        } else if (format === 'hdnum16') {
            this.load_from_hdnum16_format(fen);
        } else {
            throw new Error('Invalid format');
        }
    }

    public load_from_chessdb_format(fen: string): void {
        const list_moves = fen.split('moves').slice(1).join('moves').trim().split(' ');
        if (list_moves.length === 0) {
            this.resetGame();
            return;
        }

        else if (list_moves.length === 1 && list_moves[0] === '') {
            this.resetGame();
            return;
        }

        this.load_from_uci_notation(list_moves);
    }

    public load_from_hdnum16_format(fen: string): void {
        this.resetGame();
    }

    public load_from_uci_notation(list_moves: string[]): void {
        this.resetGame();

        for (let i = 0; i < list_moves.length; i++) {
            const move_made = this._game.make_move_from_uci(list_moves[i]);

            if (!move_made) {
                throw new Error('Invalid move: ' + list_moves[i]);
            }

            this.updateHistory();
        }
    }

    public load_from_international_notation(list_moves: string[]): void {
        this.resetGame();

        for (let i = 0; i < list_moves.length; i++) {
            // const uci = this._game.translate_international_to_uci(this._game.getBoard(), this._game.isWhiteTurn(), list_moves[i]);
            // console.log(list_moves[i] + " -> " + uci);

            // const international_notation = this._game.translate_uci_to_international(this._game.getBoard(), uci);
            // console.log(uci + " -> " + international_notation);

            const move_made = this._game.make_move_from_international_notation(list_moves[i]);

            if (!move_made) {
                throw new Error('Invalid move: ' + list_moves[i]);
            }

            this.updateHistory();
        }
    }

    public get_move_at(index: number): SquareType[] | null {
        if (index >= 0 && index < this._history.length) {
            return this._history[index];
        }

        return null;
    }

    public get_fen_at(index: number, format: string = 'chessdb'): string | null {
        if (index >= 0 && index < this._fens.length) {
            if (format === 'chessdb') {
                return this._fens[index];
            } else if (format === 'hdnum16') {
                return this._fens_hdnum16[index];
            } else {
                throw new Error('Invalid format');
            }
        }

        return null;
    }

    public getMaxIndex(): number {
        return this._history.length - 1;
    }

    public get_list_uci(): string[] {
        return this._game.get_list_uci();
    }

    public get_list_international_notation(): string[] {
        return this._game.get_list_international_notation();
    }
}