import React, { useState, useEffect } from "react";
import { View, Text, Image } from "react-native";
import styles from "./styles";
import { DataStore, Auth } from "aws-amplify";
import { User } from "../../src/models";
import { ActivityIndicator } from "react-native-paper";

const blue = "#3777f0";
const grey = "lightgrey";

const myID = "u1";

export default function Message({ message }: { message: any }) {
  const [user, setUser] = useState<User | undefined>();
  const [isMe, setIsMe] = useState<boolean>(false);

  useEffect(() => {
    DataStore.query(User, message.userID).then(setUser);
  }, []);

  useEffect(() => {
    const checkIfMe = async () => {
      if (!user) {
        return;
      }
      const authUser = await Auth.currentAuthenticatedUser();
      setIsMe(user.id === authUser.attributes.sub);
    };
    checkIfMe();
  }, [user]);

  if (!user) {
    return <ActivityIndicator></ActivityIndicator>;
  }

  return (
    <View style={styles.row}>
      {isMe == false && (
        <Image
          style={styles.image}
          source={{
            uri: "https://static-images.vnncdn.net/files/publish/ty-phu-elon-musk-vua-chi-44-ty-usd-de-mua-lai-twitter-9ff465ee3a124118b8fc9b8e8c9bcb4a.jpg",
          }}
        ></Image>
      )}

      <View
        style={[
          styles.container,
          isMe ? styles.rightContainer : styles.leftContainer,
        ]}
      >
        <Text style={{ color: isMe ? "white" : "black" }}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}
