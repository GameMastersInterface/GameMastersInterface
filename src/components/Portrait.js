import React, { Component } from "react";
import EditIcon from "../assets/edit.png";

class Portrait extends Component {
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
      portraitStyle: {
        width: "calc(100% - 8px)",
        borderRadius: "12px",
      },
      editStyle: {
        borderRadius: "12px",
      },
      portraitSrc: this.props.store.read(this.props._type, {
        id: this.props._id,
      })[0].portrait.src,
      fileInput: React.createRef(),
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps._id !== this.props._id) {
      this.setState({
        portraitSrc: this.props.store.read(this.props._type, {
          id: this.props._id,
        })[0].portrait.src,
      });
    }
    if (prevProps._type !== this.props._type) {
      this.setState({
        portraitSrc: this.props.store.read(this.props._type, {
          id: this.props._id,
        })[0].portrait.src,
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
        scopeThis.setState({ portraitSrc: reader.result });
        scopeThis.props.store.update(
          "upload",
          {
            type: scopeThis.props._type,
            id: scopeThis.props._id,
            game: scopeThis.props.store.gameId,
            category: "portrait",
          },
          { portrait: reader.result },
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
          <div style={this.state.headerStyle}>Portrait</div>
          <img
            alt="Change Portrait"
            title="Change Portrait"
            className="hover"
            style={this.state.editStyle}
            src={EditIcon}
            onClick={() => {
              this.state.fileInput.current.click();
            }}
          />
        </div>
        <img
          style={this.state.portraitStyle}
          src={this.state.portraitSrc}
          alt="Portrait"
          title="Portrait"
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

export default Portrait;
