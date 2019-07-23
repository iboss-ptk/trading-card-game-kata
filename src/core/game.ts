export type Game = {
    state: 'IDLE'
} | {
    state: 'PLAYING'
    activePlayer: Player
    opponent: Player
} | {
    state: 'END'
    winner: Player
    loser: Player
}

export type Player = {
    health: number
    // - start: 30
    mana: ManaSlot[]
    // - start: 0 max 10
    deck: Card[]
    // - start: 20 damage cards, mana costs: 0,0,1,1,2,2,2,3,3,3,3,4,4,4,5,5,6,6,7,8
    cards: Card[]
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
    cards: []
})

export const start = (): Game => ({
    state: 'PLAYING',
    activePlayer: newPlayer(),
    opponent: newPlayer()
})