//comes with logs and group members (which comes with group data)

export default function (allData, items) {
  var finishedItems = [...items];

  var logs;
  for (var i = 0; i < items.length; i++) {
    logs = [];
    for (var j = 0; j < allData.logs.length; j++) {
      if (items[i].id === allData.logs[j].characterId) {
        logs[logs.length] = { ...allData.logs[j] };
      }
    }
    finishedItems[i].logs = [...logs];
  }

  var stats;
  for (var i = 0; i < items.length; i++) {
    stats = [];
    for (var j = 0; j < allData.stats.length; j++) {
      if (items[i].id === allData.stats[j].characterId) {
        stats[stats.length] = { ...allData.stats[j] };
      }
    }
    finishedItems[i].stats = [...stats];
  }

  var inventoryItems;
  for (var i = 0; i < items.length; i++) {
    inventoryItems = [];
    for (var j = 0; j < allData.inventoryItems.length; j++) {
      if (items[i].id === allData.inventoryItems[j].itemId) {
        inventoryItems[inventoryItems.length] = {
          ...allData.inventoryItems[j],
        };
      }
    }
    finishedItems[i].inventoryItems = [...inventoryItems];
  }

  for (var i = 0; i < finishedItems.length; i++) {
    for (var j = 0; j < finishedItems[i].inventoryItems.length; j++) {
      if (finishedItems[i].inventoryItems[j].ownerType !== "None") {
        for (
          var k = 0;
          k < allData[finishedItems[i].inventoryItems[j].ownerType].length;
          k++
        ) {
          if (
            finishedItems[i].inventoryItems[j].ownerId ===
            allData[finishedItems[i].inventoryItems[j].ownerType][k].id
          ) {
            finishedItems[i].inventoryItems[j].owner = {
              ...allData[finishedItems[i].inventoryItems[j].ownerType][k],
            };
          }
        }
      }
    }
  }

  return [...finishedItems];
}
