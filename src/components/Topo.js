import React, { Component } from 'react';
import { View, Image, TouchableHighlight, StyleSheet } from 'react-native'; 
import {firebaseRef, auth} from '../FirebaseConfig'
import { Actions } from 'react-native-router-flux';

const imgLogo = require('../imgs/logo.png');
const imgTemp = require('../imgs/NoPhoto_icon-user-default.png');

export default class Topo extends Component {

  constructor(props) {
    super(props);
    this.state = {usuarioAtual : ''}
  }

  ReturnURL(){
    //console.log(auth.currentUser.photoURL == null ? 'http://icons.veryicon.com/ico/System/Icons8%20Metro%20Style/Users%20User.ico' :  auth.currentUser.photoURL);
        // auth.currentUser.then((usuarioAtual) => {
    //   this.setState = { usuarioAtual : usuarioAtual};
    //   console.log(this.state.usuarioAtual);
    //   return this.state.usuarioAtual.photoURL
    // });
    
    // auth.then((result) => {
    //   console.log(result.currentUser); // "Stuff worked!"
    // }, function(err) {
    //   console.log(err); // Error: "It broke"
    // });
    return auth.currentUser.photoURL == null ? 'https://firebasestorage.googleapis.com/v0/b/agendabox-72bc2.appspot.com/o/NoPhoto_icon-user-default.png?alt=media&token=a3c89af6-759b-47a7-86e0-f6cdb2474965' :  auth.currentUser.photoURL;
  }

    render() {
        // console.log(this.ReturnURL());
        return (
          <View style={styles.topo}>
            <View style={{flex: 10, alignItems: 'center', marginLeft: 30}}>
              <Image source={imgLogo} style={{width: 120, height: 40}}/>
            </View>
            <View style={{flex: 2}}>
              <TouchableHighlight 
                onPress={() => {Actions.editarPerfil()}}
                underlayColor={'#303030'}
                activeOpacity={0.5}
              >
                 <Image source={{uri : this.ReturnURL()}} style={{width: 40, height: 40, borderRadius: 30, backgroundColor: '#303030'}}/>
              </TouchableHighlight>
              
            </View>
          </View>
        );
    }
}

const styles = StyleSheet.create({
 topo: {
  backgroundColor: '#303030',
  alignItems:'center', 
  flex: 1.5,
  flexDirection: 'row',
 },
});