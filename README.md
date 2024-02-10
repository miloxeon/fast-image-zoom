<p align="center">
    <img width="600" alt="" src="https://user-images.githubusercontent.com/14220138/118895782-5b68ea00-b8f6-11eb-8019-1bc822562666.gif">
</p>
<p align="center">
    <a href="https://github.com/miloxeon/fast-image-zoom/blob/master/package.json"><img src="https://img.shields.io/badge/dependencies-0-brightgreen" alt="Dependencies"></a>
    <a href="https://www.npmjs.com/package/fast-image-zoom"><img alt="npm" src="https://img.shields.io/npm/v/fast-image-zoom"></a>
    <img alt="License" src="https://img.shields.io/github/license/miloxeon/fast-image-zoom?color=brightgreen">
</p>
<p align="center">
    <a href="https://miloslav.website/fast-image-zoom">Demo</a>
    &nbsp;&nbsp;&bull;&nbsp;&nbsp;
    <a href="#configuration">Configuration</a>
</p>

# 🏞 Fast Image Zoom

Image zoom on click as seen on the popular publishing platform.

## What does it do?

You click on an image and it smoothly zooms in or out to fit the screen. You click again — it smoothly goes back to normal. You scroll — it also goes back.

## Why is it better than alternatives?

- 🛠 Framework-agnostic — works with everything from Knockout.js to Web Components
- 👌 Zero-dependency
- 🧬 Perfect for dynamic content, mutation-agnostic — you can do whatever you want with images, it'll work
- ⚡️ Blazing fast — no matter if it's 10 images or 10000, it uses only two event listeners. Not per image, _just two listeners_. Complexity is always _O(1)_
- 🤓 Powered by quirky math to precisely calculate everything and do the trick with only _one transformation_
- 🦋 Looks good on both dark and light modes
- 🍦 Zero-configuration by default but extensible when you need it
- 🗿 Works flawlessly even on iOS Safari, in every orientation, with every image no matter the size and dimensions

## Basic usage

```
npm install fast-image-zoom --save
```

or

```
yarn add fast-image-zoom
```

```JS
import imageZoom from 'fast-image-zoom'
imageZoom()
```

### Alternative — use CDN

```HTML
<script src="https://unpkg.com/fast-image-zoom@7.0.1/dist/fast-image-zoom.js"></script>
<script>
  imageZoom()
</script>
```

That's it!

## How it works

Plugin targets _meaningful_, content images:

```HTML
<!-- yes -->
<img src="foo.jpg" alt="Cute kitten" />

<!-- no -->
<img src="bar.jpg" />
<img src="bar.jpg" alt="" />
```

## Configuration

Here are the defaults:

```JS
imageZoom({
    selector: `img[alt]:not([alt=""]):not([data-image-zoom-disabled])`,
    containerSelector: null,
    cb: () => {},
    exceed: false,
    padding: 20,
})
```

- `selector` (string) is used to target images. By default it only targets _meaningful_ images (e.g. ones with `alt`), so your icons won't be magnified on click.
- `containerSelector` limits plugin's scope to a certain element. It's useful for modals. Only the images inside that element will be clickable, and the scroll handler that un-zooms images will work on that element only.
- `cb` (function) is called after the plugin is initialized.
- `exceed` (boolean) defines whether images should exceed their natural size when zoomed. For example, if you zoom 100x100 image on a 1080p screen with `exceed: false`, its final size will be 100px, meanwhile, with `exceed: true` it will be 1080px.

- `padding` (integer) defines a gap in pixels between a zoomed image and the closest edge of the viewport.

Note that if `exceed` is false and smaller images appear to have a larger gap between their edges and the edge of the viewport, padding won't be added. For example, if you zoom a 100x100 image on a 1080p screen and your padding is set to 20, a natural gap between an image and the viewport edge would be (1080 - 100) / 2 = 490, thus there is no need to add that 20px gap.

Only pixels are supported by now.

### Setting `exceed` per image

You can explicitly define `exceed` for a specific picture via a data attribute:

```HTML
<img src="..." alt="..." data-image-zoom-exceed="true">
```

### Disabling the plugin for the specific image

You can disable zooming for any image you like, even if it has `alt`:

```HTML
<img src="..." alt="..." data-image-zoom-disabled>
```

Note that if you redefine the `selector` in a way that doesn't account `data-image-zoom-disabled` attribute, this feature will stop working.

### Restyling

You can always hack the plugin redefining straightforward CSS:

#### Changing a timing function

```CSS
.image-zoom,
.image-zoom-wrapper::after {
    transition-timing-function: ease-in-out;
}
```

#### Changing the background color

```CSS
.image-zoom-wrapper::after {
    background-color: hotpink;
}
```

For now, `!important` might be needed, as styles are injected into `<head>`. This will probably be changed in the future.

## Anatomy

- `.image-zoom-wrapper` — element that wraps every image. Mimics its `display` property. We use it to add page background and slightly separate the zoomed image from what's behind it.
- `.image-zoom-wrapper-zoomed` — the same wrapper but for when the image is zoomed.
- `.image-zoom` — the image itself that was processed and is interactive, ready to zoom.
- `.image-zoom-zoomed` — zoomed image.

## Disabling the plugin

Being called, the plugin returns the destroy function that you may call to remove event listeners. It will also remove related styles from `<head>` and from the images themselves.

```JS
const destroy = imageZoom()

// don't need it anymore
destroy()
```

## Limitations

- `img` inline styles will be overwritten. Use CSS selectors to stylize images.
- `img` shouldn't have transforms. If needed, wrap it with a container and apply transforms there instead.
- Container's `overflow-x` will be `hidden`. If `containerSelector` is null, then `overflow-x` will be `hidden` for the root element.

Enjoy!
