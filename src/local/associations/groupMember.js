//includes character and group
export default function (allData, items) {
  var finishedItems = [...items];

  for (var i = 0; i < finishedItems.length; i++) {
    for (var j = 0; j < allData.characters.length; j++) {
      if (finishedItems[i].characterId === allData.characters[j].id) {
        finishedItems[i].character = { ...allData.characters[j] };
      }
    }
  }

  for (var i = 0; i < finishedItems.length; i++) {
    for (var j = 0; j < allData.groups.length; j++) {
      if (finishedItems[i].groupId === allData.groups[j].id) {
        finishedItems[i].group = { ...allData.groups[j] };
      }
    }
  }

  return [...finishedItems];
}
