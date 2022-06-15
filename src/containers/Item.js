import React, { Component } from "react";
import NameInput from "../components/NameInput";
import Logs from "../components/Logs";
import Stats from "../components/Stats";
import DeleteButton from "../components/DeleteButton";
import UniqueButton from "../components/UniqueButton";
import Notes from "../components/Notes";
import Icon from "../components/Icon";

class Item extends Component {
  componentDidMount() {
    this.state = {
      unique: this.props.store.read("nativeItems", { id: this.props._id })[0]
        .unique,
    };
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  //Name
  //Icon
  //Stats
  //Unique
  //Owner
  //Logs

  render() {
    return (
      <div>
        <NameInput
          _type={"nativeItems"}
          _id={this.props._id}
          store={this.props.store}
          forceMarkerLoad={() => {
            this.props.forceMarkerLoad();
          }}
        />
        <Icon
          _type={"nativeItems"}
          _id={this.props._id}
          store={this.props.store}
        />
        <Stats store={this.props.store} _id={this.props._id} />
        <Notes
          _id={this.props._id}
          _type={"nativeItems"}
          store={this.props.store}
        />
        <UniqueButton
          store={this.props.store}
          forceMarkerLoad={() => {}}
          _type={"nativeItems"}
          _id={this.props._id}
          setUnique={(bool) => {
            this.setState({ unique: bool });
          }}
        />
        <Logs
          store={this.props.store}
          _type="nativeItems"
          _id={this.props._id}
        />
        <DeleteButton
          store={this.props.store}
          _type="nativeItems"
          _id={this.props._id}
          exit={() => {
            this.props.exit();
          }}
        />
      </div>
    );
  }
}

export default Item;
