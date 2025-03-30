import React from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";

export default function LeaderBoard() {
  const tempData = [
    { rank: 1, name: "HabitFlow", points: 210 },
    { rank: 2, name: "Flower", points: 200 },
    { rank: 3, name: "Bear", points: 120 },
    { rank: 4, name: "Mysterious", points: 100 },
    { rank: 5, name: "User12138", points: 90 },
  ];

  const user = tempData.find((item) => item.name === "Mysterious");
  const otherRanks = tempData.filter((item) => item.name !== "Mysterious");

  const getRankPlace = (rank) => {
    if (rank === 1) {
      return "1st";
    }
    if (rank === 2) {
      return "2nd";
    }
    if (rank === 3) {
      return "3rd";
    }
    return `${rank}th`;
  };

  return (
    <View style={styles.container}>
      {/* First Place Display */}
      <View style={styles.firstContainer}>
        <Text style={styles.winnerText}>Winner</Text>
        <Image
          source={require("../../assets/images/ribbon.png")}
          style={styles.avatar}
        />
        <Text style={styles.firstPlaceText}>{tempData[0].name}</Text>
        <Text style={styles.firstPlacePoints}>{tempData[0].points}</Text>
      </View>
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <View style={styles.line} />
      </View>

      {/* Other Players */}
      <FlatList
        data={otherRanks.slice(1)} // Skipping first place
        keyExtractor={(item) => item.rank.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{getRankPlace(item.rank)}</Text>
            <Text style={styles.username}>{item.name}</Text>
            <Text style={styles.points}>{item.points}</Text>
          </View>
        )}
      />

      {/* User's Rank Display */}
      {user && (
        <View style={styles.userRankContainer}>
          <Text style={styles.rank}>{getRankPlace(user.rank)}</Text>
          <Text style={styles.username}>You</Text>
          <Text style={styles.points}>{user.points}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFDF4",
    padding: 20,
  },
  winnerText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 28,
    marginBottom: 10,
  },
  firstContainer: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FBFDF4",
    marginBottom: 0,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  firstPlaceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#41342B",
  },
  firstPlacePoints: {
    fontSize: 18,
    color: "green",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#FBFDF4",
    borderRadius: 8,
    marginBottom: 10,
  },
  rank: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#78BD2F",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  points: {
    fontSize: 16,
    color: "#78BD2F",
    fontWeight: "bold",
  },
  userRankContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#A3BF80",
    marginBottom: 70,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E9E9E9",
  },
});
