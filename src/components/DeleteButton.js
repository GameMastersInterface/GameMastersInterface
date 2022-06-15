import React, { Component } from "react";

class DeleteButton extends Component {
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
        height: "32px",
      },
      nameStyle: {
        width: "100%",
        paddingTop: "3px",
        borderRadius: "16px",
        paddingLeft: "8px",
        cursor: "default",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  handleClick() {}

  render() {
    return (
      <div
        style={this.state.mainStyle}
        onClick={() => {
          this.props.store.delete(
            this.props._type,
            { id: this.props._id },
            () => {
              this.props.exit();
            }
          );
        }}
      >
        <div className="hover" style={this.state.nameStyle}>
          Delete
        </div>
      </div>
    );
  }
}

export default DeleteButton;
