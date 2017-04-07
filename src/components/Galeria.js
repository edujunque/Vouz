/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import PhotoBrowser from 'react-native-photo-browser';
import {firebaseRef, auth} from '../FirebaseConfig'

export default class Galeria extends Component {

  constructor(props) {
    super(props);

    // this.state = { evento : this.getEventos().filter((evento) => evento.evID == this.props.evID)};
    this.state = { evento : []};
    this.state = { startOnGrid : true};
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
      <PhotoBrowser style={{backgroubdColor: 'blue'}}
        mediaList={this.state.evento.eventoFotos}
        startOnGrid={this.state.startOnGrid}
        enableGrid={true}
        displayTopBar={false}
        useCircleProgress
      />
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingTop: 54,
    paddingLeft: 16,
  },
  row: {
    flex: 1,
    padding: 8,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 1,
  },
  rowTitle: {
    fontSize: 14,
  },
  rowDescription: {
    fontSize: 12,
  },
});