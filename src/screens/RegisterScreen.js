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


// ✅ FIXED: moved outside
const Field = ({ label, placeholder, keyboardType, secureEntry, icon, value, onChange, error, showPass, extra }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrap, error && styles.inputError]}>
      <Text style={styles.inputIcon}>{icon}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType || 'default'}
        secureTextEntry={secureEntry}
        autoCapitalize={label === 'Full Name' ? 'words' : 'none'}
        autoCorrect={false}
      />
      {extra}
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);


const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const validate = () => {
    const errs = {};

    if (!form.name.trim() || form.name.trim().length < 2)
      errs.name = 'Enter your full name';

    if (!form.email.trim())
      errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = 'Enter a valid email';

    if (!form.phone.trim())
      errs.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, '')))
      errs.phone = 'Enter a valid 10-digit number';

    if (!form.password)
      errs.password = 'Password is required';
    else if (form.password.length < 6)
      errs.password = 'Minimum 6 characters';

    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);

    const result = await register({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      password: form.password,
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.appName}>MediBook</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Register</Text>

          <Field
            label="Full Name"
            placeholder="John Doe"
            icon="👤"
            value={form.name}
            onChange={(t) => update('name', t)}
            error={errors.name}
          />

          <Field
            label="Email"
            placeholder="you@example.com"
            icon="✉️"
            keyboardType="email-address"
            value={form.email}
            onChange={(t) => update('email', t)}
            error={errors.email}
          />

          <Field
            label="Phone"
            placeholder="9876543210"
            icon="📱"
            keyboardType="phone-pad"
            value={form.phone}
            onChange={(t) => update('phone', t)}
            error={errors.phone}
          />

          <Field
            label="Password"
            placeholder="******"
            icon="🔒"
            secureEntry={!showPass}
            value={form.password}
            onChange={(t) => update('password', t)}
            error={errors.password}
            extra={
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Text>{showPass ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            }
          />

          <Field
            label="Confirm Password"
            placeholder="******"
            icon="🔒"
            secureEntry={!showPass}
            value={form.confirmPassword}
            onChange={(t) => update('confirmPassword', t)}
            error={errors.confirmPassword}
          />

          <TouchableOpacity onPress={handleRegister} style={styles.btn}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Create Account</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6C63FF' },
  scroll: { flexGrow: 1 },
  header: { padding: 20 },
  backIcon: { color: '#fff' },
  appName: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  form: { backgroundColor: '#fff', padding: 20, borderRadius: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },

  inputGroup: { marginBottom: 12 },
  label: { fontSize: 13 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 10, borderRadius: 10 },
  input: { flex: 1 },
  inputIcon: { marginRight: 10 },
  errorText: { color: 'red', fontSize: 12 },

  btn: { backgroundColor: '#6C63FF', padding: 15, borderRadius: 10, marginTop: 10 },
  btnText: { color: '#fff', textAlign: 'center' },
});

export default RegisterScreen;