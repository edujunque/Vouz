import React, { Component } from 'react';
import { StyleSheet,  Text,  View, TouchableHighlight } from 'react-native';
import {firebaseRef, auth} from '../FirebaseConfig'
import { Actions } from 'react-native-router-flux';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';
import ProgressBarClassic from 'react-native-progress-bar-classic';
import * as Progress from 'react-native-progress';

export default class botaoResgatarCupom extends Component {
  constructor(props){
    super(props);
    this.state = {modalCodPromoVisible : false};
    this.state = { codVisualizado : false};
    this.state = { codPromo : '' };
    this.state = { txtBtnResgatar : '' };
    this.state = { btnResgatarAtivo : true}
    this.state = { txtUsado : false}
    this.state = { txtDescrBtnResgatar : ''}
    this.state = { percCuponsUsados : 0}
    this.state = { numCuponsDisponiveis : 0}
   }
  setmodalCodPromoVisible(visible) {
    this.setState({codVisualizado: visible});
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
    
        if (snapshot.child('/codPromo' + '/evID/' + this.props.evID).exists()){
          // console.log('existe o nó:');
          var evCodPromo = snapshot.child('/codPromo' + '/evID/' + this.props.evID).val();
          // alert('entrou no que existe codigo');
          //atualiza state com codPromo:
          this.setState({txtBtnResgatar : evCodPromo.cod});
          this.setState({btnResgatarAtivo : false});
          this.setState({txtUsado : evCodPromo.codUsado});
          this.setState({txtDescrBtnResgatar : evCodPromo.codUsado == true ? "código usado" : "seu código"});
        }
        else{
          //obtem dados do Evento
          //Obtem qtd de codigos gerados:
          var promoCuponsUsados = 0;
          var refDataEvento = firebaseRef.child('eventos/'+ this.props.evID + '/evPromo');
          refDataEvento.on('value',(snapshot) => {
            promoCuponsUsados = snapshot.val().promoCuponsUsados;
            if(snapshot.val().promoCuponsUsados >= snapshot.val().promoQtdCupons){
              //Não deve permitir mais geração de cupons
              this.setState({txtBtnResgatar : "RESGATAR"});
              //Ativa botão para resgate:
              this.setState({btnResgatarAtivo : false});
              this.setState({txtUsado : true});
              this.setState({txtDescrBtnResgatar : "códigos esgotados"});          
            }else{
              //Pode gerar mais cupons
              this.setState({txtBtnResgatar : "RESGATAR"});
              //Ativa botão para resgate:
              this.setState({btnResgatarAtivo : true});
              this.setState({txtUsado : false});
              this.setState({txtDescrBtnResgatar : "resgate seu código"});
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
      var refDataEvento = firebaseRef.child('eventos/'+ this.props.evID + '/evPromo');
      refDataEvento.on('value',(snapshot) => {
          //calcula porcentagem dos cupons usados.
          this.setState({percCuponsUsados : ((100*snapshot.val().promoCuponsUsados)/snapshot.val().promoQtdCupons)/100});
          //popula state com total de cupons disponiveis
          this.setState({numCuponsDisponiveis : (snapshot.val().promoQtdCupons - snapshot.val().promoCuponsUsados)});    
      });                  
  }

   btnResgatar() {
    // alert(this.props.evNome);
    const usuarioAtual = auth.currentUser;
      var refData = firebaseRef.child('user/'+ usuarioAtual.uid);
      //evID = 0 significa adesão ao APP
      refData.on('value',(snapshot) => {
        
        if (snapshot.child('/codPromo' + '/evID/' + this.props.evID).exists()){
          // console.log('existe o nó:');
          var evCodPromo = snapshot.child('/codPromo' + '/evID/' + this.props.evID).val();
          //Caso já tenha o nó evID = 0 significa que já recebeu o codigo
          //Verifica qual é o estado atual da visuzliação do código
          // console.log(evLiked.liked);
          if(evCodPromo.codVisualizado){
            this.setState({codVisualizado: true});
            // console.log('existe o nó: setou estado true');
          }
          else{
            this.setState({codVisualizado: false});
            // console.log('existe o nó: setou estado false');
          }
          //atualiza state com codPromo:
          this.setState({codPromo : evCodPromo.cod});
        }
        else{
          //Codigo de adesão ainda não foi gerado.
          //Gerar codigo de adesão e armazena no banco de dados:
          var codTemp = this.geraCodigoAdesao();

          //Obtem qtd de codigos gerados:
          var promoCuponsUsados = 0;
          var refDataEvento = firebaseRef.child('eventos/'+ this.props.evID + '/evPromo');
          refDataEvento.on('value',(snapshot) => {
            promoCuponsUsados = snapshot.val().promoCuponsUsados;
          }); 

          //Atualiza usuario
          firebaseRef.child('user/'+ usuarioAtual.uid + '/codPromo/evID/' + this.props.evID).set({
            cod : codTemp,
            codUsado : false,
            codVisualizado : false,
            evID : this.props.evID
          });

          //Atualiza evento
          firebaseRef.child('eventos/'+ this.props.evID + '/evPromo').update({
            promoCuponsUsados : promoCuponsUsados + 1
          });


          //atualiza state com codPromo:
          this.setState({codPromo : codTemp});
          this.setState({codVisualizado: false});
          //seta texto do botão de resgatar;
          this.setState({txtBtnResgatar : codTemp});
          // console.log('nao existe o nó: setou estado false');
          this.setState({txtDescrBtnResgatar : "seu código"});
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

  disableCodPromo(){
    const usuarioAtual = auth.currentUser;
    //atualiza evento visualização
    firebaseRef.child('user/'+ usuarioAtual.uid + '/codPromo/evID/' + this.props.evID).update({
      codVisualizado : true
    });
    this.setState({codVisualizado : true});
    return true
  }
  render() {
    return(
      <View style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: 'transparent', justifyContent: 'center', paddingBottom: 5}}>
          <Text style={{textAlign: 'center', color: 'white'}}>{this.state.numCuponsDisponiveis} cupons disponíveis</Text>
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
  txtStatusUsado: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textDecorationLine: 'line-through',
    textAlign: 'center'
  },
});
