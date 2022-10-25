/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  ColorSchemeName,
  Text,
  View,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import NotFoundScreen from "../screens/NotFoundScreen";
import HomeScreen from "../screens/HomeScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import MessageScreen from "../screens/MessageScreen";
import Login from "../screens/LoginScreen";
import ConfirmEmailScreen from "../screens/ConfirmEmailScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import NewPasswordScreen from "../screens/NewPasswordScreen";
import InfoScreen from "../screens/InfoScreen";
import UsersScreen from "../screens/UsersScreen";
import { Feather } from "@expo/vector-icons";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { Auth, Hub } from "aws-amplify";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import { User } from "../src/models";
import { DataStore } from "aws-amplify";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const [user, setUser] = useState(undefined);
  const [dbUser, setdbUser] = useState<User>();

  // check login
  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      setUser(authUser);
      // get user from db
      const dbUser = await DataStore.query(User, authUser.attributes.sub); //query by id
      setdbUser(dbUser);
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const listener = (data) => {
      if (data.payload.event === "signIn" || data.payload.event === "signOut") {
        checkUser();
      }
    };

    Hub.listen("auth", listener);
    return () => Hub.remove("auth", listener);
  }, []);

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack.Navigator>
        {user ? (
          <Stack.Group>
            <Stack.Screen
              name="Home"
              component={BottomTabNavigator}
              options={{
                headerShown: false,
                headerBackVisible: false,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="UsersScreen"
              component={UsersScreen}
              options={{
                title: "Users",
              }}
            />
            <Stack.Screen
              name="ChatRoom"
              component={MessageScreen}
              options={{
                headerTitle: ChatRoomHeader,
                headerBackTitleVisible: false,
              }}
            />
          </Stack.Group>
        ) : (
          <Stack.Group>
            <Stack.Screen
              name="SignIn"
              component={Login}
              options={{
                title: "Login",
                headerShown: false,
                // // When logging out, a pop animation feels intuitive
                // // You can remove this if you want the default 'push' animation
                // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />

            <Stack.Screen
              name="NotFound"
              component={NotFoundScreen}
              options={{ title: "Oops!" }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ title: "Register" }}
            />
            <Stack.Screen
              name="ConfirmEmail"
              component={ConfirmEmailScreen}
              options={{ title: "Confirm Your Email" }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ title: "Forgot Password" }}
            />
            <Stack.Screen
              name="NewPassword"
              component={NewPasswordScreen}
              options={{ title: "New Password" }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

// function RootNavigator() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="Login"
//         component={Login}
//         options={{
//           headerShown: false,
//           // // When logging out, a pop animation feels intuitive
//           // // You can remove this if you want the default 'push' animation
//           // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
//         }}
//       />
//       <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           headerTitle: HomeHeader,
//           headerBackVisible: false,
//           headerShadowVisible: false,
//         }}
//       />
//       <Stack.Screen
//         name="ChatRoom"
//         component={MessageScreen}
//         options={{
//           headerTitle: ChatRoomHeader,
//           headerBackTitleVisible: false,
//         }}
//       />
//       <Stack.Screen
//         name="NotFound"
//         component={NotFoundScreen}
//         options={{ title: "Oops!" }}
//       />
//     </Stack.Navigator>
//   );
// }

const HomeHeader = (currentUser) => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width,
        padding: 10,
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri: "https://www.logiquetechno.com/wp-content/uploads/2020/11/retirer-photo-de-profil-facebook.png",
        }}
        style={{ width: 40, height: 40, borderRadius: 40 }}
      />
      <Text
        style={{
          flex: 1,
          textAlign: "left",
          color: "black",
          fontWeight: "bold",
          marginLeft: 15,
          fontSize: 20,
        }}
      >
        Chats
      </Text>
      <Pressable onPress={() => navigation.navigate("UsersScreen")}>
        <AntDesign
          name="contacts"
          size={24}
          color="blue"
          style={{ marginHorizontal: 5 }}
        />
      </Pressable>

      <AntDesign
        name="addusergroup"
        size={24}
        color="blue"
        style={{ marginHorizontal: 20 }}
      />
    </View>
  );
};

const ChatRoomHeader = (props) => {
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: width - 50,
        marginRight: 150,
        padding: 10,
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri: "https://static-images.vnncdn.net/files/publish/ty-phu-elon-musk-vua-chi-44-ty-usd-de-mua-lai-twitter-9ff465ee3a124118b8fc9b8e8c9bcb4a.jpg",
        }}
        style={{ width: 40, height: 40, borderRadius: 40 }}
      />
      <Text
        style={{
          flex: 1,
          color: "black",
          fontWeight: "bold",
          marginLeft: 20,
          fontSize: 20,
        }}
      >
        {props.children}
      </Text>
      <Ionicons
        name="call-outline"
        size={24}
        color="blue"
        style={{ marginHorizontal: 5 }}
      />
      {/* <AntDesign
        name="videocamera"
        size={24}
        color="blue"
        style={{ marginHorizontal: 5 }}
      /> */}
      <AntDesign
        name="infocirlceo"
        size={24}
        color="blue"
        style={{ marginHorizontal: 20 }}
      />
    </View>
  );
};

// /**
//  * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
//  * https://reactnavigation.org/docs/bottom-tab-navigator
//  */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator(currentUser) {
  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: "black",
      }}
    >
      <BottomTab.Screen
        name="Chats"
        component={HomeScreen}
        options={{
          headerTitle: HomeHeader,
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color="black"
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Info"
        component={InfoScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <AntDesign name="infocirlceo" size={24} color="black" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
