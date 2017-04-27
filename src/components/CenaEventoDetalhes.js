import React, { Component } from 'react';
import { StyleSheet,  Text,  View, TouchableHighlight, ScrollView, Select, Option, 
         TouchableOpacity, Clipboard, ToastAndroid, AlertIOS, Platform
       } from 'react-native';
import {firebaseRef, auth} from '../FirebaseConfig'
import { Image,  ListView,  Tile,  Title,  Subtitle,  Screen} from '@shoutem/ui';
import { Actions } from 'react-native-router-flux';
import MapView from 'react-native-maps';
import LinearGradient from 'react-native-linear-gradient';
import Rodape from './Rodape'
import Topo from './Topo'
import Filtro from './Filtro'
import BotaoLike from './BotaoLike'
import BotaoResgatarCupom from './BotaoResgatarCupom'
const imgOrg = require('../imgs/admin.png');

//import { NavigationBar } from '@shoutem/ui/navigation';
const imgLogo = require('../imgs/logo.png');
const imgTemp = require('../imgs/NoPhoto_icon-user-default.png');
const imgLike = require('../imgs/ico_like.png');
const imgDefaultPhoto = require('../imgs/ico_photo.png');
const imgDefaultShare = require('../imgs/ico_share.png');
const imgMen = require('../imgs/men-grey.png');
const imgWomen = require('../imgs/woman-grey.png');
const imgGo = require('../imgs/bt_go.png');
const imgCheckIn = require('../imgs/ico_place.png');
const showBuyBtn = false;

export default class CenaEventoDetalhes extends Component {
  constructor(props){
    super(props);
    //this.state = { evento : this.getEventos().filter((evento) => evento.evID == this.props.evID)};
    this.state = { evento : []};
    this.state = {numEventoFotos : 0};
    this.state = { coordinate: {
	      latitude: -122.6548,
	      longitude: -35.6548,
	    }
	  };
  }

  days_between() {
    //data evento
    var date1 = String(this.state.evento.evData);
    var res = date1.split("/");
    //Menos 1 pois o Date() começa a contar os meses a partir do zero e não 1
    date1 = new Date(res[2],res[1] -1,res[0]);
    
    //Data atual
    var date2 = new Date();
    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    var utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    var utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return Math.floor((utc1 - utc2) / ONE_DAY);
    
}

  listarDados(){
   var eventos = firebaseRef.child('eventos').child(this.props.evID);
   eventos.on('value', (snapshot) => { 
      var evento = snapshot.val();
      this.setState({numEventoFotos : snapshot.child("eventoFotos").numChildren()});
      this.setState({ evento : evento});
   	  this.setState({ coordinate: {
	      latitude: evento.lat,
	      longitude: evento.lng,
	    }
	  });
    });

  }

  // getEventos() {
  //   return require('../../assets/agendabox-2a212-export.json');
  // }

  componentWillMount() {
    this.listarDados();
    console.log(this.props.share);
  }
  componentDidMount() {
    this.days_between();
  }

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
    
    if(dateNow >= utc1){
      return true
    } else {
      return false
    }
}

returnCheckins(){
  if(this.hours_between(this.state.evento.evData,this.state.evento.evHorarioInicio,this.state.evento.evHorarioFim,this.state.evento.evTempoDuracao)){
     // ja esta no dia ou o evento já passou
    return <View style={[styles.botoesInterecaoInterno, {borderLeftWidth: 0}]}>
          <View style={{marginBottom: 5}}>
            <Image source={imgCheckIn} style={{width: 25, height: 35, backgroundColor: 'transparent'}} /> 
          </View>
          <View>
            <Text style={styles.txtCinzaPequeno}>{this.state.evento.evCheckin}</Text>
          </View>
          <View>
            <Text style={styles.txtCinzaPequeno}>CHECK-INS</Text>
          </View>
         </View>
  } else {
   //Evento ainda não passou
    return <View style={[styles.botoesInterecaoInterno, {borderLeftWidth: 0}]}>
          <View>
            <Text style={styles.txtCinzaPequeno}>FALTAM</Text> 
          </View>
          <View>
            <Text style={{color:'white', fontSize: 30}}>{this.days_between()}</Text>
          </View>
          <View>
            <Text style={{color:'#EE2B7A', fontSize: 12, fontWeight: 'bold'}}>DIAS</Text>
          </View>
         </View>
  }
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

/*  renderRowFotos(fotos) {
    return (
      <View>
        <View>
          <Image style={{height: 80, width: 80}} source={{ uri: fotos.url }}></Image>
          <Image style={{height: 80, width: 80}} source={{ uri: fotos.url }}></Image>  
        </View>
        <View>
          
        </View>
      </View>
      
    );
  }*/

  renderizaPromocao(){
    if(this.state.evento.evPromo != undefined){
      return(
            <View style={styles.tipoEntrada}>
              <View style={{flex: 1}}>
                  <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                     <View>
                       <Text style={{color: 'white', fontSize: 26}}>{this.state.evento.evPromo.promoNome}</Text>
                     </View>     
                  </View>
                 <View style={{flex: 4.5, margin: 10}}>
                    <Text style={{color: 'white', fontSize: 14}}>{this.state.evento.evPromo.promoDescricao}</Text>
                  </View>
                  <View style={{flex: 2, alignItems: 'center', justifyContent: 'center', marginBottom: 15}}>
                    <BotaoResgatarCupom evID={this.state.evento.evID}/>                    
                  </View>
              </View>                
            </View>
        );
    } else {
      return(null);
    }
  }

  render() {
     let shareOptions = {
      title: "React Native",
      message: "Hola mundo",
      url: "http://facebook.github.io/react-native/",
      subject: "Share Link" //  for email
    };

    return (

      <View style={styles.container}>
        <View style={styles.topo}>
          <Topo />
        </View>
        <View style={styles.conteudo}>
          <ScrollView>
            <View style={{height:1750, flex: 1, backgroundColor: '#1D1D1D'}}>
              <View style={styles.imagemBanner}>
                <Image styleName="large-banner" source={{ uri: this.state.evento.evFotoBanner }}></Image>
              </View>
              <View style={styles.nomeEvento}>
                <Text style={styles.txtNomeEvento}>{this.state.evento.evNome}</Text>
                <Text style={styles.txtLocalEvento}>{this.state.evento.evLocal}</Text>
              </View>
              <View style={styles.botoesInterecao}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                {this.returnCheckins()}
                <View style={styles.botoesInterecaoInterno}>
                  <View>
                    <BotaoLike evID={this.state.evento.evID}/>
                  </View>
                  <View>
                    <Text style={[styles.txtCinzaPequeno, {fontWeight: 'bold', paddingTop: 5}]}>{this.state.evento.evCurtidas}</Text>
                  </View>
                  <View>
                    <Text style={styles.txtCinzaPequeno}>CURTIDAS</Text>
                  </View>
                </View>
                <View style={styles.botoesInterecaoInterno}>
                 <TouchableHighlight 
                        onPress={() => {Actions.galeria({evID: this.state.evento.evID})}}>
                      <Image source={imgDefaultPhoto} style={{width: 35, height: 30, backgroundColor: '#1D1D1D'}}> 
                      </Image>
                 </TouchableHighlight>
                 <View style={{paddingTop: 5}}>
                   <Text style={[styles.txtCinzaPequeno, {fontWeight: 'bold'}]}>{this.state.numEventoFotos}</Text>
                 </View>
                 <View>
                   <Text style={[styles.txtCinzaPequeno,]}>FOTOS</Text>
                 </View>
                </View>
              </View>
              </View>
              <View style={styles.dataEvento}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 10}}>
                  <View style={{flex:4,  borderRightWidth: 0.5, borderColor: '#737373', marginRight: 15}}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>{this.state.evento.evData}</Text>    
                  </View>
                  <View style={{flex:1, alignItems: 'center'}}>
                    <Text style={{fontSize: 18, color: 'white'}}>
                      {this.state.evento.evHorarioInicio}
                    </Text>
                    <Text style={[styles.txtCinzaPequeno, {fontSize: 10}]}>
                      até {this.state.evento.evHorarioFim}
                    </Text>    
                  </View>
                </View>
              </View>
              <View style={styles.tipoEntrada}>
                <View style={{flex: 1}}>
                   <View style={{flex: 4.5, margin: 10}}>
                     <ListView
                      data={this.state.evento.eventoPrecos}
                      renderRow={precos => this.renderRowPrecos(precos)}
                      />
                    </View>
                    <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
                      {this.returnBuyBtn(showBuyBtn)}
                    </View>
                </View>
              </View>
                {this.renderizaPromocao()}  
              <View style={styles.fotos}>
                <View style={{flex: 1}}>
                  <View style={{flexDirection: 'row', flex: 2}}>
                    <TouchableHighlight style={{flex: 1, borderRadius: 10 }}
                        onPress={() => {Actions.galeria({evID: this.state.evento.evID})}}>
                      <Image style={{flex: 1, borderRadius: 10, margin: 5, backgroundColor: 'transparent'}} 
                        source={{ uri: this.state.evento.eventoFotos[0].photo }}></Image>
                    </TouchableHighlight>
                    <TouchableHighlight style={{flex: 1, borderRadius: 10 }}
                        onPress={() => {Actions.galeria({evID: this.state.evento.evID})}}>
                      <Image style={{flex: 1, borderRadius: 10, margin: 5, backgroundColor: 'transparent'}} 
                        source={{ uri: this.state.evento.eventoFotos[1].photo }}></Image>
                    </TouchableHighlight>
                  </View>
                   <View style={{flexDirection: 'row', flex: 1}}>
                    <TouchableHighlight style={{flex: 1, borderRadius: 10 }}
                        onPress={() => {Actions.galeria({evID: this.state.evento.evID})}}>
                      <Image style={{flex: 1, borderRadius: 10, margin: 5, backgroundColor: 'transparent'}} 
                        source={{ uri: this.state.evento.eventoFotos[2].photo }}></Image>
                    </TouchableHighlight>
                    <TouchableHighlight style={{flex: 1, borderRadius: 10 }}
                        onPress={() => {Actions.galeria({evID: this.state.evento.evID})}}>
                      <Image style={{flex: 1, borderRadius: 10, margin: 5, backgroundColor: 'transparent'}} 
                        source={{ uri: this.state.evento.eventoFotos[3].photo }}></Image>
                    </TouchableHighlight>                                       
                    <TouchableHighlight style={{flex: 1, margin: 5, borderRadius: 10 }}
                        onPress={() => {Actions.galeria({evID: this.state.evento.evID})}}>
                      <Image style={{flex: 1, borderRadius: 10}} 
                            source={{ uri: this.state.evento.eventoFotos[4].photo }}>
                            <Text style={{color: 'white', fontWeight: 'bold', backgroundColor:'transparent'}}>GALERIA</Text>
                            <Text style={{color: 'white', fontSize: 8, backgroundColor:'transparent'}}>(+{this.state.numEventoFotos - 5} FOTOS)</Text>
                      </Image>
                    </TouchableHighlight>
                    
                  </View>
                </View>
              </View>
              <View style={styles.descricaoEvento}>
                <Text style={{color: '#737373', padding: 15}}>{this.state.evento.evDescricao}</Text>
              </View>
              <View style={styles.mapa}>
                <View style={{flex: 1}}>
                  <View style={{flex: 2, paddingTop: 10}}>
                    <Text style={{textAlign: 'center', color: '#EE2B7A', fontSize: 14}}>{this.state.evento.evLocal}</Text>
                    <Text style={[styles.txtCinzaPequeno,{textAlign: 'center', fontSize: 12}]}>{this.state.evento.evEndereco}</Text>
                  </View>
                  <View style={{flex: 6, margin: 10}}>
                    <MapView style={styles.map}
                         initialRegion={{
					      latitude: this.state.coordinate.latitude,
					      longitude: this.state.coordinate.longitude,
					      latitudeDelta: 0.0922,
					      longitudeDelta: 0.0421,
					    }}
                    >
                    	<MapView.Marker
					      coordinate={this.state.coordinate}
					      title={"marker.title"}
					      description={"marker.description"}
					    />
					</MapView>  
                  </View>
                </View>
              </View>
              <View style={styles.organizador}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <Image  styleName="small-avatar" style={{backgroundColor: 'transparent'}} source={imgOrg}></Image>
                  </View>
                  <View style={{flex: 6}}>
                    <Text style={[styles.txtCinzaPequeno, {fontSize: 10}]}>Organizado por</Text>
                    <Text style={{color: 'white'}}>{this.state.evento.evOrganizador}</Text>
                  </View>
                 
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.rodape}>
			   <Rodape evID={this.state.evento.evID} evNome={this.state.evento.evNome} modalCheckIn={this.hours_between(this.state.evento.evData,this.state.evento.evHorarioInicio,this.state.evento.evHorarioFim,this.state.evento.evTempoDuracao)}/>
       </View>
      </View>
     
    );
  }
}

const styles = StyleSheet.create({
   map: {
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
  },
 container: {
  flex: 1,

 },
 topo: {
  flex: 1.5
 },
rodape: {
  position: 'absolute',
  bottom: 0.01,
  right: 1,
  left: 1,
},
conteudo:{
  flex: 10,
  backgroundColor: '#303030'
 },
 imagemBanner: {
  flex: 6,
  // backgroundColor: 'pink'
 },
 nomeEvento: {
  alignItems: 'center',
  justifyContent: 'center',
  flex: 3,
  backgroundColor: '#1D1D1D'
 },
 txtNomeEvento: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 20,
  textAlign: 'center'
 },
 txtLocalEvento: {
  color: '#737373',
 },
 txtCinzaPequeno: {
  color:'#737373', 
  fontSize: 8
 },
 botoesInterecao: {
  flex: 3,
  backgroundColor: '#1D1D1D',
  flexDirection: 'row',
 }, 
 botoesInterecaoInterno: {
  alignItems: 'center', 
  justifyContent: 'center', 
  flex: 2,
  borderLeftWidth: 0.5, 
  borderColor: '#737373',
 },
 dataEvento: {
  flex: 2,
  backgroundColor: '#303030',
  borderRadius: 10,
  margin: 5,
  marginLeft: 10,
  marginRight: 10,
 }, 
 tipoEntrada: {
  flex: 9,
  backgroundColor: '#303030',
  borderRadius: 10,
  margin: 10
 },
 fotos: {
  flex: 10,
  backgroundColor: 'transparent',
  marginBottom: 10
 },
 descricaoEvento: {
  flex: 9,
  margin: 5,
  backgroundColor: '#303030',
  borderRadius: 10,
  marginBottom: 10
 },
 mapa: {
  flex: 10,
  margin: 5,
  backgroundColor: '#303030',
  borderRadius: 10,
  marginBottom: 10
 },
 organizador: {
  flex: 2,
  margin: 5,
  backgroundColor: '#303030',
  borderRadius: 10,
  marginBottom: 70,
  flexDirection: 'row',
  alignItems: 'center'
 },
btnComprar: {
  backgroundColor: '#EE2B7A',
  width: 115,
  alignItems: 'center',
  padding: 10,
  borderRadius: 5,
  marginTop: 10
},
txtComprar: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 12
},
});

