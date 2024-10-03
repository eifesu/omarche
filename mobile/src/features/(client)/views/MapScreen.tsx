import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MarketList from '../../(client)/components/MarketList'
import { useDispatch } from 'react-redux'
import * as Location from 'expo-location'
import { setLocation } from '@/redux/slices/location.slice'
import MapComponent from '../../(client)/components/MapComponent'

export default function MapScreen() {
    const dispatch = useDispatch()

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            dispatch(setLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }));
        })();
    }, [dispatch]);

    return (
        <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <MapComponent />
            <View style={styles.menuView}>
                <MarketList />
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    menuView: {
        height: 270,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})