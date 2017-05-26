import React, { Component } from 'react';
import { StyleSheet,  Text,  View, TouchableHighlight, TouchableOpacity, Image, TextInput } from 'react-native';
import {firebaseRef, auth} from '../FirebaseConfig'
import { Actions } from 'react-native-router-flux';
import AnalyticsGoogle from '../AnalyticsGoogle'

const imgBackground = require('../imgs/bg.jpg');

export default class CenaEventoDetalhes extends Component {
  constructor(props){
    super(props);
    this.state = { codigopromoter : ''};

  }

  entrar(){
  	AnalyticsGoogle.trackEvent('Escolha Promoter', 'Entrada de novo codigo');
  	//verifica se o codigo digitado pertence a algum evento
 	var codigoPromoter = this.state.codigopromoter;
  	var refData = firebaseRef.child('eventos');
  	var blnVerificaCodigo = false;
	  refData.on('value',(snapshot) => {
	    snapshot.forEach( function(item) {
				    if (item.child('/evPromoters').exists()){
				    	if(item.val().evPromoters[1].cod == codigoPromoter.toUpperCase()){
				    		blnVerificaCodigo = true;
				    		Actions.eventoLista({evID: item.val().evID});
				    	} else{
							//codigo não é igual				    		
				    	}
				    }
				    else{
				    	//não existe promotor para esse evento
				    }	  
	    		}
	    	)
		if(!blnVerificaCodigo){
			alert('Verifique o código digitado!')
		}	    
	  });   	
  }

componentWillMount() {
    AnalyticsGoogle.trackScreenView('Escolha Promoter');	
}

  render() {
    return (
		<Image style={{flex: 1, height: null, width: null, resizeMode: 'cover'}} source= {imgBackground}>
		    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0)', position: 'relative'}}>
		    	<View style={{alignItems: 'center', justifyContent: 'center'}}>
		    		<Text style={{color: 'white', fontSize: 46, textAlign: 'center', marginBottom: 20}}>E aí, beleza?</Text>
		    		<Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>Nosso App é só pra uma galerinha </Text>
		    		<Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>VIP, por isso precisamos de um código </Text>
		    		<Text style={{color: 'white', fontSize: 16, textAlign: 'center'}}>fornecido por um dos promoters </Text>
		    		<Text style={{color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 15}}>parceiros:</Text>
				      <TextInput
				      style={styles.formText}
				      underlineColorAndroid='rgba(0,0,0,0)'
				      placeholder=""
				      placeholderTextColor='white'
				      onChangeText={(codigopromoter) => this.setState({codigopromoter})}
				      value={this.state.codigopromoter}
				    />		    		
	              <TouchableHighlight style={styles.btnCriarConta}
	                 onPress={() => {this.entrar()}}
	                 underlayColor={'transparent'}
	                 activeOpacity={0.5}
	                 >
	                 <Text style={styles.txtEntrar}>PROSSEGUIR</Text>
	              </TouchableHighlight>
		    	</View>
		    </View>
       </Image>
    );
  }
}

const styles = StyleSheet.create({
 formText: {
	  color: 'white',
	  height: 45, 
	  width: 200,
	  paddingLeft: 10,
	  backgroundColor: 'rgba(0, 0, 0, 0.5)',
	  borderRadius: 30,
	  marginTop: 10,
	  marginBottom: 35,
	  borderWidth: 1,
	  borderColor: 'grey'
 },
  btnCriarConta: {
	  backgroundColor: '#EE2B7A',
	  width: 200,
	  alignItems: 'center',
	  padding: 15,
	  borderRadius: 30,
},
  txtEntrar: {
  	color: 'white',
  	fontWeight: 'bold'
},
});