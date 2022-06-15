export default function (id, ownerType, ownerId, content) {
  var now = new Date();
  return {
    id: id,
    characterId: ownerType === "characters" ? ownerId : -1,
    groupId: ownerType === "groups" ? ownerId : -1,
    localeId: ownerType === "locales" ? ownerId : -1,
    eventId: ownerType === "events" ? ownerId : -1,
    content: content,
    createdAt:
      now.getFullYear() +
      "/" +
      (now.getMonth() + 1) +
      "/" +
      now.getDate() +
      " " +
      now.getHours() +
      ":" +
      now.getMinutes() +
      ":" +
      now.getSeconds(),
  };
}
