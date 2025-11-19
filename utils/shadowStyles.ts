import { Platform } from 'react-native';

const createShadowStyle = (
  shadowColor: string,
  shadowOffset: { width: number; height: number },
  shadowOpacity: number,
  shadowRadius: number,
  elevation: number,
  boxShadow?: string
) => {
  if (Platform.OS === 'web' && boxShadow) {
    return {
      boxShadow,
    };
  }
  return {
    shadowColor,
    shadowOffset,
    shadowOpacity,
    shadowRadius,
    elevation,
  };
};

export const shadowStyles = {
  small: createShadowStyle('#000000', { width: 0, height: 1 }, 0.18, 1.00, 1, '0px 1px 1px rgba(0, 0, 0, 0.18)'),
  medium: createShadowStyle('#000000', { width: 0, height: 2 }, 0.1, 4, 3, '0px 2px 4px rgba(0, 0, 0, 0.1)'),
  large: createShadowStyle('#000', { width: 0, height: 4 }, 0.3, 4.65, 8, '0px 4px 8px rgba(0, 0, 0, 0.3)'),
  button: createShadowStyle('#0d2f2c', { width: 0, height: 2 }, 0.25, 3.84, 5, '0px 2px 4px rgba(13, 47, 44, 0.25)'),
};

