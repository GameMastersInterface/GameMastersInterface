import React, { Component } from "react";
import VisibleIcon from "../assets/visible.png";
import NotVisibleIcon from "../assets/invisible.png";
import DisabledVisibleIcon from "../assets/visibility_disabled.png";
import GoToIcon from "../assets/goto.png";
import DisabledGoToIcon from "../assets/goto_disabled.png";

class ItemButton extends Component {
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
      },
      nameStyle: {
        width:
          this.props._type === "nativeItems" ? "100%" : "calc(100% - 75px)",
        paddingTop: "3px",
        borderRadius: "8px",
        borderTopLeftRadius: "16px",
        borderBottomLeftRadius: "16px",
        paddingLeft: this.props._type === "nativeItems" ? "8px" : "0px",
        paddingRight: "8px",
        cursor: "default",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingBottom: this.props._type === "nativeItems" ? "8px" : "0px",
      },
      visibleSrc: VisibleIcon,
      gotoSrc: GoToIcon,
      item: null,
    };
  }

  componentDidMount() {
    if (
      this.props._type === "heroes" ||
      this.props._type === "npcs" ||
      this.props._type === "enemies"
    ) {
      this.setState({
        item: this.props.store.read("characters", {
          id: this.props._id,
        })[0],
      });
    } else {
      this.setState({
        item: this.props.store.read(this.props._type, {
          id: this.props._id,
        })[0],
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.item !== this.state.item) {
      if (
        this.props._type === "heroes" ||
        this.props._type === "npcs" ||
        this.props._type === "enemies"
      ) {
        if (
          this.state.item.unique &&
          this.state.item.visible &&
          this.state.item.groupMembers[0].groupId === -1
        ) {
          this.setState({ visibleSrc: VisibleIcon });
        } else if (
          this.state.item.unique &&
          !this.state.item.visible &&
          this.state.item.groupMembers[0].groupId === -1
        ) {
          this.setState({ visibleSrc: NotVisibleIcon });
        } else if (
          !this.state.item.unique ||
          (this.state.item.unique &&
            this.state.item.groupMembers[0].groupId !== -1)
        ) {
          this.setState({ visibleSrc: DisabledVisibleIcon });
        }
        if (this.state.item.unique) {
          this.setState({ gotoSrc: GoToIcon });
        } else {
          this.setState({ gotoSrc: DisabledGoToIcon });
        }
      } else {
        if (this.state.item.visible) {
          this.setState({ visibleSrc: VisibleIcon });
        } else {
          this.setState({ visibleSrc: NotVisibleIcon });
        }
      }
    }
    if (this.props._type !== prevProps._type) {
      var temp = { ...this.state.nameStyle };
      temp.paddingBottom = this.props._type === "nativeItems" ? "8px" : "0px";
      temp.paddingBottom = this.props._type === "nativeItems" ? "8px" : "0px";
      temp.width =
        this.props._type === "nativeItems" ? "100%" : "calc(100% - 75px)";

      this.setState({
        nameStyle: temp,
      });
    }
  }

  componentWillUnmount() {}

  handleNameClick() {
    this.props.open(this.props._type, this.props._id);
  }

  handleVisibleClick() {
    if (this.state.visibleSrc !== DisabledVisibleIcon) {
      if (
        this.props._type === "heroes" ||
        this.props._type === "npcs" ||
        this.props._type === "enemies"
      ) {
        this.props.store.update(
          "characters",
          { id: this.props._id },
          { visible: this.state.visibleSrc === NotVisibleIcon },
          () => {
            this.props.forceMarkerLoad();
          }
        );
        this.setState({
          visibleSrc: this.props.store.read("characters", {
            id: this.props._id,
          })[0].visible
            ? VisibleIcon
            : NotVisibleIcon,
        });
      } else {
        this.props.store.update(
          this.props._type,
          { id: this.props._id },
          { visible: this.state.visibleSrc === NotVisibleIcon },
          () => {
            this.props.forceMarkerLoad();
          }
        );
        this.setState({
          visibleSrc: this.props.store.read(this.props._type, {
            id: this.props._id,
          })[0].visible
            ? VisibleIcon
            : NotVisibleIcon,
        });
      }
    }
  }

  handleGoToClick() {
    if (this.state.visibleSrc !== DisabledGoToIcon) {
      if (
        this.props._type === "heroes" ||
        this.props._type === "npcs" ||
        this.props._type === "enemies"
      ) {
        var item = this.props.store.read("characters", {
          id: this.props._id,
        })[0];
        if (item.groupMembers[0].groupId === -1) {
          this.props.setDest(item.localeId, item.localeX, item.localeY);
        } else {
          this.props.setDest(
            item.groupMembers[0].group.localeId,
            item.groupMembers[0].group.localeX,
            item.groupMembers[0].group.localeY
          );
        }
      } else {
        item = this.props.store.read(this.props._type, {
          id: this.props._id,
        })[0];
        this.props.setDest(item.localeId, item.localeX, item.localeY);
      }
    }
  }

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div
          className="hover"
          style={this.state.nameStyle}
          onClick={this.handleNameClick.bind(this)}
        >
          {this.props.name}
        </div>
        {this.props._type === "nativeItems" ? null : (
          <div>
            <img
              alt={
                this.state.visibleSrc === VisibleIcon
                  ? "Hide Marker"
                  : this.state.visibleSrc === DisabledVisibleIcon
                  ? "Disabled"
                  : "Show Marker"
              }
              title={
                this.state.visibleSrc === VisibleIcon
                  ? "Hide Marker"
                  : this.state.visibleSrc === DisabledVisibleIcon
                  ? "Disabled"
                  : "Show Marker"
              }
              className="hover"
              style={{ borderRadius: "8px" }}
              src={this.state.visibleSrc}
              onClick={this.handleVisibleClick.bind(this)}
            />
            <img
              className="hover"
              alt={
                this.state.gotoSrc === GoToIcon ? "Go To Marker" : "Disabled"
              }
              title={
                this.state.gotoSrc === GoToIcon ? "Go To Marker" : "Disabled"
              }
              style={{
                paddingRight: "3px",
                borderRadius: "8px",
                borderTopRightRadius: "16px",
                borderBottomRightRadius: "16px",
              }}
              src={this.state.gotoSrc}
              onClick={this.handleGoToClick.bind(this)}
            />
          </div>
        )}
      </div>
    );
  }
}

export default ItemButton;
