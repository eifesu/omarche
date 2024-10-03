import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import { showToast } from '@/redux/slices/toast.slice'
import { useUpdateOrderStatusMutation } from '@/features/(client)/redux/ordersApi.slice'
import { useDispatch } from 'react-redux'
import { useGetOrdersByMarketIdQuery } from '@/features/(client)/redux/marketsApi.slice'
import OrderItem from './OrderItem'

const OrderList = ({ marketId }: { marketId: string }) => {
    const dispatch = useDispatch()
    const { data, refetch, isFetching } = useGetOrdersByMarketIdQuery(marketId)
    const [updateOrderStatus] = useUpdateOrderStatusMutation()

    const handleConfirm = async (orderId: string) => {
        try {
            await updateOrderStatus({ orderId, status: 'PROCESSING' }).unwrap()
            dispatch(showToast({ message: "Commande confirmée avec succès.", type: "success" }))
            refetch()
        } catch (error) {
            dispatch(showToast({ message: "Erreur lors de la confirmation de la commande.", type: "warning" }))
        }
    }

    const handleCancel = async (orderId: string, reason?: string) => {
        try {
            await updateOrderStatus({ orderId, status: 'CANCELED', cancellationReason: reason }).unwrap()
            dispatch(showToast({ message: "Commande annulée avec succès.", type: "success" }))
            refetch()
        } catch (error) {
            dispatch(showToast({ message: "Erreur lors de l'annulation de la commande.", type: "warning" }))
        }
    }

    const handleFinish = async (orderId: string) => {
        try {
            await updateOrderStatus({ orderId, status: 'PROCESSED' }).unwrap()
            dispatch(showToast({ message: "Commande collectée avec succès.", type: "success" }))
            refetch()
        } catch (error) {
            dispatch(showToast({ message: "Erreur lors de la finalisation de la commande.", type: "warning" }))
        }
    }

    return (
        <View style={styles.orderListContainer}>
            <FlatList
                data={data}
                contentContainerStyle={styles.flatListContent}
                refreshing={isFetching}
                onRefresh={refetch}
                keyExtractor={(item) => item.order.orderId}
                renderItem={({ item }) => (
                    <OrderItem
                        data={item}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                        onFinish={handleFinish}
                    />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    orderListContainer: {
        flex: 1,
        backgroundColor: '#f1f1f1',
    },
    flatListContent: {
        padding: 16,
        gap: 16,
        backgroundColor: '#f1f1f1',
    },
})

export default OrderList