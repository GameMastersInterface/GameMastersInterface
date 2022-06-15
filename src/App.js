import React, { Component } from "react";
import Menu from "./containers/Menu";
import Map from "./containers/Map";
import GameSelector from "./components/GameSelector";
import BattleMap from "./components/BattleMap";
import ItemViewer from "./components/ItemViewer";
import "./App.css";
import store from "./store";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: store,
      gameSelected: false,
      forceMarkerLoad: false,
      forceMapLoad: false,
      forceMenuLoad: false,
      forceLabelLoad: false,
      battleMapOpen: false,
      battleMapId: -1,
      placing: false,
      placingType: "characters",
      placingId: -1,
      destX: -1,
      destY: -1,
      itemOpen: false,
      openType: "heroes",
      openId: 1,
      localeId: -1,
      itemViewer: -1,
      itemViewerX: 0,
      itemViewerY: 0,
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    return (
      <div className="App">
        {this.state.battleMapOpen ? (
          <BattleMap
            store={this.state.store}
            _id={this.state.battleMapId}
            exit={() => {
              this.setState({ battleMapOpen: false });
            }}
          />
        ) : null}
        {this.state.gameSelected ? null : (
          <GameSelector
            store={this.state.store}
            selectGame={() => {
              this.setState(
                {
                  gameSelected: true,
                  localeId: this.state.store.read("locales", {
                    overworld: true,
                  })[0].id,
                },
                () => {
                  this.setState({
                    forceMapLoad: true,
                    forceMarkerLoad: true,
                    forceMenuLoad: true,
                    forceLabelLoad: true,
                  });
                }
              );
            }}
          />
        )}
        <Menu
          store={this.state.store}
          forceMenuLoad={this.state.forceMenuLoad}
          itemOpen={this.state.itemOpen}
          openType={this.state.openType}
          openId={this.state.openId}
          localeId={this.state.localeId}
          setItemViewerPos={(x, y) => {
            this.setState({ itemViewerX: x, itemViewerY: y });
          }}
          setItemViewer={(val) => {
            this.setState({ itemViewer: val });
          }}
          resetForceMenuLoad={() => {
            this.setState({ forceMenuLoad: false });
          }}
          openBattleMap={(id) => {
            this.setState({ battleMapOpen: true, battleMapId: id });
          }}
          forceMapLoad={() => {
            this.setState({ forceMapLoad: true });
          }}
          forceMarkerLoad={() => {
            this.setState({ forceMarkerLoad: true });
          }}
          setDest={(locale, x, y) => {
            this.setState({ localeId: locale, destX: x, destY: y });
          }}
          setType={(type, cb) => {
            this.setState({ openType: type }, cb);
          }}
          setOpen={(type, id) => {
            if (type === "characters") {
              type = this.state.store.read("characters", { id: id })[0].type;
            }
            this.setState({ itemOpen: true, openType: type, openId: id });
          }}
          exit={() => {
            this.setState({ itemOpen: false });
          }}
          setPlacing={(type, id) => {
            this.setState({
              placingType: type,
              placingId: id,
              placing: true,
            });
          }}
          setLocale={(locale) => {
            this.setState({ localeId: locale });
          }}
        />
        <Map
          store={this.state.store}
          forceMapLoad={this.state.forceMapLoad}
          resetForceMapLoad={() => {
            this.setState({ forceMapLoad: false });
          }}
          forceMarkerLoad={this.state.forceMarkerLoad}
          resetForceMarkerLoad={() => {
            this.setState({ forceMarkerLoad: false });
          }}
          localeId={this.state.localeId}
          placing={this.state.placing}
          placingType={this.state.placingType}
          placingId={this.state.placingId}
          placed={() => {
            this.setState({ placing: false, placingId: -1 });
          }}
          setDest={(x, y) => {
            this.setState({ destX: x, destY: y });
          }}
          destX={this.state.destX}
          destY={this.state.destY}
          resetDest={() => {
            this.setState({ destX: -1, destY: -1 });
          }}
          menuWidth={306}
          setOpen={(type, id) => {
            if (type === "characters") {
              type = this.state.store.read("characters", { id: id })[0].type;
            }
            this.setState({ itemOpen: true, openType: type, openId: id });
          }}
        />
        {this.state.itemViewer === -1 ? null : (
          <ItemViewer
            item={this.state.itemViewer}
            x={this.state.itemViewerX}
            y={this.state.itemViewerY}
          />
        )}
      </div>
    );
  }
}

export default App;
