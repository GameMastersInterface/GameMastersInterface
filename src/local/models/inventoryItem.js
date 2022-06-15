export default function (id, ownerType, ownerId, itemId) {
  return {
    id: id,
    ownerType: ownerType,
    ownerId: ownerId,
    itemId: itemId,
    quantity: -1,
  };
}
