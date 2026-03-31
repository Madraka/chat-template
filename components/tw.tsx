import { Image as XImage } from "expo-image";
import { withUniwind } from "uniwind";

import { GlassView as XGlassView } from "expo-glass-effect";

import { KeyboardGestureArea as XKeyboardGestureArea } from "react-native-keyboard-controller";

export const Image = withUniwind(XImage);
export const KeyboardGestureArea = withUniwind(XKeyboardGestureArea);
export const GlassView = withUniwind(XGlassView);
