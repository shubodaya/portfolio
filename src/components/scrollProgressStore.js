// Continuous scroll progress lives here instead of React state so that
// scrolling never re-renders the component tree. It is written once per
// scroll event (App) and read inside useFrame loops (Scene3D and friends),
// which already run every frame regardless of scroll.
export const scrollState = { progress: 0 };
