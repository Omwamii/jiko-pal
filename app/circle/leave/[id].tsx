import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const LeaveCircle = () => {
  return (
    <View>
      <Stack.Screen name='leave-circle' options={{ title: 'Leave Circle' }} />
      <Text>LeaveCircle</Text>
    </View>
  )
}

export default LeaveCircle;
