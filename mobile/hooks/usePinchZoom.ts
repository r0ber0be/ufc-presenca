import { useState } from "react";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";

export function usePinchZoom(initialZoom = 0) {
  const [zoom, setZoom] = useState(initialZoom);
  const zoomValue = useSharedValue(initialZoom);

  const onGestureUpdate = (e: any) => {
    const newZoom = zoomValue.value + (e.scale - 1) * 0.5;
    const clamped = Math.max(0, Math.min(newZoom, 1));
    runOnJS(setZoom)(clamped);
    zoomValue.value = clamped;
  };

  const pinchGesture = Gesture.Pinch().onUpdate(onGestureUpdate);
  return { zoom, pinchGesture };
}