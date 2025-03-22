import { View, Text, StyleSheet} from 'react-native';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPeopleGroup } from '@fortawesome/free-solid-svg-icons';

const CircleListItem = ({ circle }) => {
  return (
    <View>
      <View style={styles.circleContainer}>
        <FontAwesomeIcon icon={faPeopleGroup} size={32} />
        <View style={styles.circleDetails}>
            <View><Text>{circle.name}</Text></View>
            <View style={styles.circleNumbers}>
                <Text>{circle.members.length} members</Text>
                <Text>{circle.cylinders.length} cylinders</Text>
            </View>
        </View>
      </View>
    </View>
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
