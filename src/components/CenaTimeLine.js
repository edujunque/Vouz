import React, { Component } from 'react';
import { StyleSheet,  Text,  View, Button, TouchableHighlight, ScrollView, Select, Option} from 'react-native';
import firebase from 'firebase';
import { Image,  ListView,  Tile,  Title,  Subtitle,  Screen} from '@shoutem/ui';
import { Actions } from 'react-native-router-flux';
import Rodape from './Rodape'
import Topo from './Topo'
import Filtro from './Filtro'
import BotaoLike from './BotaoLike'
import ModalCodigoPromo from './ModalCodigoPromo'
import {firebaseRef, auth} from '../FirebaseConfig'
import { Container, Content, Tab, Tabs, TabHeading } from 'native-base';

//import { NavigationBar } from '@shoutem/ui/navigation';
const imgLogo = require('../imgs/logo.png');
const imgLike = require('../imgs/ico_like.png');
const imgTemp = require('../imgs/NoPhoto_icon-user-default.png');
const imgOrg = require('../imgs/admin.png');
const showBuyBtn = false;

export default class CenaTimeLine extends Component {
 
constructor(props) {
  super(props);
  this.state = {eventos : []};
  this.state = {indexTab : 0};
  this.filterUser = this.filterUser.bind(this);
}

 filterUser(filter){
  this.listarDados(filter);
 }


 hours_between(dateEv, horaInicio, horaFim, TempoDuracao) {
    //data evento
    var dateEvento = String(dateEv);
    var res = dateEvento.split("/");
    var horaInicio = horaInicio.split(":");
    //Menos 1 pois o Date() começa a contar os meses a partir do zero e não 1
    var eventoInicio = new Date(res[2],res[1] -1,res[0], horaInicio[0],horaInicio[1]);
    var eventoFim = new Date(eventoInicio);
    //ja retorna o evento fim em milisegundos
    eventofim = eventoFim.setHours(eventoInicio.getHours() + TempoDuracao);
    //Data atual
    var dateNow = new Date();
    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    //Data de inicio
    var utc1 = Date.UTC(eventoInicio.getFullYear(), eventoInicio.getMonth(), eventoInicio.getDate(), eventoInicio.getHours(), eventoInicio.getMinutes());
    //DateNow deve estar entre o horario de inicio e fim do evento
    var utcNow = Date.UTC(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), dateNow.getHours(), dateNow.getMinutes());
    
    if(dateNow >= utc1 && dateNow <= eventofim){
      return true
    } else {
      return false
    }
}

listarDados(filter){
   const usuarioAtual = auth.currentUser;
   var eventos = firebaseRef.child('eventos');
   // var user = firebaseRef.child('user');
   var evento;
   eventos.on('value', function(snapshot) { 
    evento = snapshot.val();
   });

   var refDataUser = firebaseRef.child('user/'+ usuarioAtual.uid);
   refDataUser.on('value', (snapshot) => {
     var listagemEventos = [];
       //aplica as regras de filtro
     if(filter == 'Curtidas'){
     
        evento.forEach((childSnapshot) => {
         if( snapshot.child('/eventosCurtidos' + '/evID/' + childSnapshot.evID).exists()){
          //Se existe verificar se esta true ou false.
          var evLiked = snapshot.child('/eventosCurtidos' + '/evID/' + childSnapshot.evID).val();
          if(evLiked.liked){

            //Caso true quer dizer que o usuario curtiu esse evento.
            //Adiciona o evento no objeto que será enviado para o state
            listagemEventos.push(childSnapshot);
          }
         }
        });
     } else if(filter == 'Rolando Agora'){
         evento.forEach((childSnapshot) => {
            if(this.hours_between(childSnapshot.evData, childSnapshot.evHorarioInicio, childSnapshot.evHorarioFim, childSnapshot.evTempoDuracao)){
              //Adiciona o evento no objeto que será enviado para o state
              listagemEventos.push(childSnapshot);
            }
          }
        );
     } else if(filter == 'Bombando'){
         evento.forEach((childSnapshot) => {
            if(this.hours_between(childSnapshot.evData, childSnapshot.evHorarioInicio, childSnapshot.evHorarioFim, childSnapshot.evTempoDuracao)){
              //caso esteja rolando agora verifica se tem o minimo de checkins 
              if(childSnapshot.evCheckin >= 10 && childSnapshot.evCurtidas >= 10){
                //Adiciona o evento no objeto que será enviado para o state
                listagemEventos.push(childSnapshot);
              }
            }
          }
        );
     } else {
      //Lista as mais recentes
        if(this.state.eventos != []){
          if(evento != null){
              evento.forEach((childSnapshot) => {
              listagemEventos.push(childSnapshot);
              });
            }
        }
         
     }
     this.setState({ eventos : listagemEventos});
    // return this.returnEventsListView(listagemEventos);
   });
}

 // componentDidMount() {
 //   this.listarDados("Recentes");
 // }

 returnBuyBtn(blnShow){

    if(blnShow){
        return (
         <TouchableHighlight style={styles.btnComprar}
            onPress={() => {Actions.timeline(); }}>
            <Text style={styles.txtComprar}>COMPRAR</Text>
         </TouchableHighlight>
      );             
    }
  
 }

 returnDay(date){
    var res = String(date).split("/");
    return res[0];
 }

 returnMonth(date){
    var monthNames = ["JAN", "FEV", "MAR", "ABR", "MAIO", "JUN",
    "JUL", "AGO", "SET", "OUT", "NOV", "DEZ", ""];
    var res = String(date).split("/");
    return monthNames[res[1] -1];
 }

 returnYear(date){
    var res = String(date).split("/");
    return String(res[2]).toString().substr(2,2);
 }

 returnEventsListView(){
  if(this.state.eventos != null){
     if(this.state.eventos.length > 0){
       return (  
             <ListView
             data={this.state.eventos}
             renderRow={eventos => this.renderRow(eventos)}
             />
             );
    } else {
      return (
          <Text style={{color: 'white', margin: 15}}>Nenhum evento foi encontrado!</Text>
        );
    }
  }
 }

  componentWillMount() {
    this.listarDados('Recentes');
  }

  // getEventos() {
  //   return require('../../assets/agendabox-2a212-export.json');
  // }

  //Carrega o state para listar os dados referentes aquele filtro
  tabChanging(index){
    this.setState({indexTab : index.i});
    if(index.i == 0){
      //Recentes
      this.listarDados('Recentes');
    } else if(index.i == 1){
      //Rolando Agora
      this.listarDados('Rolando Agora');
    }else if(index.i == 2){
      //Rolando Agora
      this.listarDados('Bombando');
    }else if(index.i == 3){
      //Rolando Agora
      this.listarDados('Curtidas');
    }
  }

  changeTxtTabStyle(indexAtual){
    if(this.state.indexTab == indexAtual){
      return styles.txtAtivado;
    } else {
      return styles.txtDesativado;
    }
  }
  // defines the UI of each row in the list
  renderRow(eventos) {
    return (
      <View style={{backgroundColor: '#303030', marginBottom: 20}}>
        <View style={{flexDirection:'row', margin: 5, }}>
          <View style={{flex: 0.7, }}>
            <Image source={imgOrg} style={{width: 40, height: 40, borderRadius: 30, backgroundColor: '#303030', resizeMode: 'cover'}}/>
          </View>
          <View style={{flex: 4}}>
            <Text style={{color: 'white'}}>{eventos.evOrganizador}</Text>
            <Text style={{fontSize: 11, color: 'white'}}>Publicado em: {eventos.evDataPublicacao}</Text>
          </View>
        </View>
        <View>
          <TouchableHighlight 
              onPress={() => {Actions.eventodetalhes({evID: eventos.evID})}}>
               <Image styleName="large-banner" source={{ uri: eventos.evFotoBanner }}></Image>
          </TouchableHighlight>
         
          
            <View style={{backgroundColor: '#303030', flexDirection: 'row'}}>
              <View style={{alignItems: 'center', justifyContent: 'center', flex : 2, paddingTop: 5}}>
                <Text style={{fontSize: 26, color:'#737373', fontWeight: 'bold'}}>{this.returnDay(eventos.evData)}</Text>
                <Text style={{fontSize: 9, color:'#737373', fontWeight: 'bold'}}>{this.returnMonth(eventos.evData)}/
                  <Text style={{fontSize: 9, color:'#737373', fontWeight: 'normal'}}>{this.returnYear(eventos.evData)}</Text>
                </Text>
              </View>
              <View style={{ flex : 10, paddingTop: 3}}>
                <Title style={{color: 'white', fontSize: 16}}>{eventos.evNome}</Title>
                <Subtitle style={{color: '#737373', fontSize: 12}}>{eventos.evLocal}</Subtitle>
              </View>
              <View style={{ flex : 2, paddingTop: 10}}>
                <BotaoLike evID={eventos.evID} />
              </View>
            </View>
          <View style={{flexDirection: 'row', borderTopWidth: 0.2, borderColor: 'white', margin: 10}}>
            <View style={{ flex: 1, marginTop: 10}}>
              <Text style={{color:'white', paddingTop: 5}}>R$ {eventos.eventoPrecos[0].Valor} a </Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-start', marginTop: 10}}>
              <Text style={{color:'white', paddingTop: 5}}>R$ {eventos.eventoPrecos[2].Valor}</Text>
            </View>
            <View style={{flex: 2, alignItems: 'flex-end'}}>
                {this.returnBuyBtn(showBuyBtn)}
            </View>
          </View>
        </View>

      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topo}>
          <Topo />
        </View>
        <Tabs style={{flex: 8}} 
          onChangeTab={(index)=>{this.tabChanging(index)}}
          tabBarUnderlineStyle={{borderBottomWidth: 5, borderColor: '#EE2B7A'}}
          >
          <Tab 
           heading={ <TabHeading style={{backgroundColor: 'black'}}><Text style={this.changeTxtTabStyle(0)}>Recentes</Text></TabHeading>}>
          <Screen style={{backgroundColor: 'black'}}>
              {this.returnEventsListView()}
          </Screen>
          </Tab>
          <Tab 
            heading={ <TabHeading style={{backgroundColor: 'black'}}><Text style={this.changeTxtTabStyle(1)}>Rolando Agora</Text></TabHeading>}>
            <Screen style={{backgroundColor: 'black'}}>
                {this.returnEventsListView()}
            </Screen>
          </Tab>
          <Tab 
            heading={ <TabHeading style={{backgroundColor: 'black'}}><Text style={this.changeTxtTabStyle(2)}>Bombando</Text></TabHeading>}>          
            <Screen style={{backgroundColor: 'black'}}>
                {this.returnEventsListView()}
            </Screen>
          </Tab>
          <Tab 
            heading={ <TabHeading style={{backgroundColor: 'black'}}><Text style={this.changeTxtTabStyle(3)}>Curtidas</Text></TabHeading>}>          
            <Screen style={{backgroundColor: 'black'}}>
              {this.returnEventsListView()}
            </Screen>
          </Tab>
          <ModalCodigoPromo evID={this.state.evento.evID} evNome={this.state.evento.evNome} modalCheckIn={this.hours_between(this.state.evento.evData,this.state.evento.evHorarioInicio,this.state.evento.evHorarioFim,this.state.evento.evTempoDuracao)} />
        </Tabs>
      
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
 },
 topo: {
  flex: 1.5,
 },
 user: {
  margin: 10
 },
 filtro: {
  flex: 1,
  backgroundColor: 'black'
 },
  btnComprar: {
  backgroundColor: '#EE2B7A',
  width: 100,
  alignItems: 'center',
  padding: 7,
  borderRadius: 30,
  marginTop: 10,
},
  txtComprar: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
},
txtAtivado: {
  color: '#EE2B7A',
  paddingTop: 20,
  fontSize: 13
},
txtDesativado: {
  color: '#737373',
  paddingTop: 20,
  fontSize: 13
},
buttonAtivado: {
  borderBottomWidth: 3, 
  borderColor: '#EE2B7A',
  marginBottom: 2
},
buttonDesativado: {
  borderBottomWidth: 0, 
  borderColor: 'transparent'
}
});

