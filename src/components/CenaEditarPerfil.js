import React, { Component } from 'react';
import { StyleSheet,  Text,  View, Button, TouchableHighlight, ScrollView, Select, Option, Navigator } from 'react-native';
import {firebaseRef, auth} from '../FirebaseConfig'
import { Image,  ListView,  Tile,  Title,  Subtitle,  Screen} from '@shoutem/ui';
import { Actions } from 'react-native-router-flux';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import Rodape from './Rodape'
import Topo from './Topo'
import BotaoDeslogar from './BotaoDeslogar'
import AnalyticsGoogle from '../AnalyticsGoogle'

const imgBackground = require('../imgs/fdo_user.jpg');

export default class CenaEditarPerfil extends Component {
  constructor(props){
    super(props);
    this.state = {userName: ''};
    this.state = {isAdmin: false};
    
   }

    componentWillMount() {
      const usuarioAtual = auth.currentUser;
      var refData = firebaseRef.child('user/'+ usuarioAtual.uid);
      refData.once("value").then((snapshot) => {
        // alert(snapshot.val().name);
        this.setState({ userName: snapshot.val().name});
        if (snapshot.child('/evID').exists()){
          //caso exista esse nó é um admin de evento
          this.setState({isAdmin : true});
          this.setState({evID : snapshot.val().evID});
       }else{
          this.setState({isAdmin : false});
        }        
      });
    }

  ReturnURL(){
      return auth.currentUser.photoURL == null ? 'https://firebasestorage.googleapis.com/v0/b/agendabox-72bc2.appspot.com/o/NoPhoto_icon-user-default.png?alt=media&token=a3c89af6-759b-47a7-86e0-f6cdb2474965' :  auth.currentUser.photoURL;
  }

  componentDidMount() {
    AnalyticsGoogle.trackScreenView('Editar Perfil');
  }

  returnBtnCupons(){
      if(this.state.isAdmin){
            return (
              <TouchableHighlight style={styles.btnCupons}
                onPress={() => {Actions.cuponsBar({evID: this.state.evID});}}
                underlayColor={'#303030'}
                activeOpacity={0.5}
                >
                <Text style={styles.txtFaleConosco}>VALIDAR CUPONS</Text>
              </TouchableHighlight>  
            );        
          }else{
             return (
              <TouchableHighlight style={styles.btnCupons}
                onPress={() => {Actions.cupons();}}
                underlayColor={'#303030'}
                activeOpacity={0.5}
                >
                <Text style={styles.txtFaleConosco}>MEUS CUPONS</Text>
              </TouchableHighlight>  
            );            
          }

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
                  {this.state.userName != undefined ? this.state.userName.toUpperCase() : ''}
                </Text>
               </View>
               <View style={styles.viewOpcoes}>
                  {this.returnBtnCupons()}
               </View>
               <View style={styles.viewLogout}>
                 <BotaoDeslogar />
               </View>
               <View style={styles.viewFaleConosco}>
                  <TouchableHighlight style={styles.btnFaleconosco}
                    onPress={() => {Actions.faleConosco();}}
                    underlayColor={'#303030'}
                    activeOpacity={0.5}
                    >
                    <Text style={styles.txtFaleConosco}>FALE CONOSCO</Text>
                  </TouchableHighlight>
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
  viewOpcoes: {
    marginTop: 30,
    alignItems: 'center',
    flex: 2
  },
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
btnCupons: {
  backgroundColor: 'transparent',
  width: 150,
  alignItems: 'center',
  padding: 8,
  borderRadius: 60,
  borderWidth: 1,
  borderColor: '#e5e5e5'
},
txtFaleConosco: {
  color: '#e5e5e5',
  fontWeight: 'bold',
  fontSize: 14
}
});
