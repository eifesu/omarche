// In App.js in a new project

import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../views/LoginScreen';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import RegisterScreen from '../views/RegisterScreen';

type LoginParams = {
    phone: string | undefined;
};

export type LoginScreenRouteProp = RouteProp<AuthStackParamList, 'Login'>;

export type AuthStackParamList = {
    Login: LoginParams;
    Register: undefined;
};


export type AuthStackNavigation = NavigationProp<AuthStackParamList>;

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStackRouter() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />

        </Stack.Navigator>
    );
}
