const draw = {
  map: (context, image, x, y, zoom) => {
    context.drawImage(image, x, y, image.width * zoom, image.height * zoom);
  },
  hover: (context, item, mapX, mapY, zoom) => {
    context.textAlign = "center";
    context.font = "20px Verdana";
    context.fillStyle = "white";
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.shadowBlur = 4;
    context.shadowColor = "black";
    context.strokeText(
      item.name,
      item.localeX * zoom + mapX,
      item.localeY * zoom + mapY - 136
    );
    context.fillText(
      item.name,
      item.localeX * zoom + mapX,
      item.localeY * zoom + mapY - 136
    );
    context.textAlign = "start";
    context.shadowBlur = 0;
    context.drawImage(
      item.marker,
      item.localeX * zoom + mapX - 64,
      item.localeY * zoom + mapY - 128,
      128,
      128
    );
  },
  markers: (
    context,
    placingType,
    placingId,
    itemHover,
    items,
    mapX,
    mapY,
    zoom
  ) => {
    for (var i = 0; i < items.length; i++) {
      if (
        (itemHover !== null &&
          (itemHover.type !== items[i].type || itemHover.id !== items[i].id)) ||
        itemHover === null
      ) {
        if (!(placingType === items[i].type && placingId === items[i].id)) {
          context.drawImage(
            items[i].marker,
            items[i].localeX * zoom + mapX - 48,
            items[i].localeY * zoom + mapY - 96,
            96,
            96
          );
        }
      }
    }
  },
  placing: (context, item, mouseX, mouseY) => {
    context.drawImage(item.marker, mouseX - 48, mouseY - 96, 96, 96);
  },
  labels: (context, items) => {},
};
export default draw;
