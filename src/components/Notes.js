import React, { Component } from "react";
import EditIcon from "../assets/edit.png";
import CheckIcon from "../assets/check.png";

class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textAreaRef: React.createRef(),
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
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        paddingBottom: "4px",
      },
      textBoxStyle: {
        resize: "none",
        height: "149px",
        width: "calc(100% - 14px)",
        margin: "4px",
        marginBottom: "0px",
        backgroundColor: "rgb(32, 32, 32)",
        color: "white",
      },
      editSrc: EditIcon,
    };
  }

  load() {
    this.state.textAreaRef.current.value = this.props.store.read(this.props._type,{id:this.props._id})[0].notes
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps._id !== this.props._id) {
      this.load();
    }
    if (prevProps._type !== this.props._type) {
      this.load();
    }
  }

  componentWillUnmount() {}

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={this.state.headerStyle}>
          <div style={{ width: "calc(100% - 40px)", padding: "4px" }}>
            Notes
          </div>
          <img
            src={this.state.editSrc}
            className="hover"
            style={{
              width: "32px",
              height: "32px",
              marginTop: "0px",
              borderTopRightRadius: "14px",
            }}
            onClick={() => {
              this.setState(
                {
                  editSrc:
                    this.state.editSrc === EditIcon ? CheckIcon : EditIcon,
                },
                () => {
                  if (this.state.editSrc === EditIcon) {
                    console.log("!")
                    this.props.store.update(
                      this.props._type,
                      {
                        id: this.props._id,
                      },
                      { notes: this.state.textAreaRef.current.value },
                      () => {}
                    );
                  }
                }
              );
            }}
          />
        </div>
        <textarea
          ref={this.state.textAreaRef}
          style={this.state.textBoxStyle}
          resizable="false"
          disabled={this.state.editSrc === EditIcon}
        />
      </div>
    );
  }
}

export default Notes;
