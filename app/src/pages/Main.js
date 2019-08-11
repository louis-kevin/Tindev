import React , { useState, useEffect } from 'react'
import io from 'socket.io-client'
import AsyncStorage from '@react-native-community/async-storage'
import {SafeAreaView, View, Text, Image, StyleSheet} from 'react-native'

import axios from 'axios'

import logo from '../assets/logo.png'
import like from '../assets/like.png'
import dislike from '../assets/dislike.png'
import itsamatch from '../assets/itsamatch.png'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Main({ navigation }){
    const id = navigation.getParam('user')
    const [users, setUsers] = useState([])
    const [matchDev, setMatchDev] = useState(null)

    useEffect(() => {
        async function loadUsers(){
            const response = await axios.get('http://localhost:3333/devs', {
                headers: { user: id }
            })
            setUsers(response.data)
        }

        loadUsers()
    }, [id])

    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: {
                user: id
            }
        })

        socket.on('match', dev => {
            setMatchDev(dev)
        })
    }, [id])

    async function handleLike(){
        const [user, ...rest] = users
        await axios.post(`http://localhost:3333/devs/${user._id}/like`, null, {headers: {user: id}})

        setUsers(rest)
    }

    async function handleDislike(){
        const [user, ...rest] = users

        await axios.post(`http://localhost:3333/devs/${user._id}/dislike`, null, {headers: {user: id}})

        setUsers(rest)
    }

    async function handleLogout(){
        await AsyncStorage.clear()

        navigation.navigate('Login')
    }


    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout }>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>
            <View style={styles.cardsContainer} >
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <View style={[styles.card, {sIndex: users.length - index}]} key={user._id}>
                            <Image 
                                style={styles.avatar} 
                                source={{ uri: user.avatar }} 
                            />
                            
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>{user.bio}</Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <View>
                        <Text style={styles.empty}>Acabou :(</Text>
                    </View>
                )}
                
            </View>
            { users.length > 0 ? (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleDislike}>
                        <Image source={dislike} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleLike}>
                        <Image source={like} />
                    </TouchableOpacity>
                </View>
            ) : <View />}

            { matchDev && (
                <View style={styles.matchContainer}>
                    <Image source={itsamatch} />
                    <Image style={styles.matchAvatar} source={{uri: matchDev.avatar}} />

                    <Text style={styles.matchName}>{matchDev.name}</Text>
                    <Text style={styles.matchBio}>{matchDev.bio}</Text>
                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.closeMatch}>FECHAR</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    logo: {
        marginTop: 30
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },

    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0, 
        right: 0,
        bottom: 0,
    },

    avatar: {
        flex: 1,
        height: 300,
    },

    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },

    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 2,
        lineHeight: 20
    },

    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30,
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        }
    },

    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold'  
    },

    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0, 0.8)',
        alignItems: 'center',
        justifyContent: 'center'
    },

    matchImage: {
        height: 60,
        resizeMode: 'contain'
    },

    matchAvatar: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#FFF',
        marginVertical: 30
    },

    matchName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff'
    },
    
    matchBio: {
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 30,
    },

    closeMatch: {
        fontSize: 16, 
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginTop: 30,
        fontWeight: 'bold'
    }
})