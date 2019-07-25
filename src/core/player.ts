import R from 'ramda'
import { subtractList } from '../lib/list'
import { Card, draw } from './card'


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


const initialDeck = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5, 6, 6, 7, 8]
    .map(manaCost => ({ manaCost }))


export const initialPlayerDraw = (player: Player) => {
    const drawed = draw(3, player.deck)
    return R.mergeRight(
        player,
        {
            deck: subtractList(player.deck, drawed),
            hand: drawed
        }
    )
}

export const newPlayer = (): Player => ({
    health: 30,
    mana: [],
    deck: initialDeck,
    hand: []
})
// drawCard :: Player -> Player
// dealDamage :: number -> Player -> Player
// playCard :: Player -> Player -> Card -> (Player, Player)
// incManaSlot :: Player -> Player