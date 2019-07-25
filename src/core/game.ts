import R from 'ramda'
import { Player, newPlayer, initialPlayerDraw } from './player'

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
        activePlayer: initialPlayerDraw(game.activePlayer),
        opponent: initialPlayerDraw(game.opponent)
    }
)


// endGameIf :: (ActiveGame -> boolean) -> ActiveGame -> ActiveGame | EndedGame
// swapActivePlayer :: Game -> Game
// swapActivePlayerIf :: (Game -> boolean) -> Game -> Game
