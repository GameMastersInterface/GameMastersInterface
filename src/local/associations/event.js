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

  return [...finishedItems];
}
