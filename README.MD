autocrop-worker
===========
A simple, fast autocrop library which automagically crops the image. The cropping related functions are based on based on autocrop.js<https://github.com/lqez/autocrop.js>. This library offloads image processing work from main thread to workers using workerpool.

Demo site: <https://johnpremkumar.github.io/autocrop-worker/demo/>

Install
-------

```bash
$ npm install autocrop-worker
```


```As ES6 Module
import autocrop from 'autocrop-worker'
```

Usage
-----

```javascript
<script src='path/to/autocrop-worker.min.js'></script>
...
<script>
autocrop(<original_image_element>, (target_image_element), (options));
</script>
```

If `target_image_element` is set `null`, it will replace `original_image_element` with the cropped result.

Parameter
---------

```javascript
const autoCropDefaultOptions = {
  bgColor: '#FFFFFF',       // Background color.
  alphaTolerance: 20,       // Pixels that are transparent than this value are considered transparent.
  colorTolerance: 20,       // Pixels similar to the background color are considered as the background.
  invertTolerance: 0.90,    // Invert the image if most of non-transparent pixels are background color.
  margin: '2%',             // Margin
  allowInvert: true,        // Allow invert if needed.
  marker: 'cropped'         // Add a marker attribute to prevent duplicated cropping.
};
```

Example
-------

![Example image of autocrop-worker.js](./docs/demo/images/result.png)


License
-------

MIT