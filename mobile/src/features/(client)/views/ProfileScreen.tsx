import { View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from '../../../components/ui/Header'

export default function ProfileScreen() {
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <Menu />
        </View>
    )
}

function Menu() {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>

        </View>
    )
}

function Header() {
    const insets = useSafeAreaInsets()
    return (
        <HeaderContainer style={{ paddingBottom: 10, paddingTop: insets.top + 8 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <HeaderSubtitle>Mon</HeaderSubtitle>
                <HeaderTitle>Profil</HeaderTitle>
            </View>
        </HeaderContainer>
    )
}

