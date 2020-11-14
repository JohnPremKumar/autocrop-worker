function loadFile(files) {
  let reader = new FileReader();
  reader.readAsDataURL(files[0]);
  reader.onload = function (e) {
    process(e.target.result);
  };
}

function process(src) {
  const options = eval('(' + document.getElementById('parameter').value + ')');
  const original = document.getElementById('original');
  const target = document.getElementById('target');

  original.innerHTML = ''
  target.innerHTML = ''

  let oimage = document.createElement('img');
  oimage.onload = function () {
    let timage = document.createElement('img');
    target.appendChild(timage);
    autocrop(oimage, timage, options);
  }
  oimage.src = src;
  original.appendChild(oimage);
}
