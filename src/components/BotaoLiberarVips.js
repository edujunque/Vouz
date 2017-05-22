import React, { Component } from 'react';
import { StyleSheet,  Text,  View, TouchableHighlight, Modal, Image, TextInput } from 'react-native';
import {firebaseRef, auth} from '../FirebaseConfig'
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import ProgressBarClassic from 'react-native-progress-bar-classic';
import * as Progress from 'react-native-progress';

const imgCheckin = require('../imgs/bt-central.png');
const imgCheckedin = require('../imgs/bt-central-2.png');
const imgPin = require('../imgs/PIN.png');
const imgTicket = require('../imgs/ticket.png');
const imgTimer = require('../imgs/timer-bt.png');

export default class botaoResgatarCupom extends Component {
  constructor(props){
    super(props);
    this.state = {modalcodListaVipVisible : false};
    this.state = { codListaVip : '' };
    this.state = { txtBtnResgatar : '' };
    this.state = { btnResgatarAtivo : true}
    this.state = { txtUsado : false}
    this.state = { txtDescrBtnResgatar : ''}
    this.state = { percCuponsUsados : 0}
    this.state = { numCuponsDisponiveis : 0}
    this.state = { vipsExtra : ''}
   }

  componentWillMount() {
    this.listarDados();
  }

  listarDados(){
    // alert(this.props.evNome);
    const usuarioAtual = auth.currentUser;
      var refData = firebaseRef.child('user/'+ usuarioAtual.uid);
      //evID = 0 significa adesão ao APP
      refData.on('value',(snapshot) => {
    
        if (snapshot.child('/codListaVip' + '/evID/' + this.props.evID).exists()){
          // console.log('existe o nó:');
          var evcodListaVip = snapshot.child('/codListaVip' + '/evID/' + this.props.evID).val();
          // alert('entrou no que existe codigo');
          //atualiza state com codListaVip:
          this.setState({txtBtnResgatar : evcodListaVip.cod});
          this.setState({btnResgatarAtivo : false});
          this.setState({txtUsado : evcodListaVip.codUsado});
          this.setState({txtDescrBtnResgatar : evcodListaVip.codUsado == true ? "código usado" : "seu código"});
        }
        else{
          //obtem dados do Evento
          //Obtem qtd de codigos gerados:
          var qtdListaUsados = 0;
          var refDataEvento = firebaseRef.child('eventos/'+ this.props.evID + '/evPromoters/1');
          refDataEvento.on('value',(snapshot) => {
            qtdListaUsados = snapshot.val().qtdListaUsados;
            if(snapshot.val().promoCuponsUsados >= snapshot.val().qtdListaVIP){
              //Não deve permitir mais geração de cupons
              this.setState({txtBtnResgatar : "INCLUIR NOME"});
              //Ativa botão para resgate:
              this.setState({btnResgatarAtivo : false});
              this.setState({txtUsado : true});
              this.setState({txtDescrBtnResgatar : "lugares na lista VIP esgotados"});   
            }else{
              //Pode gerar mais cupons
              this.setState({txtBtnResgatar : "INCLUIR NOME"});
              //Ativa botão para resgate:
              this.setState({btnResgatarAtivo : true});
              this.setState({txtUsado : false});
              this.setState({txtDescrBtnResgatar : "inclua seu nome na lista VIP"});
            }
          });            
          // //Ainda não gerou codigo para esse evento.
          // //seta texto do botão de resgatar;
          // this.setState({txtBtnResgatar : "RESGATAR"});
          // //Ativa botão para resgate:
          // this.setState({btnResgatarAtivo : true});
          // this.setState({txtUsado : false});
          // this.setState({txtDescrBtnResgatar : "resgate seu código"});
        }
      });    
      var refDataEvento = firebaseRef.child('eventos/'+ this.props.evID + '/evPromoters/1');
      refDataEvento.on('value',(snapshot) => {
          //calcula porcentagem dos cupons usados.
          this.setState({percCuponsUsados : ((100*snapshot.val().qtdListaUsados)/snapshot.val().qtdListaVIP)/100});
          //popula state com total de cupons disponiveis
          this.setState({numCuponsDisponiveis : (snapshot.val().qtdListaVIP - snapshot.val().qtdListaUsados)});    
          this.setState({numVipsTotal : snapshot.val().qtdListaVIP});    
          this.setState({numVipsUsados : snapshot.val().qtdListaUsados});    

      });                  
  }

  btnLiberarVips(){
  	var qtdListaVIP = 0;
	  //Atualiza evento
	  var refEvento = firebaseRef.child('eventos/'+ this.props.evID + '/evPromoters/1');
	  refEvento.on('value',(snapshot) => {
	    qtdListaVIP = snapshot.val().qtdListaVIP;
	  }); 	
      //Atualiza evento
      firebaseRef.child('eventos/'+ this.props.evID + '/evPromoters/1').update({
        qtdListaVIP : parseInt(qtdListaVIP) + parseInt(this.state.vipsExtra)
      });	  
  } 

	returnBotaoInserir(){
		if(this.props.abreModal){
			return(
				<View>
			        <View style={{flex: 2, backgroundColor: 'transparent', justifyContent: 'center', paddingBottom: 5}}>
			          <Text style={{textAlign: 'center', color: 'white'}}>{this.state.numCuponsDisponiveis} lugares disponíveis</Text>
			          <Progress.Bar progress={this.state.percCuponsUsados} width={200} color={'#EE2B7A'}/>
			          <Text style={{textAlign: 'center', color: 'white'}}>{this.state.numVipsUsados} / {this.state.numVipsTotal}</Text>
			        </View>
			        <View style={{flex: 3, justifyContent: 'center', alignItems: 'center', paddingTop: 10, flexDirection: 'row'}}>
				      <View>
					      <TextInput
					      style={styles.formText}
					      underlineColorAndroid='rgba(0,0,0,0)'
					      placeholder="000"
					      placeholderTextColor='white'
					      onChangeText={(vipsExtra) => this.setState({vipsExtra})}
					      value={this.state.vipsExtra}
					    />				      	
				      </View>
				    <View>
				         <TouchableHighlight style={styles.btnComprar}
				            onPress={() => {this.btnLiberarVips(); }}
				            disabled={false}
				            activeOpacity={0.5}
				            underlayColor={'#EE2B7A'}
				            >
				              <Text style={this.state.txtUsado == false ? styles.txtStatusDisponivel : styles.txtStatusUsado}>LIBERAR</Text>
				         </TouchableHighlight> 										    	
				    </View>
			        </View>
		        </View>          
				);
		}	
	}

  render() {
    return(
     	
      <View style={{flex: 1}}>
      	{this.returnBotaoInserir()}
      </View>
      );
  }
}

const styles = StyleSheet.create({
  btnComprar: {
    backgroundColor: '#EE2B7A',
    width: 150,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 0
  },
  txtStatusDisponivel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center'
  },

 formText: {
	  color: 'white',
	  height: 45, 
	  width: 50,
	  marginRight: 10,
	  backgroundColor: 'rgba(0, 0, 0, 0.5)',
	  borderRadius: 5,
	  borderWidth: 1,
	  borderColor: 'grey',

 },
});
