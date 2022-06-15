import React, { Component } from "react";

class ItemViewer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainStyle: {
        position: "fixed",
        width: "400px",
        minHeight: "144px",
        zIndex: 0,
        backgroundColor: "rgba(32, 32, 32, .85)",
        borderColor: "white",
        borderStyle: "solid",
        borderWidth: "1px",
        borderRadius: "16px",
        //display: "flex",
      },
      iconStyle: {
        width: "128px",
        height: "128px",
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "white",
        borderRadius: "16px",
        margin: "8px",
        imageRendering: "pixelated",
      },
      contentStyle: {
        width: "368px",
      },
      statViewStyle: { overflowY: "auto", overflowX: "hidden" },
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
      footerStyle: {
        fontSize: "16px",
      },
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (this.props.item !== prevProps.item) {
      console.log(this.props.item);
    }
    if (this.props.x !== prevProps.x || this.props.y !== prevProps.y) {
      var temp = { ...this.state.mainStyle };
      delete temp.top;
      delete temp.bottom;
      temp.left = 307///this.props.x + 200;
      if (this.props.y > window.innerHeight / 2) {
        temp.bottom = window.innerHeight-this.props.y;
      } else {
        temp.top = this.props.y;
      }

      this.setState({ mainStyle: temp });
    }
  }

  componentWillUnmount() {}

  render() {
    return (
      <div style={this.state.mainStyle}>
        <div style={{ display: "flex" }}>
          <img
            style={this.state.iconStyle}
            src={this.props.item.item.icon.src}
          />
          <div style={this.state.contentStyle}>
            <div>{this.props.item.item.name}</div>
            {this.props.item.item.stats.length === 0 ? (
              this.props.item.item.notes == null ? null : (
                <div style={this.state.footerStyle}>
                  Notes:{" " + this.props.item.item.notes}
                </div>
              )
            ) : (
              this.props.item.item.stats.map((stat) => {
                return (
                  <div
                    key={"stat" + stat.id}
                    style={this.state.statButtonStyle}
                  >
                    <div style={this.state.statStyle}>
                      <input
                        style={this.state.statNameStyle}
                        defaultValue={stat.name}
                      />
                      <input
                        style={this.state.statValueStyle}
                        defaultValue={stat.value}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {this.props.item.item.notes == null ||
        this.props.item.item.stats.length === 0 ? null : (
          <div style={this.state.footerStyle}>
            Notes:{" " + this.props.item.item.notes}
          </div>
        )}
      </div>
    );
  }
}

export default ItemViewer;
