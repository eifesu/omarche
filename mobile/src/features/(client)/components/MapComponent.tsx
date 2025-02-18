import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapView, { MapMarker, PROVIDER_DEFAULT } from 'react-native-maps'
import { Market, useFetchMarketsQuery } from '../redux/marketsApi.slice'
import { Theme } from '@/config/constants'
import { MaterialIcons, Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { ButtonContainer } from '@/components/Button'
import { Image } from 'expo-image'
import { RootStackNavigation } from '@/routers/BaseRouter'

export default function MapComponent() {
    const { data: markets } = useFetchMarketsQuery()
    const navigation = useNavigation<RootStackNavigation>()
    return (
        <View style={styles.container}>
            <MapView
                showsPointsOfInterest={false}
                style={{ flex: 1 }} provider={PROVIDER_DEFAULT}>
                {markets?.map((market) => (
                    <MapMarker
                        onPress={() => { navigation.navigate('Market', { screen: 'Sellers', params: { name: market.name, marketId: market.marketId } }) }}
                        key={market.marketId}
                        coordinate={{
                            latitude: market.latitude,
                            longitude: market.longitude
                        }}
                    >
                        <Marker market={market} />
                    </MapMarker>
                ))}
            </MapView>
        </View>
    )
}

function Marker({ market }: { market: Market }) {
    const navigation = useNavigation<RootStackNavigation>()
    return (
        <ButtonContainer
            onPress={() => { navigation.navigate('Market', { screen: 'Sellers', params: { name: market.name, marketId: market.marketId } }) }}
            style={styles.mapMarker}>
            <Entypo name="shop" size={20} color={Theme.colors.black} style={styles.mapMarkerBackgroundIcon} />
            {/* <View style={{ justifyContent: 'center' }}>
                <Text style={styles.mapMarkerSubtext}>Marché de</Text>
                <Text style={styles.mapMarkerText}>{market.name}</Text>
            </View> */}
            <View style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: 'white', borderWidth: 0, borderColor: 'white', position: 'relative', overflow: 'hidden' }}>
                <Image source={market.pictureUrl} contentFit='cover' style={{ flex: 1 }} />
            </View>
            <MaterialIcons name="arrow-drop-down" size={24} color={Theme.colors.black} style={{ position: 'absolute', bottom: -20 }} />
        </ButtonContainer>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    mapMarker: {
        width: 'auto',
        backgroundColor: Theme.colors.greenDark,
        position: 'relative',
        height: 'auto',
        padding: 8,
        paddingHorizontal: 12,
        borderColor: Theme.colors.greenDark,
        borderRadius: 999,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8
    },
    mapMarkerText: {
        fontFamily: Theme.font.black,
        color: "white",
        letterSpacing: -.5
    },
    mapMarkerSubtext: {
        fontFamily: Theme.font.bold,
        fontSize: 8,
        color: "white",
        letterSpacing: -.5,
        marginBottom: -1
    },
    mapMarkerBackgroundIcon: {
        opacity: .8
    }
})