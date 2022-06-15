import React, { Component } from "react";
import draw from "./draw";

class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapCanvasRef: React.createRef(),
      map: null,
      mapX: 0,
      mapY: 0,
      clickX: 0,
      clickY: 0,
      destX: 0,
      destY: 0,
      mouseX: 0,
      mouseY: 0,
      clicked: false,
      zoomFactor: 1,
      itemHover: null,
      itemPlacing: null,
      moveTimeout: null,
      mapUpdateFrame: null,
      markerList: [],
    };
  }

  componentDidMount() {}

  getMarkerList(cb) {
    var visibleCharacters = this.props.store.read("characters", {
      visible: true,
      unique: true,
      localeId: this.props.localeId,
    });
    visibleCharacters = visibleCharacters.filter((element) => {
      if (
        this.props.store.read("groupMembers", { characterId: element.id })
          .length > 0
      ) {
        return (
          this.props.store.read("groupMembers", {
            characterId: element.id,
          })[0].groupId === -1
        );
      } else {
        return false;
      }
    });
    visibleCharacters.forEach((element) => {
      element.type = "characters";
    });
    var visibleGroups = this.props.store.read("groups", {
      visible: true,
      localeId: this.props.localeId,
    });
    visibleGroups.forEach((element) => {
      element.type = "groups";
    });
    var visibleLocales = this.props.store.read("locales", {
      visible: true,
      localeId: this.props.localeId,
    });
    visibleLocales.forEach((element) => {
      element.type = "locales";
    });
    var visibleEvents = this.props.store.read("events", {
      visible: true,
      localeId: this.props.localeId,
    });
    visibleEvents.forEach((element) => {
      element.type = "events";
    });
    this.setState(
      {
        markerList: [
          ...visibleCharacters,
          ...visibleGroups,
          ...visibleLocales,
          ...visibleEvents,
        ],
      },
      () => {
        cb();
      }
    );
  }

  getMap(cb) {
    this.setState(
      {
        map: this.props.store.read("locales", { id: this.props.localeId })[0]
          .map,
      },
      () => {
        cb();
      }
    );
  }

  /*load(cb) {
    this.getMap(() => {
      this.getMarkerList(() => {
        cb();
      });
    });
  }*/

  updateMapCanvas() {
    const mapContext = this.state.mapCanvasRef.current.getContext("2d");
    mapContext.clearRect(
      0,
      0,
      this.state.mapCanvasRef.current.width,
      this.state.mapCanvasRef.current.height
    );
    draw.map(
      mapContext,
      this.state.map,
      this.state.mapX,
      this.state.mapY,
      this.state.zoomFactor
    );
    mapContext.imageSmoothingEnabled = false;
    draw.markers(
      mapContext,
      this.props.placingType,
      this.props.placingId,
      this.state.itemHover,
      this.state.markerList,
      this.state.mapX,
      this.state.mapY,
      this.state.zoomFactor
    );
    if (
      this.state.itemHover !== null &&
      !(
        this.state.itemHover.type === this.props.placingType &&
        this.state.itemHover.id === this.props.placingId
      )
    ) {
      draw.hover(
        mapContext,
        this.state.itemHover,
        this.state.mapX,
        this.state.mapY,
        this.state.zoomFactor
      );
    }
    if (this.props.placingId !== -1) {
      draw.placing(
        mapContext,
        this.state.itemPlacing,
        this.state.mouseX,
        this.state.mouseY
      );
    }
    mapContext.imageSmoothingEnabled = true;
    this.setState({
      mapUpdateFrame: requestAnimationFrame(() => {
        this.updateMapCanvas();
      }),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      (prevProps.destY !== this.props.destY ||
        prevProps.destX !== this.props.destX) &&
      this.props.destX !== -1 &&
      this.props.destY !== -1
    ) {
      clearTimeout(this.state.moveTimeout);
      this.setState({ moveTimeout: null }, () => {
        this.setState({
          destX:
            this.state.mapCanvasRef.current.width / 2 -
            this.props.destX * this.state.zoomFactor,
          destY:
            this.state.mapCanvasRef.current.height / 2 -
            this.props.destY * this.state.zoomFactor,
          moving: true,
          moveTimeout: setTimeout(() => {
            this.moveLoop();
          }, 10),
        });
        this.props.resetDest();
      });
    }
    if (prevProps.localeId !== this.props.localeId) {
      cancelAnimationFrame(this.state.mapUpdateFrame);
      clearTimeout(this.state.moveTimeout);
      this.setState(
        {
          mapUpdateFrame: null,
          moveTimeout: null,
        },
        () => {
          this.getMap(() => {
            this.getMarkerList(() => {
              this.updateMapCanvas();
            });
          });
        }
      );
    }
    if (
      this.props.forceMarkerLoad !== prevProps.forceMarkerLoad &&
      this.props.forceMarkerLoad
    ) {
      cancelAnimationFrame(this.state.mapUpdateFrame);
      clearTimeout(this.state.moveTimeout);
      this.setState(
        {
          mapUpdateFrame: null,
          moveTimeout: null,
        },
        () => {
          this.getMarkerList(() => {
            this.updateMapCanvas();
            this.props.resetForceMarkerLoad();
          });
        }
      );
    }
    if (prevProps.placingType !== this.props.placingType) {
      this.setState({
        itemPlacing: this.props.store.read(this.props.placingType, {
          id: this.props.placingId,
        })[0],
      });
    }
    if (prevProps.placingId !== this.props.placingId) {
      this.setState({
        itemPlacing: this.props.store.read(this.props.placingType, {
          id: this.props.placingId,
        })[0],
      });
    }
    if (
      this.props.forceMapLoad !== prevProps.forceMapLoad &&
      this.props.forceMapLoad
    ) {
      cancelAnimationFrame(this.state.mapUpdateFrame);
      clearTimeout(this.state.moveTimeout);
      this.setState(
        {
          mapUpdateFrame: null,
          moveTimeout: null,
        },
        () => {
          this.getMap(() => {
            this.updateMapCanvas();
            this.props.resetForceMapLoad();
          });
        }
      );
    }
  }

  moveLoop() {
    clearTimeout(this.state.moveTimeout);
    this.setState({ moveTimeout: null }, () => {
      if (
        Math.sqrt(
          (this.state.mapX - this.state.destX) *
            (this.state.mapX - this.state.destX) +
            (this.state.mapY - this.state.destY) *
              (this.state.mapY - this.state.destY)
        ) > 1
      ) {
        this.setState({
          mapX: this.state.mapX - (this.state.mapX - this.state.destX) / 5,
          mapY: this.state.mapY - (this.state.mapY - this.state.destY) / 5,
          moveTimeout: setTimeout(() => {
            this.moveLoop();
          }, 20),
        });
      } else {
        this.setState({
          mapX: this.state.destX,
          mapY: this.state.destY,
        });
      }
    });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.state.mapUpdateFrame);
    clearTimeout(this.state.moveTimeout);
    this.setState({ mapUpdateFrame: null, moveTimeout: null });
  }

  handleMouseDown(e) {
    if (this.state.itemHover === null) {
      clearTimeout(this.state.moveTimeout);
      this.setState({
        clicked: true,
        clickX: e.clientX - this.state.mapX,
        clickY: e.clientY - this.state.mapY,
      });
    } else {
      this.props.setDest(
        this.state.itemHover.localeX,
        this.state.itemHover.localeY
      );
      if (this.state.itemHover.type !== "characters") {
        this.props.setOpen(this.state.itemHover.type, this.state.itemHover.id);
      } else {
        this.props.setOpen(
          this.state.itemHover.category,
          this.state.itemHover.id
        );
      }
    }
  }

  handleMouseUp() {
    this.setState({ clicked: false });
  }

  handleMouseMove(e) {
    this.setState({
      mouseX: e.nativeEvent.offsetX,
      mouseY: e.nativeEvent.offsetY,
    });
    if (this.state.clicked) {
      this.setState({
        mapX: e.clientX - this.state.clickX,
        mapY: e.clientY - this.state.clickY,
      });
    }
    var _x = (e.nativeEvent.offsetX - this.state.mapX) / this.state.zoomFactor;
    var _y = (e.nativeEvent.offsetY - this.state.mapY) / this.state.zoomFactor;
    if (
      this.state.itemHover !== null &&
      (_x <= this.state.itemHover.localeX - 48 / this.state.zoomFactor ||
        _x >= this.state.itemHover.localeX + 48 / this.state.zoomFactor ||
        _y <= this.state.itemHover.localeY - 96 / this.state.zoomFactor ||
        _y >= this.state.itemHover.localeY)
    ) {
      this.setState({ itemHover: null });
    }
    for (var i = 0; i < this.state.markerList.length; i++) {
      if (
        _x > this.state.markerList[i].localeX - 48 / this.state.zoomFactor &&
        _x < this.state.markerList[i].localeX + 48 / this.state.zoomFactor &&
        _y > this.state.markerList[i].localeY - 96 / this.state.zoomFactor &&
        _y < this.state.markerList[i].localeY
      ) {
        if (this.state.itemHover === null && this.props.placing === false) {
          this.setState({ itemHover: this.state.markerList[i] });
        }
      }
    }
  }

  handleMouseWheel(e) {
    clearTimeout(this.state.moveTimeout);
    var wheel = e.deltaY / Math.abs(e.deltaY);
    this.setState({
      moveTimeout: null,
      zoomFactor: this.state.zoomFactor * (1 - wheel / 7.5),
      mapX:
        -(
          (this.state.mapCanvasRef.current.width / 2 - this.state.mapX) /
          this.state.zoomFactor
        ) *
          (this.state.zoomFactor * (1 - wheel / 7.5)) +
        this.state.mapCanvasRef.current.width / 2,
      mapY:
        -(
          (this.state.mapCanvasRef.current.height / 2 - this.state.mapY) /
          this.state.zoomFactor
        ) *
          (this.state.zoomFactor * (1 - wheel / 7.5)) +
        this.state.mapCanvasRef.current.height / 2,
    });
  }

  handleRightDown(e) {
    e.preventDefault();
    if (this.props.placing) {
      this.props.store.update(
        this.props.placingType,
        { id: this.props.placingId },
        {
          localeId: this.props.localeId,
          localeX:
            (this.state.mouseX - this.state.mapX) / this.state.zoomFactor,
          localeY:
            (this.state.mouseY - this.state.mapY) / this.state.zoomFactor,
        },
        () => {
          cancelAnimationFrame(this.state.mapUpdateFrame);
          clearTimeout(this.state.moveTimeout);
          this.setState(
            {
              mapUpdateFrame: null,
              moveTimeout: null,
            },
            () => {
              this.getMarkerList(() => {
                this.updateMapCanvas();
              });
            }
          );
        }
      );
      this.props.placed();
    }
  }

  render() {
    return (
      <div>
        <canvas
          onMouseDown={this.handleMouseDown.bind(this)}
          onMouseOut={this.handleMouseUp.bind(this)}
          onMouseUp={this.handleMouseUp.bind(this)}
          onMouseMove={this.handleMouseMove.bind(this)}
          onContextMenu={this.handleRightDown.bind(this)}
          onWheel={this.handleMouseWheel.bind(this)}
          ref={this.state.mapCanvasRef}
          width={window.innerWidth - this.props.menuWidth}
          height={window.innerHeight}
          style={{
            position: "fixed",
            left: this.props.menuWidth + "px",
            top: "0",
          }}
        />
      </div>
    );
  }
}

export default Map;
