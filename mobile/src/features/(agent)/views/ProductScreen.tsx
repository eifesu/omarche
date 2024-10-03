import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SellerStackParamList } from '../routers/SellerStackRouter';
import { Theme } from '@/config/constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ButtonContainer, ButtonText } from '@/components/Button';
import { StatusBar } from 'expo-status-bar';
import { useDispatch } from 'react-redux';
import { useFetchProductByIdQuery, useUpdateProductByIdMutation } from '../../(client)/redux/productsApi.slice';
import { showToast } from '@/redux/slices/toast.slice';
import { Iconify } from 'react-native-iconify';
import { Image } from 'expo-image';

type ProductScreenRouteProp = RouteProp<SellerStackParamList, 'Product'>;
type ProductScreenNavigationProp = NativeStackNavigationProp<SellerStackParamList, 'Product'>;

export default function ProductScreen() {
    const route = useRoute<ProductScreenRouteProp>();
    const navigation = useNavigation<ProductScreenNavigationProp>();
    const dispatch = useDispatch();
    const { productId } = route.params;

    const { data: productDetails, isLoading } = useFetchProductByIdQuery(productId);
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductByIdMutation();

    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const handleToggleStock = async () => {
        if (!productDetails) return;

        try {
            await updateProduct({
                productId,
                data: { isInStock: !productDetails.isInStock },
            }).unwrap();

            dispatch(
                showToast({
                    message: productDetails.isInStock ? 'Produit marqué en rupture de stock.' : 'Produit marqué comme disponible.',
                    type: 'success',
                })
            );
        } catch (error) {
            dispatch(
                showToast({
                    message: 'Erreur lors de la mise à jour du stock.',
                    type: 'warning',
                })
            );
            console.error('Erreur lors de la mise à jour du stock:', error);
        }
    };

    if (isLoading || !productDetails) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <StatusBar style="light" />
            <BackButton navigation={navigation} />
            <Carousel images={productDetails.pictureUrl} activeIndex={activeImageIndex} setActiveIndex={setActiveImageIndex} />
            <ProductDetailsView data={productDetails} />
            <View style={styles.buttonContainer}>
                <ButtonContainer
                    onPress={handleToggleStock}
                    holdDuration={2000}
                    style={[
                        styles.toggleButton,
                        {
                            backgroundColor: productDetails.isInStock ? Theme.colors.redDark : Theme.colors.green,
                        },
                    ]}
                    disabled={isUpdating}
                >
                    <ButtonText secure color="white" style={styles.buttonText}>
                        {productDetails.isInStock ? 'Marquer en rupture de stock' : 'Marquer produit disponible'}
                    </ButtonText>
                </ButtonContainer>
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{productDetails.description}</Text>
            </View>
        </KeyboardAwareScrollView>
    );
}

function BackButton({ navigation }: { navigation: ProductScreenNavigationProp }) {
    return (
        <ButtonContainer
            style={styles.backButton}
            onPress={() => navigation.goBack()}
        >
            <Iconify icon="material-symbols:arrow-back-rounded" size={24} color={Theme.colors.black} />
        </ButtonContainer>
    );
}

function Carousel({ images, activeIndex, setActiveIndex }: { images: string[], activeIndex: number, setActiveIndex: (index: number) => void }) {
    const width = Dimensions.get('window').width;
    const height = 270;

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setActiveIndex(index);
    };

    return (
        <View style={{ position: 'relative' }}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={{ height, width: '100%', backgroundColor: Theme.colors.greenDark }}
            >
                {images.map((image, index) => (
                    <View key={index} style={{ height, width, backgroundColor: Theme.colors.greenLight }}>
                        <Image source={{ uri: image }} style={{ height, width }} contentFit="cover" />
                    </View>
                ))}
            </ScrollView>
            <CarouselIndicator totalImages={images.length} activeIndex={activeIndex} />
        </View>
    );
}

function CarouselIndicator({ totalImages, activeIndex }: { totalImages: number, activeIndex: number }) {
    return (
        <View style={styles.indicatorContainer}>
            {Array.from({ length: totalImages }).map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.indicator,
                        { backgroundColor: activeIndex === index ? 'white' : 'rgba(255,255,255,0.5)' }
                    ]}
                />
            ))}
        </View>
    );
}

function InStockIcon() {
    return (
        <Iconify
            icon="mdi:check-circle"
            size={16}
            color={Theme.colors.greenDark}
        />
    );
}

function OutOfStockIcon() {
    return (
        <Iconify
            icon="mdi:close-circle"
            size={16}
            color={Theme.colors.redDark}
        />
    );
}

function StatusChip({ isInStock }: { isInStock: boolean }) {
    return (
        <View style={[
            styles.statusChip,
            { backgroundColor: isInStock ? Theme.colors.greenLight : Theme.colors.redLight }
        ]}>
            <Text style={[
                styles.statusText,
                { color: isInStock ? Theme.colors.greenDark : Theme.colors.redDark }
            ]}>
                {isInStock ? 'En stock' : 'Rupture de stock'}
            </Text>
            {isInStock ? <InStockIcon /> : <OutOfStockIcon />}
        </View>
    );
}

function ProductDetailsView({ data }: { data: any }) {
    return (
        <View style={styles.productDetailsContainer}>
            <StatusChip isInStock={data.isInStock} />
            <View style={styles.info}>
                <Text style={styles.name}>{data.name}</Text>
                <View style={styles.productInfo}>
                    <Text style={styles.amountText}>{data.amount} {data.unit}</Text>
                    <Text style={styles.priceText}>{data.price} CFA</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 56,
        left: 16,
        zIndex: 10,
        width: 40,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 16,
        alignSelf: 'center',
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    productDetailsContainer: {
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        marginTop: 16,
        alignItems: 'center',
    },
    name: {
        fontFamily: Theme.font.black,
        color: Theme.colors.black,
        fontSize: 24,
        letterSpacing: -0.7,
    },
    productInfo: {
        marginTop: 4,
        alignItems: 'center',
    },
    amountText: {
        fontFamily: Theme.font.bold,
        color: Theme.colors.black,
        fontSize: 12,
        letterSpacing: -0.2,
    },
    priceText: {
        fontFamily: Theme.font.semiBold,
        color: Theme.colors.black,
        fontSize: 12,
        opacity: 0.7,
        letterSpacing: -0.2,
    },
    statusChip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 999,
        paddingVertical: 10,
        gap: 4,
        paddingHorizontal: 14,
    },
    statusText: {
        fontSize: 14,
        fontFamily: Theme.font.black,
        letterSpacing: -0.5,
        marginLeft: 4,
    },
    productName: {
        fontFamily: Theme.font.black,
        color: Theme.colors.black,
        fontSize: 20,
        letterSpacing: -0.7,
    },
    productUnit: {
        fontFamily: Theme.font.medium,
        color: Theme.colors.black,
        fontSize: 14,
        opacity: 0.7,
    },
    priceContainer: {
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.1)",
        borderRadius: 8,
        padding: 8,
    },
    price: {
        color: Theme.colors.black,
        fontFamily: Theme.font.black,
        fontSize: 16,
        letterSpacing: -0.5,
    },
    currency: {
        fontSize: 10,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        marginTop: 8,
    },
    toggleButton: {
        height: 48,
    },
    buttonText: {
        fontSize: 14,
        fontFamily: Theme.font.black,
    },
    descriptionContainer: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginTop: 8,
    },
    descriptionTitle: {
        fontFamily: Theme.font.black,
        color: Theme.colors.black,
        fontSize: 16,
        letterSpacing: -0.5,
    },
    descriptionText: {
        fontFamily: Theme.font.medium,
        color: Theme.colors.black,
        fontSize: 14,
        opacity: 0.7,
        lineHeight: 20,
    },
});