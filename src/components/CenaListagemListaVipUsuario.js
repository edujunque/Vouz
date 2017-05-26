import React, { Component } from 'react';
import { StyleSheet,  Text,  View, TouchableHighlight, ScrollView, Select, Option, 
         TouchableOpacity, Clipboard, ToastAndroid, AlertIOS, Platform
       } from 'react-native';
import {firebaseRef, auth} from '../FirebaseConfig'
import { Image,  ListView,  Tile,  Title,  Subtitle,  Screen} from '@shoutem/ui';
import { Actions } from 'react-native-router-flux';
import Rodape from './Rodape'
import AnalyticsGoogle from '../AnalyticsGoogle'

//import { NavigationBar } from '@shoutem/ui/navigation';
const imgBackground = require('../imgs/fdo_user.jpg');
const imgMen = require('../imgs/men-grey.png');
const imgWomen = require('../imgs/woman-grey.png');

export default class CenaEventoDetalhes extends Component {
  constructor(props){
    super(props);
    //this.state = { evento : this.getEventos().filter((evento) => evento.evID == this.props.evID)};
    this.state = { codLista : []};
    
  };


  listarDados(){
      const usuarioAtual = auth.currentUser;
      var refData = firebaseRef.child('user/'+ usuarioAtual.uid);
      // refData.once("value").then((snapshot) => {
      //   // alert(snapshot.val().name);
      //   //Verifica se o usuario tem algum codigo promocional
      //   if(snapshot.child('/codPromo' + '/evID' ).exists()){
      //   	 this.setState({ codPromo: snapshot.val().codPromo.evID});
      //   }else {
      //   	//Não tem codigo

      //   }
       

      // });

      refData.on("value", (snapshot) => {
        // alert(snapshot.val().name);
        //Verifica se o usuario tem algum codigo promocional
        if(snapshot.child('/codListaVip' + '/evID' ).exists()){
        	 this.setState({ codLista: snapshot.val().codListaVip.evID});
        }else {
        	//Não tem codigo

        }
       

      });      

   // var eventos = firebaseRef.child('eventos').child(this.props.evID);
   // eventos.on('value', (snapshot) => { 
   //    var evento = snapshot.val();
   //    this.setState({ evento : evento});
   //  });
  }

  // getEventos() {
  //   return require('../../assets/agendabox-2a212-export.json');
  // }

  componentWillMount() {
    this.listarDados();
  }

componentDidMount() {
  AnalyticsGoogle.trackScreenView('Visualizar Listagem VIPS usuario');
}
  // defines the UI of each row in the list
  renderRowCodListaVIP(codLista) {
    var nomeEvento = '';
  	//obtem os dados do evento em questão
      var refDataEvento = firebaseRef.child('eventos/'+ codLista.evID);
      refDataEvento.on('value',(snapshot) => {
        nomeEvento = snapshot.val().evNome;
     });      
    return (
        <View>
          <View>
            <Text style={{color: '#EE2B7A'}}>{nomeEvento}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-start', marginBottom: 8, marginTop: 2}}>
            <View style={{flex: 2, flexDirection: 'row', borderRightWidth: 0.5, borderColor: '#737373'}}>
             <Text style={codLista.codUsado == false ? styles.txtCodLabelDisponivel : styles.txtCodLabelUsado}>CÓDIGO: </Text>
             <Text style={codLista.codUsado == false ? styles.txtCodDisponivel : styles.txtCodUsado}>{codLista.cod}</Text>
            </View>
            <View style={{flex: 2, flexDirection: 'row', paddingLeft: 10}}>
              <Text style={codLista.codUsado == false ? styles.txtStatusDisponivel : styles.txtStatusUsado}>{codLista.codUsado == false ? 'Disponível' : 'Usado'}</Text>
            </View>
           </View>
        </View>
     );
  }


  render() {
    return (

      <Image style={{flex: 1, height: null, width: null, resizeMode: 'cover'}} source= {imgBackground}>
      	<View style={{flex: 9, flexDirection: 'row',   backgroundColor: '#303030',  borderRadius: 10, margin: 10, marginTop: 70}}>
	      	<View style={{flex: 1, padding: 15}}>

	      		<ListView
	          data={this.state.codLista}
	          renderRow={codLista => this.renderRowCodListaVIP(codLista)}
	          />	
	      	</View>
      	</View>
      	<View style={{flex: 2}}></View>
      </Image>
     
    );
  }
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
 },
 txtStatusDisponivel:{
 	color: 'green', 
 	fontWeight: 'bold', 
 	paddingLeft: 10,

 }, 
 txtCodDisponivel:{
 	color: 'white', 
 	fontWeight: 'bold', 
 	paddingLeft: 10,
 }, 
 txtCodLabelDisponivel:{
 	color: 'white', 
 	fontWeight: 'bold', 
 	paddingLeft: 10,
 },
 txtStatusUsado:{
 	color: 'yellow', 
 	fontWeight: 'bold', 
 	paddingLeft: 10
 }, 
 txtCodUsado:{
 	color: 'white', 
 	fontWeight: 'bold', 
 	paddingLeft: 10,
 	textDecorationLine: 'line-through',
 	opacity: 0.5,
 }, 
 txtCodLabelUsado:{
 	color: 'white', 
 	fontWeight: 'bold', 
 	paddingLeft: 10,
 	textDecorationLine: 'line-through'
 }
});

