import React, { Component } from 'react';
import { StyleSheet,  Text,  View, TouchableHighlight, ScrollView, Select, Option, 
         TouchableOpacity, Clipboard, ToastAndroid, AlertIOS, Platform
       } from 'react-native';
import {firebaseRef, auth} from '../FirebaseConfig'
import { Image,  ListView,  Tile,  Title,  Subtitle,  Screen} from '@shoutem/ui';
import { Actions } from 'react-native-router-flux';
import Rodape from './Rodape'

//import { NavigationBar } from '@shoutem/ui/navigation';
const imgBackground = require('../imgs/fdo_user.jpg');
const imgMen = require('../imgs/men-grey.png');
const imgWomen = require('../imgs/woman-grey.png');

export default class CenaEventoDetalhes extends Component {
  constructor(props){
    super(props);
    //this.state = { evento : this.getEventos().filter((evento) => evento.evID == this.props.evID)};
    this.state = { users : []};
    this.state = { codPromo : []};
    
  };

  componentWillMount() {
    this.listarDados();
  }

  listarDados(){
 
      var refData = firebaseRef.child('user/');
      refData.on("value", (snapshot) => {
        // alert(snapshot.val().name);
        var user = snapshot.val();
		this.setState({ users: user});
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
  	if(users.codPromo != undefined){
	 return(
	 	<View>
          <View>
            <Text style={{color: '#EE2B7A'}}>{users.name}</Text>
          </View>
          <View>
	 	      <ListView
			  data={users.codPromo.evID}
			  renderRow={codPromo => this.renderRowCodPromo(codPromo, users.userID)}
			  />         	
          </View>
	  	</View>
	 );
  	} else {
  		return (null);
  	}
  }  
  // defines the UI of each row in the list
  renderRowCodPromo(codPromo, userID) {
  	console.log(userID);
    return (
        <View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-start', marginBottom: 8, marginTop: 2}}>
            <View style={{flex: 2, flexDirection: 'row', borderRightWidth: 0.5, borderColor: '#737373'}}>
             <Text style={codPromo.codUsado == false ? styles.txtCodLabelDisponivel : styles.txtCodLabelUsado}>CÓDIGO: </Text>
             <Text style={codPromo.codUsado == false ? styles.txtCodDisponivel : styles.txtCodUsado}>{codPromo.cod}</Text>
            </View>
            <View style={{flex: 2, flexDirection: 'row', paddingLeft: 10}}>
              <TouchableHighlight style={codPromo.codUsado == false ? styles.btnUsarCodHabilitado : styles.btnUsarCodDesabilitado}
                  onPress={() => {this.alterarStatusCodPromo(userID, codPromo.evID); }}
                  underlayColor={'transparent'}
                  activeOpacity={0.5}
                  disabled={codPromo.codUsado}
                  >
				<Text style={codPromo.codUsado == false ? styles.txtStatusDisponivel : styles.txtStatusUsado}>{codPromo.codUsado == false ? 'Disponível' : 'Usado'}</Text>
              </TouchableHighlight>              
            </View>
          </View>
        </View>
     );  		

  }

	alterarStatusCodPromo(userID, evID){
      firebaseRef.child('user/'+ userID + '/codPromo/evID/' + evID).update({
        codUsado : true
      });
	}

  render() {
    return (
      <Image style={{flex: 1, height: null, width: null, resizeMode: 'cover'}} source= {imgBackground}>
      	<View style={{flex: 9, flexDirection: 'row',   backgroundColor: '#303030',  borderRadius: 10, margin: 10, marginTop: 70}}>
	      	<View style={{flex: 1, padding: 15}}>
	      		{this.populaListagem()}
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
 }
});

