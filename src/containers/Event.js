import React, { Component } from "react";
import NameInput from "../components/NameInput";
import Marker from "../components/Marker";
import Logs from "../components/Logs";
import DeleteButton from "../components/DeleteButton";

class Event extends Component {
  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <NameInput
          _type={"events"}
          _id={this.props._id}
          store={this.props.store}
          forceMarkerLoad={() => {
            this.props.forceMarkerLoad();
          }}
        />
        <Marker
          _type={"events"}
          _id={this.props._id}
          store={this.props.store}
          loner={true}
          unique={true}
          forceMarkerLoad={() => {
            this.props.forceMarkerLoad();
          }}
          setDest={(locale, x, y) => {
            this.props.setDest(locale, x, y);
          }}
          setPlacing={(type, id) => {
            this.props.setPlacing(type, id);
          }}
        />
        <Logs store={this.props.store} _type="events" _id={this.props._id} />
        <DeleteButton
          store={this.props.store}
          _type="events"
          _id={this.props._id}
          exit={() => {
            this.props.exit();
          }}
        />
      </div>
    );
  }
}

export default Event;
