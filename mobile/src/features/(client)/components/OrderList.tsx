import React, { useState } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useFetchOrdersByUserIdQuery, User } from '@/features/auth/redux/user.api'
import RefreshControl from '@/components/ui/RefreshControl'
import { OrderDetails } from '../redux/ordersApi.slice'
import { ButtonContainer, ButtonText } from '@/components/Button'
import { MarketInfo, OrderProductList, OrderStatusComponent } from './OrderItem'
import QRCode from 'react-native-qrcode-svg';
import Modal from 'react-native-modal';

const OrderList = () => {
    const auth = useSelector((state: RootState) => state.auth)
    const { data, refetch, isFetching } = useFetchOrdersByUserIdQuery((auth.user as User).userId)
    return (
        <View style={styles.orderListContainer}>
            <FlatList
                data={data}
                contentContainerStyle={{ padding: 16, gap: 16, backgroundColor: '#f1f1f1' }}
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={refetch} />
                }
                keyExtractor={(item) => item.order.orderId}
                renderItem={({ item }) => (
                    <OrderItem data={item} />
                )}
            />
        </View>
    )
}

function OrderItem(props: { data: OrderDetails }) {
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    return (
        <View
            style={{ backgroundColor: 'white', width: '100%', borderRadius: 4 }}>
            <View style={{ padding: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <MarketInfo marketName={props.data.marketName} orderId={props.data.order.orderId} />
                <OrderStatusComponent status={props.data.order.status} />
            </View>
            <OrderProductList orderProducts={props.data.orderProducts} />

            {props.data.order.status === 'DELIVERING' && (
                <View style={{ padding: 12, flexDirection: 'row', width: '100%', paddingHorizontal: 16 }}>
                    <ButtonContainer style={{ height: 48, flex: 1 }} onPress={toggleModal}>
                        <ButtonText color={"white"} style={{ fontSize: 14 }}>Afficher le QR Code</ButtonText>
                    </ButtonContainer>
                </View>
            )}

            <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                <View style={{ backgroundColor: 'white', padding: 20, alignItems: 'center', borderRadius: 10 }}>
                    <QRCode
                        value={props.data.order.orderId}
                        size={200}
                    />
                    <ButtonContainer style={{ marginTop: 20, width: 100 }} onPress={toggleModal}>
                        <ButtonText color={"white"}>Fermer</ButtonText>
                    </ButtonContainer>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    orderListContainer: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    }
})
export default OrderList

