import R from 'ramda'
import shuffle from 'lodash/shuffle'
import { subtractList } from '../lib/list'

export type Game = {
    activePlayer: Player
    opponent: Player
}

export type Player = {
    health: number
    // - start: 30
    mana: ManaSlot[]
    // - start: 0 max 10
    deck: Card[]
    // - start: 20 damage cards, mana costs: 0,0,1,1,2,2,2,3,3,3,3,4,4,4,5,5,6,6,7,8
    hand: Card[]
    // - start: 3 random cards
}

export type ManaSlot = 'EMPTY' | 'FILLED'

export type Card = {
    manaCost: number
}

const initialDeck = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8]
    .map(manaCost => ({ manaCost }))

const newPlayer = (): Player => ({
    health: 30,
    mana: [],
    deck: initialDeck,
    hand: []
})

export const start = (): Game => ({
    activePlayer: newPlayer(),
    opponent: newPlayer()
})

const draw = (count: number, deck: Card[]) =>
    R.take(count, shuffle(deck))


const initialPlayerDraw = (player: Player) => {
    const drawed = draw(3, player.deck)
    return R.mergeRight(
        player,
        {
            deck: subtractList(player.deck, drawed),
            hand: drawed
        }
    )
}

export const initialDraw = (game: Game): Game => R.mergeRight(
    game,
    {
        activePlayer: initialPlayerDraw(game.activePlayer),
        opponent: initialPlayerDraw(game.opponent)
    }
)