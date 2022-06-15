import React, { Component } from "react";
import EditIcon from "../assets/edit.png";
import CheckIcon from "../assets/check.png";
import NoImage from "../assets/noimage.png";

class NameInput extends Component {
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
        margin: "16px",
        display: "flex",
      },
      nameStyle: {
        width: "calc(100% - 34px)",
        borderTopLeftRadius: "16px",
        borderBottomLeftRadius: "16px",
        paddingTop: "1px",
        paddingLeft: "1px",
      },
      inputStyle: {
        width: "calc(100% - 10px)",
        borderTopLeftRadius: "16px",
        borderBottomLeftRadius: "16px",
        fontSize: "18px",
        textAlign: "center",
        backgroundColor: "rgb(32, 32, 32)",
        color: "white",
      },
      editSrc: EditIcon,
      name: "",
    };
  }

  componentDidMount() {
    this.setState({
      name: this.props.store.read(this.props._type, { id: this.props._id })[0]
        .name,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps._id !== this.props._id) {
      this.setState({
        name: this.props.store.read(this.props._type, { id: this.props._id })[0]
          .name,
      });
    }
    if (prevProps._type !== this.props._type) {
      this.setState({
        name: this.props.store.read(this.props._type, { id: this.props._id })[0]
          .name,
      });
    }
  }

  componentWillUnmount() {}

  handleInput(e) {
    this.setState({ name: e.target.value });
  }

  handleEditClick() {
    if (
      this.state.editSrc === CheckIcon &&
      this.state.name !==
        this.props.store.read(this.props._type, { id: this.props._id })[0].name
    ) {
      this.props.store.update(
        this.props._type,
        { id: this.props._id },
        { name: this.state.name },
        () => {
          this.props.store.refresh(this.props._type, () => {
            this.props.forceMarkerLoad();
          });
        }
      );
    }
    this.setState({
      editSrc: this.state.editSrc === EditIcon ? CheckIcon : EditIcon,
    });
  }

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={this.state.nameStyle}>
          <input
            style={this.state.inputStyle}
            type="test"
            defaultValue={this.state.name}
            onChange={this.handleInput.bind(this)}
            disabled={this.state.editSrc === EditIcon}
          />
        </div>
        <img
          className="hover"
          style={{
            borderTopRightRadius: "16px",
            borderBottomRightRadius: "16px",
          }}
          src={this.state.editSrc}
          onClick={this.handleEditClick.bind(this)}
          alt={this.state.editSrc === EditIcon ? "Change Name" : "Save Changes"}
          title={
            this.state.editSrc === EditIcon ? "Change Name" : "Save Changes"
          }
        />
      </div>
    );
  }
}

export default NameInput;
