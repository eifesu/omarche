"use client"
import { store } from '@/redux/store';
import React from 'react';
import { Provider } from 'react-redux';

interface PageWrapperProps {
    children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};

export default PageWrapper;
