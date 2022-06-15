import React, { Component } from "react";
import DownIcon from "../assets/down.png";
import UpIcon from "../assets/up.png";
import GoToIcon from "../assets/goto.png";
import DisabledGoToIcon from "../assets/goto_disabled.png";

class GroupSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInputValue: "",
      mainStyle: { marginBottom: "16px", position: "relative" },
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
        width: "calc(100% - 34px)",
        borderTopLeftRadius: "16px",
        borderBottomLeftRadius: "16px",
        paddingTop: "3px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingLeft: "8px",
      },
      groupStyle: {
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
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
      },
      groupNameStyle: {
        width: "calc(100% - 34px)",
        paddingTop: "3px",
        borderTopLeftRadius: "16px",
        borderBottomLeftRadius: "16px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingLeft: "8px",
      },
      dropDownContentStyle: {
        width: "calc(100% - 32px)",
        marginLeft: "16px",
        position: "absolute",
        display: "none",
        backgroundColor: "rgba(32, 32, 32, .9)",
        height: "96px",
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px",
        borderColor: "white",
        borderStyle: "solid",
        borderWidth: "1px",
      },
      dropDownButtonStyle: {
        fontSize: "16px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        cursor: "default",
        paddingLeft: "8px",
      },
      searchBarStyle: {
        position: "relative",
        top: "-6px",
        fontSize: "16px",
        width: "calc(100% - 12px)",
        backgroundColor: "rgb(32, 32, 32)",
        color: "white",
        textAlign: "center",
      },
      changeGroupSrc: DownIcon,
      character: this.props.store.read("characters", {
        id: this.props._id,
      })[0],
      groupName: "",
    };
  }

  componentDidMount() {
    if (this.state.character.groupMembers[0].groupId === -1) {
      this.setState({ groupName: "None" });
    } else {
      this.setState({
        groupName: this.state.character.groupMembers[0].group.name,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps._id !== this.props._id) {
      if (parseInt(this.state.character.groupMembers[0].groupId) === -1) {
        this.setState({ groupName: "None" });
      } else {
        this.setState({
          groupName: this.state.character.groupMembers[0].group.name,
        });
      }
    }
  }

  componentWillUnmount() {}

  handleGroupClick() {
    var tempContent = { ...this.state.dropDownContentStyle };
    tempContent.display = tempContent.display === "block" ? "none" : "block";
    var tempGroup = { ...this.state.groupStyle };
    tempGroup.borderBottomLeftRadius =
      tempContent.display === "none" ? "16px" : "4px";
    tempGroup.borderBottomRightRadius =
      tempContent.display === "none" ? "16px" : "4px";
    this.setState({
      changeGroupSrc:
        this.state.changeGroupSrc === DownIcon ? UpIcon : DownIcon,
      dropDownContentStyle: tempContent,
      groupStyle: tempGroup,
    });
  }

  handleButtonClick(e) {
    var tempContent = { ...this.state.dropDownContentStyle };
    tempContent.display = "none";
    var tempGroup = { ...this.state.groupStyle };
    tempGroup.borderBottomLeftRadius = "16px";
    tempGroup.borderBottomRightRadius = "16px";
    this.props.setLoner(e.target.attributes._id.value === "-1");
    this.setState({
      dropDownContentStyle: tempContent,
      groupStyle: tempGroup,
      changeGroupSrc: DownIcon,
    });
    this.props.store.update(
      "groupMembers",
      { characterId: this.props._id },
      { groupId: parseInt(e.target.attributes._id.value) },
      () => {
        this.setState({
          groupName:
            e.target.attributes._id.value === "-1"
              ? "None"
              : this.props.store.read("groups", {
                  id: parseInt(e.target.attributes._id.value),
                })[0].name,
        });
        this.props.store.refresh("characters", () => {
          this.props.forceMarkerLoad();
        });
      }
    );
  }

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={this.state.headerContainerStyle}>
          <div style={this.state.headerStyle}>Group</div>
          <img
            alt="Go To Group"
            title={
              this.state.groupName === "None" ? "Disabled" : "Go To Group"
            }
            className="hover"
            src={this.state.groupName === "None" ? DisabledGoToIcon : GoToIcon}
            style={{ borderTopRightRadius: "16px" }}
          />
        </div>
        <div
          className="hover"
          style={this.state.groupStyle}
          onClick={this.handleGroupClick.bind(this)}
        >
          <div style={this.state.groupNameStyle}>{this.state.groupName}</div>
          <img
            alt="Change Group"
            title="Change Group"
            src={this.state.changeGroupSrc}
          />
        </div>
        <div style={this.state.dropDownContentStyle}>
          <input
            style={this.state.searchBarStyle}
            type="text"
            placeholder="Search..."
            onChange={(e) => {
              this.setState({ searchInputValue: e.target.value });
            }}
          />
          <div style={{ overflow: "auto", height: "65px" }}>
            {this.state.searchInputValue === "" ? (
              <div
                style={this.state.dropDownButtonStyle}
                onClick={this.handleButtonClick.bind(this)}
                className="hover"
                _id={-1}
              >
                None
              </div>
            ) : null}
            {this.props.store.read("groups", {}).map((group) => {
              return group.name
                .toUpperCase()
                .includes(this.state.searchInputValue.toUpperCase()) ? (
                <div
                  key={"group_selector_" + group.id}
                  style={this.state.dropDownButtonStyle}
                  onClick={this.handleButtonClick.bind(this)}
                  className="hover"
                  _id={group.id}
                >
                  {group.name}
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default GroupSelector;
