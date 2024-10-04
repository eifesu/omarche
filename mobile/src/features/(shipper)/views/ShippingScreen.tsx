import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapComponent from '../components/(shipping)/MapComponent';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import MenuComponent from '../components/(shipping)/MenuComponent';
import { Shipper } from '@/features/auth/redux/shipper.api';
import { setCurrentOrderId, WebSocketMessage } from '../redux/delivery.slice';
import { ENV } from '@/config/constants';

export default function ShippingScreen() {
    const currentOrderId = useSelector((state: RootState) => state.delivery.currentOrderId);
    const dispatch = useDispatch();

    const auth = useSelector((state: RootState) => state.auth);
    const user = auth.user as Shipper;
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        let reconnectInterval: number;

        const connectWebSocket = () => {
            const newWs = new WebSocket(`ws://${ENV.API_URL.replace('http://', '')}/ws/${user.shipperId}`);

            newWs.onopen = () => {
                setIsConnected(true);
                clearInterval(reconnectInterval);
            };

            newWs.onmessage = (event) => {
                const message: WebSocketMessage = JSON.parse(event.data);
                dispatch(setCurrentOrderId(message.orderId));
            };

            newWs.onclose = () => {
                setIsConnected(false);
                reconnectInterval = setInterval(() => {
                    connectWebSocket();
                }, 5000);
            };

            setWs(newWs);
        };

        connectWebSocket();

        return () => {
            if (ws) {
                ws.close();
            }
            clearInterval(reconnectInterval);
        };
    }, []);

    return (
        <View style={styles.container}>
            <MapComponent />
            <MenuComponent orderId={currentOrderId} />
            <Text style={styles.wsStatus}>
                Status: {isConnected ? 'Connected' : 'Disconnected'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wsStatus: {
        position: 'absolute',
        top: 40,
        left: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 5,
        borderRadius: 5,
    },
});
