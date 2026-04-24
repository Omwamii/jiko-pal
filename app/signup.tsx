import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';

const PRIMARY_COLOR = '#3629B7';

export default function SignupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ accountType?: string }>();
  const { registerClient, registerVendor, user } = useAuth();
  
  const accountType = useMemo(() => params.accountType as 'client' | 'vendor' | undefined, [params.accountType]);
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');

    if (!accountType) {
      router.replace('/account-type');
      return;
    }

    if (!email.trim() || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      if (accountType === 'client') {
        if (!fullName.trim() || !phone.trim()) {
          setError('Please fill in your full name and phone number');
          setLoading(false);
          return;
        }

        await registerClient({
          email: email.trim(),
          username: username.trim() || email.split('@')[0],
          password,
          full_name: fullName.trim(),
          phone_number: phone.trim(),
        });
      } else {
        if (!companyName.trim() || !location.trim()) {
          setError('Please fill in your company name and location');
          setLoading(false);
          return;
        }

        await registerVendor({
          email: email.trim(),
          username: username.trim() || email.split('@')[0],
          password,
          company_name: companyName.trim(),
          location: location.trim(),
        });
      }

      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.response?.data) {
        const errors = err.response.data;
        const firstError = Object.values(errors)[0];
        if (Array.isArray(firstError)) {
          setError(firstError[0]);
        } else if (typeof firstError === 'string') {
          setError(firstError);
        } else {
          setError('Registration failed. Please try again.');
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

const renderAccountTypeSelection = () => (
    <View style={styles.typeSelectionContainer}>
      <Text style={styles.titleText}>Creating {accountType === 'client' ? 'Client' : 'Vendor'} Account</Text>
      <Text style={styles.subtitleText}>Fill in your details to get started</Text>
    </View>
  );

  const renderClientForm = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.titleText}>Create Client Account</Text>
      <Text style={styles.subtitleText}>Start monitoring your gas today</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor="#9CA3AF"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@example.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          autoComplete="email"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+254 7000 000"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Username (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="johndoe"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoComplete="password-new"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity 
        style={styles.checkboxContainer} 
        activeOpacity={0.8}
        onPress={() => setTermsAccepted(!termsAccepted)}
      >
        <MaterialCommunityIcons 
          name={termsAccepted ? "checkbox-marked" : "checkbox-blank-outline"} 
          size={22} 
          color={termsAccepted ? PRIMARY_COLOR : "#D1D5DB"} 
        />
        <Text style={styles.checkboxText}>
          By creating an account you agree to our <Text style={styles.termsLink}>Terms and Conditions</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.signupButton, loading && styles.signupButtonDisabled]} 
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.signupButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderVendorForm = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.titleText}>Create Vendor Account</Text>
      <Text style={styles.subtitleText}>Start your gas delivery business</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Company Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Gas Masters Ltd."
          placeholderTextColor="#9CA3AF"
          value={companyName}
          onChangeText={setCompanyName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Nairobi, Kenya"
          placeholderTextColor="#9CA3AF"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@example.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          autoComplete="email"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Username (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="gasvendors"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoComplete="password-new"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <TouchableOpacity 
        style={styles.checkboxContainer} 
        activeOpacity={0.8}
        onPress={() => setTermsAccepted(!termsAccepted)}
      >
        <MaterialCommunityIcons 
          name={termsAccepted ? "checkbox-marked" : "checkbox-blank-outline"} 
          size={22} 
          color={termsAccepted ? PRIMARY_COLOR : "#D1D5DB"} 
        />
        <Text style={styles.checkboxText}>
          By creating an account you agree to our <Text style={styles.termsLink}>Terms and Conditions</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.signupButton, loading && styles.signupButtonDisabled]} 
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.signupButtonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => {
          if (!accountType) {
            router.back();
          }
        }}>
          <MaterialCommunityIcons name="chevron-left" size={28} color="#FFFFFF" />
          <Text style={styles.backButtonText}>{accountType ? 'Back' : 'Sign Up'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.contentContainer}
      >
        {!accountType ? renderAccountTypeSelection() : accountType === 'client' ? renderClientForm() : renderVendorForm()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 4,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  typeSelectionContainer: {
    flex: 1,
    padding: 30,
    paddingTop: 40,
  },
  scrollContent: {
    padding: 30,
    paddingTop: 40,
    paddingBottom: 40,
  },
  titleText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 32,
  },
  typeCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  typeTextContainer: {
    flex: 1,
  },
  typeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 32,
    paddingRight: 20,
  },
  checkboxText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 10,
    lineHeight: 18,
  },
  termsLink: {
    color: PRIMARY_COLOR,
    fontWeight: '500',
  },
  signupButton: {
    backgroundColor: PRIMARY_COLOR,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  footerLink: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: '600',
  },
});
