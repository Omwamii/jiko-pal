import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const DeleteCircle = () => {
  return (
    <View>
      <Stack.Screen name='delete-circle' options={{ title: 'Delete Circle' }} />
      <Text>DeleteCircle</Text>
    </View>
  )
}

export default DeleteCircle;
