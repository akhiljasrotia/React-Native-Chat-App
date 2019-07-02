import React, { Component } from "react";
import {
	View,
	StyleSheet,
	alert,
	Alert,
	Button,
	Text,
	Image,
	ActivityIndicator,
	TouchableOpacity,
	Platform,
	PermissionsAndroid,
	Dimensions
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import Fire from "../firebase/Fire";
import ImagePicker from "react-native-image-crop-picker";
import Icon from "react-native-vector-icons/Entypo";
import Icon1 from "react-native-vector-icons/Entypo";
// import Geolocation from "react-native-geolocation-service";
// import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
// import { Marker } from "react-native-maps";

const { height, width } = Dimensions.get("window");

// let region = {
//   latitude: 0,
//   longitude: 0,
//   latitudeDelta: 0,
//   longitudeDelta: 0
// };

type Props = {
	name?: string,
	password?: string
};

class LogoTitle extends React.Component {
	// getLoc() {
	//   if (Platform.OS === "android") {
	//     async function requestLocationPermission() {
	//       try {
	//         const granted = await PermissionsAndroid.request(
	//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
	//           {
	//             title: "Location Access Required",
	//             message: "This App needs to Access your location"
	//           }
	//         );
	//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
	//           that.callLocation(that);
	//         } else {
	//           alert("Permission Denied");
	//         }
	//       } catch (err) {
	//         alert("err", err);
	//         console.warn(err);
	//       }
	//     }

	//     requestLocationPermission();
	//   }
	//   Geolocation.getCurrentPosition(
	//     position => {
	//       region = {
	//         latitude: position.coords.latitude,
	//         longitude: position.coords.longitude,
	//         latitudeDelta: 0.0922,
	//         longitudeDelta: 0.0421
	//       };
	//       Fire.shared.currentLoc(region);
	//     },
	//     error => {

	//     },
	//     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
	//   );
	// }

	render() {
		return (
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					flex: 1,
					justifyContent: "flex-end"
				}}
			>
				<TouchableOpacity
					onPress={() =>
						ImagePicker.openCamera({
							width: 300,
							height: 400
						}).then(image => {
							const source2 = image.path;
							Fire.shared.selectedImage(source2);
						})
					}
					style={{ marginRight: 20 }}
				>
					<Icon size={20} color="black" name="camera" />
				</TouchableOpacity>

				{/*<TouchableOpacity onPress={() => this.getLoc()}>
          <Icon1 size={20} color="black" name="location-pin" />
        </TouchableOpacity>*/}
			</View>
		);
	}
}

class Chat extends Component {
	static navigationOptions = {
		headerTitle: <LogoTitle />
	};

	state = {
		messages: [],
		imgSource: {
			uri: ""
		},
		location: {
			latitude: 0,
			longitude: 0,
			latitudeDelta: 0,
			longitudeDelta: 0
		},
		show: true
	};
	get user() {
		return {
			name: this.props.navigation.state.params.name,
			password: this.props.navigation.state.params.password,
			_id: Fire.shared.uid
		};
	}

	onPress = () => {
		ImagePicker.openPicker({
			width: 300,
			height: 400
		}).then(image => {
			const source1 = image.path;
			Fire.shared.selectedImage(source1);
		});
	};

	loading = () => {
		return (
			<View style={{ flex: 1, justifyContent: "center" }}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	};

	//   onRegionChange = (region) => {
	//   this.setState({show:false});
	//   this.setState({ region });
	// }

	// customView = ({ currentMessage }) => {
	//   if (currentMessage.location) {
	//     return (
	//       <TouchableOpacity onPress = {()=> this.props.navigation.navigate('ChatMaps')}>
	//           <MapView
	//             style={{ width: 250, height: 200, borderRadius: 13 }}
	//             region={this.state.show?currentMessage.location:this.state.region}
	//             provider={PROVIDER_GOOGLE}
	//             onRegionChange={this.onRegionChange}
	//             loc={currentMessage.location}
	//             onPress = {()=> this.props.navigation.navigate('ChatMaps',  { loc: currentMessage.location })}
	//           >
	//             <Marker title="Current Location" coordinate={currentMessage.location}>
	//               <Icon1 size={25} color="red" name="location-pin" />
	//             </Marker>
	//           </MapView>
	//       </TouchableOpacity>
	//     );
	//   }
	//   return;
	// };

	render() {
		if (!Fire.shared.uid) {
			return this.loading();
		}
		return (
			<GiftedChat
				messages={this.state.messages}
				onSend={Fire.shared.send}
				user={this.user}
				onPressActionButton={this.onPress}
				renderLoading={this.loading}
			/>
		);
	}

	onCallBack = () => {
		Fire.shared.on(message =>
			this.setState(previousState => ({
				messages: GiftedChat.append(previousState.messages, message)
			}))
		);
	};

	componentWillMount() {
		Fire.shared.observeAuth(
			this.props.navigation.state.params.name,
			this.props.navigation.state.params.password,
			this.onCallBack
		);
	}
	componentWillUnmount() {
		Fire.shared.off();
	}
}

const styles = StyleSheet.create({});

export default Chat;
