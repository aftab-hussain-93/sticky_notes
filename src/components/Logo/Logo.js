import React from 'react';
// import Tilt from 'react-tilt';
import Tilt from 'react-tilted'
import Brain from './brain.png';
import './Logo.css';

const Logo = (props) =>{
	return (
		<div onClick={()=>props.onRouteChange('home')} className="ml4 mt0 pointer">
			<Tilt className="Tilt shadow-2" options={{ max : 60 }} style={{ height: 75, width: 75 }} >
 				<div className="Tilt-inner"> <img alt="brain-logo" src={Brain}/> </div>
			</Tilt>
		</div>)
}

export default Logo;
