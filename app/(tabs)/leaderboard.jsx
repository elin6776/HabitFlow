import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import {
  fetchUserPoints,
  displayWinner,
} from "../../src/firebase/firebaseCrud";
import { getAuth } from "@react-native-firebase/auth";
import { CountDown } from "react-native-countdown-component";
import { ActivityIndicator } from "react-native";

export default function LeaderBoard() {
  const [points, setPoints] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [winners, setWinners] = useState([]);
  const [winnerModal, setwinnerModal] = useState(false);
  const [winnerLoading, setWinnerLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchPoints = fetchUserPoints(setPoints); // Fetch user points from db
      return fetchPoints;
    } catch (error) {
      console.error("Error loading points:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch winner history
  const loadWinners = async () => {
    setWinnerLoading(true);
    try {
      const historicalWinners = await displayWinner();
      setWinners(historicalWinners);
    } catch (error) {
      console.error("Error loading winners:", error);
    } finally {
      setWinnerLoading(false);
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
  // Rank place title for each rank
  const getRankPlace = (rank) => {
    switch (rank) {
      case 1:
        return "1st";
      case 2:
        return "2nd";
      case 3:
        return "3rd";
      default:
        return `${rank}th`;
    }
  };
  // Get time to the first of each month
  const timerCountDown = () => {
    const now = new Date(); // Get current date and time
    const year = now.getFullYear(); // Get current year
    const nextMonth = now.getMonth() + 1; // Get current month
    const firstOfNextMonth = new Date(year, nextMonth, 1);
    const timeDiff = firstOfNextMonth - now;
    return Math.floor(timeDiff / 1000);
  };
  // Rank of current logged in user
  const userRankPlace = userRank ? getRankPlace(userRank.rank) : "No Ranked";
  const userPoints = userRank ? userRank.points : 0;
  // How many points away from the rank above
  const rankDifference = () => {
    const rankAbove = points.find((item) => item.rank === userRank.rank - 1);
    if (rankAbove) {
      const pointDiff = rankAbove.points - userRank.points;
      Alert.alert(
        "Keep Going",
        `You are ${pointDiff} points away from ${getRankPlace(
          rankAbove.rank
        )} place.`
      );
    } else {
      Alert.alert("You are the winner");
    }
  };
  const handleHistoryClick = () => {
    setShowHistory(true);
    loadWinners();
    setwinnerModal(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.reset}>
        <Text style={styles.resetText}>Points reset in: </Text>
        {/* Count down timer */}
        <CountDown
          id="countdown-next-month"
          until={timerCountDown()}
          size={10}
          digitStyle={{ backgroundColor: "#E2F0DA", borderWidth: 0 }}
          digitTxtStyle={{ color: "#6DA535", fontSize: 18, fontWeight: "500" }}
          separatorStyle={{ color: "#004526", fontSize: 18 }}
          timeToShow={["D", "H", "M", "S"]}
          timeLabels={{ d: "", h: "", m: "", s: "" }}
          showSeparator
        />
        <View style={{ marginLeft: 15 }}>
          <TouchableOpacity onPress={handleHistoryClick}>
            <Text style={styles.historyButton}>History</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <View style={styles.line} />
      </View>

      {/* Winner Display */}
      <View style={styles.firstContainer}>
        <Text style={styles.winnerText}>Winner</Text>
        <View style={styles.avatarContainer}>
          <Image
            source={
              points[0]?.photoUrl
                ? { uri: points[0]?.photoUrl }
                : require("../../assets/images/flower.jpeg")
            }
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
        data={points.slice(1)} // Igonore the first user
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{getRankPlace(item.rank)}</Text>
            <Image
              source={
                item.photoUrl
                  ? { uri: item.photoUrl }
                  : require("../../assets/images/flower.jpeg")
              }
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
      {/* Display the points difference  */}
      <TouchableOpacity onPress={rankDifference}>
        {user && (
          <View style={styles.userRankContainer}>
            <Text style={styles.rank}>{userRankPlace}</Text>
            <Text style={styles.username}>You</Text>
            <Text style={styles.points}>{userPoints}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal for Winner History */}
      <Modal
        visible={winnerModal}
        onRequestClose={() => setwinnerModal(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.historyContainer}>
          <View style={styles.historyContent}>
            <Text style={styles.historyTitle}>Winner History</Text>
            {/* Loading Inficator */}
            {winnerLoading ? (
              <ActivityIndicator
                size="large"
                color="#6DA535"
                style={{ marginTop: 20 }}
              />
            ) : (
              <FlatList
                data={winners}
                keyExtractor={(item) => item.doc?.id || item.id}
                renderItem={({ item }) => (
                  <View style={styles.winners}>
                    <Text style={styles.username}>
                      {/* Display the month and year */}
                      {item.month.toDate().toLocaleString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                    <Text style={[styles.rank, { marginLeft: 35 }]}>
                      {item.username}
                    </Text>
                    <Text style={[styles.points, { marginLeft: "auto" }]}>
                      {item.points}
                    </Text>
                    <View style={styles.orContainer}>
                      <View style={styles.line} />
                    </View>
                  </View>
                )}
              />
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setwinnerModal(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  resetText: {
    color: "#1A5E41",
    fontSize: 18,
    fontWeight: "500",
  },
  reset: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "center",
    marginHorizontal: -20,
    marginBottom: 8,
  },
  historyContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  historyContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    height: 350,
    width: 300,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#9CD46E",
    borderRadius: 5,
    alignItems: "center",
  },
  closeText: {
    color: "#FFF",
    fontSize: 18,
  },
  historyButton: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
  winners: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
});
