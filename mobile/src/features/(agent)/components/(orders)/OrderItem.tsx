import { ButtonContainer, ButtonText } from '@/components/Button';
import { HeaderSubtitle, HeaderTitle } from '@/components/ui/Header';
import { Theme } from '@/config/constants';
import { OrderDetails } from '@/features/(client)/redux/ordersApi.slice';
import { Agent } from '@/features/auth/redux/agent.api';
import { RootState } from '@/redux/store';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { Iconify } from 'react-native-iconify';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import { OrderProductList, OrderStatusComponent } from '../../../(client)/components/OrderItem';

interface OrderItemProps {
    data: OrderDetails;
    onConfirm: (id: string) => void;
    onCancel: (id: string, reason?: string) => void; // <-- Made reason optional
    onFinish: (id: string) => void;
}

const CheckIcon = () => <Iconify icon="mdi:check" size={20} color="white" />;
const CloseIcon = () => <Iconify icon="mdi:close" size={20} color="white" />;

const OrderItem = ({ data, onConfirm, onCancel, onFinish }: OrderItemProps) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [cancellationReason, setCancellationReason] = useState('');

    const handleCancel = () => {
        onCancel(data.order.orderId, cancellationReason);
        setModalVisible(false);
        setCancellationReason('');
    };

    const isOrderProcessed = !(['IDLE', 'PROCESSING', 'PROCESSED'].some(status => status === data.order.status))

    return (
        <View style={styles.orderItem}>
            <OrderHeader data={data} />
            <OrderDetailsAndStatus data={data} />
            <OrderProductList orderProducts={data.orderProducts} />
            <OrderActions
                data={data}
                isOrderProcessed={isOrderProcessed}
                onConfirm={onConfirm}
                onFinish={onFinish}
                setModalVisible={setModalVisible}
            />
            <CancellationModal
                visible={modalVisible}
                reason={cancellationReason}
                setReason={setCancellationReason}
                onCancel={handleCancel}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
};

const OrderHeader = ({ data }: { data: OrderDetails }) => (
    <View style={styles.header}>
        <View style={styles.headerTextContainer}>
            <HeaderSubtitle>Commande</HeaderSubtitle>
            <HeaderTitle style={{ fontSize: 14 }}>
                {data.marketName} <Text style={styles.orderId}>#{data.order.orderId.substring(0, 8).toUpperCase()}</Text>
            </HeaderTitle>
        </View>
    </View>
);

const OrderDetailsAndStatus = ({ data }: { data: OrderDetails }) => (
    <View style={styles.detailsAndStatusContainer}>
        <View style={styles.detailsContainer}>
            <DetailItem label="Adresse" value={data.order.address} />
            <DetailItem label="Heure de livraison" value={data.order.deliveryTime} />
            <DetailItem label="Méthode de paiement" value={data.order.paymentMethod} />
        </View>
        <OrderStatusComponent status={data.order.status} />
    </View>
);

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <Text style={styles.detailText}>
        <Text style={styles.detailField}>{label}: </Text>
        <Text style={styles.detailValue}>{value}</Text>
    </Text>
);

const OrderActions = ({ data, isOrderProcessed, onConfirm, onFinish, setModalVisible }: {
    data: OrderDetails;
    isOrderProcessed: boolean;
    onConfirm: (id: string) => void;
    onFinish: (id: string) => void;
    setModalVisible: (visible: boolean) => void;
}) => {
    const [qrModalVisible, setQrModalVisible] = useState(false);
    const auth = useSelector((state: RootState) => state.auth)
    const user = auth.user as Agent
    const disabled = data.order.agentId && data.order.agentId !== user.agentId

    if (disabled) return null
    return (
        <View style={{ marginTop: 12 }}>
            {!isOrderProcessed && (
                <View style={styles.buttonGroup}>
                    {data.order.status === 'IDLE' ? (
                        <ActionButton
                            text="Commencer collecte"
                            icon={<CheckIcon />}
                            onPress={() => onConfirm(data.order.orderId)}
                            style={styles.confirmButton}
                            holdDuration={2000}
                        />
                    ) : data.order.status === 'PROCESSED' ? (
                        <ActionButton
                            text="Afficher QR Code"
                            icon={<Iconify icon="mdi:qrcode" size={20} color="white" />}
                            onPress={() => setQrModalVisible(true)}
                            style={styles.confirmButton}
                        />
                    ) : (
                        <ActionButton
                            text="Finir collecte"
                            icon={<CheckIcon />}
                            onPress={() => onFinish(data.order.orderId)}
                            style={styles.confirmButton}
                            holdDuration={2000}
                        />
                    )}
                    <ActionButton
                        text="Annuler commande"
                        icon={<CloseIcon />}
                        onPress={() => setModalVisible(true)}
                        style={styles.cancelButton}
                    />
                </View>
            )}
            <QRCodeModal
                visible={qrModalVisible}
                onClose={() => setQrModalVisible(false)}
                orderId={data.order.orderId}
            />
        </View>
    );
};

const ActionButton = ({ text, icon, onPress, style, holdDuration, disabled }: {
    disabled?: boolean;
    text: string;
    icon: React.ReactNode;
    onPress: () => void;
    style: object;
    holdDuration?: number;
}) => (
    <ButtonContainer onPress={onPress} style={style} holdDuration={holdDuration} disabled={disabled}>
        <ButtonText secure={holdDuration !== undefined} color="white" style={{ fontSize: 12 }}>{text}</ButtonText>
        {icon}
    </ButtonContainer>
);

const CancellationModal = ({ visible, reason, setReason, onCancel, onClose }: {
    visible: boolean;
    reason: string;
    setReason: (reason: string) => void;
    onCancel: () => void;
    onClose: () => void;
}) => (
    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Annuler la commande</Text>
                    <Text style={styles.modalSubtitle}>Veuillez entrer la raison de l'annulation de la commande</Text>
                </View>
                <TextInput
                    style={styles.modalInput}
                    placeholder="Entrez la raison"
                    value={reason}
                    onChangeText={setReason}
                />
                <View style={styles.modalFooter}>
                    <ActionButton disabled={!reason} text="Confirmer annulation" holdDuration={2000} icon={<CheckIcon />} onPress={onCancel} style={[styles.modalButton, { backgroundColor: Theme.colors.green }]} />
                    <ActionButton text="Annuler action" icon={<CloseIcon />} onPress={onClose} style={[styles.modalButton, { backgroundColor: Theme.colors.blackLight }]} />
                </View>
            </View>
        </View>
    </Modal>
);

const QRCodeModal = ({ visible, onClose, orderId }: {
    visible: boolean;
    onClose: () => void;
    orderId: string;
}) => (
    <Modal
        transparent={false}
        visible={visible}
        onRequestClose={onClose}
        animationType="slide"
    >
        <View style={styles.qrModalContent}>
            <QRCode
                value={orderId}
                size={200}
            />
            <Text style={styles.qrModalText}>Scannez ce code pour confirmer la collecte</Text>
            <ActionButton
                text="Fermer"
                icon={<CloseIcon />}
                onPress={onClose}
                style={styles.qrModalCloseButton}
            />
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    orderItem: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerTextContainer: {
        flex: 1,
    },
    orderId: {
        fontFamily: Theme.font.bold,
        letterSpacing: .3,
        fontSize: 10
    },
    detailsAndStatusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: 12,
    },
    detailsContainer: {
        flex: 1,
        gap: 4,
    },
    detailText: {
        fontFamily: Theme.font.bold,
        fontSize: 10,
        color: '#333',
    },
    detailField: {
        fontFamily: Theme.font.bold,
    },
    detailValue: {
        fontFamily: Theme.font.semiBold,
    },
    buttonGroup: {
        gap: 8,
    },
    confirmButton: {
        height: 40,
        backgroundColor: Theme.colors.green,
        borderRadius: 8,
        flex: 1,
        gap: 8,
    },
    cancelButton: {
        height: 40,
        backgroundColor: Theme.colors.red,
        borderRadius: 8,
        flex: 1,
        gap: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalHeader: {
        alignItems: 'center',
    },
    modalFooter: {
        width: '100%',
    },
    modalContent: {
        gap: 12,
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        paddingVertical: 24,
        alignItems: 'center',
    },
    modalTitle: {
        fontFamily: Theme.font.black,
        letterSpacing: -0.3,
        fontSize: 16,
        marginBottom: 12,
    },
    modalInput: {
        fontFamily: Theme.font.extraBold,
        fontSize: 14,
        letterSpacing: -0.3,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 4,
        padding: 8,
        marginBottom: 12,
    },
    modalSubtitle: {
        marginTop: -8,
        fontFamily: Theme.font.medium,
        fontSize: 12,
        textAlign: 'center',
        letterSpacing: -0.3,
        marginBottom: 12,
    },
    modalButton: {
        gap: 4,
        backgroundColor: Theme.colors.green,
        height: 40,
        borderRadius: 8,
        padding: 10,
        marginVertical: 4,
        width: '100%',
        alignItems: 'center',
    },
    qrModalContent: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrModalText: {
        fontFamily: Theme.font.semiBold,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    qrModalCloseButton: {
        backgroundColor: Theme.colors.blackLight,
        width: '100%',
    },
});

export default OrderItem;