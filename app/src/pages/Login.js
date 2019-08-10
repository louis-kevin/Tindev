import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { Text, KeyboardAvoidingView, Platform, StyleSheet, Image, TextInput, TouchableOpacity} from 'react-native'

import logo from '../assets/logo.png'
import axios from 'axios';

export default function Login({navigation}) {
    const [username, setUsername] = useState('')

    useEffect(() => {
        AsyncStorage.getItem('user').then(user => {
            if(user){
                navigateToMain(user)
            }
        })
    }, [])

    async function handleLogin(){
        const response = await axios.post('http://localhost:3333/devs', { username })

        const { _id } = response.data

        await AsyncStorage.setItem('user', _id)

        navigateToMain(_id)
    }

    function navigateToMain(user){
        navigation.navigate('Main', { user })
    }

    return (
        <KeyboardAvoidingView 
            behavior="padding"
            enabled={Platform.OS == 'ios'}
            style={styles.container}
        >
            <Image source={logo} />

            <TextInput 
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setUsername}
                placeholder="Digite seu usuário no github"
                placeholderTextColor="#999"
                style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },

    input: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15, 
    },

    button: {
        height: 46,
        alignSelf: 'stretch',
        backgroundColor: '#DF4723',
        borderRadius: 4,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
})