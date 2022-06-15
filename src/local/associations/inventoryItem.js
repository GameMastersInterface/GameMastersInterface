export default function (allData, items) {
  var finishedItems = [...items];

  for (var i = 0; i < finishedItems.length; i++) {
    for (var j = 0; j < allData[finishedItems[i].ownerType].length; j++) {
      if (
        finishedItems[i].ownerId === allData[finishedItems[i].ownerType][j].id
      ) {
        finishedItems[i].owner = { ...allData[finishedItems[i].ownerType][j] };
      }
    }
  }

  for (var i = 0; i < finishedItems.length; i++) {
    for (var j = 0; j < allData.nativeItems.length; j++) {
      if (finishedItems[i].itemId === allData.nativeItems[j].id) {
        finishedItems[i].item = { ...allData.nativeItems[j] };
      }
    }
  }

  for (var i = 0; i < finishedItems.length; i++) {
    finishedItems[i].item.stats = [];
    for (var j = 0; j < allData.stats.length; j++) {
      if (finishedItems[i].itemId === allData.stats[j].itemId) {
        finishedItems[i].item.stats[finishedItems[i].item.stats.length] =
          allData.stats[j];
      }
    }
  }

  return [...finishedItems];
}
