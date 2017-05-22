import React, { Component } from 'react';
import { View, Image, Text, StyleSheet, TouchableHighlight, ScrollView, Button} from 'react-native';
import { Actions } from 'react-native-router-flux';
//import firebase from 'firebase';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import {firebaseRef, auth} from '../FirebaseConfig'
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';

const imgLogo = require('../imgs/logo.png');
const imgBackground = require('../imgs/bg.jpg');
var photo = '';

export default class LoginFacebook extends Component {
  constructor(props) {
    super(props);
    this.state = {user : ''};
    this.state = {eventos : ''}
  }
 
  AtualizaFotoUsuario(url, usuarioAtual) {
         axios.get(url)
        .then(function (response) {
          console.log(response.request.responseURL);
           usuarioAtual.updateProfile({
            photoURL: response.request.responseURL
            // photoURL: data.profile.picture.data.url
            // photoURL: '"http://graph.facebook.com/' + data.profile.id + '/picture?type=large&redirect=true&width=400&height=400'
            }).then(function() {
               console.log('s foi');
              // Update successful.
            }, function(error) {
               console.log('n foi');
              // An error happened.
            });            
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  saveFacebookData(data){
    var email = data.profile.email;
    var senha = data.profile.id;
    var photoUrl = '';

    
     console.log('fota: ',photo);
      // 'http://graph.facebook.com/' + data.profile.id + '/picture?type=large&redirect=true&width=400&height=400'
    //Verifica se o usuario já existe na base.
    auth.signInWithEmailAndPassword(email, senha).then(() => {
      //Direciona o usuario para a area logada e atualiza imagem do facebook.
      // this.getMoviesFromApiAsync('http://graph.facebook.com/' + data.profile.id + '/picture?type=large&redirect=true&width=400&height=400');
      
      const usuarioAtual = auth.currentUser;
      this.AtualizaFotoUsuario('http://graph.facebook.com/' + data.profile.id + '/picture?type=large&redirect=true&width=400&height=400', usuarioAtual);

      Actions.timeline();
      }, function(error) {
      // An error happened.
        //verifica se o erro é de usuario não encontrado.
        if(error.code == 'auth/user-not-found'){
           //Cria usuario na base padrão de autenticação por email do Firebase  (usado para login e afins)
           auth.createUserWithEmailAndPassword(email, senha).then(() => {
            // Update successful.
            //cria usuario na estrutura de relação entre informações da base. (evento X curtidas e evento X Checkin)
             const usuarioAtual = auth.currentUser;
             //console.log(data);
             firebaseRef.child('user/'+ usuarioAtual.uid).set({
                facebookID : data.profile.id,
                gender : data.profile.gender == null ? '' : data.profile.gender,
                name : data.profile.first_name + ' ' + data.profile.last_name,
                linkFB : data.profile.link,
                userID : usuarioAtual.uid,
                listaVIP : true
             });
           
                axios.get('http://graph.facebook.com/' + data.profile.id + '/picture?type=large&redirect=true&width=400&height=400')
                .then(function (response) {
                  console.log(response.request.responseURL);
                   usuarioAtual.updateProfile({
                    photoURL: response.request.responseURL
                    // photoURL: data.profile.picture.data.url
                    // photoURL: '"http://graph.facebook.com/' + data.profile.id + '/picture?type=large&redirect=true&width=400&height=400'
                    }).then(function() {
                       console.log('s foi');
                      // Update successful.
                    }, function(error) {
                       console.log('n foi');
                      // An error happened.
                    });            
                })
                .catch(function (error) {
                  console.log(error);
                });

              //Direciona o usuario para a area logada.
              Actions.timeline();
            }, function(error) {
            // An error happened.
          });
         //var usuario = auth.auth();
        }
        else{
          alert(error);
        }
    });

  }

  render() {
    return (
     <FBLogin style={{ borderRadius: 30,  width: 300}}
      ref={(fbLogin) => { this.fbLogin = fbLogin }}
      permissions={["email","user_friends"]}
      onLogin={(e) => {this.saveFacebookData(e)}}
      onLoginFound={function(e){console.log(e)}}
      onLoginNotFound={function(e){console.log(e)}}
      onLogout={function(e){console.log(e)}}
      onCancel={function(e){console.log(e)}}
      onPermissionsMissing={function(e){console.log(e)}}
    />

    );
  }
}
