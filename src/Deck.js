import React, { Component } from "react";
import axios from "axios";
import Card from "./Card";
import "./Deck.css";

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

export default class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = { deck: null, drawn: [] };
    this.getCard = this.getCard.bind(this);
  }
  async componentDidMount() {
    const deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
    this.setState({ deck: deck.data });
  }
  async getCard() {
    let deck_id = this.state.deck.deck_id;
    try {
      let cardUrl = `${API_BASE_URL}/${deck_id}/draw/`;
      let cardRes = await axios.get(cardUrl);
      if (!cardRes.data.success) {
        throw new Error("No Card Remaining");
      }
      let card = cardRes.data.cards[0];
      this.setState((st) => ({
        remaining: cardRes.data.remaining,
        drawn: [
          ...st.drawn,
          {
            id: card.code,
            image: card.image,
            name: `${card.value} ${card.suit}`,
          },
        ],
      }));
    } catch (err) {
      alert(err);
    }
  }
  render() {
    const cards = this.state.drawn.map((c) => (
      <Card key={c.id} name={c.name} image={c.image} />
    ));
    return (
      <div>
        <h1 className="Deck-title">♦️ Card Dealer ♦️</h1>
        <h3 className="Deck-title subtitle">
          ♦️ A little demo made with react ♦️
        </h3>
        <button className="btn" onClick={this.getCard}>
          Get a Card
        </button>
        {this.state.remaining < 52 && (
          <p>{this.state.remaining} Cards Remaining</p>
        )}
        <div className="Card-deck-area">{cards}</div>
      </div>
    );
  }
}
