import React, { Component } from "react";

class Stats extends Component {
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
        borderBottomRightRadius: "4px",
        borderBottomLeftRadius: "4px",
      },
      headerStyle: {
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: "white",
        width: "100%",
        height: "28px",
        paddingTop: "4px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
      contentStyle: {
        height: "160px",
        overflow: "auto",
      },
      statButtonStyle: {
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "white",
        borderRadius: "16px",
        margin: "8px",
        cursor: "default",
        fontSize: "13px",
        paddingLeft: "0px",
        height: "24px",
      },
      statStyle: {
        display: "flex",
        width: "100%",
        height: "24px",
      },
      statValueStyle: {
        background: "rgba(0, 0, 0, 0)",
        height: "22px",
        width: "50%",
        borderStyle: "solid",
        borderWidth: "0px",
        borderLeftWidth: "1px",
        borderBottomRightRadius: "16px",
        borderTopRightRadius: "16px",
        color: "white",
        textAlign: "center",
      },
      statNameStyle: {
        background: "rgba(0, 0, 0, 0)",
        height: "22px",
        width: "50%",
        borderStyle: "solid",
        borderWidth: "0px",
        borderRightWidth: "1px",
        borderBottomLeftRadius: "16px",
        borderTopLeftRadius: "16px",
        color: "white",
        textAlign: "center",
      },
      stats: [],
    };
  }

  load() {
    var stats = this.props.store.read("stats", {
      itemId: this.props._id,
    });
    this.setState({
      stats: stats,
    });
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps._id !== this.props._id) {
      this.load();
    }
  }

  componentWillUnmount() {}

  addStat() {
    this.props.store.create(
      "stats",
      { itemId: this.props._id, name: "Name", value: "Value" },
      () => {
        this.props.store.refresh("stats", () => {
          this.setState({
            stats: this.props.store.read("stats", { itemId: this.props._id }),
          });
        });
      }
    );
  }

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={this.state.headerStyle}>Stats</div>
        <div style={this.state.contentStyle}>
          {this.state.stats.map((stat) => {
            return (
              <div key={"stat" + stat.id} style={this.state.statButtonStyle} onContextMenu={(e)=>{e.preventDefault();
              this.props.store.delete("stats",{id:stat.id},()=>{this.load()})
              }}>
                <div style={this.state.statStyle}>
                  <input
                    style={this.state.statNameStyle}
                    defaultValue={stat.name}
                    onBlur={(e) => {
                      this.props.store.update(
                        "stats",
                        { id: stat.id },
                        { name: e.target.value },
                        () => {}
                      );
                    }}
                  />
                  <input
                    style={this.state.statValueStyle}
                    defaultValue={stat.value}
                    onBlur={(e) => {
                      this.props.store.update(
                        "stats",
                        { id: stat.id },
                        { value: e.target.value },
                        () => {}
                      );
                    }}
                  />
                </div>
              </div>
            );
          })}
          <div
            className="hover"
            style={{
              ...this.state.statButtonStyle,
              paddingTop: "3px",
              height: "21px",
            }}
            onClick={() => {
              this.addStat();
            }}
          >
            +
          </div>
        </div>
      </div>
    );
  }
}

export default Stats;
