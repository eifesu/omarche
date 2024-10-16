import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { Theme } from '@/config/constants';
import { Iconify } from 'react-native-iconify';
import { ButtonContainer, ButtonText } from '@/components/Button';
import { Order, OrderDetails, useGetOrderDetailsByIdQuery, useUpdateOrderStatusMutation } from '../../../(client)/redux/ordersApi.slice';
import { useDispatch } from 'react-redux';
import { showToast } from '@/redux/slices/toast.slice';
import QRCodeScannerModal from '@/components/QRCodeScannerModal';

interface MenuProps {
    orderId?: string | null;
}

const MenuComponent: React.FC<MenuProps> = ({
    orderId,
}) => {
    const { data } = useGetOrderDetailsByIdQuery(orderId as string, { skip: !orderId, pollingInterval: 5000 });
    const [isQRCodeScannerModalVisible, setQRCodeScannerModalVisible] = useState(false);
    const dispatch = useDispatch()
    const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation()

    const handleQRCodeScan = () => {
        if (!data) return;
        switch (data.order.status) {
            case 'COLLECTING':
                updateOrderStatus({ orderId: data.order.orderId, status: 'DELIVERING' })
                dispatch(showToast({ message: 'En livraison', type: 'success' }))
                break;
            case 'DELIVERING':
                updateOrderStatus({ orderId: data.order.orderId, status: 'DELIVERED' })
                dispatch(showToast({ message: 'Livrée', type: 'success' }))
                break;
        }
    }

    const handleActionButtonPress = () => {
        if (!data) return;
        switch (data.order.status) {
            case 'IDLE':
                break;
            case 'PROCESSING':
                break;
            case 'PROCESSED':
                updateOrderStatus({ orderId: data.order.orderId, status: 'COLLECTING' })
                dispatch(showToast({ message: 'En collecte', type: 'success' }))
                break;
            case 'COLLECTING':
                setQRCodeScannerModalVisible(true)
                // updateOrderStatus({ orderId: data.order.orderId, status: 'DELIVERING' })
                // dispatch(showToast({ message: 'En livraison', type: 'success' }))
                break;
            case 'DELIVERING':
                setQRCodeScannerModalVisible(true)
                // updateOrderStatus({ orderId: data.order.orderId, status: 'DELIVERED' })
                // dispatch(showToast({ message: 'Livrée', type: 'success' }))
                break;
        }
    }

    return (
        <View style={styles.ordersContainer}>
            <MenuHeader status={data?.order?.status} />
            {data && (
                <>
                    <MenuContent data={data} />
                    <MenuActionButton status={data.order.status} onPress={handleActionButtonPress} isLoading={isLoading} />
                    <QRCodeScannerModal
                        onClose={() => setQRCodeScannerModalVisible(false)}
                        isVisible={isQRCodeScannerModalVisible}
                        onScan={handleQRCodeScan}
                        validationRegex={new RegExp(`^${data.order.orderId}$`)}
                    />
                </>
            )}
        </View>
    );
};

const MenuContent = ({ data }: { data: OrderDetails }) => {
    function getMenuContent() {
        switch (data.order.status) {
            case 'IDLE':
            case 'PROCESSING':
            case 'CANCELED':
            case 'DELIVERED':
                return;
            case 'PROCESSED':
                return <>
                    <View style={styles.ordersContainerRow}>
                        <Iconify icon="mdi:shop-outline" size={28} color={Theme.colors.orange} />
                        <View>
                            <Text style={styles.ordersContainerRowTitle}>Marché de {data.marketName}</Text>
                            <Text style={styles.ordersContainerRowSubtitle}>Distance: 5.1km</Text>
                        </View>
                        <Iconify icon="healthicons:1-negative" style={{ marginLeft: 'auto' }} size={20} color={Theme.colors.orange} />
                    </View>
                    <View style={styles.ordersContainerRow}>
                        <Iconify icon="mdi:map-marker" size={28} color={Theme.colors.orange} />
                        <View>
                            <Text style={styles.ordersContainerRowTitle}>{data.order.address}</Text>
                            <Text style={styles.ordersContainerRowSubtitle}>Distance: 1.2 km</Text>
                        </View>
                        <Iconify icon="healthicons:2-negative" style={{ marginLeft: 'auto' }} size={20} color={Theme.colors.orange} />
                    </View>
                </>
            case 'COLLECTING':
                return <>
                    <View style={styles.ordersContainerRow}>
                        <Iconify icon="mdi:shop-outline" size={28} color={Theme.colors.orange} />
                        <View>
                            <Text style={styles.ordersContainerRowTitle}>Marché de {data.marketName}</Text>
                            <Text style={styles.ordersContainerRowSubtitle}>Distance: 5.1km</Text>
                        </View>
                    </View>
                    <View style={styles.ordersContainerRow}>
                        <View style={{ height: 32, width: 32, borderRadius: 999, backgroundColor: 'black' }} />
                        <View>
                            <Text style={styles.ordersContainerRowSubtitle}>Agent</Text>
                            <Text style={styles.ordersContainerRowTitle}>{data.agent?.firstName} {data.agent?.lastName}</Text>
                        </View>
                        <ButtonContainer style={styles.callButton} onPress={() => {
                            Linking.openURL(`tel:${data.agent?.phone}`);
                        }}>
                            <ButtonText color={Theme.colors.black} style={styles.callButtonText}>Appeler</ButtonText>
                            <Iconify icon="mdi:phone" size={16} color={Theme.colors.black} />
                        </ButtonContainer>
                    </View>
                </>
            case 'DELIVERING':
                return <>
                    <View style={styles.ordersContainerRow}>
                        <Iconify icon="mdi:map-marker" size={28} color={Theme.colors.orange} />
                        <View>
                            <Text style={styles.ordersContainerRowTitle}>{data.order.address}</Text>
                            <Text style={styles.ordersContainerRowSubtitle}>Distance: 1.2 km</Text>
                        </View>
                    </View>
                    <View style={styles.ordersContainerRow}>
                        <View style={{ height: 32, width: 32, borderRadius: 999, backgroundColor: 'black' }} />
                        <View>
                            <Text style={styles.ordersContainerRowSubtitle}>Client</Text>
                            <Text style={styles.ordersContainerRowTitle}>{data.client?.firstName} {data.client?.lastName}</Text>
                        </View>
                        <ButtonContainer style={styles.callButton} onPress={() => {
                            Linking.openURL(`tel:${data.client?.phone}`);
                        }}>
                            <ButtonText color={Theme.colors.black} style={styles.callButtonText}>Appeler</ButtonText>
                            <Iconify icon="mdi:phone" size={16} color={Theme.colors.black} />
                        </ButtonContainer>
                    </View>
                </>
        }
    }
    return (
        <>
            {getMenuContent()}
        </>
    );
};

const statusTitleMap: Record<Order['status'], string> = {
    IDLE: 'En attente',
    PROCESSING: 'En collecte',
    PROCESSED: 'Nouvelle commande',
    COLLECTING: 'Collecte en cours',
    DELIVERING: 'Livraison en cours',
    DELIVERED: 'En attente',
    CANCELED: 'En attente',
}

const MenuHeader = ({ status }: { status?: Order['status'] }) => {
    const delivering = status === 'PROCESSED' || status === 'COLLECTING' || status === 'DELIVERING'
    return (
        <View style={styles.ordersContainerHeader}>

            {delivering ? (
                <>
                    <Text style={styles.ordersContainerTitle}>{statusTitleMap[status]}</Text>
                    <Iconify icon="mdi:shop-outline" size={32} color="rgba(0,0,0,0.1)" />
                </>
            ) : (
                <>
                    <Text style={styles.ordersContainerTitle}>En attente</Text>
                    <ActivityIndicator size="small" color={Theme.colors.orange} />
                </>
            )}
        </View>
    );
};

const statusActionButtonMap: Record<Order['status'], string> = {
    IDLE: 'Commencer la commande',
    PROCESSING: 'Commencer la commande',
    PROCESSED: 'Prendre la commande',
    COLLECTING: 'Récupérer le panier',
    DELIVERING: 'Confirmer la livraison',
    DELIVERED: 'Commencer la commande',
    CANCELED: 'Commencer la commande',
}

const MenuActionButton = ({ onPress, status, isLoading }: { onPress: () => void, status: Order['status'], isLoading: boolean }) => {
    const active = status === "PROCESSED" || status === "COLLECTING" || status === "DELIVERING"
    if (!active) return;
    return (
        <ButtonContainer holdDuration={2000} style={styles.buttonContainer} onPress={() => onPress()} disabled={isLoading} >
            <ButtonText secure color="white" style={styles.buttonText} loading={isLoading}>
                {statusActionButtonMap[status]}
            </ButtonText>
        </ButtonContainer>
    );
}

const styles = StyleSheet.create({
    ordersContainer: {
        gap: 12,
        height: 'auto',
        width: '100%',
        padding: 16,
    },
    ordersContainerTitle: {
        fontFamily: Theme.font.black,
        fontSize: 24,
        letterSpacing: -.6,
        color: Theme.colors.black,
    },
    ordersContainerHeader: {
        paddingBottom: 8,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ordersContainerRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 16,
    },
    ordersContainerRowTitle: {
        fontFamily: Theme.font.extraBold,
        fontSize: 14,
        letterSpacing: -.4,
        color: Theme.colors.black,
    },
    ordersContainerRowSubtitle: {
        fontFamily: Theme.font.extraBold,
        fontSize: 10,
        opacity: .5,
        color: Theme.colors.blackLight,
    },
    buttonContainer: {
        marginTop: 8,
    },
    buttonText: {
        fontSize: 16,
        letterSpacing: -.4,
    },
    agentImageContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
    agentImage: {
        width: '100%',
        height: '100%',
    },
    agentImagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
    },
    callButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: Theme.colors.blackLight,
        paddingHorizontal: 12,
        borderRadius: 999,
        height: 36,
        gap: 8,
        marginLeft: 'auto',
    },
    callButtonText: {
        fontSize: 12,
    },
});

export default MenuComponent;