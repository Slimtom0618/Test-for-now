# Biscuit — a Pixar-style 3D puppy

Biscuit is an original character: a chubby caramel-and-cream pup with floppy ears, cream "eyebrow dots",
a cowlick, a red stitched collar and a brass tag with an engraved bone. He sits with a curious head
tilt and his tongue poking out a little.

There are no 3D models or textures. The whole character is one real-time **raymarched signed-distance
field** in a single WebGL2 fragment shader (`index.html`). Open the file in a browser to play with it.

| | |
|---|---|
| `index.html` | Interactive page: live animation plus a progressive "film render" mode |
| `renders/` | High-sample stills rendered from the same page |
| `tools/render.js` | Headless Playwright renderer used to produce the stills |

## How the Pixar look is achieved

- **Sculpting:** about 40 ellipsoids and tapered capsules blended with smooth-min, so the forms read
  as soft and squashy. The head is about 1.1× body width, with big eyes set into socketed lids.
- **Fur:** strand-direction-stretched noise displacement on the surface, plus Kajiya-Kay
  anisotropic highlights, a fuzzy fresnel rim and fibre-level albedo variation.
- **Eyes:** a real cornea that reflects a rectangular key softbox and a fill strip (the catchlights).
  The iris has radial fibres, a limbal ring and the classic "caustic" glow opposite the key light.
  The eyes track your cursor within natural limits, and the lids blink.
- **Lighting:** a three-point setup. The key has wrapped, subsurface-tinted terminators (warm
  shadow edges); the fill is cool and the rim is cool too. There are SDF soft shadows and ambient
  occlusion.
- **Colour script:** the warm caramel character sits against a complementary teal cyclorama, with
  amber and teal bokeh.
- **Camera:** a 27° lens, thin-lens depth of field focused on the eyes, ACES tonemapping, a filmic
  S-curve, a split-tone grade, light bloom and a vignette.
- **Animation:** head tilt and look-at, gravity-lagged ears, breathing, tail wag and blinks
  (including the odd double blink).

## Controls

Drag to orbit · scroll or pinch to zoom · move the cursor and Biscuit looks at it.
**Film render** pauses the animation and accumulates up to 384 jittered depth-of-field samples per pixel.
**Save PNG** downloads the current frame.

## Re-rendering the stills

```bash
NODE_PATH=$(npm root -g) node tools/render.js out.png "w=1600&h=1000&mode=film&spp=128&t=1.0"
# optional params: yaw, pitch, dist, ty (camera target height), t (animation time), gx/gy (gaze)
```
