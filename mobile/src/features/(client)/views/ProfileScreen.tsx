import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HeaderContainer, HeaderSubtitle, HeaderTitle } from '../../../components/ui/Header'
import { MenuContainer, MenuText } from '@/components/MenuButton'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '@/features/auth/redux/auth.slice'
import { useNavigation } from '@react-navigation/native'
import { RootStackNavigation } from '@/routers/BaseRouter'
import QRCodeScannerModal from '@/components/QRCodeScannerModal'
import { showToast } from '@/redux/slices/toast.slice'
import { GiftCard, useAssignGiftCardToUserMutation } from '../redux/giftCardApi.slice'
import { useFetchGiftCardByUserIdQuery, User } from '@/features/auth/redux/user.api'
import { RootState } from '@/redux/store'
import { Theme } from '@/config/constants'

export default function ProfileScreen() {
    const dispatch = useDispatch()
    const [isQRCodeScannerVisible, setQRCodeScannerVisible] = useState(false)
    const user = useSelector((state: RootState) => state.auth.user) as User
    const [assignGiftCardToUser] = useAssignGiftCardToUserMutation()
    const { data: giftCard, isLoading, refetch } = useFetchGiftCardByUserIdQuery(user.userId)

    const handleQRCodeScan = async (code: string) => {
        try {
            await assignGiftCardToUser({ giftCardId: code, userId: user.userId }).unwrap()
            dispatch(showToast({ message: "Carte de fidélité assignée avec succès!", type: "success" }))
            refetch()
        } catch (error) {
            dispatch(showToast({ message: "Erreur lors de l'assignation de la carte de fidélité.", type: "warning" }))
        }
        setQRCodeScannerVisible(false)
    }

    if (isLoading) return <ActivityIndicator />
    return (
        <View style={{ flex: 1 }}>
            <Header giftCard={giftCard} />
            <Menu onScanPress={() => setQRCodeScannerVisible(true)} />
            <QRCodeScannerModal
                isVisible={isQRCodeScannerVisible}
                onClose={() => setQRCodeScannerVisible(false)}
                onScan={handleQRCodeScan}
            />
        </View>
    )
}

function Menu({ onScanPress }: { onScanPress: () => void }) {
    const dispatch = useDispatch()
    const navigation = useNavigation<RootStackNavigation>()

    const handleLogout = () => {
        dispatch(logOut())
        navigation.navigate('Auth', { screen: 'Login', params: { email: '' } })
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <MenuContainer onPress={onScanPress}>
                <MenuText>Scanner une carte de fidélité</MenuText>
            </MenuContainer>
            <MenuContainer onPress={handleLogout}>
                <MenuText>Se déconnecter</MenuText>
            </MenuContainer>
        </View>
    )
}

function Header({ giftCard }: { giftCard: GiftCard | undefined }) {
    const insets = useSafeAreaInsets()
    return (
        <HeaderContainer style={{ paddingBottom: 10, paddingTop: insets.top + 8 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <HeaderSubtitle>Mon</HeaderSubtitle>
                <HeaderTitle>Profil</HeaderTitle>
            </View>
            <View style={[styles.statusChip, { backgroundColor: giftCard ? Theme.colors.orangeDark : Theme.colors.greenDark }]}>
                <Text style={{ color: 'white', fontFamily: Theme.font.black, letterSpacing: -0.5 }}>{giftCard ? "Premium" : "Standard"}</Text>
            </View>
        </HeaderContainer>
    )
}

const styles = StyleSheet.create({
    statusChip: {
        padding: 8,
        borderRadius: 8,
    }
})
