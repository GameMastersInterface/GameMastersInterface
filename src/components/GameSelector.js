import React, { Component } from "react";
import GameButton from "./GameButton";

class GameSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainStyle: {
        position: "absolute",
        width: "320px",
        height: "320px",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "white",
        borderRadius: "16px",
        fontSize: "20px",
        top: "25%",
        left: "calc(50% - 120px)",
        backgroundColor: "rgb(32,32,32)",
        color: "white",
        zIndex: "2",
        paddingBottom: "16px",
        paddingTop: "12px",
      },
      backgroundStyle: {
        position: "absolute",
        width: "100%",
        height: "100%",
        fontSize: "20px",
        backgroundColor: "rgba(0,0,0,.75)",
        zIndex: "1",
      },
      headerStyle: {
        width: "100%",
        height: "28px",
        paddingTop: "4px",
        borderRadius: "16px",
      },
      gameStyle: {
        width: "calc(100% - 32px)",
        height: "28px",
        paddingTop: "4px",
        borderRadius: "16px",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "white",
        marginLeft: "16px",
      },
      games: [],
    };
  }

  componentDidMount() {
    this.props.store.refresh("games", () => {
      this.setState({ games: this.props.store.read("games", {}) });
    });
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  handleAddButton() {
    this.props.store.create("games", { name: "New Game" }, () => {
      this.props.store.refresh("games", () => {
        this.setState({ games: this.props.store.read("games", {}) });
      });
    });
  }

  handleGameButton(id) {
    this.props.store.setGame(id, () => {
      this.props.selectGame();
    });
  }

  render() {
    return (
      <div style={this.state.backgroundStyle}>
        <div style={this.state.mainStyle}>
          <div style={this.state.headerStyle}>Games</div>
          <div
            style={{ height: "288px", overflowY: "auto", overflowX: "hidden" }}
          >
            {this.state.games.map((game) => {
              return (
                <GameButton
                  key={"game" + game.id}
                  _id={game.id}
                  store={this.props.store}
                  open={(id) => {
                    this.handleGameButton(id);
                  }}
                />
              );
            })}
            <div
              style={this.state.gameStyle}
              onClick={this.handleAddButton.bind(this)}
            >
              +
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GameSelector;
