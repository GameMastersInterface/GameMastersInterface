import React, { Component } from "react";
import GrassTexture from "../assets/grass.png";
import SnowTexture from "../assets/snow.png";
import SandTexture from "../assets/sand.png";
import BackIcon from "../assets/back.png";
import HeroIcon from "../assets/hero.png";
import EnemyIcon from "../assets/enemy.png";

class BattleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      battleMapCanvasRef: React.createRef(),
      buttonStyle: {
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "white",
        borderRadius: "16px",
        width: "25%",
        height: "24px",
        margin: "4px",
      },
      mainStyle: {
        position: "absolute",
        width: "90%",
        height: "90%",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "white",
        borderRadius: "16px",
        fontSize: "20px",
        top: "5%",
        left: "5%",
        backgroundColor: "rgb(32,32,32)",
        color: "white",
        zIndex: "2",
        paddingBottom: "16px",
      },
      backgroundStyle: {
        position: "absolute",
        width: "100%",
        height: "100%",
        fontSize: "20px",
        backgroundColor: "rgba(0,0,0,.75)",
        zIndex: "1",
      },
      headerStyle: {
        width: "100%",
        height: "28px",
        borderRadius: "16px",
        paddingBottom: "3px",
        paddingTop: "4px",
      },
      optionsStyle: {
        width: "100%",
        height: "28px",
        paddingBottom: "8px",
        display: "flex",
      },
      contentStyle: {
        width: "calc(100% - 528px)",
        height: "calc(100% - 32px)",
        marginLeft: "8px",
        marginRight: "8px",
        overflowY: "auto",
        overflowX: "hidden",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: "black",
        borderRadius: "12px",
        backgroundColor: "rgb(160, 160, 160)",
      },
      background: null,
      backgroundIndex: 0,
      backgrounds: [GrassTexture, SandTexture, SnowTexture],
      battleMapUpdateFrame: null,
      combatantRadius: 48,
      combatants: [],
      hoverCombatant: -1,
      selectedCombatant: -1,
      nameInputRef: React.createRef(),
    };
  }

  componentDidMount() {
    var newBackground = new Image();
    newBackground.src = this.state.backgrounds[this.state.backgroundIndex];
    this.setState({ background: newBackground });
    this.setState(
      {
        battleMapUpdateFrame: requestAnimationFrame(() => {
          this.updateBattleMapCanvas();
        }),
      },
      () => {
        this.props.store.refresh("groupMembers", () => {
          var members = this.props.store.read("groupMembers", {
            groupId: this.props._id,
          });
          var newCombatants = [];
          for (var i = 0; i < members.length; i++) {
            if (members[i].quantity === -1) {
              var obj = {
                member: true,
                hp: members[i].hp,
                maxHp: members[i].maxHp,
                marker: this.props.store.read("characters", {
                  id: members[i].characterId,
                })[0].marker,
                name: this.props.store.read("characters", {
                  id: members[i].characterId,
                })[0].name,
                color: "orange",
                x:
                  this.state.battleMapCanvasRef.current.width / 10 +
                  (Math.random() *
                    this.state.battleMapCanvasRef.current.width) /
                    3,
                y:
                  this.state.battleMapCanvasRef.current.height / 10 +
                  Math.random() *
                    this.state.battleMapCanvasRef.current.height *
                    0.8,
              };
              newCombatants = [...newCombatants, obj];
            } else {
              for (var j = 0; j < members[i].quantity; j++) {
                var img = new Image();
                img.src = HeroIcon;
                var obj = {
                  member: true,
                  marker: img,
                  hp: members[i].maxHp,
                  maxHp: members[i].maxHp,
                  name: this.props.store.read("characters", {
                    id: members[i].characterId,
                  })[0].name,
                  color: "darkgreen",
                  x:
                    this.state.battleMapCanvasRef.current.width / 10 +
                    (Math.random() *
                      this.state.battleMapCanvasRef.current.width) /
                      3,
                  y:
                    this.state.battleMapCanvasRef.current.height / 10 +
                    Math.random() *
                      this.state.battleMapCanvasRef.current.height *
                      0.8,
                };
                newCombatants = [...newCombatants, obj];
              }
            }
          }
          this.setState({
            combatants: newCombatants,
          });
        });
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.selectedCombatant !== this.state.selectedCombatant &&
      this.state.selectedCombatant !== -1 &&
      this.state.combatants[this.state.selectedCombatant].member === false
    ) {
      this.state.nameInputRef.current.value =
        this.state.combatants[this.state.selectedCombatant].name;
    }
  }

  componentWillUnmount() {}

  getDistance(x1, y1, x2, y2) {
    var a = Math.abs(x1 - x2);
    var b = Math.abs(y1 - y2);
    return Math.sqrt(a * a + b * b);
  }

  handleFoeAddButton() {
    var img = new Image();
    img.src = EnemyIcon;
    var obj = {
      member: false,
      marker: img,
      name: "Foe",
      color: "darkred",
      x:
        (this.state.battleMapCanvasRef.current.width * 9) / 10 -
        this.state.battleMapCanvasRef.current.width / 3 +
        (Math.random() * this.state.battleMapCanvasRef.current.width) / 3,
      y:
        this.state.battleMapCanvasRef.current.height / 10 +
        Math.random() * this.state.battleMapCanvasRef.current.height * 0.8,
    };
    this.setState({ combatants: [...this.state.combatants, obj] });
  }

  handleFriendAddButton() {
    var img = new Image();
    img.src = HeroIcon;
    var obj = {
      member: false,
      marker: img,
      name: "Friend",
      color: "darkgreen",
      x:
        this.state.battleMapCanvasRef.current.width / 10 +
        (Math.random() * this.state.battleMapCanvasRef.current.width) / 3,
      y:
        this.state.battleMapCanvasRef.current.height / 10 +
        Math.random() * this.state.battleMapCanvasRef.current.height * 0.8,
    };
    this.setState({ combatants: [...this.state.combatants, obj] });
  }

  handleNameInputChange(e) {
    var item = this.state.combatants[this.state.selectedCombatant];
    item.name = e.target.value;
  }

  handleMapMouseMove(e) {
    this.setState({
      mouseX: e.nativeEvent.offsetX,
      mouseY: e.nativeEvent.offsetY,
    });
    if (this.state.clicked && this.state.selectedCombatant !== -1) {
      var item = this.state.combatants[this.state.selectedCombatant];
      item.x = e.nativeEvent.offsetX;
      item.y = e.nativeEvent.offsetY;
    }
    var found = false;
    for (var i = 0; i < this.state.combatants.length; i++) {
      if (
        this.getDistance(
          this.state.mouseX,
          this.state.mouseY,
          this.state.combatants[i].x,
          this.state.combatants[i].y
        ) < this.state.combatantRadius
      ) {
        this.setState({ hoverCombatant: i });
        found = true;
      }
    }
    if (!found) {
      this.setState({ hoverCombatant: -1 });
    }
  }

  handleMapMouseDown() {
    this.setState({ clicked: true });
    var found = false;
    for (var i = 0; i < this.state.combatants.length; i++) {
      if (
        this.getDistance(
          this.state.mouseX,
          this.state.mouseY,
          this.state.combatants[i].x,
          this.state.combatants[i].y
        ) < this.state.combatantRadius
      ) {
        this.setState({ selectedCombatant: i });
        found = true;
      }
    }
    if (!found) {
      this.setState({ selectedCombatant: -1 });
    }
  }
  handleMapMouseUp() {
    this.setState({ clicked: false });
  }

  handleDeleteButton() {
    var list = [...this.state.combatants];
    list.splice(this.state.selectedCombatant, 1);
    this.setState({ selectedCombatant: -1, combatants: list });
  }

  updateBattleMapCanvas() {
    const battleMapContext =
      this.state.battleMapCanvasRef.current.getContext("2d");
    battleMapContext.clearRect(
      0,
      0,
      this.state.battleMapCanvasRef.current.width,
      this.state.battleMapCanvasRef.current.height
    );
    for (var x = 0; x < this.state.battleMapCanvasRef.current.width; x += 256) {
      for (
        var y = 0;
        y < this.state.battleMapCanvasRef.current.height;
        y += 256
      ) {
        battleMapContext.drawImage(this.state.background, x, y, 256, 256);
      }
    }
    for (var x = 0; x < this.state.battleMapCanvasRef.current.width; x += 112) {
      battleMapContext.globalAlpha = 0.5;
      battleMapContext.strokeStyle = "black";
      battleMapContext.lineWidth = 1;
      battleMapContext.beginPath();
      battleMapContext.moveTo(x, 0);
      battleMapContext.lineTo(x, this.state.battleMapCanvasRef.current.height);
      battleMapContext.stroke();
    }
    for (
      var y = 0;
      y < this.state.battleMapCanvasRef.current.height;
      y += 112
    ) {
      battleMapContext.globalAlpha = 0.5;
      battleMapContext.strokeStyle = "black";
      battleMapContext.lineWidth = 1;
      battleMapContext.beginPath();
      battleMapContext.moveTo(0, y);
      battleMapContext.lineTo(this.state.battleMapCanvasRef.current.width, y);
      battleMapContext.stroke();
    }
    battleMapContext.globalAlpha = 1;
    for (var i = 0; i < this.state.combatants.length; i++) {
      /*
      battleMapContext.font = "20px Arial";
      battleMapContext.textAlign = "center";
      battleMapContext.strokeStyle = "black";
      battleMapContext.lineWidth = 3;
      battleMapContext.strokeText(
        this.state.combatants[i].name,
        this.state.combatants[i].x,
        this.state.combatants[i].y - 80
      );
      battleMapContext.lineWidth = 1;
      battleMapContext.fillStyle = "white";
      battleMapContext.fillText(
        this.state.combatants[i].name,
        this.state.combatants[i].x,
        this.state.combatants[i].y - 80
      );*/

      battleMapContext.drawImage(
        this.state.combatants[i].marker,
        this.state.combatants[i].x - 24,
        this.state.combatants[i].y - 24,
        48,
        48
      );
      if (i === this.state.selectedCombatant) {
        battleMapContext.lineWidth = 1;
        battleMapContext.strokeStyle = "black";
        battleMapContext.beginPath();
        battleMapContext.arc(
          this.state.combatants[i].x,
          this.state.combatants[i].y,
          34,
          0,
          2 * Math.PI
        );
        battleMapContext.stroke();
        battleMapContext.strokeStyle = "white";
        battleMapContext.beginPath();
        battleMapContext.arc(
          this.state.combatants[i].x,
          this.state.combatants[i].y,
          33,
          0,
          2 * Math.PI
        );
        battleMapContext.stroke();
      }
      battleMapContext.shadowBlur = 4;
      battleMapContext.shadowColor = "black";
      battleMapContext.strokeStyle = "red";
      battleMapContext.lineWidth = 2;
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].x,
        this.state.combatants[i].y,
        33,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].x,
        this.state.combatants[i].y,
        38,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.shadowBlur = 0;
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].x,
        this.state.combatants[i].y,
        34,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].x,
        this.state.combatants[i].y,
        35,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].x,
        this.state.combatants[i].y,
        36,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].x,
        this.state.combatants[i].y,
        37,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.strokeStyle = "lime";
      battleMapContext.lineWidth = 3;
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].x,
        this.state.combatants[i].y,
        33,
        1.25 * Math.PI,
        (1.25 +
          (this.state.combatants[i].hp / this.state.combatants[i].maxHp) * 0.5) *
          Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].x,
        this.state.combatants[i].y,
        34,
        1.25 * Math.PI,
        (1.25 +
          (this.state.combatants[i].hp / this.state.combatants[i].maxHp) * 0.5) *
          Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].x,
        this.state.combatants[i].y,
        35,
        1.25 * Math.PI,
        (1.25 +
          (this.state.combatants[i].hp / this.state.combatants[i].maxHp) * 0.5) *
          Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].x,
        this.state.combatants[i].y,
        36,
        1.25 * Math.PI,
        (1.25 +
          (this.state.combatants[i].hp / this.state.combatants[i].maxHp) * 0.5) *
          Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].x,
        this.state.combatants[i].y,
        37,
        1.25 * Math.PI,
        (1.25 +
          (this.state.combatants[i].hp / this.state.combatants[i].maxHp) * 0.5) *
          Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].x,
        this.state.combatants[i].y,
        38,
        1.25 * Math.PI,
        (1.25 +
          (this.state.combatants[i].hp / this.state.combatants[i].maxHp) * 0.5) *
          Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.lineWidth = 1;
      battleMapContext.strokeStyle = "black";
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].x,
        this.state.combatants[i].y,
        32,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.lineWidth = 1;
      battleMapContext.strokeStyle = "black";
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].x,
        this.state.combatants[i].y,
        40,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.stroke();
    }
    if (this.state.hoverCombatant !== -1) {
      battleMapContext.font = "20px Arial";
      battleMapContext.textAlign = "center";
      battleMapContext.strokeStyle = "black";
      battleMapContext.lineWidth = 3;
      battleMapContext.strokeText(
        this.state.combatants[this.state.hoverCombatant].name,
        this.state.combatants[this.state.hoverCombatant].x,
        this.state.combatants[this.state.hoverCombatant].y - 44
      );
      battleMapContext.lineWidth = 1;
      battleMapContext.fillStyle = "white";
      battleMapContext.fillText(
        this.state.combatants[this.state.hoverCombatant].name,
        this.state.combatants[this.state.hoverCombatant].x,
        this.state.combatants[this.state.hoverCombatant].y - 44
      );
    }
    this.setState({
      battleMapUpdateFrame: requestAnimationFrame(() => {
        this.updateBattleMapCanvas();
      }),
    });
  }

  render() {
    return (
      <div>
        <div
          style={this.state.backgroundStyle}
          onClick={() => {
            this.props.exit();
          }}
        ></div>
        <div style={this.state.mainStyle}>
          <div style={this.state.headerStyle}>
            <img
              className="hover"
              style={{
                height: "24px",
                borderRadius: "4px",
                position: "relative",
                top: "4px",
              }}
              src={BackIcon}
              alt="Change Background"
              title="Change Background"
              onClick={() => {
                this.setState(
                  {
                    backgroundIndex:
                      this.state.backgroundIndex - 1 === -1
                        ? this.state.backgrounds.length - 1
                        : this.state.backgroundIndex - 1,
                  },
                  () => {
                    var newBackground = new Image();
                    newBackground.src =
                      this.state.backgrounds[this.state.backgroundIndex];
                    this.setState({ background: newBackground });
                  }
                );
              }}
            />
            Battle Map
            <img
              className="hover"
              style={{
                transform: "scaleX(-1)",
                height: "24px",
                borderRadius: "4px",
                position: "relative",
                top: "4px",
              }}
              src={BackIcon}
              alt="Change Background"
              title="Change Background"
              onClick={() => {
                this.setState(
                  {
                    backgroundIndex:
                      this.state.backgroundIndex + 1 ===
                      this.state.backgrounds.length
                        ? 0
                        : this.state.backgroundIndex + 1,
                  },
                  () => {
                    var newBackground = new Image();
                    newBackground.src =
                      this.state.backgrounds[this.state.backgroundIndex];
                    this.setState({ background: newBackground });
                  }
                );
              }}
            />
          </div>

          <canvas
            onMouseMove={(e) => {
              this.handleMapMouseMove(e);
            }}
            onMouseDown={() => {
              this.handleMapMouseDown();
            }}
            onMouseUp={() => {
              this.handleMapMouseUp();
            }}
            onMouseLeave={() => {
              this.handleMapMouseUp();
              this.setState({ hoverCombatant: -1 });
            }}
            ref={this.state.battleMapCanvasRef}
            style={this.state.contentStyle}
            width={window.innerWidth * 0.9 - 528}
            height={window.innerHeight * 0.9 - 32}
          />
        </div>
      </div>
    );
  }
}

export default BattleMap;
