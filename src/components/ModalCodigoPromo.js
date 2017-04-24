import React, { Component } from 'react';
import { StyleSheet,  Text,  View, TouchableHighlight, Image, Modal } from 'react-native';
import {firebaseRef, auth} from '../FirebaseConfig'
import { Actions } from 'react-native-router-flux';

export default class botaoLike extends Component {
  constructor(props){
    super(props);
  	this.state = {modalCodPromoVisible : false};
    this.state = { codVisualizado : false};
    this.state = { codPromo : ''};
   }
  setmodalCodPromoVisible(visible) {
    this.setState({modalCodPromoVisible: visible});
  }

   componentWillMount() {
    // this.setmodalCheckinVisible(false);
    
    // alert(this.props.evNome);
    const usuarioAtual = auth.currentUser;
      var refData = firebaseRef.child('user/'+ usuarioAtual.uid);
      //evID = 0 significa adesão ao APP
      refData.on('value',(snapshot) => {
        
        if (snapshot.child('/codPromo' + '/evID/' + '0').exists()){
          // console.log('existe o nó:');
          var evCodPromo = snapshot.child('/codPromo' + '/evID/' + 0).val();
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
          firebaseRef.child('user/'+ usuarioAtual.uid + '/codPromo/evID/' + 0).set({
            cod : codTemp,
            codUsado : false,
            codVisualizado : false
          });
          //atualiza state com codPromo:
          this.setState({codPromo : codTemp});
          this.setState({codVisualizado: false});
          // console.log('nao existe o nó: setou estado false');
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
    firebaseRef.child('user/'+ usuarioAtual.uid + '/codPromo/evID/' + 0).update({
      codVisualizado : true
    });
    this.setState({codVisualizado : true});
    return true
  }
  render() {
    return (
		 <Modal 
		    animationType={"slide"}
		    transparent={true}
		    visible={!this.state.codVisualizado}
		    onRequestClose={() => {this.disableCodPromo()}}
		    >
		    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', position: 'relative', paddingTop: 30}}>
		    	<View style={{paddingTop: 15, backgroundColor: '#303030',height: 225, width: 300, alignItems: 'center', justifyContent: 'center', borderRadius: 15}}>
		    		<Text style={{color: 'white'}}>Seu código de adesão ao VOUZ é:</Text>
            <Text style={{fontSize: 40, color: 'white'}}>{this.state.codPromo}</Text>
              <TouchableHighlight style={styles.btnCancelar}
                 onPress={() => {this.disableCodPromo()}}
                 underlayColor={'transparent'}
                 activeOpacity={0.5}
                 >
                 <Text style={styles.txtCancelar}>FECHAR</Text>
              </TouchableHighlight>
		    	</View>
		    </View>
		</Modal>
	);
  }
}

const styles = StyleSheet.create({
 btnCancelar: {
  backgroundColor: 'transparent',
  width: 155,
  alignItems: 'center',
  padding: 5,
  borderRadius: 30,
  borderWidth: 1,
  borderColor: '#737373'
},
txtCancelar: {
  color: '#737373',
  fontWeight: 'bold',
  fontSize: 12
}
});
