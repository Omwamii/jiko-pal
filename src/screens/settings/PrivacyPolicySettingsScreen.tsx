import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Effective Date: (Change)</Text>

      <Text style={styles.paragraph}>
        We value your privacy. This app collects and uses data to help you track gas levels, receive alerts, and manage your cylinders effectively.
      </Text>

      <Text style={styles.subHeader}>What We Collect:</Text>
      <Text style={styles.listItem}>• Your name, email, and phone (for account & support)</Text>
      <Text style={styles.listItem}>• Cylinder data (current/total weight, usage, sensor ID)</Text>
      <Text style={styles.listItem}>• Sensor info (battery status, gas purity)</Text>
      <Text style={styles.listItem}>• Device info (for notifications & app performance)</Text>

      <Text style={styles.subHeader}>How We Use It:</Text>
      <Text style={styles.listItem}>• To track gas levels and send alerts</Text>
      <Text style={styles.listItem}>• To help you monitor usage and schedule refills</Text>
      <Text style={styles.listItem}>• To improve app functionality and support</Text>

      <Text style={styles.subHeader}>Your Control:</Text>
      <Text style={styles.paragraph}>
        You can edit your info, manage notifications, and delete your account anytime from Settings.
      </Text>
      <Text style={styles.paragraph}>
        We don’t sell your data. Data is only shared with services that help the app function (e.g., notifications).
      </Text>

      <Text style={styles.subHeader}>Security:</Text>
      <Text style={styles.paragraph}>
        Your data is securely stored and encrypted. We follow best practices to keep it safe.
      </Text>

      <Text style={styles.subHeader}>Contact:</Text>
      <Text style={styles.paragraph}>
        For questions or to request data deletion, email us at <Text style={styles.link}>[support@example.com]</Text>.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
  },
  listItem: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 5,
  },
  link: {
    color: 'blue',
  },
});

export default PrivacyPolicyScreen;
