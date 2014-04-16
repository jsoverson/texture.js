
"use strict";

class Texture {

  constructor(texture, options = {}) {
    this.shininess = options.shininess || 0;
    this.brightness = options.brightness === undefined ? 1 : options.brightness;
    this.ambient = options.ambient === undefined ? .5 : options.ambient;

    this.texture = document.createElement('img');
    this.normal = document.createElement('img');

    this.loaded = new Promise((resolve, reject) => {
      this.texture.onload = this.normal.onload = () => {
        this.ready = this.texture.complete && this.normal.complete;
        if (this.ready) resolve(this);
      };
      this.texture.src = texture;
      this.normal.src = options.normal;
    });
    this.loaded.then(this.onload.bind(this));

    this.ready = false;
    this.renderElement = document.createElement('canvas');
    this.renderContext = this.renderElement.getContext('2d');
    this.normals = [];
  }

  onload() {
    var width = this.renderElement.width = this.texture.width;
    var height = this.renderElement.height = this.texture.height;

    this.renderContext.drawImage(this.texture,0,0);
    this.textureData = this.renderContext.getImageData(0,0,width,height).data;

    this.renderContext.drawImage(this.normal,0,0);
    var mapData = this.renderContext.getImageData(0,0,width,height).data;

    var imageDataLength = height * width * 4;
    var max = 255;

    // precalculate the normal vectors
    for (var i = 0; i < imageDataLength; i += 4) {
      // normalizes vector values across a -1, 1 scale
      var nx = (mapData[i] * 2 - max) / max;
      var ny = ((max - mapData[i + 1]) * 2 - max) / max;
      var nz = (mapData[i + 2] * 2 - max) / max;

      this.normals.push(nx, ny, nz);
    }

    if (this.lightPosition) this.moveLight(this.lightPosition);
  }

  toDataURL() {
    return 'url("'+this.renderElement.toDataURL()+'")'
  }

  moveLight(pos = {}) {
    this.lightPosition = pos;
    if (!this.ready) return;

    var lx = pos.x,
        ly = pos.y,
        lz = pos.z;

    var normals = this.normals;
    var textureData = this.textureData;
    var shine = this.shininess;
    var brightness = this.brightness;
    var ambient = this.ambient;

    var width = this.renderElement.width;
    var height = this.renderElement.height;

    // get renderElement's imageData because we're going to be setting channels directly.
    // cache and reuse it to limit expensive getImageData calls
    this.imageData = this.imageData || this.renderContext.getImageData(0, 0, width, height);
    var pixelData = this.imageData.data;

    var ipx = 0, inorm = 0;
    var x, y;
    var dx, dy, dz, inverseMagnitude, dot, intensity, channel, channelValue;

    // adjust intensity for every pixel
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        // calculate the light direction vector
        dx = lx - x;
        dy = ly - y;
        dz = lz; // texture is at 0

        // unit vector of direction (inverted to save on div calcs.)
        inverseMagnitude = 1 / Math.sqrt(dx * dx + dy * dy + dz * dz);
        dx *= inverseMagnitude;
        dy *= inverseMagnitude;
        dz *= inverseMagnitude;

        // dot product of the direction and the normal
        dot = dx * normals[inorm++] + dy * normals[inorm++] + dz * normals[inorm++];
        intensity = dot * brightness;
        intensity += Math.pow(dot, 10) * shine;
        intensity += ambient;

        // inlined and unrolled for perf
        channelValue = textureData[ipx] * intensity;
        pixelData[ipx] = ~~channelValue;
        channelValue = textureData[++ipx] * intensity;
        pixelData[ipx] = ~~channelValue;
        channelValue = textureData[++ipx] * intensity;
        pixelData[ipx] = ~~channelValue;
        ipx+=2; // index of next pixel (skip alpha channel)

        // used to check bounds above, but looks like browser does it so it was a useless, expensive check
        // (in other words, don't check bounds thinking this was a mistake)
        // pixelData[ipx] = ~~(channelValue > 255 ? 255 : channelValue < 0 ? 0 : channelValue);
      }
    }

    this.renderContext.putImageData(this.imageData, 0, 0);
    return this;
  }
}
