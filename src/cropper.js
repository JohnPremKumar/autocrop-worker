const cropper = (imgData, options) => {
  let { width } = imgData;
  let { height } = imgData;
  const { pixels } = imgData;

  const getIsBgColorFunc = (bgColor, colorTolerance) => {
    const tr = parseInt(bgColor.substring(1, 3), 16);
    const tg = parseInt(bgColor.substring(3, 5), 16);
    const tb = parseInt(bgColor.substring(5, 7), 16);
    return (pixel) => (
      Math.abs(tr - pixel[0])
      + Math.abs(tg - pixel[1])
      + Math.abs(tb - pixel[2]) <= colorTolerance
    );
  };

  const getIsTransparentFunc = (alphaTolerance) => (pixel) => (pixel[3] <= alphaTolerance);

  // Prepare functions
  const isBgColor = getIsBgColorFunc(options.bgColor, options.colorTolerance);
  const isTransparent = getIsTransparentFunc(options.alphaTolerance);

  // Loop over to get corner coordinates
  const bgRect = {
    sx: -1, sy: -1, ex: -1, ey: -1,
  };

  const trRect = {
    sx: -1, sy: -1, ex: -1, ey: -1,
  };

  // We will run two worksets
  const workSet = [
    {
      func: isBgColor,
      r: bgRect,
      c: 0,
    }, // Crop by background color
    {
      func: isTransparent,
      r: trRect,
      c: 0,
    }, // Crop by transparency
  ];

  let c = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel = pixels.slice(c, c + 4);

      workSet.forEach((eachSet) => {
        const w = eachSet;
        if (!w.func(pixel)) {
          if (w.r.sx === -1 || w.r.sx > x) {
            w.r.sx = x;
          }
          if (w.r.sy === -1) {
            w.r.sy = y;
          }
          if (w.r.ex < x) {
            w.r.ex = x;
          }
          if (w.r.ey < y) {
            w.r.ey = y;
          }
          w.c += 1;
        }
      });
      c += 4;
    }
  }

  // Choose a result from worksets
  let r = false;
  let needInvert = false;
  if (workSet[0].c < workSet[1].c) {
    r = workSet[0].r;
  } else {
    r = workSet[1].r;
    // If most of non-transparent pixels are background color, then it may need to be inverted
    if ((width * height - workSet[0].c) >= (workSet[1].c * options.invertTolerance)) {
      needInvert = true;
    }
  }

  // Apply given margin
  let margin = 0;
  if (options.margin.slice(-1) === '%') {
    // Regard margin as percentage
    margin = parseInt((Math.max(width, height) * parseInt(options.margin, 10)) / 100.0, 10);
  } else {
    // Regard margin as pixel
    margin = parseInt(options.margin, 10);
  }
  width = r.ex - r.sx + margin * 2;
  height = r.ey - r.sy + margin * 2;

  return {
    sx: r.sx,
    sy: r.sy,
    sWidth: r.ex - r.sx,
    sHeight: r.ey - r.sy,
    dx: margin,
    dy: margin,
    dWidth: r.ex - r.sx,
    dHeight: r.ey - r.sy,
    width,
    height,
    needInvert,
  };
};

export default cropper;
