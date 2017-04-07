import firebase from 'firebase';
var firebaseConfig = {
 	apiKey: "AIzaSyAW6jwB5S1Frpxk8uinDlqfcxocGazaQTo",
    authDomain: "agendabox-72bc2.firebaseapp.com",
    databaseURL: "https://agendabox-72bc2.firebaseio.com",
    storageBucket: "agendabox-72bc2.appspot.com",
    messagingSenderId: "208881071830"
};

firebase.initializeApp(firebaseConfig);
export var auth = new firebase.auth();
export var firebaseRef = firebase.database().ref();
export default firebase;

module.exports.firebaseRef = firebaseRef; 
module.exports.auth = auth; 