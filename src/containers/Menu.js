import React, { Component } from "react";
import MenuBar from "../components/MenuBar";
import ItemButton from "../components/ItemButton";
import AddButton from "../components/AddButton";
import Character from "./Character.js";
import Group from "./Group.js";
import Locale from "./Locale.js";
import Event from "./Event.js";
import Item from "./Item.js";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        backgroundColor: "rgb(48, 48, 48)",
        width: 306 + "px",
        height: "100vh",
      },
      searchBarStyle: {
        position: "relative",
        top: "-6px",
        fontSize: "20px",
        width: "calc(100% - 12px)",
        backgroundColor: "rgb(32, 32, 32)",
        color: "white",
        textAlign: "center",
        marginBottom: "8px",
      },
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
      searchInputRef: React.createRef(),
      searchInputValue: "",
      itemList: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.refresh(() => {});
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.openType !== this.props.openType) {
      this.refresh(() => {});
      if (!this.props.itemOpen) {
        var _temp = this.state.searchInputRef;
        _temp.current.value = "";
      }
      this.setState({ searchInputValue: "" });
    }
    if (
      prevProps.forceMenuLoad !== this.props.forceMenuLoad &&
      this.props.forceMenuLoad
    ) {
      this.refresh(() => {
        console.log(this.state.itemList);
      });
      this.props.resetForceMenuLoad();
    }
  }

  componentWillUnmount() {}

  refresh(cb) {
    this.setState({ loading: true }, () => {
      if (
        this.props.openType === "heroes" ||
        this.props.openType === "npcs" ||
        this.props.openType === "enemies"
      ) {
        this.props.store.refresh("characters", () => {
          this.setState(
            {
              itemList: this.props.store.read("characters", {
                category: this.props.openType,
              }),
              loading: false,
            },
            cb
          );
        });
      } else {
        this.props.store.refresh(this.props.openType, () => {
          this.setState(
            {
              itemList: this.props.store.read(this.props.openType, {}),
              loading: false,
            },
            cb
          );
        });
      }
    });
  }

  render() {
    return (
      <div style={this.state.style}>
        <MenuBar
          setType={(type, cb) => {
            this.props.setType(type, cb);
          }}
          itemOpen={this.props.itemOpen}
          openType={this.props.openType}
          openId={this.props.openId}
          exit={() => {
            this.setState({ searchInputValue: "" });
            this.props.exit();
          }}
        />
        {this.props.itemOpen || this.props.openType === "file" ? null : (
          <input
            ref={this.state.searchInputRef}
            style={this.state.searchBarStyle}
            type="text"
            placeholder="Search..."
            onChange={(e) => {
              this.setState({ searchInputValue: e.target.value });
            }}
          />
        )}
        <div
          style={{
            height: this.props.itemOpen
              ? "calc(100vh - 88px)"
              : "calc(100vh - 128px)",
            overflow: "auto",
          }}
        >
          {this.props.itemOpen || this.state.loading
            ? null
            : this.state.itemList.map((item) => {
                return item.name
                  .toUpperCase()
                  .includes(this.state.searchInputValue.toUpperCase()) ? (
                  <ItemButton
                    key={"menu_" + this.props.openType + "_" + item.id}
                    store={this.props.store}
                    name={item.name}
                    _type={this.props.openType}
                    _id={item.id}
                    forceMarkerLoad={() => {
                      this.props.forceMarkerLoad();
                    }}
                    open={(type, id) => {
                      this.props.setOpen(type, id);
                    }}
                    setDest={(locale, x, y) => {
                      this.props.setDest(locale, x, y);
                    }}
                  />
                ) : null;
              })}
          {this.props.itemOpen || this.props.openType === "file" ? null : (
            <AddButton
              store={this.props.store}
              _type={this.props.openType}
              refresh={() => {
                this.refresh(() => {});
              }}
              localeId={this.props.localeId}
              forceMarkerLoad={() => {
                this.props.forceMarkerLoad();
              }}
            />
          )}
          {this.props.itemOpen &&
          (this.props.openType === "heroes" ||
            this.props.openType === "npcs" ||
            this.props.openType === "enemies") ? (
            <Character
              _id={this.props.openId}
              store={this.props.store}
              setItemViewer={(val) => {
                this.props.setItemViewer(val);
              }}
              setItemViewerPos={(x, y) => {
                this.props.setItemViewerPos(x, y);
              }}
              forceMarkerLoad={() => {
                this.props.forceMarkerLoad();
              }}
              setDest={(locale, x, y) => {
                this.props.setDest(locale, x, y);
              }}
              setPlacing={(type, id) => {
                this.props.setPlacing(type, id);
              }}
              exit={() => {
                this.refresh(() => {
                  this.props.forceMarkerLoad();
                  this.props.exit();
                });
              }}
            />
          ) : null}
          {this.props.itemOpen && this.props.openType === "groups" ? (
            <Group
              _id={this.props.openId}
              store={this.props.store}
              openBattleMap={(id) => {
                this.props.openBattleMap(id);
              }}
              forceMarkerLoad={() => {
                this.props.forceMarkerLoad();
              }}
              setDest={(locale, x, y) => {
                this.props.setDest(locale, x, y);
              }}
              setPlacing={(type, id) => {
                this.props.setPlacing(type, id);
              }}
              exit={() => {
                this.refresh(() => {
                  this.props.forceMarkerLoad();
                  this.props.exit();
                });
              }}
            />
          ) : null}
          {this.props.itemOpen && this.props.openType === "nativeItems" ? (
            <Item
              _id={this.props.openId}
              store={this.props.store}
              exit={() => {
                this.refresh(() => {
                  this.props.forceMarkerLoad();
                  this.props.exit();
                });
              }}
            />
          ) : null}
          {this.props.itemOpen && this.props.openType === "locales" ? (
            <Locale
              _id={this.props.openId}
              store={this.props.store}
              forceMapLoad={() => {
                this.props.forceMapLoad(this.props.openId);
              }}
              forceMarkerLoad={() => {
                this.props.forceMarkerLoad(this.props.openId);
              }}
              setDest={(locale, x, y) => {
                this.props.setDest(locale, x, y);
              }}
              setPlacing={(type, id) => {
                this.props.setPlacing(type, id);
              }}
              setLocale={(localeId) => {
                this.props.setLocale(localeId);
              }}
              exit={() => {
                this.refresh(() => {
                  this.props.forceMarkerLoad();
                  this.props.exit();
                });
              }}
            />
          ) : null}
          {this.props.itemOpen && this.props.openType === "events" ? (
            <Event
              _id={this.props.openId}
              store={this.props.store}
              forceMapLoad={() => {
                this.props.forceMapLoad();
              }}
              setDest={(locale, x, y) => {
                this.props.setDest(locale, x, y);
              }}
              setPlacing={(type, id) => {
                this.props.setPlacing(type, id);
              }}
              exit={() => {
                this.refresh(() => {
                  this.props.forceMarkerLoad();
                  this.props.exit();
                });
              }}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Menu;
