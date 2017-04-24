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
    this.state = { evento : []};
    this.state = {numEventoFotos : 0};
  };


  listarDados(){

   var eventos = firebaseRef.child('eventos').child(this.props.evID);
   eventos.on('value', (snapshot) => { 
      var evento = snapshot.val();
      this.setState({ evento : evento});
    });
  }

  // getEventos() {
  //   return require('../../assets/agendabox-2a212-export.json');
  // }

  componentWillMount() {
    this.listarDados();
  }

  // defines the UI of each row in the list
  renderRowPrecos(precos) {
    return (
        <View>
          <View>
            <Text style={{color: '#EE2B7A'}}>{precos.Tipo.toUpperCase()}</Text>
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent:'flex-start', marginBottom: 8, marginTop: 2}}>
            <View style={{flex: 2, flexDirection: 'row', borderRightWidth: 0.5, borderColor: '#737373'}}>
             <Image source={imgWomen} style={{backgroundColor: 'transparent', width: 15, height: 20}} />
             <Text style={{color: 'white', fontWeight: 'bold', paddingLeft: 10}}>R$ {precos.Valor}</Text>
            </View>
            <View style={{flex: 2, flexDirection: 'row', paddingLeft: 10}}>
              <Image source={imgMen} style={{backgroundColor: 'transparent', width: 12, height: 22}} />
              <Text style={{color: 'white', fontWeight: 'bold', paddingLeft: 10}}>R$ {precos.Valor}</Text>
            </View>
           </View>
        </View>
     );
  }


  render() {
    return (

      <View style={styles.container}>
        <Image style={{flex: 1, height: null, width: null, resizeMode: 'cover'}} source= {imgBackground}>
	        <View style={{flex: 1, backgroundColor: 'blue', marginTop: 80}}>
	              <View style={styles.tipoEntrada}>
	                <View>
	                   <View style={{margin: 10}}>
	                     <ListView
	                      data={this.state.evento.eventoPrecos}
	                      renderRow={precos => this.renderRowPrecos(precos)}
	                      />
	                    </View>
	                </View>
	              </View>	        
	        </View>
        </Image>				
      </View>
     
    );
  }
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
 },
 tipoEntrada: {
  backgroundColor: '#303030',
  borderRadius: 10,
  margin: 10,
  flex: 1
 },
});

