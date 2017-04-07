import React, { Component } from 'react';
import { Container, Content, Picker } from 'native-base';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native'; 

//const Item = Picker.Item;​
const Item = Picker.Item;
export default class PickerExample extends Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     selectedItem: undefined,
        //     selected1: 'key-1',
        //     results: {
        //         items: []
        //     }
        // }
        this.state = { filter : ''};
        this.handler = this.handler.bind(this);
    }

    componentWillMount() {
      this.handler('Recentes');
    }

    handler(filter){
      this.props.filterUser(filter);
      this.setState({filter : filter})
    }
    // onValueChange (value: string) {
    //     this.setState({
    //         selected1 : value
    //     });
    // }

  //Antigo filtro
  // <View style={{backgroundColor: '#303030', width: 350}}>
  //           <Picker style={{color:'#F467B4'}}
  //                       iosHeader="Select one"
  //                       mode="dropdown"
  //                       selectedValue={this.state.selected1}
  //                       onValueChange={this.onValueChange.bind(this)}>
  //                       <Item label="Publicações Recentes" value="key-1" />
  //                       <Item label="Rolando agora" value="key0" />
  //                       <Item label="Bombando" value="key1" />
  //                  </Picker>
  //        </View>
  renderActivateFilterText(filter){
    if(this.state.filter == filter){
        return styles.txtAtivado
    }
    else{
         return styles.txtDesativado
    }
  }
  renderActivateFilterButton(filter){
    if(this.state.filter == filter){
        return styles.buttonAtivado
    }
    else{
         return styles.buttonDesativado
    }
  }


    render() {
        return (
            <View style={{flex: 1,alignItems: 'flex-end', justifyContent: 'space-around', flexDirection: 'row'}}>
                <View style={this.renderActivateFilterButton("Recentes")}>
                     <TouchableHighlight 
                        onPress={() => { this.handler("Recentes")}}
                        underlayColor={'transparent'}
                        activeOpacity={0.9}>
                        <Text style={this.renderActivateFilterText("Recentes")}>Recentes</Text>
                     </TouchableHighlight>
                </View>
                <View style={this.renderActivateFilterButton("Rolando Agora")}>
                     <TouchableHighlight 
                        onPress={() => {this.handler("Rolando Agora")}}
                        underlayColor={'transparent'}
                        activeOpacity={0.9}>
                        <Text style={this.renderActivateFilterText("Rolando Agora")}>Rolando Agora</Text>
                     </TouchableHighlight>                
                </View>
                <View style={this.renderActivateFilterButton("Bombando")}>
                     <TouchableHighlight 
                        onPress={() => {this.handler("Bombando")}}
                        underlayColor={'transparent'}
                        activeOpacity={0.9}>                         
                        <Text style={this.renderActivateFilterText("Bombando")}>Bombando</Text>
                     </TouchableHighlight>                
                </View>
                <View style={this.renderActivateFilterButton("Curtidas")}>
                     <TouchableHighlight 
                        onPress={() => {this.handler("Curtidas")}}
                        underlayColor={'transparent'}
                        activeOpacity={0.9}>                         
                        <Text style={this.renderActivateFilterText("Curtidas")}>Curtidas</Text>
                     </TouchableHighlight>                
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    txtAtivado: {
        color: '#EE2B7A',
    },
    txtDesativado: {
        color: '#737373'
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

