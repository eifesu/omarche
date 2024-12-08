// Common interfaces and types used across the application

export interface Agent {
    agentId: string;
}

export interface Order {
    orderId: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELED';
    agentId?: string;
    cancellationReason?: string;
}

export interface Market {
    marketId: string;
}

export interface Product {
    productId: string;
}

export interface RootState {
    auth: {
        user: Agent | null;
    };
}
