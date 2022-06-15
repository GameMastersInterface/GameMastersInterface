export default function (category, id) {
  return {
    category: category,
    id: id,
    name:
      "New " +
      (category === "heroes" ? "Hero" : category === "enemies" ? "Enemy" : "NPC"),
    localeId: -1,
    localeX: -1,
    localeY: -1,
    hp: 1,
    maxHp: 1,
    unique: true,
    visible: true,
    marker: new Image(),
    portrait: new Image(),
  };
}
