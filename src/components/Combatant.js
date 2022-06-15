import React, { Component } from "react";
import EditIcon from "../assets/edit.png";
import CheckIcon from "../assets/check.png";

class Combatant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInputValue: "",
      mainStyle: {
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "rgb(32,32,32)",
        marginBottom: "8px",
        position: "relative",
        paddingTop: "8px",
        borderTopLeftRadius:
          this.props.store.read("combatants", { id: this.props._id })[0]
            .memberId === -2
            ? "16px"
            : "0px",
        borderBottomLeftRadius:
          this.props.store.read("combatants", { id: this.props._id })[0]
            .memberId === -2
            ? "16px"
            : "0px",
        borderTopRightRadius:
          this.props.store.read("combatants", { id: this.props._id })[0]
            .memberId >= -1
            ? "16px"
            : "0px",
        borderBottomRightRadius:
          this.props.store.read("combatants", { id: this.props._id })[0]
            .memberId >= -1
            ? "16px"
            : "0px",
      },
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
        borderBottomRightRadius: "4px",
        borderBottomLeftRadius: "4px",
      },
      nameStyle: {
        width:
          this.props._id !== -1 &&
          this.props.store.read("combatants", { id: this.props._id }).length >
            0 &&
          this.props.store.read("combatants", { id: this.props._id })[0]
            .characterId === -1
            ? "calc(100% - 34px)"
            : "calc(100%)",
        borderTopLeftRadius: "16px",
        borderBottomLeftRadius: "16px",
        borderTopRightRadius:
          this.props._id !== -1 &&
          this.props.store.read("combatants", { id: this.props._id }).length >
            0 &&
          this.props.store.read("combatants", { id: this.props._id })[0]
            .characterId === -1
            ? "0px"
            : "16px",
        borderBottomRightRadius:
          this.props._id !== -1 &&
          this.props.store.read("combatants", { id: this.props._id }).length >
            0 &&
          this.props.store.read("combatants", { id: this.props._id })[0]
            .characterId === -1
            ? "0px"
            : "16px",
        paddingTop: "1px",
        paddingLeft: "1px",
        margin: "0px",
        padding: "0px",
      },
      inputStyle: {
        width: "calc(100% - 10px)",
        borderTopLeftRadius: "16px",
        borderBottomLeftRadius: "16px",
        fontSize: "18px",
        textAlign: "center",
        backgroundColor: "rgb(32, 32, 32)",
        color: "white",
        borderTopRightRadius:
          this.props._id !== -1 &&
          this.props.store.read("combatants", { id: this.props._id }).length >
            0 &&
          this.props.store.read("combatants", { id: this.props._id })[0]
            .characterId === -1
            ? "0px"
            : "16px",
        borderBottomRightRadius:
          this.props._id !== -1 &&
          this.props.store.read("combatants", { id: this.props._id }).length >
            0 &&
          this.props.store.read("combatants", { id: this.props._id })[0]
            .characterId === -1
            ? "0px"
            : "16px",
        height: "30px",
      },
      editSrc: EditIcon,
      name:
        this.props.store.read("combatants", { id: this.props._id })[0]
          .characterId === -1
          ? this.props.store.read("combatants", { id: this.props._id })[0].name
          : this.props.store.read("characters", {
              id: this.props.store.read("combatants", { id: this.props._id })[0]
                .characterId,
            })[0].name,
      hp: this.props.store.read("combatants", { id: this.props._id })[0].hp,
      maxHp: this.props.store.read("combatants", { id: this.props._id })[0]
        .maxHp,
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selected !== this.props.selected) {
      var mainStyle = { ...this.state.mainStyle };
      mainStyle.backgroundColor = this.props.selected
        ? "rgb(64, 64, 64)"
        : "rgb(32, 32, 32)";
      this.setState({
        mainStyle: mainStyle,
      });
    }
    if (prevProps.hover !== this.props.hover) {
      var mainStyle = { ...this.state.mainStyle };
      mainStyle.borderColor = this.props.hover
        ? "rgb(255, 255, 255)"
        : "rgb(32, 32, 32)";
      this.setState({
        mainStyle: mainStyle,
      });
    }
  }

  componentWillUnmount() {}

  handleInput(e) {
    this.setState({ name: e.target.value });
  }

  handleEditClick() {
    if (
      this.props.store.read("combatants", { id: this.props._id })[0]
        .characterId === -1 &&
      this.state.editSrc === CheckIcon &&
      this.state.name !==
        this.props.store.read("combatants", { id: this.props._id })[0].name
    ) {
      this.props.store.update(
        "combatants",
        { id: this.props._id },
        { name: this.state.name },
        () => {}
      );
    }
    if (
      this.props.store.read("combatants", { id: this.props._id })[0]
        .characterId === -1
    ) {
      this.setState({
        editSrc: this.state.editSrc === EditIcon ? CheckIcon : EditIcon,
      });
    }
  }

  render() {
    return (
      <div
        style={this.state.mainStyle}
        onContextMenu={(e) => {
          e.preventDefault();
          if (
            this.props.store.read("combatants", { id: this.props._id })[0]
              .characterId === -1
          ) {
            this.props.destroy();
          }
        }}
      >
        <div style={this.state.headerContainerStyle}>
          <div style={this.state.nameStyle}>
            <input
              style={this.state.inputStyle}
              type="test"
              defaultValue={this.state.name}
              onChange={this.handleInput.bind(this)}
              disabled={this.state.editSrc === EditIcon}
            />
          </div>
          <div>
            {this.props._id !== -1 &&
            this.props.store.read("combatants", { id: this.props._id }).length >
              0 &&
            this.props.store.read("combatants", { id: this.props._id })[0]
              .characterId === -1 ? (
              <img
                className="hover"
                style={{
                  borderTopRightRadius: "16px",
                  borderBottomRightRadius: "16px",
                }}
                src={this.state.editSrc}
                onClick={this.handleEditClick.bind(this)}
                alt={
                  this.state.editSrc === EditIcon
                    ? "Change Name"
                    : "Save Changes"
                }
                title={
                  this.state.editSrc === EditIcon
                    ? "Change Name"
                    : "Save Changes"
                }
              />
            ) : null}
          </div>
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
            onBlur={(e) => {
              this.props.store.update(
                "combatants",
                {
                  id: this.props._id,
                },
                { hp: parseInt(e.target.value) },
                () => {}
              );
              this.setState({ hp: parseInt(e.target.value) }, () => {});
            }}
            defaultValue={parseInt(this.state.hp)}
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
          /{" "}
          <input
            type="text"
            disabled={
              this.props.store.read("combatants", {
                id: this.props._id,
              }).length === 1 &&
              this.props.store.read("combatants", {
                id: this.props._id,
              })[0].characterId !== -1
            }
            onBlur={(e) => {
              this.props.store.update(
                "combatants",
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

export default Combatant;
