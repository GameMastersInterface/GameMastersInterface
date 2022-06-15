import React, { Component } from "react";
import NameInput from "../components/NameInput";
import Portrait from "../components/Portrait";
import Marker from "../components/Marker";
import GroupSelector from "../components/GroupSelector";
import UniqueButton from "../components/UniqueButton";
import Logs from "../components/Logs";
import DeleteButton from "../components/DeleteButton";
import HealthBar from "../components/HealthBar";
import Inventory from "../components/Inventory";
import ItemSelector from "../components/ItemSelector";

class Character extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateInventory: false,
      updateItemSelector: false,
      unique: this.props.store.read("characters", { id: this.props._id })[0]
        .unique,
      loner: this.props.store.read("characters", { id: this.props._id })[0]
        .unique
        ? this.props.store.read("characters", { id: this.props._id })[0]
            .groupMembers[0].groupId === -1
        : false,
    };
  }

  componentDidMount() {
    if (
      !this.state.unique ||
      this.props.store.read("characters", { id: this.props._id })[0]
        .groupMembers[0].groupId !== -1
    ) {
      this.setState({ loner: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps._id !== this.props._id) {
      this.setState(
        {
          unique: this.props.store.read("characters", { id: this.props._id })[0]
            .unique,
          loner: true,
        },
        () => {
          if (
            !this.state.unique ||
            this.props.store.read("characters", { id: this.props._id })[0]
              .groupMembers[0].groupId !== -1
          ) {
            this.setState({ loner: false });
          }
        }
      );
    }
  }

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <NameInput
          _type={"characters"}
          _id={this.props._id}
          store={this.props.store}
          forceMarkerLoad={() => {
            this.props.forceMarkerLoad();
          }}
        />
        <HealthBar _id={this.props._id} store={this.props.store} />
        <Portrait
          _type={"characters"}
          _id={this.props._id}
          store={this.props.store}
        />
        <Marker
          _type={"characters"}
          _id={this.props._id}
          store={this.props.store}
          loner={this.state.loner}
          unique={this.state.unique}
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
        <UniqueButton
          store={this.props.store}
          forceMarkerLoad={() => {
            this.props.forceMarkerLoad();
          }}
          _type={"characters"}
          _id={this.props._id}
          setUnique={(bool) => {
            this.setState({ unique: bool });
          }}
        />
        {this.state.unique ? (
          <div>
            <GroupSelector
              _type={"characters"}
              _id={this.props._id}
              store={this.props.store}
              forceMarkerLoad={() => {
                this.props.forceMarkerLoad();
              }}
              setLoner={(bool) => {
                this.setState({ loner: bool });
              }}
            />
            <Inventory
              _type={"characters"}
              _id={this.props._id}
              store={this.props.store}
              update={this.state.updateInventory}
              updateSelector={() => {
                this.setState({ updateItemSelector: true });
              }}
              resetUpdate={() => {
                this.setState({ updateInventory: false });
              }}
              setItemViewer={(val) => {
                this.props.setItemViewer(val);
              }}
              setItemViewerPos={(x, y) => {
                this.props.setItemViewerPos(x, y);
              }}
            />
            <ItemSelector
              _type={"characters"}
              _id={this.props._id}
              store={this.props.store}
              update={this.state.updateItemSelector}
              updateInventory={() => {
                this.setState({ updateInventory: true });
              }}
              resetUpdate={() => {
                this.setState({ updateItemSelector: false });
              }}
              setItemViewer={(val) => {
                this.props.setItemViewer(val);
              }}
              setItemViewerPos={(x, y) => {
                this.props.setItemViewerPos(x, y);
              }}
            />
            <Logs
              store={this.props.store}
              _type="characters"
              _id={this.props._id}
            />
          </div>
        ) : null}
        <DeleteButton
          store={this.props.store}
          _type="characters"
          _id={this.props._id}
          exit={() => {
            this.props.exit();
          }}
        />
      </div>
    );
  }
}

export default Character;
