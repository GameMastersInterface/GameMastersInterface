import React, { Component } from "react";
import XIcon from "../assets/x.png";

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        display: "flex",
      },
      itemNameStyle: {
        paddingTop: "3px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "calc(100% - 34px)",
      },
      items: this.props.store.read("inventoryItems", {
        ownerType: this.props._type,
        ownerId: this.props._id,
      }),
    };
  }

  load() {
    this.props.store.refresh("inventoryItems", () => {
      this.setState({
        items: this.props.store.read("inventoryItems", {
          ownerType: this.props._type,
          ownerId: this.props._id,
        }),
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

  removeUniqueItem(item) {
    this.props.store.update(
      "inventoryItems",
      { id: item.id },
      { ownerId: -1 },
      () => {
        this.props.updateSelector();
        this.load();
      }
    );
  }

  handleQuantityChange(e) {
    if (e.target.value !== "") {
      this.props.store.update(
        "inventoryItems",
        {
          id: parseInt(e.target.attributes._id.value),
        },
        {
          quantity: parseInt(e.target.value),
        },
        () => {
          this.props.store.refresh("inventoryItems", () => {
            this.props.updateSelector();
            this.load();
          });
        }
      );
    }
  }

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={this.state.headerStyle}>Inventory</div>
        <div style={this.state.contentStyle}>
          {this.state.items.map((item) => {
            return (
              <div
                key={"inventoryitem" + item.id}
                style={this.state.itemButtonStyle}
                onMouseEnter={() => {
                  this.props.setItemViewer(item);
                }}
                onMouseMove={(e) => {
                  this.props.setItemViewerPos(e.clientX, e.clientY);
                }}
                onMouseLeave={() => {
                  this.props.setItemViewer(-1);
                }}
              >
                <div style={this.state.itemNameStyle}>{item.item.name}</div>
                {item.item.unique ? (
                  <img
                    onClick={() => {
                      this.removeUniqueItem(item);
                    }}
                    className="hover"
                    alt="Remove Item"
                    title="Remove Item"
                    src={XIcon}
                    style={{
                      borderBottomRightRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  />
                ) : (
                  <input
                    type="number"
                    style={{
                      width: "38px",
                      height: "26px",
                      borderBottomRightRadius: "16px",
                      borderTopRightRadius: "16px",
                      backgroundColor: "rgb(32, 32, 32)",
                      color: "white",
                    }}
                    min="0"
                    max="999"
                    step="1"
                    _id={item.id}
                    onBlur={this.handleQuantityChange.bind(this)}
                    defaultValue={item.quantity}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Inventory;
