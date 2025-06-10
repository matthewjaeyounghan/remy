// Habitualize MVP - React Native App

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [formData, setFormData] = useState({
    sleepHours: '',
    sleepQuality: '',
    exerciseType: '',
    exerciseDuration: '',
    exerciseIntensity: '',
    mood: '',
    journal: '',
    productivity: '',
    screenTime: '',
    waterIntake: ''
  });

  const [summary, setSummary] = useState(null);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const saveData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem(`habit-${today}`, JSON.stringify(formData));
      Alert.alert('Saved!', 'Your habits were saved successfully.');
      generateSummary();
    } catch (e) {
      Alert.alert('Error', 'Failed to save data.');
    }
  };

  const generateSummary = () => {
    const insights = [];
    const sleepHours = parseFloat(formData.sleepHours);
    const waterIntake = parseFloat(formData.waterIntake);
    const mood = parseInt(formData.mood);

    if (!isNaN(sleepHours) && sleepHours < 6) {
      insights.push('You slept less than 6 hours. Try going to bed earlier.');
    }
    if (formData.exerciseIntensity === '5') {
      insights.push('Great job on intense exercise! Remember to hydrate.');
    }
    if (!isNaN(waterIntake) && waterIntake < 4) {
      insights.push('Try drinking more water tomorrow.');
    }
    if (!isNaN(mood) && mood <= 2) {
      insights.push('Mood was low. Reflect on what may have influenced it.');
    }

    setSummary(insights);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Habitualize - Daily Check-In</Text>

        <TextInput placeholder="Sleep Hours" keyboardType="numeric" style={styles.input} onChangeText={v => handleChange('sleepHours', v)} />
        <TextInput placeholder="Sleep Quality (1–5)" keyboardType="numeric" style={styles.input} onChangeText={v => handleChange('sleepQuality', v)} />
        <TextInput placeholder="Exercise Type" style={styles.input} onChangeText={v => handleChange('exerciseType', v)} />
        <TextInput placeholder="Exercise Duration (min)" keyboardType="numeric" style={styles.input} onChangeText={v => handleChange('exerciseDuration', v)} />
        <TextInput placeholder="Exercise Intensity (1–5)" keyboardType="numeric" style={styles.input} onChangeText={v => handleChange('exerciseIntensity', v)} />
        <TextInput placeholder="Mood (1–5)" keyboardType="numeric" style={styles.input} onChangeText={v => handleChange('mood', v)} />
        <TextInput placeholder="Productivity (tasks completed / planned)" style={styles.input} onChangeText={v => handleChange('productivity', v)} />
        <TextInput placeholder="Screen Time (hrs)" keyboardType="numeric" style={styles.input} onChangeText={v => handleChange('screenTime', v)} />
        <TextInput placeholder="Water Intake (cups)" keyboardType="numeric" style={styles.input} onChangeText={v => handleChange('waterIntake', v)} />
        <TextInput placeholder="Journal Entry (optional)" style={[styles.input, styles.textarea]} multiline numberOfLines={4} onChangeText={v => handleChange('journal', v)} />

        <Button title="Save Habits" onPress={saveData} />

        {summary && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Today's Summary:</Text>
            {summary.map((item, index) => (
              <Text key={index} style={styles.summaryItem}>• {item}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  textarea: {
    height: 100
  },
  summaryBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 10
  },
  summaryItem: {
    marginBottom: 5
  }
});
