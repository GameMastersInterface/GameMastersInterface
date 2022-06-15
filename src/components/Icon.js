import React, { Component } from "react";
import EditIcon from "../assets/edit.png";

class Icon extends Component {
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
      iconStyle: {
        width: "calc(100% - 8px)",
        imageRendering: "pixelated",
      },
      editStyle: {
        borderRadius: "12px",
      },
      iconSrc: this.props.store.read(this.props._type, {
        id: this.props._id,
      })[0].icon.src,
      fileInput: React.createRef(),
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps._id !== this.props._id) {
      this.setState({
        iconSrc: this.props.store.read(this.props._type, {
          id: this.props._id,
        })[0].icon.src,
      });
    }
    if (prevProps._type !== this.props._type) {
      this.setState({
        iconSrc: this.props.store.read(this.props._type, {
          id: this.props._id,
        })[0].icon.src,
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
        scopeThis.setState({ iconSrc: reader.result });
        scopeThis.props.store.update(
          "upload",
          {
            type: scopeThis.props._type,
            id: scopeThis.props._id,
            game: scopeThis.props.store.gameId,
            category: "icon",
          },
          { icon: reader.result },
          () => {}
        );
      },
      false
    );
  }

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={{ display: "flex" }}>
          <div style={this.state.headerStyle}>Icon</div>
          <img
            alt="Change Icon"
            title="Change Icon"
            className="hover"
            style={this.state.editStyle}
            src={EditIcon}
            onClick={() => {
              this.state.fileInput.current.click();
            }}
          />
        </div>
        <img
          style={this.state.iconStyle}
          src={this.state.iconSrc}
          alt="Icon"
          title="Icon"
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

export default Icon;
