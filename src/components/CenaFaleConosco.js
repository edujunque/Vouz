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
    this.state = {msg : ''};
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

 salvarMsg(){
  if (this.state.msg == null){
    alert('A mensagem é obrigatória!')
  } else {
       const usuarioAtual = auth.currentUser;
       //Data atual
       var dateNow = new Date();
       firebaseRef.child('faleConosco').push().set({
          userID : usuarioAtual.uid,
          fcMensagem : this.state.msg,
          fcData : String(dateNow)
       });
       this.setState({msg : ''});
       alert('Mensagem enviada com sucesso!');
    }
  }
  render() {
    return (
      
        <View style={styles.container}>

          <View style={styles.conteudo}>
            <Image style={{flex: 1, height: null, width: null, resizeMode: 'cover'}} source= {imgBackground}>
                <View style={{flex: 1, backgroundColor: 'transparent', alignItems: 'center', marginTop: 80}}>
                  <View>
                    <Text style={{color: '#e5e5e5', margin: 15, fontSize: 16, marginLeft: 20}}>
                      Hey {this.state.userName} gostaríamos de sua opinião sobre nosso aplicativo. Só com sua ajuda poderemos continuar melhorando:
                    </Text>
                  </View>
                  <View style={styles.formCampos}>
                    <TextInput
                    style={styles.formText}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Mensagem"
                    multiline = {true}
                    numberOfLines = {10}
                    placeholderTextColor='black'
                    onChangeText={(msg) => this.setState({msg})}
                    value={this.state.msg}
                    maxLength={500}
                  />
                  </View>
                <View>
                  <TouchableHighlight style={styles.btnFaleconosco}
                      onPress={() => {this.salvarMsg(); }}
                      underlayColor={'black'}
                      activeOpacity={0.5}
                      >
                      <Text style={styles.txtFaleConosco}>ENVIAR</Text>
                  </TouchableHighlight>
                </View>
              </View>
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
  viewFaleConosco: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    flex: 2
  },
  container: {
    flex: 1,
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
},
formText: {
  color: 'black',
  backgroundColor: '#e5e5e5',
  borderRadius: 15,
  marginBottom: 20,
  marginTop: 20,
  width: 325
},
formCampos: {
  backgroundColor: 'transparent',
},
});
