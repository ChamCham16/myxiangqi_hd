export type RoomType = {
    id: number,
    name: string,
    slug: string,
    white_player: string | null,
    black_player: string | null,
    fen: string,
    is_white_turn: boolean,
    game_status: number,
}

export type MainXiangqiStateType = {
    fen: string,
    white: string,
    black: string,
    white_name: string,
    black_name: string,
    isWhiteTurn: boolean,
    isWhite: boolean,
    isBlack: boolean,
    isStarted: boolean,
    isCheck: boolean,
    isCheckmate: boolean,
    isGameOver: boolean,
}

export enum I_AM {
    WHITE = 0,
    BLACK = 1,
    SPECTATOR = 2,
}

export enum XIANGQI_STATUS {
    WAITING = 0,
    PLAYING = 1,
    DRAW = 2,
    WHITEWIN = 3,
    BLACKWIN = 4,
    WHITERESIGN = 5,
    BLACKRESIGN = 6,
}

export type UserType = {
    username: string,
}

export type RoomStateType = {
    id: number,
    name: string,
    slug: string,
    white_player: UserType | null,
    black_player: UserType | null,
    is_white_ready: boolean,
    is_black_ready: boolean,
    fen: string,
    is_white_turn: boolean,
    game_status: XIANGQI_STATUS,
}

export type XiangqiStateType = {
    fen: string,
    isWhiteTurn: boolean,
}

export type XiangqiGameType = {
    id: number,
    GAMEID: string,
    EVENT: string,
    DATE: string,
    ROUND: string,
    RESULT: string,
    REDPLAYER: string,
    REDCLUB: string,
    BLACKPLAYER: string,
    BLACKCLUB: string,
    OPENING: string,
    VARIATION: string,
    GAME: string,
}

export type AllMovesPlayedByMastersType = {
    'id': number,
    'move_number': number,
    'fen': string,
    'move': string,
    'games': number,
    'wins': number,
    'draws': number,
    'losses': number,
}[]

export type AllKnownMovesType = {
    'name': string,
    'score': number,
    'rank': number,
    'winrate': string,
    'note': string,
}[]

export type ScoresType = {
    'fen': string,
    'score': number,
}[] 

export type SquareType = {
    'type': string | null,
    'color': string | null,
    'row': number,
    'col': number,
    'appendix': string,
}