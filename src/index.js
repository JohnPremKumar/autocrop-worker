import workerpool from 'workerpool';
import cropper from './cropper';

const pool = workerpool.pool();

const autoCropDefaultOptions = {
  bgColor: '#FFFFFF',
  alphaTolerance: 20,
  colorTolerance: 20,
  invertTolerance: 0.90,
  margin: '2%',
  allowInvert: true,
  marker: 'cropped',
};

const autocrop = (originalElement, targetElement, options) => {
  let target = targetElement;
  const mergedOptions = Object.assign(autoCropDefaultOptions, options);
  const imgElement = document.createElement('img');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  imgElement.onload = () => {
    if (originalElement.getAttribute(mergedOptions.marker)) {
      return;
    }
    const { width } = imgElement;
    const { height } = imgElement;
    canvas.width = width;
    canvas.height = height;
    context.drawImage(imgElement, 0, 0);
    const pixels = context.getImageData(0, 0, width, height).data;
    pool.exec(cropper, [{ pixels, width, height }, options]).then((response) => {
      context.clearRect(0, 0, response.width, response.height);
      canvas.width = response.width;
      canvas.height = response.height;
      if (response.needInvert) {
        context.filter = 'invert(1)';
      }
      context.drawImage(
        imgElement,
        response.sx,
        response.sy,
        response.sWidth,
        response.sHeight,
        response.dx,
        response.dy,
        response.dWidth,
        response.dHeight,
      );
      if (!target) {
        target = originalElement;
      }
      target.src = canvas.toDataURL();
      target.height = response.height;
      target.width = response.width;
      originalElement.setAttribute(mergedOptions.marker, 'true');
    }).catch((err) => {
      throw err;
    });
  };
  imgElement.crossorigin = 'anonymous';
  imgElement.decoding = 'async';
  imgElement.src = originalElement.src;
};

export default autocrop;
