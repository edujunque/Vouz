import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableHighlight, Button, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import {firebaseRef, auth} from '../FirebaseConfig'

const imgName = require('../imgs/ico-men.png');
const imgEmail = require('../imgs/ico-mail.png');
const imgCPF = require('../imgs/ico-cpf.png');
const imgPassword = require('../imgs/ico-pass.png');
const imgLogo = require('../imgs/logo.png');
const imgBackground = require('../imgs/bg.jpg');

export default class CenaLogin extends Component {

  constructor(props) {
    super(props);
    this.state = {name : ''}
    this.state = {email : ''}
    this.state = {cpf : ''}
    this.state = {pass : ''}
    this.state = {confPass : ''}
  }

  passwordValidate(){
    if (this.state.pass !== this.state.confPass){
      return false;
    } else {
      return true;
    }
  }

  saveUserData(){
    if(this.passwordValidate()){
        //console.log(data);
        var email = this.state.email;
        var senha = this.state.pass;
        // console.log(email, '', senha);
        //var usuario = auth.auth();
       //Cria usuario na base padrão de autenticação por email do Firebase  (usado para login e afins)
         auth.createUserWithEmailAndPassword(email, senha).then(() => {
          // Update successful.
          //cria usuario na estrutura de relação entre informações da base. (evento X curtidas e evento X Checkin)
           const usuarioAtual = auth.currentUser;
           console.log(usuarioAtual.uid);
           firebaseRef.child('user/'+ usuarioAtual.uid).set({
              facebookID : '',
              gender : '',
              name : this.state.name,
              linkFB : ''
           });
           // firebase.database().ref('user/'+ usuarioAtual.uid + '/eventosCheckin').push().set({
           //    dtCkeckin : String(Date.now),
           //    evID : '1'
           // });
           // firebase.database().ref('user/'+ usuarioAtual.uid + '/eventosCurtidos').push().set({
           //    evID : '1'
           // });
           usuarioAtual.updateProfile({
            photoURL: ''
            }).then(function() {
              // Update successful.
            }, function(error) {
              // An error happened.
            });

            //Direciona o usuario para a area logada.
            Actions.timeline();
          }, function(error) {
          // An error happened.
        });
    }
    else {
      alert('As senhas devem ser iguais!');
    }
  }

 render() {
    return (
      
        <View style={styles.criarConta}>
          <View style={{paddingBottom: 30}}>
            <View style={styles.formCampos}>
              <Image style={{width: 15, height: 17, marginLeft: 5}} source={imgName}
              />
              <TextInput
              style={styles.formText}
              underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="Nome"
              placeholderTextColor='white'
              onChangeText={(name) => this.setState({name})}
              value={this.state.name}
            />
            </View>
             <View style={styles.formCampos}>
              <Image style={{width: 19, height: 15, marginLeft: 5}} source={imgEmail}
              />
              <TextInput
             style={styles.formText}
             underlineColorAndroid='rgba(0,0,0,0)'
              placeholder="E-mail"
              placeholderTextColor='white'
              onChangeText={(email) => this.setState({email})}
              value={this.state.email}
            />
            </View>
            <View style={styles.formCampos}>
              <Image style={{width: 14, height: 15, marginLeft: 5}} source={imgPassword}
              />
              <TextInput
             style={styles.formText}
             underlineColorAndroid='rgba(0,0,0,0)'
             secureTextEntry = {true}
              placeholder="Senha"
              placeholderTextColor='white'
              onChangeText={(pass) => this.setState({pass})}
              value={this.state.pass}
            />
            </View>
             <View style={styles.formCampos}>
              <Image style={{width: 14, height: 15, marginLeft: 5}} source={imgPassword}
              />
              <TextInput
              style={styles.formText}
              underlineColorAndroid='rgba(0,0,0,0)'
              secureTextEntry = {true}
              placeholder="Confirme a Senha"
              placeholderTextColor='white'
              onChangeText={(confPass) => this.setState({confPass})}
            />
            </View>
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
      
    );
  }
}

const styles = StyleSheet.create({
 criarConta:{
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  backgroundColor: 'transparent',
  justifyContent: 'flex-end',
},
 btnCriarConta: {
  backgroundColor: '#EE2B7A',
  width: 300,
  alignItems: 'center',
  padding: 13,
  borderRadius: 30,
},
  txtCriarConta: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17
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
 }
});
