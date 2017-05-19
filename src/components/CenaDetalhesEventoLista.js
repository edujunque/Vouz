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
import BotaoInserirNomeListaVIP from './BotaoInserirNomeListaVip'
const imgOrg = require('../imgs/admin.png');

//import { NavigationBar } from '@shoutem/ui/navigation';
const imgLogo = require('../imgs/logo.png');
const imgTemp = require('../imgs/NoPhoto_icon-user-default.png');
const imgDefaultPhoto = require('../imgs/ico_photo.png');
const imgDefaultShare = require('../imgs/ico_share.png');
const imgMen = require('../imgs/men-grey.png');
const imgWomen = require('../imgs/woman-grey.png');
const imgGo = require('../imgs/bt_go.png');

export default class CenaEventoDetalhes extends Component {
  constructor(props){
    super(props);
    //this.state = { evento : this.getEventos().filter((evento) => evento.evID == this.props.evID)};
    this.state = { evento : []};
    this.state = {numEventoFotos : 0};
    this.state = {statusCadastroLista : ''};
    this.state = { coordinate: {
	      latitude: -122.6548,
	      longitude: -35.6548,
	    }
	  };
  }

  listarDados(){
   var eventos = firebaseRef.child('eventos').child(this.props.evID);
   eventos.on('value', (snapshot) => { 
      var evento = snapshot.val();
      this.setState({ evento : evento});
   	  this.setState({ coordinate: {
	      latitude: evento.lat,
	      longitude: evento.lng,
	    }
	  });
    });
   console.log(this.state.evento);

  }

  componentWillMount() {
    this.listarDados();
  }

returnListaVIP(){
	 const usuarioAtual = auth.currentUser;
     var usuarios = firebaseRef.child('user').child(usuarioAtual.uid);
	   	usuarios.on('value', (snapshot) => { 
			if(snapshot.child('/codListaVip' + '/evID/' + this.props.evID).exists()){
				//Se existe quer dizer que o usuario já esta na lista desse evento
			 	//Verifica se o usuario já esta na balada.
				if(snapshot.child('/codListaVip' + '/evID/' + this.props.evID).val().codUsado){
					//Codigo já usado, ou seja, usuario já entrou na balada.
					this.setState({statusCadastroLista : 'naBalada'});
				}else{
					//Usuario ainda não entrou na balada.
					this.setState({statusCadastroLista : 'naoUsado'});
		 		}
			}else{
			 	//usuario ainda não incluiu seu nome na lista
			 	this.setState({statusCadastroLista : 'foraDaLista'});
			}
	  	});
	  	if(this.state.statusCadastroLista == ''){
	  		return(null);
	  	}else if(this.state.statusCadastroLista == 'naBalada'){
	  		return(<Text>na balada</Text>);
	  	}else if(this.state.statusCadastroLista == 'naoUsado'){
	  		return(<Text>naoUsado</Text>);
	  	}else if(this.state.statusCadastroLista == 'foraDaLista'){
	  		return(<Text>foraDaLista</Text>);
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

  returnEventsListView(){
	if (this.state.evento != undefined){
		return(
				<View style={{height:1750, flex: 1, backgroundColor: '#1D1D1D'}}>
				  <View style={styles.imagemBanner}>
				    <Image styleName="large-banner" source={{ uri: this.state.evento.evFotoBanner }}></Image>
				  </View>
				  <View style={styles.nomeEvento}>
				    <Text style={styles.txtNomeEvento}>{this.state.evento.evNome}</Text>
				    <Text style={styles.txtLocalEvento}>{this.state.evento.evLocal}</Text>
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
				    </View>
				  </View>
				  <View style={styles.listaVIP}>
			          <View style={{flex: 1}}>
			              <View style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
			                 <View>
			                   <Text style={{color: 'white', fontSize: 26}}>LISTA VIP</Text>
			                   {this.returnListaVIP()}
			                 </View>     
			              </View>
			             <View style={{flex: 2, margin: 10}}>
			                <Text style={{color: 'white', fontSize: 14}}>Aqui a festa é garantida! Coloque seu nome na lista mais VIP da festa e compartilhe com seus amigos.</Text>
			              </View>
			              <View style={{flex: 4, alignItems: 'center', justifyContent: 'center', marginBottom: 15}}>
			              	<BotaoInserirNomeListaVIP evID={this.state.evento.evID}/>           
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
			);
	} else {
		return(<Text>Carregando...</Text>);
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
          	{this.returnEventsListView()}
          </ScrollView>
        </View>
        <View style={styles.rodape}>
			   
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
  flex: 7,
  backgroundColor: '#303030',
  borderRadius: 10,
  margin: 10
 },
 listaVIP: {
  flex: 11,
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

