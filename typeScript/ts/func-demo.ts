interface Card {
  suit: string;
  card: number;
}

interface Deck {
  suits: string[];
  cards: number[];
  createCardPicker(this: Deck): () => Card
}

let deck: Deck = {
  suits: ['1', '2', '3'],
  cards: [1, 2, 3],
  createCardPicker(this: Deck) {
    return deck
  }
}