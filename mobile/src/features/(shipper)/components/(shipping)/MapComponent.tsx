import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions, Animated } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { ButtonContainer } from '@/components/Button';
import { Iconify } from 'react-native-iconify';
import { Theme } from '@/config/constants';

interface LocationCoords {
    latitude: number;
    longitude: number;
}

const INITIAL_REGION: Region = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
};

const Cursor = () => {
    const { width, height } = useWindowDimensions();
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const isPortrait = height > width;
        Animated.timing(rotation, {
            toValue: isPortrait ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [width, height]);

    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
    });

    return (
        <Animated.View style={[styles.cursor, { transform: [{ rotate: rotateInterpolate }] }]}>
            <Iconify icon="fluent:cursor-16-filled" size={24} color={Theme.colors.orange} />
        </Animated.View>
    );
};


export default function MapComponent() {
    const mapRef = useRef<MapView>(null);
    const [location, setLocation] = useState<LocationCoords | null>(null);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            const { coords } = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: coords.latitude,
                longitude: coords.longitude,
            });
        } catch (error) {
            console.error('Error getting current location:', error);
        }
    };

    const scrollToCurrentLocation = () => {
        if (location && mapRef.current) {
            mapRef.current.animateToRegion({
                ...location,
                latitudeDelta: INITIAL_REGION.latitudeDelta,
                longitudeDelta: INITIAL_REGION.longitudeDelta,
            }, 1000);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                initialRegion={INITIAL_REGION}
            />
            <ButtonContainer
                onPress={scrollToCurrentLocation}
                style={styles.locationButton}
            >
                <Iconify icon="mdi:crosshairs-gps" size={32} color={Theme.colors.black} />
            </ButtonContainer>
            <Cursor />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    map: {
        flex: 1,
    },
    locationButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'white',
        borderRadius: 999,
        height: 56,
        width: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cursor: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -16 }, { translateY: -16 }],
        backgroundColor: 'white',
        borderRadius: 999,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
