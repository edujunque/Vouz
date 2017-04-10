import React, { Component } from 'react';
import { StyleSheet,  Text,  View, Button, TouchableHighlight, ScrollView, Select, Option, Navigator, TextInput } from 'react-native';
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
                  <View style={{paddingBottom: 30}}>
                    <View style={styles.formCampos}>
                      <TextInput
                      style={styles.formText}
                      underlineColorAndroid='rgba(0,0,0,0)'
                      placeholder="Nome"
                      placeholderTextColor='white'
                      onChangeText={(name) => this.setState({name})}
                      value={this.state.name}
                    />
                    </View>
                  <View>
                    <TouchableHighlight style={styles.btnCriarConta}
                        onPress={() => {this.saveUserData(); }}
                        underlayColor={'#bd0f55'}
                        activeOpacity={0.5}
                        >
                        <Text style={styles.txtCriarConta}>CRIAR CONTA</Text>
                    </TouchableHighlight>
                  </View>
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
  viewFaleConosco: {
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
  },
btnFaleconosco: {
  backgroundColor: 'transparent',
  width: 225,
  alignItems: 'center',
  padding: 8,
  borderRadius: 30,
  borderWidth: 1,
  borderColor: '#e5e5e5'
},
txtFaleConosco: {
  color: '#e5e5e5',
  fontWeight: 'bold',
  fontSize: 14
}
});
