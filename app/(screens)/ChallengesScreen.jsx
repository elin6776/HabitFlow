import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { Image } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from "react";


const challenges = [
  { id: "1", user: "HabitFlow", title: "A month of exercising", difficulty: "Hard", days: 30, status: "Accept" },
  { id: "2", user: "Flower", title: "Read the Hunger Games in 2 weeks", difficulty: "Easy", days: 14, status: "Accepted" },
];

export default function ChallengesScreen() {
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(7); 
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filteredChallenges, setFilteredChallenges] = useState(challenges);
  const router = useRouter();

  const applyFilters = () => {
    setFilteredChallenges(challenges.filter(challenge => 
        (!selectedDifficulty || challenge.difficulty === selectedDifficulty) &&
        challenge.days >= selectedDuration
    ));
    setIsFilterVisible(false);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {/* search */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={18} color=" #916A4C;" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search for a challenge" 
            placeholderTextColor=" #916A4C;"
          />
        </View>

        {/* filter */}
        <TouchableOpacity onPress={() => setIsFilterVisible(!isFilterVisible)} style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* filter */}
      {isFilterVisible && (
        <View style={styles.filterContainer}>
          {/* difficulty filter */}
          <Text style={styles.filterLabel}>Difficulty</Text>
          <View style={styles.optionContainerColumn}>
            {["Easy", "Normal", "Hard"].map(level => (
              <TouchableOpacity 
                key={level} 
                style={[styles.filterOption, selectedDifficulty === level && styles.selectedOption]} 
                onPress={() => setSelectedDifficulty(level)}
              >
                <Text style={styles.filterOptionText}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* duration filter */}
          <Text style={styles.filterLabel}>Duration</Text>
          <View style={styles.optionContainer}>
            <TextInput
              style={styles.durationInput}
              keyboardType="numeric"  
              placeholder="Enter days"
              value={String(selectedDuration)}
              onChangeText={(text) => {
                const days = parseInt(text) || 7; 
                setSelectedDuration(days);
              }}
            />
          </View>

          {/*  Apply button*/}
          <View style={styles.filterButtons}>
            <TouchableOpacity onPress={applyFilters}>
              <Text style={styles.applyButton}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Challenge list */}
      <FlatList
        data={filteredChallenges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.challengeCard, item.status === "Accepted" && styles.acceptedCard]}>
            <View style={styles.userContainer}>
              {/* User Avatar */}
              <Image 
                source={{uri: 'https://s3-alpha-sig.figma.com/img/8b62/1cd5/3edeeae6fe3616bdf2812d44e6f4f6ef?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=emv7w1QsDjwmrYSiKtEgip8jIWylb3Y-X19pOuAS4qkod6coHm-XpmS8poEzUjvqiikwbYp1yQNL1J4O6C9au3yiy-c95qnrtmWFJtvHMLHCteLJjhQgOJ0Kdm8tsw8kzw7NhZAOgMzMJ447deVzCecPcSPRXLGCozwYFYRmdCRtkwJ9JBvM~4jqBKIiryVGeEED5ZIOQsC1yZsYrcSCAnKjZb7eBcRr1iHfH-ihDA9Z1UPAEJ5vTau7aMvNnaHD56wt~jNx0jf8wvQosLhmMigGvqx5dnV~3PpavHpfs6DJclhW3pv9BJ25ZH9nLuNAfAW6a2X4Qw4KLESnH6fVGg__'}} // 替换成你的头像 URL
                style={styles.avatar}
              />
              <Text style={styles.user}>{item.user}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>

            {/* Tag */}
            <View style={styles.tagContainer}>
              <View style={[styles.tag, styles[item.difficulty.toLowerCase()]]}>
                <Text style={styles.tagText}>{item.difficulty}</Text>
              </View>
              <View style={styles.daysTag}>
                <Text style={styles.tagText}>{item.days} days</Text>
              </View>
            </View>

            {/* Icon  and Accept */}
            <View style={styles.iconContainer}>
              <Ionicons name="ellipsis-horizontal" size={25} color="#000000" />
              <Ionicons name="thumbs-up-outline" size={25} color="#000000" style={styles.iconSpacing} />
              <Ionicons name="link-outline" size={25} color="#000000" />
              <TouchableOpacity
                style={[styles.statusButton, item.status === "Accept" ? styles.acceptButton : styles.acceptedButton]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* + button */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create-challenge")}>
        <Ionicons name="add-circle-outline" size={45} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FBFDF4", paddingHorizontal: 20, paddingTop: 15 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },

  searchWrapper: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 6,  
    paddingHorizontal: 10, 
    borderRadius: 50, 
    borderWidth: 1,
    borderColor: "#A3BF80",
    alignItems: "center",
    marginBottom: 10,
    height: 40,  
    width: "60%", 
    alignSelf: "center", 
  },

  searchContainer: {
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "center", 
    width: "100%",  
    marginBottom: 10,
    top:10,
  },
  
  searchInput: {
    fontFamily:'ABeeZee',
    flex: 1,
    fontSize: 14, 
    paddingVertical: 3, 
    marginLeft: 4,
  },
  
  searchIcon: {
    position:'absolute',
    right:10,
  },

  filterContainer: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 10,
  },
  
  filterLabel: {
    fontSize: 20,
    fontWeight: "bold",
    Top:50,
  },
  
  optionContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  
  filterOption: {
    borderWidth: 1,
    borderColor: "#A3BF80",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 5,
  },
  
  selectedOption: {
    backgroundColor: "#748D56",
    color: "white",
  },
  
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
  cancelButton: {
    color: "red",
    fontWeight: "bold",
  },
  
  applyButton: {
    color: "green",
    fontWeight: "bold",
  },

  durationInput: {
    borderWidth: 1,
    borderColor: "#A3BF80",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 16,
    width: 80, 
  },
  

  challengeCard: {
    backgroundColor: "#FBFDF4",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9', 
  },
  userContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 30,    
    height: 30, 
    borderRadius: 15, 
    marginRight: 10,  
  },
  user: {
    fontSize: 16,
  },
  title: {
    fontSize: 14,
    color: '#555',
  },
  tagContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    marginTop:15,
  },
  tag: {
    fontSize: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 10,
  },
  hard: {
    backgroundColor: '#FAD7D7',
    color: '#fff',
  },
  easy: {
    backgroundColor: '#D7FAF3',
    color: '#fff',
  },
  daysTag: {
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#DED7FA',
    color: '#000000',
  },
  tagText: {
    color: '#000000',
    fontSize: 14,
  },
  iconContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    color:'#000000'
  },
  iconSpacing: {
    marginHorizontal: 15,
  },
  statusButton: {
    backgroundColor: '#A8D5BA',
    paddingVertical: 5, 
    paddingHorizontal: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width:100,
    marginLeft: 150,
},
  acceptedButton: {
    backgroundColor: '#D1D1D0', 
  },
  acceptButton: {
    backgroundColor: '#C5DE9D',
  },
  statusText: {
    color: '#382C14',
    fontFamily: 'ABeeZee',
    fontSize:15,
  },

  addButton: {
    position: "absolute",
    bottom: 50,
    right: 40,
    backgroundColor: "#FBFDF4", 
    borderRadius: 50, 
    alignItems: "center",
    justifyContent: "center",
  }
  
});
