import React, { Component } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  OnPress,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";

const { height, width } = Dimensions.get("window");

var comp;

export default class Splash extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    header: null
  };

  componentWillMount() {
    comp = setTimeout(() => {
      this.props.navigation.navigate("Login");
    }, 2000);
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.container1}>
          <Text style={styles.splashScreenText}>Chat-app</Text>
        </View>
        <Text style={styles.signatureText}>Made by Akhil.J</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5458F7"
  },
  container1:{
    height:width*0.5,
    width:width*0.5,
    borderRadius:width*0.25,
    backgroundColor:'#5458F7',
    justifyContent:'center',
    alignItems:'center',
    borderWidth:3,
    borderColor:'#FFFFFF',
  },
  splashScreenText:{
    fontSize:30,
    color:'#FFFFFF',
    fontWeight:'bold',
  },
  signatureText:{
    fontSize:15,
    color:'#FFFFFF',
    position:'absolute',
    bottom:20,
  }
});
