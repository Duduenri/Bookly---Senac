import { paletasCores } from '@/utils/colors';
import {
  APIProvider,
  InfoWindow,
  Map,
  Marker,
} from '@vis.gl/react-google-maps';
import Constants from 'expo-constants';
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type Store = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  type?: 'bookstore' | 'secondhand_store';
};

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type LivrariasMapProps = {
  stores: Store[];
  initialRegion?: Region;
  height?: number;
  onStorePress?: (storeId: string, storeType?: 'bookstore' | 'secondhand_store') => void;
};

export default function LivrariasMap({ stores, initialRegion, height = 300, onStorePress }: LivrariasMapProps) {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  
  const handleMarkerClick = (store: Store) => {
    setSelectedStoreId(store.id);
    if (onStorePress) {
      onStorePress(store.id, store.type);
    }
  };

  const defaultRegion: Region =
    initialRegion || {
      latitude: stores[0]?.latitude || -31.7654, // Pelotas - RS
      longitude: stores[0]?.longitude || -52.3371,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    };

  const center = useMemo(() => ({
    lat: defaultRegion.latitude,
    lng: defaultRegion.longitude,
  }), [defaultRegion.latitude, defaultRegion.longitude]);

  const zoom = useMemo(() => {
    // Conversão aproximada do latitudeDelta para zoom do Google Maps (não linear, apenas heurística)
    const delta = Math.max(defaultRegion.latitudeDelta, defaultRegion.longitudeDelta);
    // 0.2 ~ zoom 12; 1 ~ zoom 10; 5 ~ zoom 7, etc
    if (delta <= 0.2) return 12;
    if (delta <= 0.5) return 11;
    if (delta <= 1) return 10;
    if (delta <= 2) return 9;
    if (delta <= 5) return 8;
    return 7;
  }, [defaultRegion.latitudeDelta, defaultRegion.longitudeDelta]);

  // Em Web, o bundler injeta process.env a partir do .env. use process.env primeiro e caia para Constants como fallback.
  const googleMapsApiKey =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API ||
    process.env.Google_Maps_API ||
    process.env.GOOGLE_MAPS_API ||
    process.env.GOOGLE_MAPS_KEY ||
    ((Constants.expoConfig?.extra as { GOOGLE_MAPS_API_KEY?: string } | undefined)?.GOOGLE_MAPS_API_KEY);

  if (!googleMapsApiKey) {
    return (
      <View style={[styles.fallback, { height }]}> 
        <p style={{ textAlign: 'center', margin: 0 }}>
          Configure a variável de ambiente <code>Google_Maps_API</code> no seu arquivo .env para exibir o mapa na Web.
        </p>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}> 
      <APIProvider apiKey={googleMapsApiKey}>
        <Map
          style={{ ...StyleSheet.absoluteFillObject, borderRadius: 12 }}
          defaultCenter={center}
          defaultZoom={zoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {stores.map((store) => (
            <Marker
              key={store.id}
              position={{ lat: store.latitude, lng: store.longitude }}
              title={store.name}
              onClick={() => handleMarkerClick(store)}
            />
          ))}

          {selectedStoreId && stores.find(s => s.id === selectedStoreId) && (
            <InfoWindow
              position={{ lat: stores.find(s => s.id === selectedStoreId)!.latitude, lng: stores.find(s => s.id === selectedStoreId)!.longitude }}
              onCloseClick={() => setSelectedStoreId(null)}
            >
              <View style={styles.infoWindow}>
                <Text style={styles.infoWindowTitle}>{stores.find(s => s.id === selectedStoreId)!.name}</Text>
                <Text style={styles.infoWindowAddress}>{stores.find(s => s.id === selectedStoreId)!.address}</Text>
              </View>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  fallback: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  infoWindow: {
    padding: 8,
    maxWidth: 200,
  },
  infoWindowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: paletasCores.principal.solido,
    marginBottom: 4,
  },
  infoWindowAddress: {
    fontSize: 12,
    color: paletasCores.cinza.solido,
  },
});
