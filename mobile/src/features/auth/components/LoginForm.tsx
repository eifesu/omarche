import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Theme } from '@/config/constants'
import { Formik } from 'formik'
import { FormInputContainer, InputError, FormInputField } from './FormInput'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ButtonContainer, ButtonText } from '@/components/Button'
import * as Yup from 'yup'
import { useLoginClientMutation, useLoginAgentMutation, useLoginShipperMutation } from '../redux/auth.api'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useNavigation, useRoute } from '@react-navigation/native'
import { AuthStackNavigation, LoginScreenRouteProp } from '../routers/AuthStackRouter'
import { RootStackNavigation } from '@/routers/BaseRouter'
import { useErrorHandler } from '@/hooks/useErrorHandler'

export default function LoginForm() {
    const authNavigation = useNavigation<AuthStackNavigation>()
    const homeNavigation = useNavigation<RootStackNavigation>()
    const [loginClient] = useLoginClientMutation()
    const [loginAgent] = useLoginAgentMutation()
    const [loginShipper] = useLoginShipperMutation()
    const route = useRoute<LoginScreenRouteProp>()
    const role = useSelector((state: RootState) => state.auth.role)
    const handleError = useErrorHandler()

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Connexion</Text>

            <View style={styles.formContainer}>
                <Formik
                    initialValues={{ phone: route.params ? route.params.phone : '', password: '' }}
                    onSubmit={async (values) => {
                        if (!values.phone || !values.password) return;
                        try {
                            let result;
                            if (role === 'Client') {
                                result = await loginClient({ phone: values.phone, password: values.password }).unwrap();
                                homeNavigation.navigate('Client');
                            } else if (role === 'Agent') {
                                result = await loginAgent({ phone: values.phone, password: values.password }).unwrap();
                                homeNavigation.navigate('Agent');
                            } else if (role === 'Livreur') {
                                result = await loginShipper({ phone: values.phone, password: values.password }).unwrap();
                                homeNavigation.navigate('Shipper');
                            }
                        } catch (error) {
                            handleError(error)
                        }
                    }}
                    validationSchema={LoginSchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
                        <>
                            <FormInputContainer>
                                <MaterialCommunityIcons name="phone" size={20} color="rgba(0,0,0,0.2)" />
                                <FormInputField
                                    placeholder="Entrer votre numéro de téléphone"
                                    onChangeText={handleChange('phone')}
                                    onBlur={handleBlur('phone')}
                                    value={values.phone}
                                    keyboardType="phone-pad"
                                />
                            </FormInputContainer>
                            {errors.phone && touched.phone && <InputError error={errors.phone} />}

                            <FormInputContainer>
                                <MaterialCommunityIcons name="form-textbox-password" size={20} color="rgba(0,0,0,0.2)" />
                                <FormInputField
                                    placeholder="Entrer votre mot de passe"
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry
                                />
                            </FormInputContainer>
                            {errors.password && touched.password && <InputError error={errors.password} />}

                            <View style={styles.buttonGroup}>
                                <ButtonContainer onPress={handleSubmit} disabled={!isValid}>
                                    <ButtonText color="white">Se connecter</ButtonText>
                                </ButtonContainer>
                                {/* <ButtonContainer style={{ backgroundColor: Theme.colors.greenLight }}>
                                    <ButtonText color={Theme.colors.greenDark}>Mot de passe oublié ?</ButtonText>
                                </ButtonContainer> */}
                                {role === 'Client' && (
                                    <ButtonContainer style={{ backgroundColor: Theme.colors.orange }} onPress={() => authNavigation.navigate('Register')}>
                                        <ButtonText color="white">Créer un compte</ButtonText>
                                    </ButtonContainer>
                                )}
                            </View>
                            <View style={styles.buttonGroup}>
                            </View>
                        </>
                    )}
                </Formik>
            </View>

        </View>
    )
}

const LoginSchema = Yup.object().shape({
    phone: Yup.string()
        .required('Le numéro de téléphone est requis')
        .matches(/^[0-9]+$/, 'Le numéro de téléphone doit contenir uniquement des chiffres'),
    password: Yup.string()
        .required('Le mot de passe est requis')
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        width: '100%',
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        gap: 8,
        width: '100%'
    },
    sectionTitle: {
        fontSize: 36,
        letterSpacing: -1,
        color: Theme.colors.orange,
        fontFamily: Theme.font.black
    },
    buttonGroup: {
        width: '100%',
        marginTop: 16,
        gap: 8,
    }
})