import React, { Component } from "react";
import EditIcon from "../assets/edit.png";
import GoToIcon from "../assets/goto.png";
import PinIcon from "../assets/pin.png";
import VisibleIcon from "../assets/visible.png";
import NotVisibleIcon from "../assets/invisible.png";

class Marker extends Component {
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
      },
      headerStyle: {
        width:
          this.props.unique && this.props.loner
            ? "calc(100% - 130px)"
            : "calc(100% - 32px)",
        height: "28px",
        paddingTop: "4px",
        borderTopLeftRadius: "16px",
        borderBottomLeftRadius: "16px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      markerStyle: {
        width: "calc(100% - 8px)",
        borderRadius: "12px",
        imageRendering: "pixelated",
      },
      iconStyle: {
        borderRadius: "12px",
        height: "32px",
      },
      visibleSrc: VisibleIcon,
      markerSrc: this.props.store.read(this.props._type, {
        id: this.props._id,
      })[0].marker.src,
      fileInput: React.createRef(),
    };
  }

  componentDidMount() {
    this.setState({
      visibleSrc: this.props.store.read(this.props._type, {
        id: this.props._id,
      })[0].visible
        ? VisibleIcon
        : NotVisibleIcon,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps._id !== this.props._id) {
      this.setState({
        visibleSrc: this.props.store.read(this.props._type, {
          id: this.props._id,
        })[0].visible
          ? VisibleIcon
          : NotVisibleIcon,
        markerSrc: this.props.store.read(this.props._type, {
          id: this.props._id,
        })[0].marker.src,
      });
    }
    if (prevProps._type !== this.props._type) {
      this.setState({
        visibleSrc: this.props.store.read(this.props._type, {
          id: this.props._id,
        })[0].visible
          ? VisibleIcon
          : NotVisibleIcon,
        markerSrc: this.props.store.read(this.props._type, {
          id: this.props._id,
        })[0].marker.src,
      });
    }
    if (prevProps.unique !== this.props.unique) {
      var headerStyle = { ...this.state.headerStyle };
      headerStyle.width =
        this.props.unique && this.props.loner
          ? "calc(100% - 130px)"
          : "calc(100% - 32px)";
      this.setState({ headerStyle: headerStyle });
    }
    if (prevProps.loner !== this.props.loner) {
      var headerStyle = { ...this.state.headerStyle };
      headerStyle.width =
        this.props.unique && this.props.loner
          ? "calc(100% - 130px)"
          : "calc(100% - 32px)";
      this.setState({ headerStyle: headerStyle });
    }
  }

  componentWillUnmount() {}

  handleInput(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    const scopeThis = this;
    if (file) {
      reader.readAsDataURL(file);
    }
    reader.addEventListener(
      "load",
      function () {
        scopeThis.setState({ markerSrc: reader.result });
        scopeThis.props.store.update(
          "upload",
          {
            type: scopeThis.props._type,
            id: scopeThis.props._id,
            game: scopeThis.props.store.gameId,
            category: "marker",
          },
          { marker: reader.result },
          () => {
            scopeThis.props.forceMarkerLoad();
          }
        );
      },
      false
    );
  }

  handlePinClick(e) {
    this.props.setPlacing(this.props._type, this.props._id);
  }

  handleVisibleClick(e) {
    const scopeThis = this;
    this.props.store.update(
      this.props._type,
      { id: this.props._id },
      { visible: this.state.visibleSrc === NotVisibleIcon },
      () => {
        scopeThis.props.forceMarkerLoad();
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

  handleGoToClick() {
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
        item = this.props.store.read("groups", {
          id: item.groupMembers[0].groupId,
        })[0];
        this.props.setDest(item.localeId, item.localeX, item.localeY);
      }
    } else {
      item = this.props.store.read(this.props._type, {
        id: this.props._id,
      })[0];
      console.log(item);
      this.props.setDest(item.localeId, item.localeX, item.localeY);
    }
  }

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={{ display: "flex" }}>
          <div style={this.state.headerStyle}>Marker</div>
          {this.props.loner && this.props.unique ? (
            <div style={{ width: "96px" }}>
              <img
                alt="Place Marker"
                title="Place Marker"
                className="hover"
                style={this.state.iconStyle}
                src={PinIcon}
                onClick={this.handlePinClick.bind(this)}
              />
              <img
                alt={
                  this.state.visibleSrc === VisibleIcon
                    ? "Hide Maker"
                    : "Show Marker"
                }
                title={
                  this.state.visibleSrc === VisibleIcon
                    ? "Hide Maker"
                    : "Show Marker"
                }
                className="hover"
                style={this.state.iconStyle}
                src={this.state.visibleSrc}
                onClick={this.handleVisibleClick.bind(this)}
              />
              <img
                alt="Go To Marker"
                title="Go To Marker"
                className="hover"
                style={this.state.iconStyle}
                src={GoToIcon}
                onClick={this.handleGoToClick.bind(this)}
              />
            </div>
          ) : null}
          <img
            alt="Change Marker"
            title="Change Marker"
            className="hover"
            style={this.state.iconStyle}
            src={EditIcon}
            onClick={() => {
              this.state.fileInput.current.click();
            }}
          />
        </div>
        <img
          style={this.state.markerStyle}
          src={this.state.markerSrc}
          alt="Marker"
          title="Marker"
        />
        <input
          type="file"
          ref={this.state.fileInput}
          style={{ display: "none" }}
          onInput={this.handleInput.bind(this)}
        />
      </div>
    );
  }
}

export default Marker;
