import React, { Component } from "react";
import GrassTexture from "../assets/grass.png";
import SnowTexture from "../assets/snow.png";
import SandTexture from "../assets/sand.png";
import BackIcon from "../assets/back.png";
import Combatant from "./Combatant";
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
      leftBar: {
        width: "254px",
        height: "calc(100vh - 136px)",
        marginLeft: "1px",
        overflowY: "auto",
        overflowX: "hidden",
      },
      rightBar: {
        width: "254px",
        height: "calc(100vh - 136px)",
        overflowY: "auto",
        overflowX: "hidden",
      },
      background: null,
      backgroundIndex: 0,
      backgroundSrc: [GrassTexture, SandTexture, SnowTexture],
      background: new Image(),
      battleMapUpdateFrame: null,
      combatantRadius: 48,
      combatants: [],
      hoverCombatant: -1,
      selectedCombatant: -1,
      nameInputRef: React.createRef(),
      loading: false,
    };
  }

  componentDidMount() {
    var background = this.state.background;
    background.src = this.state.backgroundSrc[this.state.backgroundIndex];
    background.onload = () => {
      if (!this.state.loading) {
        this.setState({ loading: true }, () => {
          this.checkCombatants(() => {
            this.setState({
              background: background,
              loading: false,
              battleMapUpdateFrame: requestAnimationFrame(() => {
                this.updateBattleMapCanvas();
              }),
            });
          });
        });
      }
    };
  }

  checkCombatants(cb) {
    this.props.store.refresh("combatants", () => {
      var combatants = this.props.store.read("combatants", {
        fieldOwnerType: "groups",
        fieldOwnerId: this.props._id,
      });
      console.log(combatants);
      this.setState({ combatants: combatants }, () => {
        this.getMarkers(cb);
      });
    });
  }

  getMarkers(cb) {
    var combatants = [...this.state.combatants];
    for (var i = 0; i < combatants.length; i++) {
      if (combatants[i].characterId !== -1) {
        combatants[i].marker = this.props.store.read("characters", {
          id: combatants[i].characterId,
        })[0].marker;
        combatants[i].name = this.props.store.read("characters", {
          id: combatants[i].characterId,
        })[0].name;
      } else if (combatants[i].memberId === -1) {
        combatants[i].marker = new Image();
        combatants[i].marker.src = HeroIcon;
      } else if (combatants[i].memberId === -2) {
        combatants[i].marker = new Image();
        combatants[i].marker.src = EnemyIcon;
      }
    }
    this.setState({ combatants: combatants }, () => {
      cb();
    });
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {
    cancelAnimationFrame(this.state.battleMapUpdateFrame);
    this.setState({ battleMapUpdateFrame: null });
  }

  getDistance(x1, y1, x2, y2) {
    var a = Math.abs(x1 - x2);
    var b = Math.abs(y1 - y2);
    return Math.sqrt(a * a + b * b);
  }

  handleMapMouseMove(e) {
    this.setState({
      mouseX: e.nativeEvent.offsetX,
      mouseY: e.nativeEvent.offsetY,
    });
    if (this.state.clicked && this.state.selectedCombatant !== -1) {
      var item = this.state.combatants[this.state.selectedCombatant];
      item.fieldX = e.nativeEvent.offsetX;
      item.fieldY = e.nativeEvent.offsetY;
    }
    var found = false;
    for (var i = 0; i < this.state.combatants.length; i++) {
      if (
        this.getDistance(
          this.state.mouseX,
          this.state.mouseY,
          this.state.combatants[i].fieldX,
          this.state.combatants[i].fieldY
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
          this.state.combatants[i].fieldX,
          this.state.combatants[i].fieldY
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
    if (this.state.clicked && this.state.selectedCombatant !== -1) {
      this.props.store.update(
        "combatants",
        { id: this.state.combatants[this.state.selectedCombatant].id },
        {
          fieldX: this.state.combatants[this.state.selectedCombatant].fieldX,
          fieldY: this.state.combatants[this.state.selectedCombatant].fieldY,
        },
        () => {}
      );
    }
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
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY - 80
      );
      battleMapContext.lineWidth = 1;
      battleMapContext.fillStyle = "white";
      battleMapContext.fillText(
        this.state.combatants[i].name,
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY - 80
      );*/

      battleMapContext.drawImage(
        this.state.combatants[i].marker,
        this.state.combatants[i].fieldX - 24,
        this.state.combatants[i].fieldY - 24,
        48,
        48
      );
      if (i === this.state.selectedCombatant) {
        battleMapContext.lineWidth = 1;
        battleMapContext.strokeStyle = "black";
        battleMapContext.beginPath();
        battleMapContext.arc(
          this.state.combatants[i].fieldX,
          this.state.combatants[i].fieldY,
          34,
          0,
          2 * Math.PI
        );
        battleMapContext.stroke();
        battleMapContext.strokeStyle = "white";
        battleMapContext.beginPath();
        battleMapContext.arc(
          this.state.combatants[i].fieldX,
          this.state.combatants[i].fieldY,
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
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY,
        33,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY,
        38,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.shadowBlur = 0;
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY,
        34,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY,
        35,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY,
        36,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY,
        37,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.strokeStyle = "lime";
      battleMapContext.lineWidth = 3;
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY,
        33,
        1.25 * Math.PI,
        (1.25 +
          (this.state.combatants[i].hp / this.state.combatants[i].maxHp) *
            0.5) *
          Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY,
        34,
        1.25 * Math.PI,
        (1.25 +
          (this.state.combatants[i].hp / this.state.combatants[i].maxHp) *
            0.5) *
          Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY,
        35,
        1.25 * Math.PI,
        (1.25 +
          (this.state.combatants[i].hp / this.state.combatants[i].maxHp) *
            0.5) *
          Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY,
        36,
        1.25 * Math.PI,
        (1.25 +
          (this.state.combatants[i].hp / this.state.combatants[i].maxHp) *
            0.5) *
          Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY,
        37,
        1.25 * Math.PI,
        (1.25 +
          (this.state.combatants[i].hp / this.state.combatants[i].maxHp) *
            0.5) *
          Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY,
        38,
        1.25 * Math.PI,
        (1.25 +
          (this.state.combatants[i].hp / this.state.combatants[i].maxHp) *
            0.5) *
          Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.lineWidth = 1;
      battleMapContext.strokeStyle = "black";
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY,
        32,
        1.25 * Math.PI,
        1.75 * Math.PI
      );
      battleMapContext.stroke();
      battleMapContext.lineWidth = 1;
      battleMapContext.strokeStyle = "black";
      battleMapContext.beginPath();
      battleMapContext.arc(
        this.state.combatants[i].fieldX,
        this.state.combatants[i].fieldY,
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
        this.state.combatants[this.state.hoverCombatant].fieldX,
        this.state.combatants[this.state.hoverCombatant].fieldY - 44
      );
      battleMapContext.lineWidth = 1;
      battleMapContext.fillStyle = "white";
      battleMapContext.fillText(
        this.state.combatants[this.state.hoverCombatant].name,
        this.state.combatants[this.state.hoverCombatant].fieldX,
        this.state.combatants[this.state.hoverCombatant].fieldY - 44
      );
    }
    this.setState({
      battleMapUpdateFrame: requestAnimationFrame(() => {
        this.updateBattleMapCanvas();
      }),
    });
  }

  addAlly() {
    this.props.store.create(
      "combatants",
      {
        fieldOwnerType: "groups",
        fieldOwnerId: this.props._id,
        characterId: -1,
        name: "Ally",
        memberId: -1,
        hp: 10,
        maxHp: 10,
        visible: true,
      },
      () => {
        if (!this.state.loading) {
          this.setState({ loading: true }, () => {
            this.checkCombatants(() => {
              this.setState({
                loading: false,
                battleMapUpdateFrame: requestAnimationFrame(() => {
                  this.updateBattleMapCanvas();
                }),
              });
            });
          });
        }
      }
    );
  }

  addEnemy() {
    this.props.store.create(
      "combatants",
      {
        fieldOwnerType: "groups",
        fieldOwnerId: this.props._id,
        characterId: -1,
        name: "Enemy",
        memberId: -2,
        hp: 10,
        maxHp: 10,
        visible: true,
      },
      () => {
        if (!this.state.loading) {
          this.setState({ loading: true }, () => {
            this.checkCombatants(() => {
              this.setState({
                loading: false,
                battleMapUpdateFrame: requestAnimationFrame(() => {
                  this.updateBattleMapCanvas();
                }),
              });
            });
          });
        }
      }
    );
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
                        ? this.state.backgroundSrc.length - 1
                        : this.state.backgroundIndex - 1,
                  },
                  () => {
                    var background = this.state.background;
                    background.src =
                      this.state.backgroundSrc[this.state.backgroundIndex];
                    this.setState({ background: background });
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
                      this.state.backgroundSrc.length
                        ? 0
                        : this.state.backgroundIndex + 1,
                  },
                  () => {
                    var background = this.state.background;
                    background.src =
                      this.state.backgroundSrc[this.state.backgroundIndex];
                    this.setState({ background: background });
                  }
                );
              }}
            />
          </div>
          <div style={{ display: "flex" }}>
            <div style={this.state.leftBar}>
              {this.state.combatants.map((combatant, index) => {
                return combatant.characterId !== -1 ||
                  combatant.memberId === -1 ? (
                  <div
                    onMouseEnter={() => {
                      this.setState({ hoverCombatant: index });
                    }}
                    onMouseLeave={() => {
                      this.setState({ hoverCombatant: -1 });
                    }}
                    onMouseDown={() => {
                      this.setState({ selectedCombatant: index });
                    }}
                    key={"combatant" + combatant.id}
                  >
                    <Combatant
                      _id={combatant.id}
                      store={this.props.store}
                      selected={
                        this.state.selectedCombatant !== -1 &&
                        this.state.combatants[this.state.selectedCombatant]
                          .id === combatant.id
                      }
                      hover={
                        this.state.hoverCombatant !== -1 &&
                        this.state.combatants[this.state.hoverCombatant].id ===
                          combatant.id
                      }
                      destroy={() => {
                        this.props.store.delete(
                          "combatants",
                          { id: combatant.id },
                          () => {
                            if (!this.state.loading) {
                              this.setState(
                                {
                                  hoverCombatant: -1,
                                  selectedCombatant: -1,
                                  loading: true,
                                },
                                () => {
                                  this.checkCombatants(() => {
                                    this.setState({
                                      loading: false,
                                    });
                                  });
                                }
                              );
                            }
                          }
                        );
                      }}
                    />
                  </div>
                ) : null;
              })}
              <div
                className="hover"
                style={{
                  margin: "16px",
                  width: "calc(100% - 40px)",
                  borderColor: "white",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  padding: "4px",
                  paddingBottom: "6px",
                  borderRadius: "16px",
                }}
                onClick={() => {
                  this.addAlly();
                }}
              >
                <div style={{ textAlign: "center" }}>+</div>
              </div>
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
            <div style={this.state.rightBar}>
              {this.state.combatants.map((combatant, index) => {
                return combatant.memberId === -2 ? (
                  <div
                    onMouseEnter={() => {
                      this.setState({ hoverCombatant: index });
                    }}
                    onMouseLeave={() => {
                      this.setState({ hoverCombatant: -1 });
                    }}
                    onMouseDown={() => {
                      this.setState({ selectedCombatant: index });
                    }}
                    key={"combatant" + combatant.id}
                  >
                    <Combatant
                      _id={combatant.id}
                      store={this.props.store}
                      selected={
                        this.state.selectedCombatant !== -1 &&
                        this.state.combatants[this.state.selectedCombatant]
                          .id === combatant.id
                      }
                      hover={
                        this.state.hoverCombatant !== -1 &&
                        this.state.combatants[this.state.hoverCombatant].id ===
                          combatant.id
                      }
                      destroy={() => {
                        this.props.store.delete(
                          "combatants",
                          { id: combatant.id },
                          () => {
                            if (!this.state.loading) {
                              this.setState(
                                {
                                  hoverCombatant: -1,
                                  selectedCombatant: -1,
                                  loading: true,
                                },
                                () => {
                                  this.checkCombatants(() => {
                                    this.setState({
                                      loading: false,
                                    });
                                  });
                                }
                              );
                            }
                          }
                        );
                      }}
                    />
                  </div>
                ) : null;
              })}
              <div
                className="hover"
                style={{
                  margin: "16px",
                  width: "calc(100% - 40px)",
                  borderColor: "white",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  padding: "4px",
                  paddingBottom: "6px",
                  borderRadius: "16px",
                }}
                onClick={() => {
                  this.addEnemy();
                }}
              >
                <div style={{ textAlign: "center" }}>+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BattleMap;
