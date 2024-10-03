import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationProp } from '@react-navigation/native';
import SellerScreen from '../views/SellerScreen';
import SellersScreen from '../views/SellersScreen';
import ProductScreen from '../views/ProductScreen';

export type SellerStackParamList = {
    Sellers: undefined;
    Seller: { sellerId: string };
    Product: { productId: string };
};

export type SellerStackNavigation = NavigationProp<SellerStackParamList>;

const Stack = createNativeStackNavigator<SellerStackParamList>();

export default function SellerStackRouter() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Sellers" component={SellersScreen} />
            <Stack.Screen name="Seller" component={SellerScreen} />
            <Stack.Screen name="Product" component={ProductScreen} />
        </Stack.Navigator>
    );
}