import React, { Component } from 'react';
import { StyleSheet,  Text,  View, Button, TouchableHighlight, ScrollView, Select, Option, Navigator } from 'react-native';
import {firebaseRef, auth} from '../FirebaseConfig'
import { Image,  ListView,  Tile,  Title,  Subtitle,  Screen} from '@shoutem/ui';
import { Actions } from 'react-native-router-flux';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import Rodape from './Rodape'
import Topo from './Topo'
import BotaoDeslogar from './BotaoDeslogar'

const imgBackground = require('../imgs/fdo_user.jpg');

export default class CenaEditarPerfil extends Component {
  constructor(props){
    super(props);
    this.state = {userName : ''};
   }

    componentWillMount() {
      const usuarioAtual = auth.currentUser;
      var refData = firebaseRef.child('user/'+ usuarioAtual.uid);
      refData.once("value").then((snapshot) => {
        // alert(snapshot.val().name);
        this.setState({ userName: snapshot.val().name});

      });

    }

  ReturnURL(){
      return auth.currentUser.photoURL == null ? 'https://s3.amazonaws.com/convertflow/uploads/4e5effb9-0ef6-4975-ad75-1fd20c051e78/NoPhoto_icon-user-default.png' :  auth.currentUser.photoURL;
  }

  render() {
    return (
      
        <View style={styles.container}>
          <View style={styles.topo}>
            <Topo />
          </View>
          <View style={styles.conteudo}>
           <Image style={{flex: 1, height: null, width: null, resizeMode: 'cover'}} source= {imgBackground}>
             <ScrollView>
               <View style={styles.viewUserData}>
                <Image source={{uri : this.ReturnURL()}} style={{width: 80, height: 80, borderRadius: 40, backgroundColor: 'transparent'}}/>
                <Text style={{color: 'white', fontSize: 16, paddingTop: 10}}>
                  {this.state.userName.toUpperCase()}
                </Text>
               </View>
               <View style={styles.viewLogout}>
                 <BotaoDeslogar />
               </View>
               <View style={styles.viewRights}>
                 <Text style={{color: 'white', fontSize: 12}}>
                   VERSÃO DO APLICATIVO 1.0
                 </Text>
                 <Text style={{color: 'white', fontSize: 12}}>
                   DESENVOLVIMENTO - NAVEGAR TI
                 </Text>
               </View>
             </ScrollView>
           </Image>
         </View>
         
          <View style={styles.rodape}>
            <Rodape />
          </View>
        </View>
    
    );
  }
}

const styles = StyleSheet.create({
  viewLogout: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    flex: 2
  },
  viewRights: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    flex: 2
  },
  viewUserData: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    flex: 2
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  topo: {
    flex: 1.5
  },
  conteudo:{
    flex: 10,
    // backgroundColor: '#1D1D1D'
  }
});
