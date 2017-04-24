import React, { Component } from 'react';
import { StyleSheet,  Text,  View, TouchableHighlight, Image, Modal } from 'react-native';
import {firebaseRef, auth} from '../FirebaseConfig'
import { Actions } from 'react-native-router-flux';
import {FBLogin, FBLoginManager} from 'react-native-facebook-login';

const imgCheckin = require('../imgs/bt-central.png');
const imgCheckedin = require('../imgs/bt-central-2.png');
const imgPin = require('../imgs/PIN.png');
const imgBell = require('../imgs/bell.png');
const imgTimer = require('../imgs/timer-bt.png');


export default class botaoLike extends Component {
  constructor(props){
    super(props);
    this.state = { Checkedin : false};
    this.state = {modalCheckinVisible : false};
    this.state = {modalLembreteVisible : false};
   }

  setmodalCheckinVisible(visible) {
    this.setState({modalCheckinVisible: visible});
  }
  setmodalLembreteVisible(visible) {
    this.setState({modalLembreteVisible: visible});
  }

   componentWillMount() {
    this.setmodalCheckinVisible(false);
    this.setmodalLembreteVisible(false);
    // alert(this.props.evNome);
    const usuarioAtual = auth.currentUser;
      var refData = firebaseRef.child('user/'+ usuarioAtual.uid);
      refData.on('value',(snapshot) => {
        if (snapshot.child('/eventosCheckin' + '/evID/' + this.props.evID).exists()){
          // console.log('existe o nó:');
          var evCheckedin = snapshot.child('/eventosCheckin' + '/evID/' + this.props.evID).val();
          //Se o nó existe é ´porque o usuario já deu like nesse evento
          //Verifica qual é o estado atual do like
          // console.log(evLiked.liked);
          if(evCheckedin.Checkedin){
            this.setState({Checkedin: true});
            // console.log('existe o nó: setou estado true');
          }
          else{
            this.setState({Checkedin: false});
            // console.log('existe o nó: setou estado false');
          }
          
        }
        else{
          this.setState({Checkedin: false});
          // console.log('nao existe o nó: setou estado false');
        }
      }); 
   }
  
  actionCheckedinBtn(){
      this.setmodalCheckinVisible(false);
      var evCheckin = 0;
      var refDataEvento = firebaseRef.child('eventos/'+ this.props.evID);
      refDataEvento.on('value',(snapshot) => {
        evCheckin = snapshot.val().evCheckin;
      }); 
    const usuarioAtual = auth.currentUser;
    if(this.state.Checkedin){
      //atualiza usuario
      firebaseRef.child('user/'+ usuarioAtual.uid + '/eventosCheckin/evID/' + this.props.evID).set({
        Checkedin : false
      });
      //atualiza evento
      firebaseRef.child('eventos/'+ this.props.evID).update({
        evCheckin : evCheckin - 1
      });
    }
    else{
      //atualiza usuario
     firebaseRef.child('user/'+ usuarioAtual.uid + '/eventosCheckin/evID/' + this.props.evID).set({
        Checkedin : true
      });
     //atualiza evento
      firebaseRef.child('eventos/'+ this.props.evID).update({
        evCheckin : evCheckin + 1
      });
    }
    
  }

  actionLembreteBtn(opcao){
    this.setmodalLembreteVisible(false);
     
    const usuarioAtual = auth.currentUser;
      //atualiza usuario
     firebaseRef.child('user/'+ usuarioAtual.uid + '/eventosLembretes/evID/' + this.props.evID).set({
        evPeridiocidade : opcao
      });
  }
  
  disableCheckin(){
    if(this.state.Checkedin){
      return true
    } else{
      return false
    }
  }

  returnModal(modalCheckIn){

    if(modalCheckIn){
      return <Modal 
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalCheckinVisible}
                onRequestClose={() => {this.setmodalCheckinVisible(!this.state.modalCheckinVisible)}}
                >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', position: 'relative', paddingTop: 30}}>
                  <View style={{position: 'relative', paddingTop: 30, alignItems: 'center'}}>
                    <View style={{position: 'absolute', zIndex: 3, top: 0 }}>
                      <Image source={imgPin} style={{width: 70, height: 105, backgroundColor: 'transparent'}}/>
                    </View>
                    <View style={{paddingTop: 15, backgroundColor: '#303030',height: 225, width: 300, alignItems: 'center', justifyContent: 'center', borderRadius: 15}}>
                      <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 15}}>
                        <View style={{zIndex: 2}}>
                          <Text style={{color: '#e5e5e5', fontWeight: 'bold', fontSize: 18, textAlign: 'center'}}>{this.props.evNome}</Text>
                        </View>
                        <View style={{zIndex: 2}}>
                          <TouchableHighlight style={styles.btnCheckin}
                            onPress={() => {
                            this.actionCheckedinBtn()
                          }}>
                            <Text style={styles.txtComprar}>FAZER CHECK-IN</Text>
                          </TouchableHighlight>
                        </View>
                        <View style={{paddingTop: 10}}>
                          <TouchableHighlight style={styles.btnCancelar}
                            onPress={() => {
                            this.setmodalCheckinVisible(!this.state.modalCheckinVisible)
                          }}>
                            <Text style={styles.txtCancelar}>Cancelar</Text>
                          </TouchableHighlight>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
            </Modal>
    } else{
      return <Modal 
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalLembreteVisible}
                onRequestClose={() => {this.setmodalLembreteVisible(!this.state.modalLembreteVisible)}}
                >
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', position: 'relative', paddingTop: 30}}>
                  <View style={{position: 'relative', paddingTop: 30, alignItems: 'center'}}>
                    <View style={{position: 'absolute', zIndex: 3, top: 0 }}>
                      <Image source={imgBell} style={{width: 100, height: 105, backgroundColor: 'transparent'}}/>
                    </View>
                    <View style={{paddingTop: 15, backgroundColor: '#303030',height: 300, width: 325, alignItems: 'center', justifyContent: 'center', borderRadius: 15}}>
                      <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 15}}>
                        <View style={{zIndex: 2}}>
                          <Text style={{color: '#e5e5e5', fontWeight: 'bold', fontSize: 18, textAlign: 'center'}}>Quando você gostaria de ser lembrado sobre esse evento?</Text>
                        </View>
                        <View style={{zIndex: 2}}>
                          <TouchableHighlight style={styles.btnDiaEvento}
                            onPress={() => {
                            this.actionLembreteBtn('dia')
                          }}>
                            <Text style={styles.txtComprar}>NO DIA DO EVENTO</Text>
                          </TouchableHighlight>
                        </View>
                        <View style={{zIndex: 2}}>
                          <TouchableHighlight style={styles.btnSemanaEvento}
                            onPress={() => {
                            this.actionLembreteBtn('semana')
                          }}>
                            <Text style={styles.txtComprar}>NA SEMANA DO EVENTO</Text>
                          </TouchableHighlight>
                        </View>
                        <View style={{paddingTop: 10}}>
                          <TouchableHighlight style={styles.btnCancelar}
                            onPress={() => {
                            this.setmodalLembreteVisible(!this.state.modalLembreteVisible)
                          }}>
                            <Text style={styles.txtCancelar}>NÃO LEMBRAR</Text>
                          </TouchableHighlight>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
            </Modal>
    }
  }

  render() {
    if(this.props.modalCheckIn){
      if(this.state.Checkedin){
        return (
          <View style={{backgroundColor: 'transparent'}}>
            <TouchableHighlight style={{opacity: 0.5}}
               onPress={() => {this.setmodalCheckinVisible(!this.state.modalCheckinVisible)}}
               underlayColor={'transparent'}
               activeOpacity={0.5}
               disabled= {this.disableCheckin()}
               >
               <Image source={imgCheckedin} style={{width: 70, height: 59, backgroundColor: 'transparent'}}/>
            </TouchableHighlight>
          </View>
        );
      }else{
        return (
          <View>
            <View>
               {this.returnModal(this.props.modalCheckIn)}
            </View>
            <View>
              <TouchableHighlight 
                 onPress={() => {this.setmodalCheckinVisible(!this.state.modalCheckinVisible)}}
                 underlayColor={'transparent'}
                 activeOpacity={0.5}
                 disabled= {this.disableCheckin()}
                 >
                 <Image source={imgCheckin} style={{width: 70, height: 59, backgroundColor: 'transparent'}}/>
              </TouchableHighlight>        
            </View>
          </View>
        );
      }
    } else {
        return (
          <View>
            <View>
               {this.returnModal(this.props.modalCheckIn)}
            </View>
            <View style={{backgroundColor: 'transparent'}}>
              <TouchableHighlight 
                 onPress={() => {this.setmodalLembreteVisible(!this.state.modalLembreteVisible)}}
                 underlayColor={'transparent'}
                 activeOpacity={0.5}
                 disabled= {this.disableCheckin()}
                 >
                 <Image source={imgTimer} style={{width: 70, height: 59, backgroundColor: 'transparent'}}/>
              </TouchableHighlight>
            </View>            
          </View>

        );
    }
  }
}

const styles = StyleSheet.create({
 btnDiaEvento: {
  backgroundColor: '#EE2B7A',
  width: 150,
  alignItems: 'center',
  padding: 10,
  borderRadius: 30,
  marginTop: 10
},
btnCheckin: {
  backgroundColor: '#EE2B7A',
  width: 150,
  alignItems: 'center',
  padding: 10,
  borderRadius: 30,
  marginTop: 10
},
 btnSemanaEvento: {
  backgroundColor: '#EE2B7A',
  width: 200,
  alignItems: 'center',
  padding: 10,
  borderRadius: 30,
  marginTop: 10
},
txtComprar: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 12
},
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
