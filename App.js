/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { memo, useState } from 'react';

import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert
} from 'react-native';

import TouchID from 'react-native-touch-id'
import * as keychain from 'react-native-keychain'

function DemoNativeAuth () {
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  const login = () => {
    (async () => {
      try {
        let message
        const type = await TouchID.isSupported()

        const credentials = await keychain.getGenericPassword()
        const { username: storedUsername , password: storedPassword } = credentials

        switch (type) {
          case 'TouchID':

            message = 'Login with touch id'
            break;

          case 'FaceID':

            message = 'Login with face id'
            break;
        }

        if (type) {
          const isAuthenticated = await TouchID.authenticate(message)

          if (isAuthenticated) {
            if (storedPassword && storedUsername) {
              setTimeout(() => {
                Alert.alert("Login in with stored credentials", `${storedPassword} ${storedPassword}`)
              }, 1000)
            } else if (username && password){
              setTimeout(() => {
                Alert.alert("Login in manually", `${username} ${password}`)
              }, 1000)
              keychain.setGenericPassword(username, password)
            } else {
              Alert.alert('Ooops', 'please set a username and password')
            }
          }
        }
      } catch (e) {
        /* handle error */
      }
    })()
  }

  return (
    <View style={{ flex: 1, padding: 40 }}>
      <Text>username</Text>
      <TextInput
        onChangeText={(text) => setUsername(text)}
        style={{ height: 40, borderWidth: 1, marginBottom: 5 }} value={username}/>
      <Text>password</Text>
      <TextInput
        onChangeText={(text) => setPassword(text)}
        style={{ height: 40, borderWidth: 1 }} value={password}/>
      <TouchableOpacity onPress={login}>
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  )
}

export default memo(DemoNativeAuth)
