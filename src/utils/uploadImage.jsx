import storage from "@react-native-firebase/storage";
import { launchImageLibrary } from "react-native-image-picker";
import { getAuth } from "@react-native-firebase/auth";

export const uploadImageAndGetURL = async (folderName = "uploads") => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const result = await launchImageLibrary({ mediaType: "photo" });

    if (result.didCancel || !result.assets || result.assets.length === 0) {
      console.log("Image selection cancelled");
      return null;
    }

    const image = result.assets[0];
    const { uri, fileName } = image;
    const imageName = fileName || `${Date.now()}.jpg`;

    const reference = storage().ref(`${folderName}/${imageName}`);
    await reference.putFile(uri);

    const url = await reference.getDownloadURL();
    
    //console.log("✅ Uploaded:", url);
    return url;
  } catch (error) {
    console.error("❌ Upload error:", error);
    return null;
  }
};
//method:https://rnfirebase.io/storage/usage