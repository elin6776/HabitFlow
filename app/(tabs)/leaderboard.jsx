import React from "react";
import { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import { fetchUserPoints } from "../../src/firebase/firebaseCrud";
import { getAuth } from "@react-native-firebase/auth";
export default function LeaderBoard() {
  const [points, setPoints] = useState([]);
  const [userRank, setUserRank] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;
  useEffect(() => {
    // Load Challenges from firestore
    const loadData = async () => {
      try {
        const fetchPoints = await fetchUserPoints();
        setPoints(fetchPoints);
        // console.log(points);
        if (user) {
          const userRank = fetchPoints.find((item) => item.userId === user.uid);
          setUserRank(userRank);
        }
      } catch (error) {
        console.error("Error loading points:", error);
      }
    };
    loadData();
  }, []);

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
  const userRankPlace = userRank ? getRankPlace(userRank.rank) : "No Ranked";
  const userPoints = userRank ? userRank.points : 0;
  return (
    <View style={styles.container}>
      {/* First Place Display */}
      <View style={styles.firstContainer}>
        <Text style={styles.winnerText}>Winner</Text>
        <Image
          source={require("../../assets/images/ribbon.png")}
          style={styles.avatar}
        />
        <View style={styles.firstPlaceRow}>
          <Text style={[styles.firstPlacePoints, { marginRight: 40 }]}>
            1st
          </Text>
          <Text style={[styles.firstPlaceText, { marginRight: 40 }]}>
            {points[0]?.userName}
          </Text>
          <Text style={styles.firstPlacePoints}>{points[0]?.points}</Text>
        </View>
      </View>
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <View style={styles.line} />
      </View>

      {/* Other Players */}
      <FlatList
        data={points.slice(1)} // Skipping first place
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{getRankPlace(item.rank)}</Text>
            <Text style={styles.username}>{item.userName}</Text>
            <Text style={styles.points}>{item.points}</Text>
          </View>
        )}
      />
      {user && (
        <View style={styles.userRankContainer}>
          <Text style={styles.rank}>{userRankPlace}</Text>
          <Text style={styles.username}>You</Text>
          <Text style={styles.points}>{userPoints}</Text>
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
    color: "green",
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
  firstPlaceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  firstPlacePoints: {
    fontSize: 20,
    color: "green",
    fontWeight: "bold",
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
    marginBottom: 15,
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
