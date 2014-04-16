"use strict";
var $__Object = Object, $__getOwnPropertyNames = $__Object.getOwnPropertyNames, $__getOwnPropertyDescriptor = $__Object.getOwnPropertyDescriptor, $__getDescriptors = function(object) {
  var descriptors = {}, name, names = $__getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = $__getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
var Texture = function() {
  'use strict';
  var $Texture = ($__createClassNoExtends)({
    constructor: function(texture) {
      var options = arguments[1] !== (void 0) ? arguments[1]: {};
      this.shininess = options.shininess || 0;
      this.brightness = options.brightness === undefined ? 1: options.brightness;
      this.ambient = options.ambient === undefined ? .5: options.ambient;
      this.texture = document.createElement('img');
      this.normal = document.createElement('img');
      this.loaded = new Promise((function(resolve, reject) {
        this.texture.onload = this.normal.onload = (function() {
          this.ready = this.texture.complete && this.normal.complete;
          if (this.ready) resolve(this);
        }).bind(this);
        this.texture.src = texture;
        this.normal.src = options.normal;
      }).bind(this));
      this.loaded.then(this.onload.bind(this));
      this.ready = false;
      this.renderElement = document.createElement('canvas');
      this.renderContext = this.renderElement.getContext('2d');
      this.normals = [];
    },
    onload: function() {
      var width = this.renderElement.width = this.texture.width;
      var height = this.renderElement.height = this.texture.height;
      this.renderContext.drawImage(this.texture, 0, 0);
      this.textureData = this.renderContext.getImageData(0, 0, width, height).data;
      this.renderContext.drawImage(this.normal, 0, 0);
      var mapData = this.renderContext.getImageData(0, 0, width, height).data;
      var imageDataLength = height * width * 4;
      var max = 255;
      for (var i = 0; i < imageDataLength; i += 4) {
        var nx = (mapData[i] * 2 - max) / max;
        var ny = ((max - mapData[i + 1]) * 2 - max) / max;
        var nz = (mapData[i + 2] * 2 - max) / max;
        this.normals.push(nx, ny, nz);
      }
      if (this.lightPosition) this.moveLight(this.lightPosition);
    },
    toDataURL: function() {
      return 'url("' + this.renderElement.toDataURL() + '")';
    },
    moveLight: function() {
      var pos = arguments[0] !== (void 0) ? arguments[0]: {};
      this.lightPosition = pos;
      if (!this.ready) return;
      var lx = pos.x, ly = pos.y, lz = pos.z;
      var normals = this.normals;
      var textureData = this.textureData;
      var shine = this.shininess;
      var brightness = this.brightness;
      var ambient = this.ambient;
      var width = this.renderElement.width;
      var height = this.renderElement.height;
      this.imageData = this.imageData || this.renderContext.getImageData(0, 0, width, height);
      var pixelData = this.imageData.data;
      var ipx = 0, inorm = 0;
      var x, y;
      var dx, dy, dz, inverseMagnitude, dot, intensity, channel, channelValue;
      for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
          dx = lx - x;
          dy = ly - y;
          dz = lz;
          inverseMagnitude = 1 / Math.sqrt(dx * dx + dy * dy + dz * dz);
          dx *= inverseMagnitude;
          dy *= inverseMagnitude;
          dz *= inverseMagnitude;
          dot = dx * normals[inorm++] + dy * normals[inorm++] + dz * normals[inorm++];
          intensity = dot * brightness;
          intensity += Math.pow(dot, 10) * shine;
          intensity += ambient;
          channelValue = textureData[ipx] * intensity;
          pixelData[ipx] = ~~channelValue;
          channelValue = textureData[++ipx] * intensity;
          pixelData[ipx] = ~~channelValue;
          channelValue = textureData[++ipx] * intensity;
          pixelData[ipx] = ~~channelValue;
          ipx += 2;
        }
      }
      this.renderContext.putImageData(this.imageData, 0, 0);
      return this;
    }
  }, {});
  return $Texture;
}();
