import React, { Component } from "react";
import HeroIcon from "../assets/hero.png";
import NPCIcon from "../assets/npc.png";
import EnemyIcon from "../assets/enemy.png";

class MemberSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorySelected: "heroes",
      searchInputRef: React.createRef(),
      searchInputValue: "",
      mainStyle: {
        width: "calc(100% - 32px)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "white",
        borderRadius: "16px",
        fontSize: "20px",
        marginBottom: "16px",
        marginLeft: "16px",
        borderBottomRightRadius: "4px",
        borderBottomLeftRadius: "4px",
      },
      headerStyle: {
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: "white",
        width: "100%",
        height: "28px",
        paddingTop: "4px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      categoryStyle: {
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: "white",
        width: "100%",
        height: "33px",
        display: "flex",
      },
      searchStyle: {
        width: "100%",
        height: "33px",
        display: "flex",
      },
      searchInputStyle: {
        marginTop: "2px",
        marginLeft: "2px",
        width: "calc(100% - 12px)",
        height: "23px",
        backgroundColor: "rgb(32, 48, 32)",
        color: "white",
        textAlign: "center",
      },
      categoryButtonStyle: {
        width: "calc(100% / 3)",
      },
      contentStyle: {
        height: "160px",
        overflow: "auto",
      },
      memberButtonStyle: {
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "white",
        borderRadius: "16px",
        margin: "8px",
        cursor: "default",
        height: "29px",
        paddingTop: "3px",
        paddingBottom: "0",
      },
      group: {},
      memberIds: [],
      availableMembers: [],
    };
  }

  load() {
    this.setState(
      { group: this.props.store.read("groups", { id: this.props._id })[0] },
      () => {
        var temp = [];
        this.state.group.groupMembers.forEach((member) => {
          temp = [...temp, member.characterId];
        });
        this.setState({ memberIds: temp }, () => {
          var characters = this.props.store.read("characters", {
            category: this.state.categorySelected,
          });
          var contained;
          temp = [];
          characters.forEach((character) => {
            contained = false;
            this.state.memberIds.forEach((id) => {
              if (id === character.id) {
                contained = true;
              }
            });
            if (!contained) {
              temp = [...temp, character];
            }
          });
          this.setState({ availableMembers: temp });
        });
      }
    );
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.update !== this.props.update && this.props.update) {
      this.load();
      this.props.resetUpdate();
    }
    if (prevProps._id !== this.props._id) {
      this.load();
    }
    if (prevProps._type !== this.props._type) {
      this.load();
    }
  }

  componentWillUnmount() {}

  changeCategory(category, color) {
    var _temp = this.state.searchInputRef;
    _temp.current.value = "";
    this.setState({ searchInputValue: "" });
    var temp = { ...this.state.searchInputStyle };
    temp.backgroundColor = color;
    this.setState(
      {
        searchInputStyle: temp,
        categorySelected: category,
      },
      () => {
        this.load();
      }
    );
  }

  memberButtonClickHandler(member) {
    if (member.unique) {
      this.props.store.update(
        "groupMembers",
        {
          characterId: member.id,
          id: this.props.store.read("groupMembers", {
            characterId: member.id,
          })[0].id,
        },
        {
          groupId: this.props._id,
          maxHp: this.props.store.read("characters", { id: member.id })[0]
            .maxHp,
          hp: this.props.store.read("characters", { id: member.id })[0].hp,
        },
        () => {
          this.load();
          this.props.updateRoster();
          this.props.forceMarkerLoad();
        }
      );
    } else {
      this.props.store.create(
        "groupMembers",
        {
          groupId: this.props._id,
          characterId: member.id,
          maxHp: this.props.store.read("characters", { id: member.id })[0]
            .maxHp,
        },
        () => {
          this.props.store.refresh("groups", () => {
            this.props.store.refresh("groupMembers", () => {
              this.props.store.refresh("characters", () => {
                this.load();
                this.props.updateRoster();
                this.props.forceMarkerLoad();
              });
            });
          });
        }
      );
    }
  }

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={this.state.headerStyle}>Member Selector</div>
        <div style={this.state.categoryStyle}>
          <div
            style={{
              backgroundColor: "green",
              ...this.state.categoryButtonStyle,
            }}
            onClick={() => {
              this.changeCategory("heroes", "rgb(32, 56, 32)");
            }}
          >
            <div className="hover">
              <img src={HeroIcon} alt="" />
            </div>
          </div>
          <div
            style={{
              backgroundColor: "blue",
              ...this.state.categoryButtonStyle,
            }}
            onClick={() => {
              this.changeCategory("npcs", "rgb(32, 32, 56)");
            }}
          >
            <div className="hover">
              <img src={NPCIcon} alt="" />
            </div>
          </div>
          <div
            style={{
              backgroundColor: "red",
              ...this.state.categoryButtonStyle,
            }}
            onClick={() => {
              this.changeCategory("enemies", "rgb(56, 32, 32)");
            }}
          >
            <div className="hover-enemy">
              <img src={EnemyIcon} alt="" />
            </div>
          </div>
        </div>
        <div style={this.state.searchStyle}>
          <input
            ref={this.state.searchInputRef}
            style={this.state.searchInputStyle}
            placeholder={
              "Search " +
              (this.state.categorySelected === "npcs"
                ? "NPCs"
                : this.state.categorySelected.charAt(0).toUpperCase() +
                  this.state.categorySelected.slice(1)) +
              "..."
            }
            onChange={(e) => {
              this.setState({ searchInputValue: e.target.value });
            }}
          />
        </div>
        <div style={this.state.contentStyle}>
          {this.state.availableMembers.map((member) => {
            return member.name
              .toUpperCase()
              .includes(this.state.searchInputValue.toUpperCase()) ? (
              <div
                className="hover"
                key={"member" + member.id}
                style={this.state.memberButtonStyle}
                onClick={() => {
                  this.memberButtonClickHandler(member);
                }}
              >
                <div>
                  <div
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {member.name}
                  </div>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    );
  }
}

export default MemberSelector;
