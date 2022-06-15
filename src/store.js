import CharacterModel from "./local/models/character.js";
import GroupModel from "./local/models/group.js";
import GroupMemberModel from "./local/models/groupMember.js";
import LocaleModel from "./local/models/locale.js";
import LabelModel from "./local/models/label.js";
import EventModel from "./local/models/event.js";
import LogModel from "./local/models/log.js";
import nativeItemModel from "./local/models/nativeItem.js";
import inventoryItemModel from "./local/models/inventoryItem.js";

import characterAssociations from "./local/associations/character.js";
import groupAssociations from "./local/associations/group.js";
import groupMemberAssociations from "./local/associations/groupMember.js";
import localeAssociations from "./local/associations/locale.js";
import eventAssociations from "./local/associations/event.js";
import nativeItemAssociations from "./local/associations/nativeItem.js";
import inventoryItemAssociations from "./local/associations/inventoryItem.js";

import api from "./api.js";

const store = {
  gameId: -1,
  online: true,
  api: api,
  games: [],
  characters: [],
  groups: [],
  groupMembers: [],
  locales: [],
  labels: [],
  events: [],
  logs: [],
  combatants: [],
  nativeItems: [],
  stats: [],
  inventoryItems: [],
  setGame: (game, cb) => {
    store.gameId = parseInt(game);
    store.refreshAll(() => {
      cb();
    });
  },
  create: (type, data, cb) => {
    if (store.online) {
      if (type !== "logs" && type !== "label" && type !== "games") {
        data.gameId = store.gameId;
      }
      store.api.create(type, data, (res) => {
        store[type] = [...store[type], res];
        if (type === "characters") {
          store.refresh("groupMembers", () => {
            store.refresh("groups", () => {
              cb(res);
            });
          });
        } else {
          cb(res);
        }
      });
    } else {
      var _new;
      switch (type) {
        case "characters":
          _new = CharacterModel(data.category, store.characters.length + 1);
          break;
        case "groups":
          _new = GroupModel(store.groups.length + 1);
          break;
        case "groupMembers":
          _new = GroupMemberModel(
            store.groupMembers.length + 1,
            data.groupId,
            data.characterId
          );
          break;
        case "locales":
          _new = LocaleModel(store.locales.length + 1);
          break;
        case "labels":
          _new = LabelModel(store.labels.length + 1, data.localeId);
          break;
        case "events":
          _new = EventModel(store.events.length + 1);
          break;
        case "logs":
          _new = LogModel(
            store.logs.length + 1,
            data.ownerType,
            data.ownerId,
            data.content
          );
          break;
        case "nativeItems":
          _new = nativeItemModel(store.nativeItems.length + 1);
          break;
        case "inventoryItems":
          _new = inventoryItemModel(
            store.inventoryItems.length + 1,
            data.ownerType,
            data.ownerId,
            data.itemId
          );
          break;
      }
      store[type][store[type].length] = { ..._new };
      cb(_new);
    }
  },
  read: (type, whereData) => {
    var item;
    var items = [];
    var fits;
    var keys;
    for (var i = 0; i < store[type].length; i++) {
      item = store[type][i];
      fits = true;
      keys = Object.keys(whereData);
      for (var j = 0; j < keys.length; j++) {
        if (
          typeof item[keys[j]] === "undefined" ||
          item[keys[j]] !== whereData[keys[j]]
        ) {
          fits = false;
        }
      }
      if (fits) {
        items[items.length] = item;
      }
    }
    var itemsCompleted = [];
    var allData = {
      characters: [...store.characters],
      games: [...store.games],
      groups: [...store.groups],
      groupMembers: [...store.groupMembers],
      locales: [...store.locales],
      labels: [...store.labels],
      events: [...store.events],
      logs: [...store.logs],
      combatants: [...store.combatants],
      nativeItems: [...store.nativeItems],
      inventoryItems: [...store.inventoryItems],
      stats: [...store.stats],
    };
    switch (type) {
      case "characters":
        itemsCompleted = characterAssociations(allData, items);
        break;
      case "groups":
        itemsCompleted = groupAssociations(allData, items);
        break;
      case "groupMembers":
        itemsCompleted = groupMemberAssociations(allData, items);
        break;
      case "locales":
        itemsCompleted = localeAssociations(allData, items);
        break;
      case "events":
        itemsCompleted = eventAssociations(allData, items);
        break;
      case "nativeItems":
        itemsCompleted = nativeItemAssociations(allData, items);
        break;
      case "inventoryItems":
        itemsCompleted = inventoryItemAssociations(allData, items);
        break;
    }
    return type === "labels" ||
      type === "logs" ||
      type === "games" ||
      type === "combatants" ||
      type === "stats"
      ? items
      : itemsCompleted;
  },
  update: (type, whereData, data, cb) => {
    var item;
    var fits;
    if (type !== "logs" && type !== "labels" && type !== "games") {
      whereData.gameId = store.gameId;
    }
    delete data.gameId;
    var keys;
    if (type !== "upload") {
      for (var i = 0; i < store[type].length; i++) {
        item = store[type][i];
        fits = true;
        keys = Object.keys(whereData);
        for (var j = 0; j < keys.length; j++) {
          if (
            typeof item[keys[j]] === "undefined" ||
            item[keys[j]] !== whereData[keys[j]]
          ) {
            fits = false;
          }
        }
        if (fits) {
          keys = Object.keys(data);
          for (var k = 0; k < keys.length; k++) {
            store[type][i][keys[k]] = data[keys[k]];
          }
        }
      }
    } else {
      i = 0;
      while (
        i < store[whereData.type].length &&
        store[whereData.type][i].id !== whereData.id
      ) {
        i++;
      }
      if (
        i < store[whereData.type].length &&
        store[whereData.type][i].id === whereData.id
      ) {
        if (whereData.category === "portrait") {
          store[whereData.type][i].portrait = new Image();
          store[whereData.type][i].portrait.src = data.portrait;
          store[whereData.type][i].portrait.onload = () => {
            cb();
          };
        } else if (whereData.category === "marker") {
          store[whereData.type][i].marker = new Image();
          store[whereData.type][i].marker.src = data.marker;
          store[whereData.type][i].marker.onload = () => {
            cb();
          };
        } else if (whereData.category === "map") {
          store[whereData.type][i].map = new Image();
          store[whereData.type][i].map.src = data.map;
          store[whereData.type][i].map.onload = () => {
            cb();
          };
        } else if (whereData.category === "icon") {
          store[whereData.type][i].icon = new Image();
          store[whereData.type][i].icon.src = data.icon;
          store[whereData.type][i].icon.onload = () => {
            cb();
          };
        }
      }
    }
    if (store.online) {
      store.api.update(type, whereData, data, (res) => {
        if (type === "charcters") {
          store.refresh("characters", () => {
            store.refresh("groups", () => {
              store.refresh("groupMembers", cb);
            });
          });
        } else if (type === "groupMembers") {
          store.refresh("groupMembers", () => {
            store.refresh("groups", () => {
              store.refresh("characters", cb);
            });
          });
        } else if (type === "groups") {
          store.refresh("groups", () => {
            store.refresh("groupMembers", () => {
              store.refresh("characters", cb);
            });
          });
        } else if (type !== "upload") {
          cb();
        }
      });
    } else if (type !== "upload") {
      cb();
    }
  },
  delete: (type, whereData, cb) => {
    var item;
    var fits;
    var keys;
    for (var i = 0; i < store[type].length; i++) {
      item = store[type][i];
      fits = true;
      keys = Object.keys(whereData);
      for (var j = 0; j < keys.length; j++) {
        if (
          typeof item[keys[j]] === "undefined" ||
          item[keys[j]] !== whereData[keys[j]]
        ) {
          fits = false;
        }
      }
      if (fits) {
        store[type].splice(i, 1);
      }
    }
    if (store.online) {
      store.api.delete(type, whereData, cb);
    } else {
      cb();
    }
  },
  refresh: (type, cb) => {
    if (store.online) {
      var obj = [];
      obj =
        type === "games" || type === "logs" || type === "labels"
          ? {}
          : { gameId: store.gameId };
      store.api.read(store.gameId, type, obj, (res) => {
        store[type] = res.data;
        cb();
      });
    } else {
      cb();
    }
  },
  refreshAll: (cb) => {
    console.log("!");
    store.refresh("characters", () => {
      console.log("!");
      store.refresh("groups", () => {
        console.log("!");
        store.refresh("groupMembers", () => {
          console.log("!");
          store.refresh("locales", () => {
            console.log("!");
            store.refresh("events", () => {
              console.log("!");
              store.refresh("logs", () => {
                console.log("!");
                store.refresh("labels", () => {
                  console.log("!");
                  store.refresh("combatants", () => {
                    console.log("!");
                    //cb();
                    store.refresh("nativeItems", () => {
                      console.log("!");
                      store.refresh("inventoryItems", () => {
                        console.log("!");
                        store.refresh("stats", () => {
                          console.log("!");
                          cb();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  },
};
export default store;
