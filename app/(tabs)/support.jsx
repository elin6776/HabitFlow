import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import { Ionicons } from '@expo/vector-icons';
export default function Support(){
    const [expanded, setExpanded] = React.useState(null);
    const faqs=[
        {
            key:'faq1',
            question: 'How do I join a challenge?',
            answer: 'Go to the Challenges tab, select a challenge, and tap Accept to join.'
        },
        {
            key: 'faq2',
            question: 'How to add a daily task?',
            answer: 'On the Home tab, tap the + icon under Daily Tasks and fill out the form.'
          },
          {
            key: 'faq3',
            question: 'What happens when I complete a challenge?',
            answer: 'You earn points which appear in the Leaderboard, and your challenge moves to Completed.'
          },
    ];

    return(
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Support Center</Text>
            <Text style={styles.intro}>Here are some quick answers to common questions about using HabitFlow.</Text>
            <Text style={styles.faqtitle}>FAQs</Text>
            {faqs.map((item)=>{
                const isExpanded = expanded === item.key;
                return(
                    <View key={item.key} style={styles.faqBox}>
                        <TouchableOpacity onPress={()=>setExpanded(isExpanded?null:item.key)}>
                        <Text style={styles.question}>{item.question}<Ionicons name={isExpanded?'chevron-up':'chevron-down'}size={18}color="#2E7D32"/></Text>
                        </TouchableOpacity>
                        {isExpanded && <Text style={styles.answer}>{item.answer}</Text>}
                    </View>
                )
            }
        )}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
      backgroundColor: "#FBFDF4",
      width: "100%",
      flex: 1,
      padding: 15,
    },
    header:{
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center'
        
    },
    intro: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center'
    },
    faqtitle:{
        fontSize: 22,
        fontWeight: 'bold',
        marginTop:0,
        marginBottom: 10,
        color: '#2AA198',
        fontWeight: '600',
    },
    faqBox:{
        borderWidth: 1,
        borderColor: '#A3BF80',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        width: '100%'
    },
    question:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2AA198',
    },
    answer: {
        fontSize: 15,
        color: '#444',
        marginTop: 8,
    },
});