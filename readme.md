Normal Mapped textures in JavaScript
------------------------------------
# What is it?
A pure JavaScript library that uses textures and normal maps to simulate 3d lighting with 2d images.

[Demo](http://jsoverson.github.io/texture.js/demo/)

## Is this useful?
Maybe. It's probably not useful in the standard way normal maps are used, providing texture to 3d models in games. The goal was to provide subtly different backgrounds to elements without having unique images per element.

With textures and normal maps, one texture can be made then reused, rotated, offset, all with different lighting angles to provide variety to generic elements like buttons and paragraphs

The demo pages all show dynamic lighting following the mouse, but the intent was to generate a texture once, apply it to an element, and then apply slight transformations to other elements. Dynamic lighting just looks cool.

To further put this usefulness into question, this was written in ES6. It is transpiled down to be compatible in modern browsers, but will require an ES6 promise shim if Promise is not available.

## Inspiration
Jonas Wagner's implementation in 2010 served as proof that it could be done, simply. The implementation is slightly different but wouldn't have happened without his demo and explanation.

This was a personal experiment investigating ways to get creative with UI for a project using a stack similar to node-webkit. My goal was to find ways to give richer life to UIs programmatically.

Textures taken from opengameart (1, 2) and tutorialsforblender3d.com.

## Author
Jarrod Overson
