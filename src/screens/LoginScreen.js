import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';

    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Minimum 6 characters';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);

    const result = await login({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (!result.success) {
      setErrors({ general: result.message });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.logo}>🏥</Text>
          <Text style={styles.title}>MediBook</Text>
          <Text style={styles.subtitle}>Your health, our priority</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.heading}>Welcome Back</Text>

          {errors.general && (
            <Text style={styles.error}>{errors.general}</Text>
          )}

          {/* EMAIL */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}   // ✅ FIXED
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {errors.email && <Text style={styles.error}>{errors.email}</Text>}

          {/* PASSWORD */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputFlex}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}   // ✅ FIXED (IMPORTANT)
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Text style={styles.eye}>
                {showPass ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>

          {errors.password && <Text style={styles.error}>{errors.password}</Text>}

          {/* BUTTON */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* NAVIGATION */}
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>
              Don’t have an account? <Text style={styles.bold}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6C63FF' },
  scroll: { flexGrow: 1 },

  header: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 20,
  },
  logo: { fontSize: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#ddd' },

  form: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },

  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  inputFlex: {
    flex: 1,
    paddingVertical: 12,
  },

  eye: { fontSize: 18 },

  button: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  link: {
    textAlign: 'center',
    marginTop: 15,
  },

  bold: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },

  error: {
    color: 'red',
    marginBottom: 5,
    fontSize: 12,
  },
});

export default LoginScreen;