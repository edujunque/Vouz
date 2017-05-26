import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableHighlight, Button, TextInput, ScrollView, Linking } from 'react-native';
import { Actions } from 'react-native-router-flux';
import LoginFacebook from './CenaLoginFacebook'
import CriarConta from './CenaCriarConta'
import {firebaseRef, auth} from '../FirebaseConfig'
import SplashScreen from 'react-native-splash-screen'
import AnalyticsGoogle from '../AnalyticsGoogle'

const imgLogo = require('../imgs/logo.png');
const imgBackground = require('../imgs/bg.jpg');

export default class CenaLogin extends Component {

   verificarUsuarioLogado(){
     const usuarioAtual = auth.currentUser;
      auth.onAuthStateChanged(
        (usuarioAtual) => {
          if( usuarioAtual ){
          // Analytics.setUserId('11111');
          // Analytics.setUserProperty('propertyName', 'propertyValue');

          // Analytics.logEvent('view_item', {
          //   'item_id': 'login'
          // });
          //Verifica se o usuario que esta logado pode ver a timeline ou deve ser redirecionado para a tela de "Lista VIP"
            var refData = firebaseRef.child('user/'+ usuarioAtual.uid);
            refData.once('value').then(function(snapshot) {
              // alert(snapshot.val().listaVIP);
              if (snapshot.val().listaVIP) {
                //Direciona para a tela onde irá digitar o codigo do promoter para ser direcionado para o evento especifico
                Actions.escolhaPromoter();
              } else {
                Actions.timeline();
              }
            });
          } else {
            Actions.entrarJa();
          }
        }
      );
  } 

    componentDidMount() {
        SplashScreen.hide();
        Linking.getInitialURL().then((url) => {
          if (url) {
            console.log('Initial url is: ' + url);
          }
        }).catch(err => console.error('An error occurred', err));        
        AnalyticsGoogle.trackScreenView('Login');
    }

 render() {
    return (
      <Image style={{flex: 1, height: null, width: null, resizeMode: 'cover'}} source= {imgBackground}>
      <ScrollView style={styles.principal}>
      <View style={{alignItems:'center', justifyContent:'center', flex: 3, paddingTop: 40, paddingBottom: 40}}>
        <Image style={{height: 40, width: 120}} source={imgLogo} />
      </View>
      
        <View style={styles.criarConta}>
         <CriarConta />
        </View>
        <View style={{flex: 1, marginTop: 10, marginBottom: 10, alignItems: 'center',}}>
          <LoginFacebook />  
        </View>
        <View style={styles.login}>
        <Text style={{color:'gray', marginBottom: 10, fontSize: 12}}>Já é cadastrado?</Text>
          <TouchableHighlight style={styles.btnLogin}
              onPress={() => { this.verificarUsuarioLogado(); }}
              underlayColor={'#1a1a1a'}
              activeOpacity={0.5}
              >
              <Text style={styles.txtEntreJa}>ENTRE JÁ</Text>
          </TouchableHighlight>
        </View>
        </ScrollView>
         </Image>
    );
  }
}

const styles = StyleSheet.create({
  principal: {
    backgroundColor: 'transparent',
    flex: 1
  },
  login:{
    alignItems: 'center',
    justifyContent: 'center',
    flex: 3,
    backgroundColor: 'transparent'
  },
 criarConta:{
  flex: 6,
  paddingBottom: 10
},
txtEntreJa: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13
},
formCampos: {
  flexDirection: 'row',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderColor: 'gray'
},
 formText: {
  color: 'white',
  height: 40, 
  width: 300,
  paddingLeft: 10,
 },
  btnLogin: {
  backgroundColor: 'transparent',
  width: 225,
  alignItems: 'center',
  padding: 10,
  borderRadius: 30,
  borderWidth: 1,
  borderColor: 'white'
}
});
