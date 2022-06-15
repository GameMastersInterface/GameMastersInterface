import React, { Component } from "react";
import NoImage from "../assets/noimage.png";
import EditIcon from "../assets/edit.png";
import GoToIcon from "../assets/goto.png";

class MapPreview extends Component {
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
        width: "calc(100% - 34px)",
        height: "28px",
        paddingTop: "4px",
        borderTopLeftRadius: "16px",
        borderBottomLeftRadius: "16px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      mapStyle: {
        width: "calc(100% - 8px)",
        borderRadius: "12px",
      },
      iconStyle: {
        borderRadius: "12px",
      },
      mapSrc: this.props.store.read(this.props._type, {
        id: this.props._id,
      })[0].map.src,
      fileInput: React.createRef(),
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps._id !== this.props._id) {
      this.setState({
        mapSrc: this.props.store.read(this.props._type, {
          id: this.props._id,
        })[0].map.src,
      });
    }
    if (prevProps._type !== this.props._type) {
      this.setState({
        mapSrc: this.props.store.read(this.props._type, {
          id: this.props._id,
        })[0].map.src,
      });
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
        scopeThis.setState({ mapSrc: reader.result });
        scopeThis.props.store.update(
          "upload",
          {
            type: scopeThis.props._type,
            id: scopeThis.props._id,
            game: scopeThis.props.store.gameId,
            category: "map",
          },
          { map: reader.result },
          () => {
            scopeThis.props.forceMapLoad();
          }
        );
      },
      false
    );
  }

  handleGoTo() {
    this.props.setLocale(this.props._id);
  }

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={{ display: "flex" }}>
          <div style={this.state.headerStyle}>Map</div>
          <img
            className="hover"
            alt="Go To Map"
            style={this.state.iconStyle}
            src={GoToIcon}
            onClick={this.handleGoTo.bind(this)}
          />
          <img
            className="hover"
            alt="Change Map"
            title="Change Map"
            style={this.state.iconStyle}
            src={EditIcon}
            onClick={() => {
              this.state.fileInput.current.click();
            }}
          />
        </div>
        <img
          style={this.state.mapStyle}
          src={this.state.mapSrc}
          alt="Map"
          title="Map"
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

export default MapPreview;
