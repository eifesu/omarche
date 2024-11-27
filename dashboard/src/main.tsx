import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MarketsScreen from './pages/markets/views/MarketsScreen.tsx'
import MarketScreen from './pages/markets/views/MarketScreen.tsx'
import SellerScreen from './pages/markets/views/SellerScreen.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/api/store.ts'
import OrdersScreen from './pages/orders/views/OrdersScreen.tsx'
import OrderScreen from './pages/orders/views/OrderScreen.tsx'
import GiftCardsScreen from './pages/giftcards/views/GiftCardsScreen.tsx'
import PromoCodesScreen from './pages/promocodes/views/PromoCodesScreen.tsx'

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/markets',
                element: <MarketsScreen />,
            },
            {
                path: '/markets/:marketId',
                element: <MarketScreen />,
            },
            {
                path: '/sellers/:sellerId',
                element: <SellerScreen />,
            },
            {
                path: '/orders',
                element: <OrdersScreen />,
            },
            {
                path: '/orders/:orderId',
                element: <OrderScreen />,
            },
            {
                path: '/cards',
                element: <GiftCardsScreen />,
            },
            {
                path: '/promo-codes',
                element: <PromoCodesScreen />,
            },
        ],
    },
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>
)
