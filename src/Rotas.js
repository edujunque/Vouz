import React, { Component } from 'react';
import { Router, Scene, Actions } from 'react-native-router-flux';

import CenaLogin from './components/CenaLogin';
import CenaTimeLine from './components/CenaTimeLine';
import CenaEventoDetalhes from './components/CenaEventoDetalhes';
import CenaEventoGaleria from './components/CenaEventoGaleria';
import Galeria from './components/Galeria';
import CenaLoginFacebook from './components/CenaLoginFacebook';
import CenaEditarPerfil from './components/CenaEditarPerfil';
import CenaEntrarJa from './components/CenaEntrarJa';

const imgTemp = require('./imgs/NoPhoto_icon-user-default.png');

const Rotas = () => (
	<Router navigationBarStyle={{ backgroundColor: 'transparent', borderBottomColor: 'transparent', marginTop: 10 }}>
	    <Scene hideNavBar={true} key='login' component={CenaLogin} title='Login' initial={true} />
	    <Scene hideNavBar={true} key='timeline' component={CenaTimeLine} />
	    <Scene hideNavBar={false} key='eventodetalhes' 
	    		component={CenaEventoDetalhes} 
	    		leftButtonIconStyle = {{ tintColor:'#EE2B7A'}} 
	    		rightButtonImage={imgTemp}  
	    		onRight={()=>{Actions.editarPerfil()}}
       			rightTitle={null}
       			rightButtonIconStyle={{ width: 44, height: 44, opacity: 0.01 }}
        />
	    <Scene hideNavBar={false} key='eventogaleriafotos' component={CenaEventoGaleria} />
	    <Scene hideNavBar={false} navigationBarStyle={{ marginTop: 12, marginLeft: 7 }} leftButtonIconStyle = {{ tintColor:'transparent'}} key='galeria' component={Galeria} />
	    <Scene hideNavBar={false} key='CenaLoginFacebook' component={CenaLoginFacebook}  />
	    <Scene hideNavBar={false} key='editarPerfil' component={CenaEditarPerfil} leftButtonIconStyle = {{ tintColor:'#EE2B7A'}}/>
	    <Scene hideNavBar={false} key='entrarJa' component={CenaEntrarJa} leftButtonIconStyle = {{ tintColor:'#EE2B7A'}}/>
	</Router>
	);

export default Rotas;
