import React, { Component } from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Login from "./components/Login";
import Chat from "./components/Chat";
import Splash from "./components/Splash";

const RootStack = createStackNavigator(
	{
		Login: Login,
		Chat: Chat,
		Splash: Splash
	},
	{
		initialRouteName: "Splash"
	}
);

export default createAppContainer(RootStack);
