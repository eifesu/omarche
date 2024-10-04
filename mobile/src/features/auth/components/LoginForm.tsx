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

export default function LoginForm() {
    const authNavigation = useNavigation<AuthStackNavigation>()
    const homeNavigation = useNavigation<RootStackNavigation>()
    const [loginClient] = useLoginClientMutation()
    const [loginAgent] = useLoginAgentMutation()
    const [loginShipper] = useLoginShipperMutation()
    const route = useRoute<LoginScreenRouteProp>()
    const role = useSelector((state: RootState) => state.auth.role)

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Connexion</Text>

            <View style={styles.formContainer}>
                <Formik
                    initialValues={{ email: route.params ? route.params.email : '', password: '' }}
                    onSubmit={async (values) => {
                        if (!values.email || !values.password) return;
                        try {
                            let result;
                            if (role === 'Client') {
                                result = await loginClient({ email: values.email, password: values.password }).unwrap();
                                homeNavigation.navigate('Client');
                            } else if (role === 'Agent') {
                                result = await loginAgent({ email: values.email, password: values.password }).unwrap();
                                homeNavigation.navigate('Agent');
                            } else if (role === 'Livreur') {
                                result = await loginShipper({ email: values.email, password: values.password }).unwrap();
                                homeNavigation.navigate('Shipper');
                            }
                        } catch (error) {
                            console.error('Login error:', error);
                        }
                    }}
                    validationSchema={LoginSchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
                        <>
                            <FormInputContainer>
                                <MaterialCommunityIcons name="email" size={20} color="rgba(0,0,0,0.2)" />
                                <FormInputField
                                    placeholder="Entrer votre adresse email"
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                />
                            </FormInputContainer>
                            {errors.email && touched.email && <InputError error={errors.email} />}

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
    email: Yup.string().email('Veuillez entrer une adresse email valide.').required('Veuillez entrer une adresse email.'),
    password: Yup.string().min(8, 'Votre mot de passe doit avoir au moins 8 caractères.').required('Veuillez entrer un mot de passe.')
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