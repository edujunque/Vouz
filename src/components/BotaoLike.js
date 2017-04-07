import React, { Component } from 'react';
import { StyleSheet,  Text,  View, TouchableHighlight, Image } from 'react-native';
import {firebaseRef, auth} from '../FirebaseConfig'
import { Actions } from 'react-native-router-flux';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';

const imgLike = require('../imgs/ico_like.png');
const imgLiked = require('../imgs/ico_liked.png');

export default class botaoLike extends Component {
  constructor(props){
    super(props);
    this.state = { liked : false}
   }


   componentDidMount() {
    this.atualizaImgLiked();
   }

   atualizaImgLiked(){
      console.log('Atualiza imagem coraçao');
      const usuarioAtual = auth.currentUser;
      var refData = firebaseRef.child('user/'+ usuarioAtual.uid);
      refData.on('value',(snapshot) => {
        if (snapshot.child('/eventosCurtidos' + '/evID/' + this.props.evID).exists()){
          // console.log('existe o nó:');
          var evLiked = snapshot.child('/eventosCurtidos' + '/evID/' + this.props.evID).val();
          //Se o nó existe é ´porque o usuario já deu like nesse evento
          //Verifica qual é o estado atual do like
          // console.log(evLiked.liked);
          // alert(this.props.evID + ': ' + evLiked.liked)
          if(evLiked.liked){
            this.setState({liked: true});
            // console.log('existe o nó: setou estado true');
          }
          else{
            this.setState({liked: false});
            // console.log('existe o nó: setou estado false');
          }
          
        }
        else{
          this.setState({liked: false});
          // console.log('nao existe o nó: setou estado false');
        }
      }); 
   }


  actionLikeBtn(){
      var evCurtidas = 0;
      var refDataEvento = firebaseRef.child('eventos/'+ this.props.evID);
      refDataEvento.on('value',(snapshot) => {
        evCurtidas = snapshot.val().evCurtidas;
      }); 
    const usuarioAtual = auth.currentUser;
    if(this.state.liked){
      //atualiza usuario
      firebaseRef.child('user/'+ usuarioAtual.uid + '/eventosCurtidos/evID/' + this.props.evID).set({
        liked : false
      });
      //atualiza evento
      firebaseRef.child('eventos/'+ this.props.evID).update({
        evCurtidas : evCurtidas - 1
      });
    }
    else{
      //atualiza usuario
     firebaseRef.child('user/'+ usuarioAtual.uid + '/eventosCurtidos/evID/' + this.props.evID).set({
        liked : true
      });
     //atualiza evento
      firebaseRef.child('eventos/'+ this.props.evID).update({
        evCurtidas : evCurtidas + 1
      });
    }
  }
  

  render() {
    if(this.state.liked){
      return (
        <View style={{backgroundColor: 'transparent'}}>
          <TouchableHighlight 
             onPress={() => {this.actionLikeBtn()}}
             underlayColor={'#303030'}
             activeOpacity={0.5}
             >
             <Image source={imgLiked} style={{width: 35, height: 30, backgroundColor: 'transparent'}}/>
          </TouchableHighlight>
        </View>
      );
    }else{
      return (
        <View>
          <TouchableHighlight 
             onPress={() => {this.actionLikeBtn()}}
             underlayColor={'#303030'}
             activeOpacity={0.5}
             >
             <Image source={imgLike} style={{width: 35, height: 30, backgroundColor: 'transparent'}}/>
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
  borderWidth: 0.5,
  borderColor: 'red'
},
  txtCriarConta: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 17
}
});
