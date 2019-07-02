import React, { Component } from "react";
import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	Alert,
	alert,
	Dimensions
} from "react-native";
import { AsyncStorage } from "react-native";

const { height, width } = Dimensions.get("window");

class Main extends Component {
	static navigationOptions = {
		header: null
	};
	state = { name: "", password: "" };
	onPress = () => {
		this._storeData();
		this.props.navigation.navigate("Chat", {
			name: this.state.name,
			password: this.state.password
		});
	};
	onChangeText = name => this.setState({ name });
	onChangeText1 = password => this.setState({ password });
	_storeData = async () => {
		try {
			await AsyncStorage.setItem(
				"@Credentials:Username",
				this.state.name
			);
			await AsyncStorage.setItem(
				"@Credentials:password",
				this.state.password
			);
		} catch (error) {}
	};

	_retrieveData = async () => {
		try {
			let name = await AsyncStorage.getItem("@Credentials:Username");
			let password = await AsyncStorage.getItem("@Credentials:password");
			if (!name) {
				name = "";
			}
			if (!password) {
				password = "";
			}

			this.setState({
				name,
				password
			});
		} catch (error) {
			Alert.alert("Error");
		}
	};

	componentWillMount() {
		this._retrieveData();
	}

	render() {
		return (
			<View style={styles.mainContainer}>
				<View style={styles.header}>
					<Text style={styles.headerText}>CHAT</Text>
				</View>
				<View style={{ marginTop: height * 0.3 }}>
					<View style={styles.box}>
						<Text style={styles.title}>Username:</Text>
						<TextInput
							onChangeText={this.onChangeText}
							style={styles.textInput}
							value={this.state.name}
						/>
					</View>
					<View style={styles.box}>
						<Text style={styles.title}>Password:</Text>
						<TextInput
							onChangeText={this.onChangeText1}
							style={styles.textInput}
							value={this.state.password}
						/>
					</View>
				</View>
				<TouchableOpacity onPress={this.onPress} style={styles.button}>
					<Text style={styles.buttonText}>Login</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	mainContainer: {
		alignItems: "center",
		backgroundColor: "white",
		flex: 1
	},
	header: {
		marginTop:height*0.1,
		height: height * 0.07,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		width: width,
		backgroundColor: "#5458F7",
	},
	headerText: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white"
	},
	box: {
		height: height * 0.1,
		width: width * 0.8,
		borderRadius: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 10,
		backgroundColor: "#F4F5F6",
		marginBottom: 30
	},

	title: {
		fontSize: 20,
		fontWeight: "bold",
		paddingRight: 5
	},
	textInput: {
		height: height * 0.1,
		width: width * 0.5,
		borderRadius: 10,
		fontSize: 20
	},
	button: {
		marginTop: 80,
		height: height * 0.07,
		width: width * 0.5,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#5458F7"
	},
	buttonText: {
		fontSize: 20,
		color: "#FFFFFF",
		fontWeight: "bold"
	}
});
export default Main;
