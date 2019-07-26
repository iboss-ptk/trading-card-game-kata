import R from 'ramda'
import { subtractList } from '../lib/list'
import { Card, draw, card } from './card'


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


const has = (count: number, card: Card) => R.repeat(card, count)

const initialDeck = R.flatten([
    has(2, card(0)),
    has(2, card(1)),
    has(3, card(2)),
    has(4, card(3)),
    has(3, card(4)),
    has(2, card(5)),
    has(2, card(6)),
    has(1, card(7)),
    has(1, card(8)),
])

export const drawCard = (count: number, player: Player) => {
    const drawed = draw(count, player.deck)
    return R.mergeRight(
        player,
        {
            deck: subtractList(player.deck, drawed),
            hand: player.hand.concat(drawed)
        }
    )
}

export const newPlayer = (): Player => ({
    health: 30,
    mana: [],
    deck: initialDeck,
    hand: []
})

// dealDamage :: number -> Player -> Player
// playCard :: Player -> Player -> Card -> (Player, Player)
// incManaSlot :: Player -> Player