import React from 'react';
import { Platform } from 'react-native';

// Delegador por plataforma: carrega a implementação correta em tempo de execução
// Isso evita que o Web importe módulos nativos do react-native-maps

export type Store = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
};

export type LivrariasMapProps = {
  stores: Store[];
  initialRegion?: any;
  height?: number;
};

export default function LivrariasMap(props: LivrariasMapProps) {
  const Impl = Platform.OS === 'web'
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ? require('./LivrariasMap.web').default
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    : require('./LivrariasMap.native').default;
  return <Impl {...props} />;
}
