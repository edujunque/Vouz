import React, { Component } from 'react';
import { StyleSheet,  Text,  View, TouchableHighlight, ScrollView, Select, Option, 
         TouchableOpacity, Clipboard, ToastAndroid, AlertIOS, Platform, TextInput
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
var listagemUsuario = [];

export default class CenaEventoDetalhes extends Component {
  constructor(props){
    super(props);
    //this.state = { evento : this.getEventos().filter((evento) => evento.evID == this.props.evID)};
    this.state = { users : []};
    this.state = { codLista : []};
    this.state = { populaListagemDados : []}
  };

componentDidMount() {
	AnalyticsGoogle.trackScreenView('Visualizar Listagem VIPS admin');
}
  componentWillMount() {
    this.listarDados();
  }

  listarDados(){
      var refData = firebaseRef.child('user/');
      refData.on("value", (snapshot) => {
        // alert(snapshot.val().name);
        var user = snapshot.val();
		this.setState({ users: user});
		// console.log(snapshot.key);
      });  
  }

  populaListagem(){
  	if(this.state.users != undefined){
  	  	return(
	      <ListView
		  data={this.state.users}
		  renderRow={users => this.renderRowUsers(users)}
		  />
		);
  	} else {
  		<Text style={{color: 'white', fontSize: 30}}>Carregando...</Text>
  	}


  }

  // defines the UI of each row in the list
  renderRowUsers(users) {
    //verifica se o usuario tem codigo para o evento que o admin tem acesso evento.
    var insereUser = false;
    var refData = firebaseRef.child('user/'+ users.userID);
    //evID = 0 significa adesão ao APP
    refData.on('value',(snapshot) => {
      if (snapshot.child('/codListaVip' + '/evID/' + this.props.evID).exists()){
        insereUser = true;
      } else{
        insereUser = false;
      }
    });   
    if (insereUser){
      if(users.codListaVip != undefined){
        //verifica se o registro não esta duplicado
        var precisaInserir = true;
      for (var i = 0; i < listagemUsuario.length; i++) {
       if(listagemUsuario[i].userID == users.userID){
          precisaInserir = false;
       }
      }       
      if(precisaInserir){
        listagemUsuario.push(users)
      }             
       // console.log(listagemUsuario); 
     return(
      <View>
            <View>
              <Text style={{color: '#EE2B7A'}}>{users.name}</Text>
            </View>
            <View>
            <ListView
          data={users.codListaVip.evID}
          renderRow={codListaVip => this.renderRowCodLista(codListaVip, users.userID)}
          />          
            </View>
      </View>
     );
      } else {
        return (null);
      }      
    }else{
      return (null);
    }
  }  
  // defines the UI of each row in the list
  renderRowCodLista(codListaVip, userID) {
  	// console.log(userID);
      
    //verifica se a promocao que o usuario faz parte deve ser vista por esse admin
        if(codListaVip.evID == this.props.evID){
          return (
              <View>
                <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-start', marginBottom: 8, marginTop: 2}}>
                  <View style={{flex: 2, flexDirection: 'row', borderRightWidth: 0.5, borderColor: '#737373'}}>
                   <Text style={codListaVip.codUsado == false ? styles.txtCodLabelDisponivel : styles.txtCodLabelUsado}>CÓDIGO: </Text>
                   <Text style={codListaVip.codUsado == false ? styles.txtCodDisponivel : styles.txtCodUsado}>{codListaVip.cod}</Text>
                  </View>
                  <View style={{flex: 2, flexDirection: 'row', paddingLeft: 10}}>
                    <TouchableHighlight style={codListaVip.codUsado == false ? styles.btnUsarCodHabilitado : styles.btnUsarCodDesabilitado}
                        onPress={() => {this.alterarStatusCodLista(userID, codListaVip.evID); }}
                        underlayColor={'transparent'}
                        activeOpacity={0.5}
                        disabled={codListaVip.codUsado}
                        >
                    <Text style={codListaVip.codUsado == false ? styles.txtStatusDisponivel : styles.txtStatusUsado}>{codListaVip.codUsado == false ? 'Disponível' : 'Usado'}</Text>
                    </TouchableHighlight>              
                  </View>
                </View>
              </View>
           );         
        } else {
          return (<View></View>);
        }
	}

	alterarStatusCodLista(userID, evID){
      firebaseRef.child('user/'+ userID + '/codListaVip/evID/' + evID).update({
        codUsado : true
      });
	}
	atualizaListagem(txtFiltro){
		var listagemUser = [];
		for (var i = 0; i < listagemUsuario.length; i++) {
		    // Iterate over numeric indexes from 0 to 5, as everyone expects.
         if(listagemUsuario[i].name.toUpperCase().includes(txtFiltro.toUpperCase())){
            listagemUser.push(listagemUsuario[i]);
         }			    
		}			
        this.setState({ users : listagemUser});
	}

  render() {
    return (
      <Image style={{flex: 1, height: null, width: null, resizeMode: 'cover'}} source= {imgBackground}>
      	<View style={{marginTop: 70,  backgroundColor: 'black', borderRadius: 30}}>
	      <TextInput
		  style={styles.formText}
	      underlineColorAndroid='rgba(0,0,0,0)'
	      placeholder="Digite aqui o nome que deseja encontrar."
	      placeholderTextColor='white'
	      onChangeText={(txtFiltro) => this.atualizaListagem(txtFiltro)}
	      value={this.state.email}
	      />
      	</View>
      	<View style={{flex: 9, flexDirection: 'row',   backgroundColor: '#303030',  borderRadius: 10, margin: 10}}>
	      	<View style={{flex: 1, padding: 15}}>
	      		<ScrollView>
	      			{this.populaListagem()}
				</ScrollView>	      			
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
 },
 btnUsarCodHabilitado: {
 	opacity: 1
 },
 btnUsarCodDesabilitado: {
 	opacity: 0.5
 },
formText: {
  color: 'white',
  height: 40, 
  width: 300,
  paddingLeft: 10,
 },
});

