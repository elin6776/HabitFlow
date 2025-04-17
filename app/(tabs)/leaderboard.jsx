import React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { fetchUserPoints } from "../../src/firebase/firebaseCrud";
import { getAuth } from "@react-native-firebase/auth";
import { Alert } from "react-native";

export default function LeaderBoard() {
  const [points, setPoints] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const loadData = async () => {
    setLoading(true);
    try {
      const fetchPoints = fetchUserPoints(setPoints);
      return fetchPoints;
    } catch (error) {
      console.error("Error loading points:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchPoints = async () => {
      await loadData();
    };

    fetchPoints();
  }, []);

  useEffect(() => {
    if (user) {
      const foundRank = points.find((item) => item.userId === user.uid);
      setUserRank(foundRank);
    }
  }, [points, user]);

  const getRankPlace = (rank) => {
    switch (rank) {
      case 1: {
        return "1st";
      }
      case 2: {
        return "2nd";
      }
      case 3: {
        return "3rd";
      }
      default:
        return `${rank}th`;
    }
  };
  const getProfilePic = (rank) => {
    switch (rank) {
      case 2:
        return require("../../assets/images/flower.jpeg");
      case 3:
        return require("../../assets/images/cloud.jpg");
      case 4:
        return require("../../assets/images/avocado.png");
      default:
        return require("../../assets/images/logo.png");
    }
  };
  const userRankPlace = userRank ? getRankPlace(userRank.rank) : "No Ranked";
  const userPoints = userRank ? userRank.points : 0;
  const rankDifference = () => {
    const rankAbove = points.find((item) => item.rank === userRank.rank - 1);
    if (rankAbove) {
      const pointDiff = rankAbove.points - userRank.points;
      Alert.alert(
        "Good Job",
        `You are ${pointDiff} points away from ${getRankPlace(
          rankAbove.rank
        )} place.`
      );
    } else {
      Alert.alert("You are the winner");
    }
  };

  return (
    <View style={styles.container}>
      {/* First Place Display */}
      <View style={styles.firstContainer}>
        <Text style={styles.winnerText}>Winner</Text>
        <View style={styles.avatarContainer}>
          <Image
            source={require("../../assets/images/disney.jpg")}
            style={styles.avatar}
          />
          <Image
            source={require("../../assets/images/ribbon.png")}
            style={styles.ribbon}
          />
        </View>
        <View style={styles.firstPlaceRow}>
          <Text style={[styles.firstPlacePoints, { marginRight: 40 }]}>
            {getRankPlace(points[0]?.rank)}
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
            <Image
              source={getProfilePic(item.rank)}
              style={[styles.profilePic, { marginLeft: 50 }]}
            />
            <Text style={[styles.username, { marginLeft: 60 }]}>
              {item.userName}
            </Text>
            <Text style={[styles.points, { marginLeft: "auto" }]}>
              {item.points}
            </Text>
          </View>
        )}
      />
      <TouchableOpacity onPress={rankDifference}>
        {user && (
          <View style={styles.userRankContainer}>
            <Text style={styles.rank}>{userRankPlace}</Text>
            <Text style={styles.username}>You</Text>
            <Text style={styles.points}>{userPoints}</Text>
          </View>
        )}
      </TouchableOpacity>
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
    marginTop: -15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  avatarContainer: {
    position: "relative",
  },
  ribbon: {
    width: 45,
    height: 45,
    position: "absolute",
    top: -5,
    right: -5,
    zIndex: 1,
    transform: [{ rotate: "30deg" }],
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
  profilePic: {
    width: 45,
    height: 45,
    borderRadius: 40,
    marginBottom: 10,
    alignItems: "flex-start",
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
    marginBottom: -10,
  },
  reloadButton: {
    alignItems: "flex-end",
    marginRight: 20,
  },
});
