import { View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from '../../../components/ui/Header'
import { MenuContainer, MenuText } from '@/components/MenuButton'
import { useDispatch } from 'react-redux'
import { logOut } from '@/features/auth/redux/auth.slice'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigation } from '@/routers/BaseRouter'

export default function ProfileScreen() {
    return (
        <View style={{ flex: 1 }}>
            <Header />
            <Menu />
        </View>
    )
}

function Menu() {
    const dispatch = useDispatch()
    const navigation = useNavigation<RootStackNavigation>()

    const handleLogout = () => {
        dispatch(logOut())
        navigation.navigate('Auth', { screen: 'Login', params: { phone: '' } })
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <MenuContainer onPress={handleLogout}>
                <MenuText>Se déconnecter</MenuText>
            </MenuContainer>
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
