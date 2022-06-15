import axios from "axios";
import HeroIcon from "./assets/hero.png";
import NPCIcon from "./assets/npc.png";
import LootIcon from "./assets/loot.png";
import EnemyIcon from "./assets/enemy.png";
import GroupIcon from "./assets/group.png";
import LocaleIcon from "./assets/locale.png";
import EventIcon from "./assets/event.png";
import NoImage from "./assets/noimage.png";

const api = {
  port: 3001,
  loadImages: (gameId, type, result, cb) => {
    var portraitLoaded = false;
    var markerLoaded = false;
    var mapLoaded = false;
    if (type === "characters") {
      result.portrait = new Image();
      result.portrait.src =
        "http://localhost:" +
        api.port +
        "/images/" +
        gameId +
        "_" +
        type +
        "_" +
        result.id +
        "_portrait.png?" +
        Math.round(Math.random() * 1000000000);
      result.portrait.onerror = () => {
        result.portrait.src = NoImage;
      };
      result.portrait.onload = () => {
        portraitLoaded = true;
        if (markerLoaded) {
          cb(result);
        }
      };
      result.marker = new Image();
      result.marker.src =
        "http://localhost:" +
        api.port +
        "/images/" +
        gameId +
        "_" +
        type +
        "_" +
        result.id +
        "_marker.png?" +
        Math.round(Math.random() * 1000000000);
      result.marker.onerror = () => {
        if (result.category === "heroes") {
          result.marker.src = HeroIcon;
        }
        if (result.category === "npcs") {
          result.marker.src = NPCIcon;
        }
        if (result.category === "enemies") {
          result.marker.src = EnemyIcon;
        }
      };
      result.marker.onload = () => {
        markerLoaded = true;
        if (portraitLoaded) {
          cb(result);
        }
      };
    } else if (type === "groups") {
      result.marker = new Image();
      result.marker.src =
        "http://localhost:" +
        api.port +
        "/images/" +
        gameId +
        "_" +
        type +
        "_" +
        result.id +
        "_marker.png?" +
        Math.round(Math.random() * 1000000000);
      result.marker.onerror = () => {
        result.marker.src = GroupIcon;
      };
      result.marker.onload = () => {
        cb(result);
      };
    } else if (type === "nativeItems") {
      result.icon = new Image();
      result.icon.src =
        "http://localhost:" +
        api.port +
        "/images/" +
        gameId +
        "_" +
        type +
        "_" +
        result.id +
        "_icon.png?" +
        Math.round(Math.random() * 1000000000);
      result.icon.onerror = () => {
        result.icon.src = LootIcon;
      };
      result.icon.onload = () => {
        cb(result);
      };
    } else if (type === "events") {
      result.marker = new Image();
      result.marker.src =
        "http://localhost:" +
        api.port +
        "/images/" +
        gameId +
        "_" +
        type +
        "_" +
        result.id +
        "_marker.png?" +
        Math.round(Math.random() * 1000000000);
      result.marker.onerror = () => {
        result.marker.src = EventIcon;
      };
      result.marker.onload = () => {
        cb(result);
      };
    } else if (type === "locales") {
      result.marker = new Image();
      result.marker.src =
        "http://localhost:" +
        api.port +
        "/images/" +
        gameId +
        "_" +
        type +
        "_" +
        result.id +
        "_marker.png?" +
        Math.round(Math.random() * 1000000000);
      result.marker.onerror = () => {
        result.marker.src = LocaleIcon;
      };
      result.marker.onload = () => {
        markerLoaded = true;
        if (mapLoaded) {
          cb(result);
        }
      };
      result.map = new Image();
      result.map.src =
        "http://localhost:" +
        api.port +
        "/images/" +
        gameId +
        "_" +
        type +
        "_" +
        result.id +
        "_map.png?" +
        Math.round(Math.random() * 1000000000);
      result.map.onerror = () => {
        result.map.src = NoImage;
      };
      result.map.onload = () => {
        mapLoaded = true;
        if (markerLoaded) {
          cb(result);
        }
      };
    } else {
      cb(result);
    }
  },
  loadNewImage: (type, result, cb) => {
    var portraitLoaded = false;
    var markerLoaded = false;
    var mapLoaded = false;
    if (type === "characters") {
      result.portrait = new Image();
      result.portrait.src = NoImage;
      result.portrait.onload = () => {
        portraitLoaded = true;
        if (markerLoaded) {
          cb(result);
        }
      };
      result.marker = new Image();
      if (result.category === "heroes") {
        result.marker.src = HeroIcon;
      }
      if (result.category === "enemies") {
        result.marker.src = EnemyIcon;
      }
      if (result.category === "npcs") {
        result.marker.src = NPCIcon;
      }
      result.marker.onload = () => {
        markerLoaded = true;
        if (portraitLoaded) {
          cb(result);
        }
      };
    } else if (type === "groups") {
      result.marker = new Image();
      result.marker.src = GroupIcon;
      result.marker.onload = () => {
        cb(result);
      };
    } else if (type === "locales") {
      result.marker = new Image();
      result.marker.src = LocaleIcon;
      result.marker.onload = () => {
        markerLoaded = true;
        if (mapLoaded) {
          cb(result);
        }
      };
      result.map = new Image();
      result.map.src = NoImage;
      result.map.onload = () => {
        mapLoaded = true;
        if (markerLoaded) {
          cb(result);
        }
      };
    } else if (type === "events") {
      result.marker = new Image();
      result.marker.src = EventIcon;
      result.marker.onload = () => {
        cb(result);
      };
    } else {
      cb(result);
    }
  },
  create: (type, data, cb) => {
    var query = Object.keys(data)
      .map((key) => `${key}=${data[key]}`)
      .join("&");
    axios
      .post("http://localhost:" + api.port + "/" + type + "/create?" + query)
      .then((result) => {
        api.loadNewImage(type, result.data, cb);
      });
  },
  read: (gameId, type, whereData, cb) => {
    var query =
      type +
      "?" +
      Object.keys(whereData)
        .map((key) => `${key}=${whereData[key]}`)
        .join("&");
    axios.get("http://localhost:" + api.port + "/" + query).then((result) => {
      if (
        type === "games" ||
        type === "groupMembers" ||
        type === "logs" ||
        result.data.length === 0
      ) {
        cb(result);
      } else {
        var itemsLoaded = 0;
        if (gameId !== -1) {
          for (var i = 0; i < result.data.length; i++) {
            api.loadImages(gameId, type, result.data[i], () => {
              itemsLoaded++;
              if (itemsLoaded === result.data.length) {
                cb(result);
              }
            });
          }
        }
      }
    });
  },
  update: (type, whereData, data, cb) => {
    var query =
      type +
      "?" +
      Object.keys(whereData)
        .map((key) => `${key}=${whereData[key]}`)
        .join("&");
    axios
      .post("http://localhost:" + api.port + "/" + query, data)
      .then((result) => {
        cb(result);
      });
  },
  delete: (type, whereData, cb) => {
    var query =
      type +
      "?" +
      Object.keys(whereData)
        .map((key) => `${key}=${whereData[key]}`)
        .join("&");
    axios
      .delete("http://localhost:" + api.port + "/" + query)
      .then((result) => {
        cb(result);
      });
  },
};
export default api;
