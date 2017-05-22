import React, { Component } from 'react';
import { StyleSheet,  Text,  View, TouchableHighlight, Modal, Image } from 'react-native';
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
    this.state = { modalNomeIncluido : false}
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
      });                  
  }

   btnResgatar() {
    // alert(this.props.evNome);
    const usuarioAtual = auth.currentUser;
      var refData = firebaseRef.child('user/'+ usuarioAtual.uid);
      //evID = 0 significa adesão ao APP
      refData.on('value',(snapshot) => {
        
        if (snapshot.child('/codListaVip' + '/evID/' + this.props.evID).exists()){
          // console.log('existe o nó:');
          var evcodListaVip = snapshot.child('/codListaVip' + '/evID/' + this.props.evID).val();
 
          //atualiza state com codListaVip:
          this.setState({codListaVip : evcodListaVip.cod});
        }
        else{
          //Codigo de adesão ainda não foi gerado.
          //Gerar codigo de adesão e armazena no banco de dados:
          var codTemp = this.geraCodigoAdesao();

          //Obtem qtd de codigos gerados:
          var qtdListaUsados = 0;
          var refDataEvento = firebaseRef.child('eventos/'+ this.props.evID + '/evPromoters/1');
          refDataEvento.on('value',(snapshot) => {
            qtdListaUsados = snapshot.val().qtdListaUsados;
          }); 

          //Atualiza usuario
          firebaseRef.child('user/'+ usuarioAtual.uid + '/codListaVip/evID/' + this.props.evID).set({
            cod : codTemp,
            codUsado : false,
            codVisualizado : false,
            evID : this.props.evID
          });

          //Atualiza evento
          firebaseRef.child('eventos/'+ this.props.evID + '/evPromoters/1').update({
            qtdListaUsados : qtdListaUsados + 1
          });
          //atualiza state com codListaVip:
          this.setState({codListaVip : codTemp});
        }
      }); 
   }

   geraCodigoAdesao(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
   }

  disablecodListaVip(){
    const usuarioAtual = auth.currentUser;
    //atualiza evento visualização
    firebaseRef.child('user/'+ usuarioAtual.uid + '/codListaVip/evID/' + this.props.evID).update({
      codVisualizado : true
    });
    this.setState({codVisualizado : true});
    return true
  }

  updateListaVisualizado(){
  	  const usuarioAtual = auth.currentUser;
	  //Atualiza evento
	  firebaseRef.child('user/'+ usuarioAtual.uid + '/codListaVip/evID/' + this.props.evID).update({
	    codVisualizado : true
	  }); 	
  } 

	returnBotaoInserir(){
		if(this.props.abreModal){
			return(
				<View>
			        <View style={{flex: 1, backgroundColor: 'transparent', justifyContent: 'center', paddingBottom: 5}}>
			          <Text style={{textAlign: 'center', color: 'white'}}>{this.state.numCuponsDisponiveis} lugares disponíveis</Text>
			          <Progress.Bar progress={this.state.percCuponsUsados} width={200} color={'#EE2B7A'}/>
			        </View>
			        <View style={{flex: 3, justifyContent: 'center', alignItems: 'center', paddingTop: 10}}>
			         <TouchableHighlight style={styles.btnComprar}
			            onPress={() => {this.btnResgatar(); }}
			            disabled={!this.state.btnResgatarAtivo}
			            activeOpacity={0.5}
			            underlayColor={'#EE2B7A'}
			            >
			            <View>
			              <Text style={this.state.txtUsado == false ? styles.txtStatusDisponivel : styles.txtStatusUsado}>{this.state.txtBtnResgatar}</Text>
			              <Text style={{fontSize: 12, textAlign: 'center'}}>{this.state.txtDescrBtnResgatar}</Text>  
			            </View>
			            
			         </TouchableHighlight>          
			        </View>
		        </View>          
				);
		}	
	}

  render() {
    return(
     	
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
			<Modal 
		     animationType={"slide"}
		     transparent={true}
		     visible={!this.props.codListaVisualizado}
		     onRequestClose={() => {this.setmodalNomeInseridoVisible(!this.state.modalNomeIncluido)}}
		     >
			     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', position: 'relative', paddingTop: 30}}>
			       <View style={{position: 'relative', paddingTop: 30, alignItems: 'center'}}>
			         <View style={{position: 'absolute', zIndex: 3, top: 0 }}>
			           <Image source={imgTicket} style={{width: 100, height: 105, backgroundColor: 'transparent'}}/>
			         </View>
			         <View style={{paddingTop: 15, backgroundColor: '#303030',height: 300, width: 325, alignItems: 'center', justifyContent: 'center', borderRadius: 15}}>
			           <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 15}}>
			             <View style={{zIndex: 2}}>
			               <Text style={{color: 'white', fontWeight: 'bold', fontSize: 22, textAlign: 'center'}}>Aeee! VIP Garantido!</Text>
			               <Text style={{color: 'white', fontSize: 18, textAlign: 'center'}}>É só chegar chegando no dia da</Text>
			               <Text style={{color: 'white', fontSize: 18, textAlign: 'center'}}>balada com um documento e falar o</Text>
			               <Text style={{color: 'white', fontSize: 18, textAlign: 'center'}}>código secreto: {this.props.codlista}</Text>
			             </View>
			             <View style={{zIndex: 2}}>
			               <TouchableHighlight style={styles.btnEntendi}
			                 onPress={() => {this.updateListaVisualizado()}}>
			                 <Text style={styles.txtEntendi}>ENTENDI</Text>
			               </TouchableHighlight>
			             </View>
			           </View>
			         </View>
			       </View>
			     </View>
	 		</Modal>
        </View>     
        {this.returnBotaoInserir()}  
        </View>
      );
  }
}

const styles = StyleSheet.create({
  btnComprar: {
    backgroundColor: '#EE2B7A',
    width: 200,
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
  txtStatusUsado: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textDecorationLine: 'line-through',
    textAlign: 'center'
  },
btnEntendi: {
  backgroundColor: '#EE2B7A',
  width: 175,
  alignItems: 'center',
  padding: 10,
  borderRadius: 30,
  marginTop: 20,
  marginBottom: 15
},
txtEntendi: {
  color: 'white',
  fontSize: 17,
  fontWeight: 'bold'
},
});
