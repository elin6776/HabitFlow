import React, { useEffect,useState  } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert,Modal,Image } from 'react-native';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore, doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { Ionicons,FontAwesome } from '@expo/vector-icons';
export default function Support(){
    const [expanded, setExpanded] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [userData, setUserData] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(()=>{
        const fetchUser=async()=>{
            const auth=getAuth();
            const user=auth.currentUser;
            if(user){
                const db=getFirestore();
                const userRef = doc(db, 'users', user.uid);
                const userSnap=await getDoc(userRef);
                if(userSnap.exists()){
                    setUserData({
                        uid:user.uid,
                        username:userSnap.data().username,
                        email:user.email,
                    });
                }
            }
        };
        fetchUser();
    },[]);
    const submitMessage = async () => {
        if (!userData) return alert("User not loaded. Please try again.");
        if (!message.trim()||(message.trim().length < 5)) return alert("The message cannot be empty or too short.");
        try {
          const db = getFirestore();
          await addDoc(collection(db, "support_reports"), {
            uid: userData.uid,
            username: userData.username,
            email: userData.email,
            message,
            createdAt: new Date(),
          });
          alert("Message sent!");
          setMessage('');
          setModalVisible(false);
        } catch (err) {
          console.error("Error sending message:", err);
          alert("Failed to send message.");
        }
    };
    
    const faqs = [
        {
          key: 'faq1',
          question: '📌How do I join a challenge?',
          answer: 'Go to the Challenges tab, select a challenge, and tap Accept to join.'
        },
        {
          key: 'faq2',
          question: '📝How do I add a daily task?',
          answer: 'On the Home tab, tap the + icon under Daily Tasks and fill out the form.'
        },
        {
          key: 'faq3',
          question: '🎯What happens when I complete a challenge?',
          answer: 'You earn points which appear in the Leaderboard, and your challenge moves to Completed.'
        },
        {
          key: 'faq4',
          question: '⏳When are scores reset?',
          answer: 'Leaderboard scores are automatically reset at the beginning of each month.'
        },
        {
          key: 'faq5',
          question: '👥How can I participate in a collaborated challenge?',
          answer: 'Go to a challenge that supports collaboration and select "Invite a friend" or use the challenge link.'
        },
        {
          key: 'faq6',
          question: '🖼️How do I upload or change my profile picture?',
          answer: 'Go to your profile page and tap the avatar to select and upload an image from your device.'
        },
    ];
      

    return(
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Support Center</Text>
                <View style={styles.aboutbox}>
                    <View style={styles.aboutTitleRow}>
                        <Image
                            source={require("../../assets/images/logo.png")}
                            style={styles.logo}
                        />
                        <Text style={styles.aboutTitle}>About HabitFlow</Text>
                    </View>
                    <Text style={styles.aboutText}>
                    HabitFlow is a habit-building app that turns self-improvement into a fun and personal journey. 
                    With gamified challenges, daily tracking, and collaboration, it keeps you motivated and on track.
                    Build routines, celebrate progress with friends, and grow one step at a time.
                    </Text>
                </View>
                <Text style={styles.faqtitle1}>FAQs</Text>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={18} color="#888" style={{ marginRight: 6 }} />
                    <TextInput
                        placeholder="Search FAQs..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        style={styles.searchInput}
                    />
                </View>
                <Text style={styles.intro}>Here are some quick answers to common questions about using HabitFlow.</Text>
                {faqs
                    .filter(item => item.question.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item)=>{
                    const isExpanded = expanded === item.key;
                    return(
                        <View key={item.key} style={styles.faqBox}>
                            <TouchableOpacity
                                onPress={() => setExpanded(isExpanded ? null : item.key)}
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <Text style={styles.question}>{item.question}</Text>
                                <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color="#2E7D32" />
                            </TouchableOpacity>
                            {isExpanded && <Text style={styles.answer}>{item.answer}</Text>}
                        </View>
                    )
                }
                )}
                {/*logo*/}
                <View style={styles.footerBox}>
                    <Text style={styles.footerHeader}>Find Us</Text>
                    <View style={styles.iconRow}>
                        <TouchableOpacity style={styles.iconButton}>
                            <FontAwesome name="github" size={24} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <FontAwesome name="twitter" size={24} color="#1DA1F2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="mail-outline" size={24} color="#555" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
                    <Ionicons name="chatbubble-ellipses-outline" size={28} color="white" />
                </TouchableOpacity>
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.faqtitle2}>Send Feedback</Text>
                            <TextInput
                            style={styles.input}
                            placeholder="Tell us what the problem is..."
                            multiline
                            value={message}
                            onChangeText={setMessage}
                            maxLength={500}
                            />
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.button} onPress={submitMessage}>
                                <Text style={styles.buttonText}>Send</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelbutton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
      backgroundColor: "#FBFDF4",
      width: "100%",
      padding: 15,
    },
    header:{
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#222',
        textAlign: 'center'
    },
    aboutbox:{
        borderWidth: 2,
        borderColor: '#A3BF80',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: 'F9FFF8',
        shadowColor: '#A3BF80',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    aboutTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    logo:{
        width: 45,
        height: 45,
        marginRight: 5,
        resizeMode: 'contain',
    },
    aboutTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 10,
        color: '#222',
        textAlign: 'center',
        letterSpacing: 0.5
    },
    aboutText: {
        fontSize: 15,
        color: '#444',
        marginBottom: 24,
        lineHeight: 22,
        textAlign: 'center',
        paddingHorizontal: 10
    },      
    intro: {
        fontSize: 12,
        color: '#777',
        marginBottom: 20
    },
    faqtitle1:{
        fontSize: 22,
        fontWeight: 'bold',
        marginTop:0,
        marginBottom: 0,
        color: '#222',
        fontWeight: '600',
    },
    faqtitle2:{
        fontSize: 22,
        fontWeight: 'bold',
        marginTop:0,
        marginBottom: 10,
        color: '#222',
        fontWeight: '600',
        textAlign:'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#A3BF80',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 5,
        backgroundColor: '#fff',
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        paddingVertical: 8,
    },
    faqBox:{
        borderWidth: 1,
        borderColor: '#A3BF80',
        backgroundColor: 'F0F0F0',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        width: '100%'
    },
    question:{
        fontSize: 17,
        fontWeight: '500',
        color: '#333',
        flex: 1, 
        paddingRight: 5,
    },
    answer: {
        margin:5,
        fontSize: 14,
        color: '#5D675F',
        marginTop: 8,
    },
    footerBox: {
        backgroundColor: '#FBFDF4',
        alignItems: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderColor: '#ccc',
        marginTop: 40,
        marginBottom: 10,
    },
    footerHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    iconRow: {
        flexDirection: 'row',
        gap: 20
    },
        iconButton: {
        marginHorizontal: 10
    },
    floatingButton:{
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: '#1B4D3E',
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        elevation: 5,
    },
    input: {
        height: 100,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        borderColor: '#A3BF80',
        borderWidth: 1,
        textAlignVertical: 'top',
        marginBottom: 10,
        width: '100%'
    },
    buttonRow:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#A3BF80',
        paddingVertical: 12,
        borderRadius: 20,
        alignItems: 'center',
        width: '48%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelbutton:{ 
        backgroundColor: '#bbb',
        paddingVertical: 12,
        borderRadius: 20,
        textAlign: 'center',
        alignItems: 'center',
        width: '48%',
    },
});