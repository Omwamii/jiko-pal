import { View, Text, StyleSheet} from 'react-native';
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
        <FontAwesome name="binoculars" size={32} />
        <View style={styles.circleDetails}>
            <View><Text>{circle.name}</Text></View>
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
        marginVertical: 10,
        width: '90%',
    },
    circleDetails: {
        flexDirection: 'column',
        marginLeft: 10,
    },
    circleNumbers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default CircleListItem;
