import { ITheme, ILayerCache } from "./ITheme";
import { IColorLayer } from "./IColorLayer";
import { IColorLayerKey } from "./IColorLayerKey";
import { getLayerFromKeys } from "./ThemeColors";
import { constructNamedColor } from "./Transforms";

/*
  Input/output type.  On input it is a collection of:
    [destination key]: color name
  
  On output the returned value is:
    [destination key]: resolved color value
*/
export interface IColorRequest {
  [value: string]: string;
}

export function getThemeColors(layerName: string, theme: ITheme, requested: IColorRequest) : IColorRequest {
  const layers: ILayerCache = theme.layers;
  let layer: IColorLayer;
  if (!layers.hasOwnProperty(layerName)) {
    const offsets = theme.offsets;
    if (offsets.hasOwnProperty(layerName)) {
      const layerKey: IColorLayerKey = offsets[layerName];
      layer = getLayerFromKeys(layerKey, offsets.default, theme);
      layers[layerName] = layer;
    } else {
      return getThemeColors(defaultName, theme, requested);
    }
  } else {
    layer = layers[layerName];
  }

  const colors = { ...requested };
  for (const key in requested) {
    if (requested.hasOwnProperty(key)) {
      const clr = layer.clr;
      const colorName = requested[key];
      if (!clr.hasOwnProperty(colorName)) {
        clr[colorName] = constructNamedColor(colorName, layer, theme);
      }
      colors[key] = clr[colorName].str;
    }
  }

  return colors;
}

const defaultName = 'default';