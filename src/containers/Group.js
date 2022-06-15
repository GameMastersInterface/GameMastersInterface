import React, { Component } from "react";
import NameInput from "../components/NameInput";
import Marker from "../components/Marker";
import MemberSelector from "../components/MemberSelector";
import Roster from "../components/Roster";
import Logs from "../components/Logs";
import DeleteButton from "../components/DeleteButton";
import BattleMapButton from "../components/BattleMapButton";

class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updateRoster: false,
      updateSelector: false,
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <NameInput
          _type={"groups"}
          _id={this.props._id}
          store={this.props.store}
          forceMarkerLoad={() => {
            this.props.forceMarkerLoad();
          }}
        />
        <Marker
          _type={"groups"}
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
        <BattleMapButton
          openBattleMap={() => {
            this.props.openBattleMap(this.props._id);
          }}
        />
        <Roster
          store={this.props.store}
          _id={this.props._id}
          forceMarkerLoad={() => {
            this.props.forceMarkerLoad();
          }}
          update={this.state.updateRoster}
          resetUpdate={() => {
            this.setState({ updateRoster: false });
          }}
          updateSelector={() => {
            this.setState({ updateSelector: true });
          }}
        />
        <MemberSelector
          store={this.props.store}
          _id={this.props._id}
          forceMarkerLoad={() => {
            this.props.forceMarkerLoad();
          }}
          update={this.state.updateSelector}
          resetUpdate={() => {
            this.setState({ updateSelector: false });
          }}
          updateRoster={() => {
            this.setState({ updateRoster: true });
          }}
        />
        <Logs store={this.props.store} _type="groups" _id={this.props._id} />
        <DeleteButton
          store={this.props.store}
          _type="groups"
          _id={this.props._id}
          exit={() => {
            this.props.exit();
          }}
        />
      </div>
    );
  }
}

export default Group;
