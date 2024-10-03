
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBar from '../../../components/ui/TabBar';
import MapScreen from '../views/MapScreen';
import OrdersScreen from '../views/OrdersScreen';
import ProfileScreen from '../views/ProfileScreen';
import { FontAwesome6, Entypo } from '@expo/vector-icons'
import { Theme } from '@/config/constants';

export type ClientTabParamList = {
    Map: undefined;
    Orders: undefined;
    Settings: undefined;
};

const Tab = createBottomTabNavigator()

function TabIcon({ label, isFocused }: { label: string, isFocused: boolean }) {
    const size = 24;
    if (label === 'Map') return <FontAwesome6 name="basket-shopping" color={isFocused ? Theme.colors.green : 'rgba(0,0,0,.2)'} size={size} />
    if (label === 'Orders') return <FontAwesome6 name="receipt" color={isFocused ? Theme.colors.green : 'rgba(0,0,0,.2)'} size={size} />
    else return <Entypo name="menu" color={isFocused ? Theme.colors.green : 'rgba(0,0,0,.2)'} size={size} />
}

export default function ClientTabRouter() {
    return (
        <Tab.Navigator
            tabBar={props => <TabBar tabIconComponent={TabIcon} {...props} />}
            screenOptions={
                { headerShown: false }
            }>
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Orders" component={OrdersScreen} />
            <Tab.Screen name="Settings" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
