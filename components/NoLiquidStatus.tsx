import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NoLiquidAlert() {
    return (
        <View style={[styles.warningBox, styles.warningBoxCompact]}>
          <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#92400E" />
          <Text style={styles.warningText}>Place the monitor correctly under the cylinder.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 6,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 6,
  },
  warningBoxCompact: {
    paddingVertical: 6,
  },
  warningText: {
    flex: 1,
    color: '#92400E',
    fontSize: 11,
    lineHeight: 14,
    marginLeft: 8,
  }
})