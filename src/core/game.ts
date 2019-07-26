import R from 'ramda'
import { Player, newPlayer, drawCard } from './player'

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


// endGameIf :: (ActiveGame -> boolean) -> ActiveGame -> ActiveGame | EndedGame
// swapActivePlayer :: Game -> Game
// swapActivePlayerIf :: (Game -> boolean) -> Game -> Game
