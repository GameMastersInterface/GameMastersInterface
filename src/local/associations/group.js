//include members, characters, and logs

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

  var groupMembers;
  for (var i = 0; i < items.length; i++) {
    groupMembers = [];
    for (var j = 0; j < allData.groupMembers.length; j++) {
      if (items[i].id === allData.groupMembers[j].groupId) {
        groupMembers[groupMembers.length] = { ...allData.groupMembers[j] };
      }
    }
    finishedItems[i].groupMembers = [...groupMembers];
  }

  //character
  for (var i = 0; i < finishedItems.length; i++) {
    for (var j = 0; j < finishedItems[i].groupMembers.length; j++) {
      for (var k = 0; k < allData.characters.length; k++) {
        if (
          finishedItems[i].groupMembers[j].characterId ===
          allData.characters[k].id
        ) {
          finishedItems[i].groupMembers[j].character = {
            ...allData.characters[k],
          };
        }
      }
    }
  }

  return [...finishedItems];
}
