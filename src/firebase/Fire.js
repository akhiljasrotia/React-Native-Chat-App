import firebase from "firebase";
import { user } from "../components/Chat";
import {
  View,
  StyleSheet,
  alert,
  Alert,
  Button,
  Text,
  Platform,
  Image
} from "react-native";
import RNFetchBlob from "react-native-fetch-blob";

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
const Fetch = RNFetchBlob.polyfill.Fetch;
// replace built-in fetch
window.fetch = new Fetch({
  // enable this option so that the response data conversion handled automatically
  auto: true,
  // when receiving response data, the module will match its Content-Type header
  // with strings in this array. If it contains any one of string in this array,
  // the response body will be considered as binary data and the data will be stored
  // in file system instead of in memory.
  // By default, it only store response data to file system when Content-Type
  // contains string `application/octet`.
  binaryContentTypes: ["image/", "video/", "audio/", "foo/"]
}).build();

class Fire {
  constructor() {
    this.init();
    this.observeAuth = this.observeAuth.bind(this);
  }

  uploadImage = (uri, mime = "application/octet-stream") => {
    return new Promise((resolve, reject) => {
      //uid Generator
      function guid() {
        function _p8(s) {
          var p = (Math.random().toString(16) + "000000000").substr(2, 8);
          return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
      }
      const name = guid();
      const uploadUri =
        Platform.OS === "ios" ? uri.replace("file://", "") : uri;
      let uploadBlob = null;
      const imageRef = firebase
        .storage()
        .ref("Images")
        .child(name);
      fs.readFile(uploadUri, "base64")
        .then(data => {
          return Blob.build(data, { type: `${mime};BASE64` });
        })
        .then(blob => {
          uploadBlob = blob;
          return imageRef.put(blob, { contentType: mime });
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL();
        })
        .then(url => {
          //Alert.alert(url);
          resolve(url);
        })
        .catch(error => {
          Alert.alert("_____" + error);
          reject(error);
        });
    });
  };

  init = () =>
    firebase.initializeApp({
      apiKey: "AIzaSyDMGW4BBtzjPHQl3DEo7hGptSubsjZP8BY",
      authDomain: "chat-application-d1bfe.firebaseapp.com",
      databaseURL: "https://chat-application-d1bfe.firebaseio.com",
      projectId: "chat-application-d1bfe",
      storageBucket: "chat-application-d1bfe.appspot.com",
      messagingSenderId: "393871485515",
     // appId: "1:393871485515:web:090c3a35072c10a2"
    });

  observeAuth = (userName, password, cb) => {
    //console.log(userName, password);
    //Alert.alert(userName,password);
    firebase
      .auth()
      .signInWithEmailAndPassword(userName, password)
      .then(() => {
        //Alert.alert("Logged in" + this.uid);
        cb();
      })
      .catch(function(error) {
        var errorCode = error.code;
        Alert.alert(error + "");
        //console.log(errorCode);
      });
    // if (errorCode === "auth/user-not-found") {
    //   firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
    //       }
    //   });
  };

  selectedImage = image => {
    //console.log("Image is ",image);
    let user = {
      _id: this.uid
    };
    this.uploadImage(image)
      .then(url => {
        //Alert.alert("SUCCESS")
        const message = {
          image: url,
          messageType: "image",
          user,
          timestamp: this.timestamp
        };
        this.append(message);
      })
      .catch(err => {
        Alert.alert("ERROR" + err);
      });

    //console.log(message);
  };

  // currentLoc = region => {
  //   let user = {
  //     _id: this.uid
  //   };

  //   const message = {
  //     location:region,
  //     messageType: "location",
  //     user,
  //     timestamp: this.timestamp
  //   };
  //   this.append(message);
  // };

  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref("messages");
  }

  parse = snapshot => {
    const { timestamp: numberStamp, text, user, image } = snapshot.val();
    const { key: _id } = snapshot;
    const timestamp = new Date(numberStamp);
    const message = {
      _id,
      timestamp,
      text,
      user,
      image
      //location
    };
    return message;
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on("child_added", snapshot => callback(this.parse(snapshot)));

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // send the message to the Backend
  send = messages => {
    //console.log(messages);
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      const message = {
        text,
        user,
        timestamp: this.timestamp
      };
      //console.log(message);
      this.append(message);
    }
  };

  append = message => this.ref.push(message);

  // close the connection to the Backend
  off() {
    this.ref.off();
  }
}

Fire.shared = new Fire();
export default Fire;
