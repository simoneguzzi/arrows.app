export const windowResized = (width: number, height: number) => {
  return {
    type: 'WINDOW_RESIZED',
    width,
    height,
  };
};

export const toggleInspector = () => {
  return {
    type: 'TOGGLE_INSPECTOR',
  };
};

export const styleTheme = () => {
  return {
    type: 'STYLE_THEME',
  };
};

export const styleCustomize = () => {
  return {
    type: 'STYLE_CUSTOMIZE',
  };
};

export const setBetaFeaturesEnabled = (enabled: boolean) => ({
  type: 'SET_BETA_FEATURES_ENABLED',
  enabled,
});
