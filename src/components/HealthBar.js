import React, { Component } from "react";

class HealthBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInputValue: "",
      mainStyle: { marginBottom: "8px", position: "relative" },
      headerContainerStyle: {
        width: "calc(100% - 32px)",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "white",
        borderRadius: "16px",
        fontSize: "20px",
        marginBottom: 0,
        marginLeft: "16px",
        display: "flex",
        cursor: "default",
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px",
      },
      headerStyle: {
        width: "100%",
        borderTopLeftRadius: "16px",
        borderBottomLeftRadius: "16px",
        paddingTop: "3px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingLeft: "8px",
      },
      barStyle: {
        width: "calc(100% - 32px)",
        height: "32px",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "white",
        borderRadius: "16px",
        fontSize: "20px",
        marginBottom: 0,
        marginLeft: "16px",
        display: "flex",
        cursor: "default",
        borderRadius: "0px",
        backgroundColor: "red",
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
      },
      hp: this.props.store.read("characters", { id: this.props._id })[0].hp,
      maxHp: this.props.store.read("characters", { id: this.props._id })[0]
        .maxHp,
      hpInput: React.createRef(),
      maxHpInput: React.createRef(),
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps._id !== this.props._id) {
      this.setState({
        hp: this.props.store.read("characters", { id: this.props._id })[0].hp,
        maxHp: this.props.store.read("characters", { id: this.props._id })[0]
          .maxHp,
      });
      this.state.hpInput.current.value = this.props.store.read("characters", {
        id: this.props._id,
      })[0].hp;
      this.state.maxHpInput.current.value = this.props.store.read(
        "characters",
        {
          id: this.props._id,
        }
      )[0].maxHp;
    }
    if (prevProps._type !== this.props._type) {
      this.setState({
        hp: this.props.store.read("characters", { id: this.props._id })[0].hp,
        maxHp: this.props.store.read("characters", { id: this.props._id })[0]
          .maxHp,
      });
      this.state.hpInput.current.value = this.props.store.read("characters", {
        id: this.props._id,
      })[0].hp;
      this.state.maxHpInput.current.value = this.props.store.read(
        "characters",
        {
          id: this.props._id,
        }
      )[0].maxHp;
    }
  }

  componentWillUnmount() {}

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={this.state.headerContainerStyle}>
          <div style={this.state.headerStyle}>Health</div>
        </div>
        <div className="hover" style={this.state.barStyle}>
          <div
            style={{
              width: (this.state.hp * 100) / this.state.maxHp + "%",
              backgroundColor: "lime",
              borderBottomLeftRadius: "3px",
              borderBottomRightRadius: "3px",
            }}
          ></div>
        </div>
        <div
          style={{
            position: "relative",
            top: "-38px",
            zIndex: 2,
            width: "100%",
            height: "0",
            padding: "0",
            paddingTop: "8px",
            fontSize: "16px",
          }}
        >
          <input
            type="text"
            ref={this.state.hpInput}
            onBlur={(e) => {
              this.props.store.update(
                "characters",
                { id: this.props._id },
                { hp: parseInt(e.target.value) },
                () => {}
              );
              this.setState({ hp: parseInt(e.target.value) }, () => {});
            }}
            defaultValue={this.state.hp}
            style={{
              margin: "0",
              textAlign: "right",
              width: "32px",
              marginLeft: "2px",
              height: "20px",
              backgroundColor: "rgba(0,0,0,0)",
              borderColor: "rgba(0,0,0,0)",
              color: "white",
              textShadow:
                "-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black",
            }}
          />
          /
          <input
            type="text"
            ref={this.state.maxHpInput}
            onBlur={(e) => {
              this.props.store.update(
                "characters",
                { id: this.props._id },
                { maxHp: parseInt(e.target.value) },
                () => {}
              );
              this.setState({ maxHp: parseInt(e.target.value) });
            }}
            defaultValue={this.state.maxHp}
            style={{
              margin: "0",
              width: "32px",
              height: "20px",
              backgroundColor: "rgba(0,0,0,0)",
              borderColor: "rgba(0,0,0,0)",
              color: "white",
              textShadow:
                "-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black",
            }}
          />
        </div>
      </div>
    );
  }
}

export default HealthBar;
