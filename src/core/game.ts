import R from 'ramda'
import { Player, newPlayer, drawCard, activate } from './player'
import { Card } from './card';

export type Game = {
    activePlayer: Player
    opponent: Player
}

export const newGame = (): Game => ({
    activePlayer: newPlayer(),
    opponent: newPlayer()
})

export const initialDraw = (game: Game): Game => R.mergeRight(
    game,
    {
        activePlayer: drawCard(3, game.activePlayer),
        opponent: drawCard(3, game.opponent)
    }
)


type Status =
    | 'IDLE'
    | 'PLAYING'
    | 'ACTIVE_PLAYER_WINS'
    | 'ACTIVE_PLAYER_LOSES'

export const Status: { [key: string]: Status } = {
    IDLE: 'IDLE',
    PLAYING: 'PLAYING',
    ACTIVE_PLAYER_WINS: 'ACTIVE_PLAYER_WINS',
    ACTIVE_PLAYER_LOSES: 'ACTIVE_PLAYER_LOSES'
}

type Action =
    | { type: 'START' }
    | { type: 'SWAP_TURN' }
    | { type: 'PLAY_CARD', card: Card }

export const Action = {
    start: (): Action => ({ type: 'START' }),
    swapTurn: (): Action => ({ type: 'SWAP_TURN' }),
    playCard: (card: Card) => ({ type: 'PLAY_CARD', card })
}

type GameState = {
    status: Status,
    game: Game
}

const initGameState: GameState = {
    status: Status.IDLE,
    game: newGame()
}

const swapAndActivate = (gameState: GameState) => R.mergeRight(
    gameState,
    {
        status: Status.PLAYING,
        game: {
            activePlayer: activate(gameState.game.opponent),
            opponent: gameState.game.activePlayer
        }
    }
)

const changeStatusIf = R.curry((
    condition: (gameState: GameState) => boolean,
    newStatus: Status,
    gameState: GameState
) => R.mergeRight(
    gameState, { status: condition(gameState) ? newStatus : gameState.status }
))

const activePlayerHealthBelowOrEqZero = (gameState: GameState) => gameState.game.activePlayer.health <= 0

export const updateGameState = (action: Action, gameState: GameState = initGameState) => {
    switch (action.type) {
        case 'START':
            return R.mergeRight(
                gameState,
                {
                    status: Status.PLAYING,
                    game: initialDraw(newGame())
                }
            )
        case 'SWAP_TURN':
            return R.pipe(
                swapAndActivate,
                changeStatusIf(
                    activePlayerHealthBelowOrEqZero,
                    Status.ACTIVE_PLAYER_LOSES
                )
            )(gameState)
        default:
            return gameState
    }
}
