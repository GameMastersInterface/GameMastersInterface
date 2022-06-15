import React, { Component } from "react";
import DownIcon from "../assets/down.png";
import UpIcon from "../assets/up.png";

class Logs extends Component {
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
        borderBottomRightRadius: "16px",
        borderBottomLeftRadius: "16px",
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
      logButtonStyle: {
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "white",
        borderRadius: "16px",
        margin: "8px",
        cursor: "default",
        fontSize: "13px",
        paddingLeft: "4px",
      },
      logHeaderStyle: { display: "flex", width: "100%" },
      logContentStyle: { display: "block", width: "100%" },
      logNameStyle: {
        width: "calc(100% - 33px)",
        paddingTop: "6px",
      },
      footerStyle: {
        borderTopStyle: "solid",
        borderTopColor: "white",
        borderTopWidth: "1px",
        fontSide: "16px",
        paddingBottom: "4px",
        cursor: "default",
      },
      logs: [],
      writeLog: false,
    };
  }

  load() {
    var logs;
    if (this.props._type === "characters") {
      logs = this.props.store.read("logs", {
        characterId: this.props._id,
      });
      logs.forEach((log) => {
        log.open = false;
      });
      this.setState({
        logs: logs,
      });
    } else if (this.props._type === "groups") {
      logs = this.props.store.read("logs", {
        groupId: this.props._id,
      });
      logs.forEach((log) => {
        log.open = false;
      });
      this.setState({
        logs: logs,
      });
    } else if (this.props._type === "locales") {
      logs = this.props.store.read("logs", {
        localeId: this.props._id,
      });
      logs.forEach((log) => {
        log.open = false;
      });
      this.setState({
        logs: logs,
      });
    } else if (this.props._type === "events") {
      logs = this.props.store.read("logs", {
        eventId: this.props._id,
      });
      logs.forEach((log) => {
        log.open = false;
      });
      this.setState({
        logs: logs,
      });
    }
  }

  dateToString(date) {
    var year = date.slice(0, 4);
    var month = date.slice(5, 7);
    var day = date.slice(8, 10);
    var hours = date.slice(11, 13);
    var AMPM = "AM";
    if (hours === "00" || parseInt(hours) > 12) {
      AMPM = hours === "00" ? "AM" : "PM";
      var temp = parseInt(hours);
      temp = Math.abs(temp - 12);
      hours = temp;
    }
    var minutes = date.slice(14, 16);
    var seconds = date.slice(17, 19);
    return (
      month +
      "/" +
      day +
      "/" +
      year +
      " at " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds +
      " " +
      AMPM
    );
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

  toggleLog(id) {
    var logs = [...this.state.logs];
    var i = 0;
    while (logs[i].id !== id && i < logs.length - 1) {
      i++;
    }
    logs[i].open = !logs[i].open;
    this.setState({ logs: logs });
  }

  writeAddLog() {
    if (this.state.writeLog) {
      if (this.props._type === "characters") {
        this.props.store.create(
          "logs",
          {
            characterId: this.props._id,
            content: this.state.textAreaRef.current.value,
          },
          () => {
            this.setState({ writeLog: false });
            this.props.store.refresh("logs", () => {
              this.load();
            });
          }
        );
      } else if (this.props._type === "groups") {
        this.props.store.create(
          "logs",
          {
            groupId: this.props._id,
            content: this.state.textAreaRef.current.value,
          },
          () => {
            this.setState({ writeLog: false });
            this.props.store.refresh("logs", () => {
              this.load();
            });
          }
        );
      } else if (this.props._type === "locales") {
        this.props.store.create(
          "logs",
          {
            localeId: this.props._id,
            content: this.state.textAreaRef.current.value,
          },
          () => {
            this.setState({ writeLog: false });
            this.props.store.refresh("logs", () => {
              this.load();
            });
          }
        );
      } else if (this.props._type === "events") {
        this.props.store.create(
          "logs",
          {
            eventId: this.props._id,
            content: this.state.textAreaRef.current.value,
          },
          () => {
            this.setState({ writeLog: false });
            this.props.store.refresh("logs", () => {
              this.load();
            });
          }
        );
      }
    } else {
      this.setState({ writeLog: true });
    }
  }

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={this.state.headerStyle}>Logs</div>
        {this.state.writeLog ? (
          <textarea
            ref={this.state.textAreaRef}
            style={{
              resize: "none",
              height: "148px",
              width: "calc(100% - 10px)",
              marginTop: "2px",
            }}
            resizable="false"
          />
        ) : (
          <div style={this.state.contentStyle}>
            {this.state.logs.map((log) => {
              return (
                <div key={"log" + log.id} style={this.state.logButtonStyle}>
                  <div style={this.state.logHeaderStyle}>
                    <div style={this.state.logNameStyle}>
                      {this.dateToString(log.createdAt)}
                    </div>
                    <img
                      className="hover"
                      style={{
                        borderBottomRightRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                      alt={log.open ? "Hide Log" : "Show Log"}
                      title={log.open ? "Hide Log" : "Show Log"}
                      src={log.open ? UpIcon : DownIcon}
                      onClick={() => {
                        this.toggleLog(log.id);
                      }}
                    />
                  </div>
                  {log.open ? (
                    <div style={this.state.logContentStyle}>
                      {log.content}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
        <div
          className="hover"
          style={{
            borderBottomLeftRadius: "16px",
            borderBottomRightRadius: "16px",
          }}
        >
          <div
            style={this.state.footerStyle}
            onClick={this.writeAddLog.bind(this)}
          >
            {this.state.writeLog ? "Add Log" : "Write Log"}
          </div>
        </div>
      </div>
    );
  }
}

export default Logs;
