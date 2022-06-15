import React, { Component } from "react";

class AddButton extends Component {
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
        display: "flex",
        height: "32px",
      },
      nameStyle: {
        width: "100%",
        paddingTop: "3px",
        paddingLeft: "8px",
        cursor: "default",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  handleClick() {
    var temp;
    if (this.props._type === "heroes") {
      temp = "Hero";
    }
    if (this.props._type === "enemies") {
      temp = "Enemy";
    }
    if (this.props._type === "npcs") {
      temp = "NPC";
    }
    if (this.props._type === "groups") {
      temp = "Group";
    }
    if (this.props._type === "locales") {
      temp = "Locale";
    }
    if (this.props._type === "events") {
      temp = "Event";
    }
    if (this.props._type === "nativeItems") {
      temp = "Item";
    }
    if (
      this.props._type === "heroes" ||
      this.props._type === "npcs" ||
      this.props._type === "enemies"
    ) {
      this.props.store.create(
        "characters",
        {
          name: "New " + temp,
          type: this.props._type,
          localeId: this.props.localeId,
          category: this.props._type,
        },
        () => {
          this.props.refresh();
        }
      );
    } else {
      this.props.store.create(
        this.props._type,
        { name: "New " + temp, localeId: this.props.localeId },
        () => {
          this.props.refresh();
          this.props.forceMarkerLoad();
        }
      );
    }
  }

  render() {
    return (
      <div
        className="hover"
        style={this.state.mainStyle}
        onClick={this.handleClick.bind(this)}
      >
        <div style={this.state.nameStyle}>+</div>
      </div>
    );
  }
}

export default AddButton;
