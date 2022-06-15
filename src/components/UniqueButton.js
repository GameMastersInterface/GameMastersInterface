import React, { Component } from "react";
import CheckedBoxIcon from "../assets/checkbox_filled.png";
import UncheckedBoxIcon from "../assets/checkbox_empty.png";

class UniqueButton extends Component {
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
        width: "calc(100% - 34px)",
        paddingTop: "3px",
        borderTopLeftRadius: "16px",
        borderBottomLeftRadius: "16px",
        paddingLeft: "8px",
        cursor: "default",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      checkboxSrc: this.props.store.read(this.props._type, {
        id: this.props._id,
      })[0].unique
        ? CheckedBoxIcon
        : UncheckedBoxIcon,
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps._id !== this.props._id) {
      this.setState({
        checkboxSrc: this.props.store.read(this.props._type, {
          id: this.props._id,
        })[0].unique
          ? CheckedBoxIcon
          : UncheckedBoxIcon,
      });
    }
  }

  componentWillUnmount() {}

  handleCheckBoxClick() {
    var temp = this.state.checkboxSrc === UncheckedBoxIcon;
    this.setState({
      checkboxSrc:
        this.state.checkboxSrc === UncheckedBoxIcon
          ? CheckedBoxIcon
          : UncheckedBoxIcon,
    });
    this.props.store.update(
      this.props._type,
      { id: this.props._id },
      { unique: this.state.checkboxSrc === UncheckedBoxIcon },
      () => {
        this.props.store.refresh("characters", () => {
          this.props.setUnique(temp);
          this.props.forceMarkerLoad();
        });
      }
    );
  }

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={this.state.nameStyle}>Unique</div>
        <img
          className="hover"
          alt={
            this.state.checkboxSrc === UncheckedBoxIcon
              ? "Make Unique"
              : "Make Non-Unique"
          }
          title={
            this.state.checkboxSrc === UncheckedBoxIcon
              ? "Make Unique"
              : "Make Non-Unique"
          }
          src={this.state.checkboxSrc}
          style={{
            borderTopRightRadius: "16px",
            borderBottomRightRadius: "16px",
          }}
          onClick={this.handleCheckBoxClick.bind(this)}
        />
      </div>
    );
  }
}

export default UniqueButton;
