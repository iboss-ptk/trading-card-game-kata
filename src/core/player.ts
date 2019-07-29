import R from 'ramda'
import { subtractList } from '../lib/list'
import { Card, draw, card, cards } from './card'

export type Player = {
    health: number
    mana: ManaSlot[]
    deck: Card[]
    hand: Card[]
}

// Mana

export type ManaSlot = 'EMPTY' | 'FILLED'

const MAX_MANA_SLOT = 10
const MAX_HAND = 5

export const emptyMana = R.repeat<ManaSlot>('EMPTY')
export const filledMana = R.repeat<ManaSlot>('FILLED')
export const manaSlots = (...mss: ManaSlot[][]) => R.flatten(mss)

export const remainingMana = (player: Player) =>
    R.filter(R.equals<ManaSlot>('FILLED'), player.mana).length

const totalMana = (player: Player) =>
    player.mana.length

const useMana = (requiredMana: number, player: Player): ManaSlot[] => {
    const remainingManaAfterUsed = remainingMana(player) - requiredMana
    return manaSlots(
        emptyMana(totalMana(player) - remainingManaAfterUsed),
        filledMana(remainingManaAfterUsed)
    )
}

// Deck

const initialDeck = cards(
    [2, card(0)],
    [2, card(1)],
    [3, card(2)],
    [4, card(3)],
    [3, card(4)],
    [2, card(5)],
    [2, card(6)],
    [1, card(7)],
    [1, card(8)],
)

// init

export const newPlayer = (): Player => ({
    health: 30,
    mana: [],
    deck: initialDeck,
    hand: []
})

// activation actions

const incManaSlotAndFill = (player: Player) => R.mergeRight(
    player,
    {
        mana: filledMana(R.min(MAX_MANA_SLOT, player.mana.length + 1)),
    })

const bleedWhenDeckIsEmpty = (player: Player) => R.mergeRight(
    player,
    {
        health: R.isEmpty(player.deck)
            ? player.health - 1
            : player.health
    }
)

export const drawCard = R.curry((count: number, player: Player) => {
    const drawed = draw(count, player.deck)
    return R.mergeRight(
        player,
        {
            deck: subtractList(player.deck, drawed),
            hand: player.hand.concat(drawed)
        }
    )
})

const overlord = (player: Player) => R.mergeRight(
    player,
    {
        hand: R.take(MAX_HAND, player.hand)
    }
)

export const activate: (player: Player) => Player = R.pipe(
    incManaSlotAndFill,
    bleedWhenDeckIsEmpty,
    drawCard(1),
    overlord
)

export const useCard = (card: Card, player: Player) => R.mergeRight(
    player,
    {
        mana: useMana(card.manaCost, player),
        hand: subtractList(player.hand, [card])
    }
)

export const dealDamage = (damage: number, player: Player) => R.mergeRight(
    player,
    { health: player.health - damage }
)