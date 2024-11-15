import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from '../../constants/Colors';
import Font_Family from '../../constants/Font_Family';

const SkillList = ({ skills, setFieldValue, skillOptions }) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Skills</Text>
      {skills.map((skill, index) => (
        <View key={index} style={styles.skillRow}>
          <Picker
            selectedValue={skill}
            style={styles.input}
            onValueChange={(itemValue) => setFieldValue(`skills[${index}]`, itemValue)}
          >
            <Picker.Item label="Select Skill" value="" />
            {skillOptions.map((option, idx) => (
              <Picker.Item key={idx} label={option} value={option} />
            ))}
          </Picker>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => {
              const updatedSkills = skills.filter((_, skillIndex) => skillIndex !== index);
              setFieldValue('skills', updatedSkills);
            }}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setFieldValue('skills', [...skills, ''])}
      >
        <Text style={styles.addButtonText}>Add Skill</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.DARK_TEXT,
    marginBottom: 10,
  },
  skillRow: {
    backgroundColor: Colors.SOFT_CREAM,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontFamily: Font_Family.REGULAR,
    backgroundColor: '#FFF',
  },
  removeButton: {
    backgroundColor: Colors.CORAL_PINK,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: Colors.BRIGHT_BLUE,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SkillList;

