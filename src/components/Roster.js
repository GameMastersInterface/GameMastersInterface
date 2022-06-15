import React, { Component } from "react";
import XIcon from "../assets/x.png";

class Roster extends Component {
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
      memberButtonStyle: {
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "white",
        borderRadius: "16px",
        margin: "8px",
        cursor: "default",
        display: "flex",
      },
      memberNameStyle: {
        paddingTop: "3px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "calc(100% - 34px)",
      },
      group: { name: "", groupMembers: [] },
    };
  }

  load() {
    var group = this.props.store.read("groups", { id: this.props._id })[0];
    //group.groupMembers = this.props.store.read("groupMembers")
    //console.log(group)
    this.setState({
      group: group,
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

  removeUniqueMember(member) {
    this.props.store.update(
      "groupMembers",
      { id: member.id, characterId: member.characterId },
      { groupId: -1 },
      () => {
        this.props.updateSelector();
        this.load();
        this.props.forceMarkerLoad();
      }
    );
  }

  handleQuantityChange(e) {
    if (e.target.value !== "") {
      this.props.store.update(
        "groupMembers",
        {
          id: parseInt(e.target.attributes._id.value),
          //characterId: parseInt(e.target.attributes.characterid.value),
          //groupId: this.props._id,
        },
        {
          quantity: parseInt(e.target.value),
          // maxHp: this.props.store.read("characters", {
          //   id: parseInt(e.target.attributes.characterid.value),
          // })[0].maxHp,
        },
        () => {
          this.props.updateSelector();
          this.load();
          this.props.forceMarkerLoad();
        }
      );
    }
  }

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={this.state.headerStyle}>Roster</div>
        <div style={this.state.contentStyle}>
          {this.state.group.groupMembers.map((member) => {
            return (
              <div
                key={"member" + member.character.id}
                style={this.state.memberButtonStyle}
              >
                <div style={this.state.memberNameStyle}>
                  {member.character.name}
                </div>
                {member.character.unique ? (
                  <img
                    onClick={() => {
                      this.removeUniqueMember(member);
                    }}
                    className="hover"
                    alt="Remove Member"
                    title="Remove Member"
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
                    _id={member.id}
                    characterid={member.characterId}
                    onBlur={this.handleQuantityChange.bind(this)}
                    defaultValue={member.quantity}
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

export default Roster;
