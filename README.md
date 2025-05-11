# HabitFlow

HabitFlow is a React Native mobile application an app that will promote healthy habits and help support users in maintaining them. The main goal is to make habit building easier and more enjoyable. The app will be primarily targeting individuals who struggle with habit building or maintaining them. Our strategy to do this will be by offering users new challenges to try and providing opportunities to discuss these challenges with others. Traditional habit-tracking methods often feel repetitive and uninspiring, making it difficult to stay consistent. By constantly taking on a new challenge users will find it more engaging and enjoyable.

In addition to this we also implemented an experience point system that will reward the users for having a consistent habit. This system will provide users with tangible incentives, reinforcing their commitment to consistent habit building.What makes our app unique is that it encourages users to constantly try new challenges. Users will feel more connected to others on a similar journey, making it easier to stay committed and share experiences, tips, and encouragement, ultimately enhancing their chances of building and maintaining healthy habits.

---

## Description of the System

This app allows users to:

- Sign in or register with email and password
- Reset password
- Create new challenges
- Accept/delete solo or collaborative challenges
- Add/delete daily task
- Track and complete challenge progress
- Receive/end collaboration invites
- Track points and view points in leaderboards
- Post, like, and comment on challenges in the discussion board
- Change profile picture and view completed challenges on the profile page

---

## Technologies and Packages Used

The project is built with:

### Core Framework

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)

### Navigation

- `@react-navigation/native`
- `@react-navigation/bottom-tabs`
- `@react-navigation/drawer`
- `@react-navigation/native-stack`
- `expo-router`

### Firebase (via React Native Firebase)

- `@react-native-firebase/app`
- `@react-native-firebase/auth`
- `@react-native-firebase/firestore`
- `@react-native-firebase/storage`
- `@react-native-firebase/database`
- `@react-native-firebase/crashlytics`

### UI Components & Icons

- `@expo/vector-icons`
- `react-native-alert-notification`
- `react-native-snap-carousel`
- `@react-native-picker/picker`
- `react-native-gesture-handler`
- `expo-blur`
- `expo-constants`
- `expo-font`

### Utilities

- `@react-native-async-storage/async-storage`
- `@react-native-community/checkbox`
- `react-native-image-picker`
- `@google-cloud/pubsub`

---

## Dependencies

```json
"dependencies": {
  "@expo/vector-icons": "^14.0.2",
  "@firebase/firestore": "^4.7.11",
  "@google-cloud/pubsub": "^4.11.0",
  "@react-native-async-storage/async-storage": "^1.24.0",
  "@react-native-community/checkbox": "^0.5.17",
  "@react-native-firebase/app": "21.13.0",
  "@react-native-firebase/auth": "21.13.0",
  "@react-native-firebase/crashlytics": "^21.13.0",
  "@react-native-firebase/database": "^21.13.0",
  "@react-native-firebase/firestore": "^21.13.0",
  "@react-native-firebase/storage": "^21.13.0",
  "@react-native-picker/picker": "^2.11.0",
  "@react-navigation/bottom-tabs": "^7.2.0",
  "@react-navigation/drawer": "^7.3.3",
  "@react-navigation/native": "^7.1.0",
  "@react-navigation/native-stack": "^7.2.1",
  "expo": "~52.0.46",
  "expo-blur": "~14.0.3",
  "expo-build-properties": "^0.13.2",
  "expo-constants": "~17.0.7",
  "expo-dev-client": "~5.0.15",
  "expo-font": "~12.7.3",
  "react-native-alert-notification": "^2.4.0",
  "react-native-gesture-handler": "^2.15.2",
  "react-native-image-picker": "^5.1.1",
  "react-native-snap-carousel": "^3.9.1"
}
```

---

## How to Install and Run the System

1. **Clone the repository**

   ```bash
   git clone https://github.com/elin6776/HabitFlow.git
   cd HabitFlow
   ```

2. **Configure Firebase**

   1. Visit Firebase Console.
   2. Create a new Firebase project.
   3. Create an Android or iOS app to the Firebase project.
   4. Download the google-services.json or GoogleService-Info.plist file based on your platform and add it to your project.
   5. For Android: Place the google-services.json file in the /android/app/ directory.
   6. For iOS: Follow the instructions for iOS to add -GoogleService-Info.plist into the iOS project.
   7. Go to the Authentication tab in Firebase and enable Email/Password sign-in method.
   8. In the Firestore Database, create the necessary collections that the app will use.

3. **Install dependencies**

   ```bash
   npm install or yarn install
   ```

4. **Set up environment variables**  
   Create a `.env` file in the root directory and add your configurations.

   Example `.env` file:

   ```bash
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   REACT_APP_FIREBASE_APP_ID=your_app_id_here
   ```

5. **Run the app locally**

   ```bash
   npx expo start
   ```
