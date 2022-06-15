import React, { Component } from "react";

class BattleMapButton extends Component {
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
    this.props.openBattleMap();
  }

  render() {
    return (
      <div
        className="hover"
        style={this.state.mainStyle}
        onClick={this.handleClick.bind(this)}
      >
        <div style={this.state.nameStyle}>Open Battle Map</div>
      </div>
    );
  }
}

export default BattleMapButton;
