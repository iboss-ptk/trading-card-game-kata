import R from 'ramda'
import { Player, newPlayer, drawCard, activate, useCard, dealDamage, remainingMana } from './player'
import { Card } from './card';

// Game model

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

// Game state and actions

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
    playCard: (card: Card): Action => ({ type: 'PLAY_CARD', card })
}

type GameState = {
    status: Status,
    game: Game
}

const initGameState: GameState = {
    status: Status.IDLE,
    game: newGame()
}

// update utilities

const fix = (fixedGameState: GameState) => (_gameState: GameState) => fixedGameState

const updateIf = (
    condition: (gameState: GameState) => boolean,
    update: (gameState: GameState) => GameState
) => (gameState: GameState) =>
        condition(gameState) ? update(gameState) : gameState

const updateAtMostOneOf = (...configs: {
    condition: (gameState: GameState) => boolean,
    update: (gameState: GameState) => GameState
}[]) => (gameState: GameState): GameState => {
    const firstFound = R.head(configs.filter(c => c.condition(gameState)))
    return R.isNil(firstFound)
        ? gameState
        : firstFound.update(gameState)
}

const changeStatus = R.curry((
    newStatus: Status,
    gameState: GameState
) => R.mergeRight(gameState, { status: newStatus }))


// conditions

const activePlayerHealthBelowOrEqZero = (gameState: GameState) => gameState.game.activePlayer.health <= 0
const opponentHealthBelowOrEqZero = (gameState: GameState) => gameState.game.opponent.health <= 0
const emptyHand = (gameState: GameState) => R.isEmpty(gameState.game.activePlayer.hand)
const statusIs = (status: Status) => (gameState: GameState) => gameState.status === status


// game state updaters

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

const swapTurn = R.pipe(
    swapAndActivate,
    updateIf(
        activePlayerHealthBelowOrEqZero,
        changeStatus(Status.ACTIVE_PLAYER_LOSES)
    )
)

const playCard = (card: Card) => (gameState: GameState) => {
    const cardExistsInHand = R.find(R.equals(card), gameState.game.activePlayer.hand) !== undefined
    const enoughMana = remainingMana(gameState.game.activePlayer) >= card.manaCost

    if (cardExistsInHand && enoughMana) {
        return R.mergeRight(
            gameState,
            {
                game: {
                    activePlayer: useCard(card, gameState.game.activePlayer),
                    opponent: dealDamage(card.manaCost, gameState.game.opponent)
                }
            }
        )
    } else {
        return gameState
    }
}


// main state updater

export const updateGameState = (action: Action, gameState: GameState = initGameState): GameState => (() => {
    switch (action.type) {
        case 'START':
            return fix({
                status: Status.PLAYING,
                game: initialDraw(newGame())
            })

        case 'SWAP_TURN':
            return updateIf(
                statusIs(Status.PLAYING),
                swapTurn
            )

        case 'PLAY_CARD':
            return updateIf(
                statusIs(Status.PLAYING),
                R.pipe(
                    playCard(action.card),
                    updateAtMostOneOf(
                        {
                            condition: opponentHealthBelowOrEqZero,
                            update: changeStatus(Status.ACTIVE_PLAYER_WINS)
                        },
                        {
                            condition: emptyHand,
                            update: swapTurn
                        }
                    ),
                ))

        default:
            return R.identity
    }
})()(gameState)
