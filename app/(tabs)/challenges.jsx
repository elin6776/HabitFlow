import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchChallenges, acceptChallenge, fetchAcceptedChallenges } from '../../src/firebase/firebaseCrud';
import { Ionicons } from '@expo/vector-icons';

export default function Homepage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState([]);
  const [filteredChallenges, setFilteredChallenges] = useState([]);
  const [acceptedChallenges, setAcceptedChallenges] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedChallenges = await fetchChallenges();
        setChallenges(fetchedChallenges);
        setFilteredChallenges(fetchedChallenges);

        const acceptedIds = await fetchAcceptedChallenges();
        setAcceptedChallenges(new Set(acceptedIds));
      } catch (error) {
        console.error("Error loading challenges:", error);
      }
    };
    loadData();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredChallenges(challenges);
    } else {
      const filtered = challenges.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredChallenges(filtered);
    }
  };

  const handleAcceptChallenge = async (challengeUid) => {
    try {
      await acceptChallenge({ challengeUid });

      // ✅ Update accepted challenges immediately
      setAcceptedChallenges((prev) => new Set([...prev, challengeUid]));
    } catch (error) {
      console.error('Failed to accept challenge:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={{ height: 16 }} /> 
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      
      <View style={{ height: 14 }} /> 

      {/* Display Challenges */}
      <FlatList
        data={filteredChallenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isAccepted = acceptedChallenges.has(item.id);

          return (
            <TouchableOpacity 
              style={styles.challengeItem} 
              onPress={() => console.log(`Clicked: ${item.title}`)}
            >
              <View>
                <Text style={styles.h2}>{item.title}</Text>
                <Text style={styles.h3}>{item.description}</Text>
              </View>
              
              {/* Grey out button if accepted */}
              <Button 
                title={isAccepted ? "Accepted" : "Accept"}
                onPress={() => handleAcceptChallenge(item.id)}
                color={isAccepted ? "#ccc" : "#4CAF50"}
                disabled={isAccepted}
              />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.h3}>No challenges available.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFDF4',
    padding: 16
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  h3: {
    fontSize: 16,
    color: '#555',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  searchInput: {
    height: 40,
    borderColor: '#A3BF80',
    borderWidth: 1,
    borderRadius: 50,
    paddingLeft: 10,
    width: '80%',
    fontSize: 16,
    backgroundColor: 'white'
  },
  challengeItem: {
    padding: 22,
    borderBottomWidth: 0.2,  
  },  
});
