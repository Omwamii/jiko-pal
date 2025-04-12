import { View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Circle } from '@/types';
import { Link } from 'expo-router';

type CircleListItemProps = {
    circle: Circle;
  };
  
const CircleListItem = ({ circle }: CircleListItemProps) => {
  return (
    <Link href={{
        pathname: '/circle/[id]',
        params: { id: circle.id },
    }}>
        <View style={styles.circleContainer}>
        {/* <FontAwesome name="binoculars" size={32} /> */}
        <Image source={require('@/assets/images/circle.png')} style={{ width: 52, height: 52, resizeMode: 'contain' }} />

        <View style={styles.circleDetails}>
            <View><Text style={{ fontWeight: 'bold' }}>{circle.name}</Text></View>
            <View style={styles.circleNumbers}>
                <Text>{circle.members.length} members</Text>
                <Text>{circle.cylinders.length} cylinders</Text>
            </View>
        </View>

      </View>
    </Link>
  )
}

const styles = StyleSheet.create({
    circleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
        width: '90%',
        // borderWidth: 1,
        // borderColor: 'blue',
    },
    circleDetails: {
        flexDirection: 'column',
        marginLeft: 10,
        padding: 5,
        // borderWidth: 1,
        // borderColor: 'green',
        width: '75%'
    },  
    circleNumbers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        // borderWidth: 1,
        // borderColor: 'red',
    },
});

export default CircleListItem;
