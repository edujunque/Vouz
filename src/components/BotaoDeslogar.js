import React, { Component } from 'react';
import { StyleSheet,  Text,  View, TouchableHighlight } from 'react-native';
import {firebaseRef, auth} from '../FirebaseConfig'
import { Actions } from 'react-native-router-flux';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';


export default class botaoDeslogar extends Component {
  constructor(props){
    super(props);
    this.state = { loginFB : ''}
   }

   componentDidMount() {
     const usuarioAtual = auth.currentUser;
      var userData = firebaseRef.child('user/'+ usuarioAtual.uid);
      userData.on('value', (snapshot) => { 
      var userDataSnap = snapshot.val();
        if(userDataSnap.facebookID != ''){
          this.setState({loginFB: true});
        } else {
          this.setState({loginFB: false});
        }
    });
   }

   deslogarUsuario(){
      auth.signOut().then(() => {
        Actions.login();
      });
   }

  render() {
    if(this.state.loginFB){
      return (
        <View>
           <FBLogin style={{ borderRadius: 30,  width: 225}}
              ref={(fbLogin) => { this.fbLogin = fbLogin }}
              permissions={["email","user_friends"]}
              onLogout={() => {this.deslogarUsuario()}}
          />    
        </View>
      );
    }else{
      return (
        <View>
           <TouchableHighlight style={styles.btnCriarConta}
              onPress={() => {this.deslogarUsuario(); }}
              underlayColor={'#303030'}
              activeOpacity={0.5}
              >
              <Text style={styles.txtCriarConta}>SAIR</Text>
           </TouchableHighlight>
        </View>
      );
    }
  
  }
}

const styles = StyleSheet.create({
  btnCriarConta: {
  backgroundColor: 'transparent',
  width: 300,
  alignItems: 'center',
  padding: 13,
  borderRadius: 30,
  borderWidth: 1,
  borderColor: 'red'
},
  txtCriarConta: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 17
}
});
