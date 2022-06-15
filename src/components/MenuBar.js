import React, { Component } from "react";
import FileIcon from "../assets/file.png";
import HeroIcon from "../assets/hero.png";
import NPCIcon from "../assets/npc.png";
import EnemyIcon from "../assets/enemy.png";
import GroupIcon from "../assets/group.png";
import LootIcon from "../assets/loot.png";
import CacheIcon from "../assets/cache.png";
import LocaleIcon from "../assets/locale.png";
import EventIcon from "../assets/event.png";
import NoImage from "../assets/noimage.png";

class MenuBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: "heroes",
      selectedTypeDisplay: "Heroes",
      selectedColor: "green",
      colorObject: {
        file: "rgb(96, 96, 96)",
        heroes: "green",
        npcs: "blue",
        enemies: "red",
        groups: "#ff8000",
        nativeItems: "yellow",
        caches: "#994c00",
        locales: "#b200b2",
        events: "#0ff",
      },
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.openType !== this.props.openType) {
      if (!this.props.itemOpen) {
        this.props.exit();
      }
      var typeDisplay;
      typeDisplay =
        this.props.openType.charAt(0).toUpperCase() +
        this.props.openType.slice(1);
      if (typeDisplay === "Npcs") {
        typeDisplay = "NPCs";
      } else if (typeDisplay === "NativeItems") {
        typeDisplay = "Loot";
      }
      this.setState({
        selectedType: this.props.openType,
        selectedTypeDisplay: typeDisplay,
        selectedColor: this.state.colorObject[this.props.openType],
      });
      this.props.setType(this.props.openType);
    }
  }

  componentWillUnmount() {}

  clickHandler(e) {
    this.props.exit();
    var typeDisplay =
      e.target.attributes._type.value.charAt(0).toUpperCase() +
      e.target.attributes._type.value.slice(1);
    if (typeDisplay === "Npcs") {
      typeDisplay = "NPCs";
    } else if (typeDisplay === "NativeItems") {
      typeDisplay = "Loot";
    }
    this.setState({
      selectedType: e.target.attributes._type.value,
      selectedTypeDisplay: typeDisplay,
      selectedColor: this.state.colorObject[e.target.attributes._type.value],
    });
    this.props.setType(e.target.attributes._type.value, () => {});
  }

  render() {
    return (
      <div>
        <div
          style={{
            backgroundColor: this.state.selectedColor,
            width: "100%",
            paddingTop: "8px",
            paddingBottom: "8px",
          }}
        >
          {this.state.selectedTypeDisplay}
        </div>
        <div>
          <img
            style={{
              backgroundColor: this.state.colorObject.file,
              padding: "1px",
            }}
            _type="file"
            src={FileIcon}
            alt={NoImage}
            onClick={this.clickHandler.bind(this)}
          />
          <img
            style={{
              backgroundColor: this.state.colorObject.heroes,
              padding: "1px",
            }}
            _type="heroes"
            src={HeroIcon}
            alt={NoImage}
            onClick={this.clickHandler.bind(this)}
          />
          <img
            style={{
              backgroundColor: this.state.colorObject.npcs,
              padding: "1px",
            }}
            _type="npcs"
            src={NPCIcon}
            alt={NoImage}
            onClick={this.clickHandler.bind(this)}
          />
          <img
            style={{
              backgroundColor: this.state.colorObject.enemies,
              padding: "1px",
            }}
            _type="enemies"
            src={EnemyIcon}
            alt={NoImage}
            onClick={this.clickHandler.bind(this)}
          />
          <img
            style={{
              backgroundColor: this.state.colorObject.groups,
              padding: "1px",
            }}
            _type="groups"
            src={GroupIcon}
            alt={NoImage}
            onClick={this.clickHandler.bind(this)}
          />
          <img
            style={{
              backgroundColor: this.state.colorObject.nativeItems,
              padding: "1px",
            }}
            _type="nativeItems"
            src={LootIcon}
            alt={NoImage}
            onClick={this.clickHandler.bind(this)}
          />
          <img
            style={{
              backgroundColor: this.state.colorObject.caches,
              padding: "1px",
            }}
            _type="caches"
            src={CacheIcon}
            alt={NoImage}
            //onClick={this.clickHandler.bind(this)}
          />
          <img
            style={{
              backgroundColor: this.state.colorObject.locales,
              padding: "1px",
            }}
            _type="locales"
            src={LocaleIcon}
            alt={NoImage}
            onClick={this.clickHandler.bind(this)}
          />
          <img
            style={{
              backgroundColor: this.state.colorObject.events,
              padding: "1px",
            }}
            _type="events"
            src={EventIcon}
            alt={NoImage}
            onClick={this.clickHandler.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default MenuBar;
