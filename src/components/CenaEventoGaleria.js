import React, { Component } from 'react';
import { StyleSheet,  Text,  View, Button, TouchableHighlight, ScrollView, Select, Option, Navigator } from 'react-native';
import {firebaseRef, auth} from '../FirebaseConfig'
import { Image,  ListView,  Tile,  Title,  Subtitle,  Screen} from '@shoutem/ui';
import { Actions } from 'react-native-router-flux';
import PhotoBrowser from 'react-native-photo-browser';
import Rodape from './Rodape'
import Topo from './Topo'
import Galeria from './Galeria'


export default class CenaEventoGaleria extends Component {
  constructor(props){
    super(props);
    //alert(this.props.evID);
    // this.state = { evento : this.getEventos().filter((evento) => evento.evID == this.props.evID)};
    this.state = { evento : []};
   }

  listarDados(){
   var eventos = firebaseRef.child('eventos').child(this.props.evID);
   eventos.on('value', (snapshot) => { 
      var evento = snapshot.val();
      this.setState({ evento : evento});
      console.log(evento);
    });
  }

  componentWillMount() {
    this.listarDados();
  }

  // getEventos() {
  //   return require('../../assets/agendabox-2a212-export.json');
  // }

  render() {
    return (

      <View style={styles.container}>
        <View style={styles.topo}>
          <Topo />
        </View>
        <View style={styles.conteudo}>
          <ScrollView>
            <View style={{ flex: 1}}>
              <View style={styles.GeneralInfo}>
                <Text style={{textAlign: 'center', color: 'white', fontSize: 16, fontWeight: 'bold'}}>{this.state.evento.evLocal}</Text>
                <Text style={{textAlign: 'center', fontSize: 12, color: '#737373'}}>{this.state.evento.evEndereco}</Text>
                <Text style={{textAlign: 'center', fontSize: 12, color: '#737373'}}>{this.state.evento.evData}
                 - 
                 {this.state.evento.evHorarioInicio}
                </Text>
              </View>
              <View style={{flex: 2, borderBottomWidth: 0.5, borderTopWidth: 0.5,  borderColor: '#737373', margin: 15, paddingTop: 10, paddingBottom: 10}}>
                <TouchableHighlight 
                  onPress={() => {Actions.eventodetalhes({evID: this.state.evento.evID})}}>
                  <Text style={{textAlign: 'center', fontSize: 12, color: '#737373'}}>INFORMAÇÕES DO EVENTO</Text>
                </TouchableHighlight>
              </View>
               <View style={{flex: 10,  paddingBottom: 10}}>
                  <View>
                    <Text style={{textAlign: 'center', fontSize: 14, color: '#737373'}}>FOTOS</Text>  
                  </View>
                  <View style={{height: 500, marginTop: 15}}>
                     <Galeria evID={this.state.evento.evID}/>
                  </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.rodape}>
          <Rodape />
        </View>
      </View>
     
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topo: {
    flex: 1.5
  },
  rodape: {
    flex: 1.5
  },
  conteudo:{
    flex: 10,
    backgroundColor: '#1D1D1D'
  },
  GeneralInfo: {
    flex: 6,
    marginTop: 20
  },
});
