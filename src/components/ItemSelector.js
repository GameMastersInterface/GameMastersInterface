import React, { Component } from "react";
import HeroIcon from "../assets/hero.png";
import NPCIcon from "../assets/npc.png";
import EnemyIcon from "../assets/enemy.png";

class ItemSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        backgroundColor: "rgb(32, 32, 32)",
        color: "white",
        textAlign: "center",
      },
      contentStyle: {
        height: "160px",
        overflow: "auto",
      },
      itemButtonStyle: {
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
      items: [],
    };
  }

  load() {
    this.props.store.refresh("inventoryItems", () => {
      this.props.store.refresh("nativeItems", () => {
        var allItems = this.props.store.read("nativeItems", {});
        var obtainedItems = this.props.store.read("inventoryItems", {
          ownerType: this.props._type,
          ownerId: this.props._id,
        });
        var items = [];
        var found;
        for (var i = 0; i < allItems.length; i++) {
          found = false;
          for (var j = 0; j < obtainedItems.length; j++) {
            if (allItems[i].id === obtainedItems[j].itemId) {
              found = true;
            }
          }
          if (!found) {
            items = [...items, allItems[i]];
          }
        }
        console.log(obtainedItems);
        this.setState({ items: items });
      });
    });
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

  itemButtonClickHandler(item) {
    if (item.unique) {
      this.props.store.update(
        "inventoryItems",
        {
          itemId: item.id,
        },
        {
          ownerType: this.props._type,
          ownerId: this.props._id,
        },
        () => {
          this.load();
          this.props.updateInventory();
        }
      );
    } else {
      this.props.store.create(
        "inventoryItems",
        {
          itemId: item.id,
          ownerType: this.props._type,
          ownerId: this.props._id,
          quantity: 1,
        },
        () => {
          this.load();
          this.props.updateInventory();
        }
      );
    }
  }

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={this.state.headerStyle}>Item Selector</div>
        <div style={this.state.searchStyle}>
          <input
            ref={this.state.searchInputRef}
            style={this.state.searchInputStyle}
            placeholder={"Search Items..."}
            onChange={(e) => {
              this.setState({ searchInputValue: e.target.value });
            }}
          />
        </div>
        <div style={this.state.contentStyle}>
          {this.state.items.map((item) => {
            return item.name
              .toUpperCase()
              .includes(this.state.searchInputValue.toUpperCase()) ? (
              <div
                className="hover"
                key={"item" + item.id}
                style={this.state.itemButtonStyle}
                onClick={() => {
                  this.itemButtonClickHandler(item);
                }}
                onMouseEnter={() => {
                  var _item = {
                    item: this.props.store.read("nativeItems", {
                      id: item.id,
                    })[0],
                  };
                  _item.item.stats = this.props.store.read("stats", {
                    itemId: item.id,
                  });
                  this.props.setItemViewer(_item);
                }}
                onMouseMove={(e) => {
                  this.props.setItemViewerPos(e.clientX, e.clientY);
                }}
                onMouseLeave={() => {
                  this.props.setItemViewer(-1);
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
                    {item.name}
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

export default ItemSelector;
