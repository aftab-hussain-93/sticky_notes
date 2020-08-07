import React from 'react';
import Tilt from 'react-tilted'
import LogoImage from './logo_transparent.png';
import './Logo.css';

const Logo = (props) =>{
	return (
		<div onClick={()=>props.onRouteChange('home')} className="ml4 mt0 pointer">
			<Tilt className="Tilt shadow-2" options={{ max : 60 }} style={{ height: 70, width:70 }} >
 				<div className="Tilt-inner pa0 ma0"> <img alt="sticky-logo" src={LogoImage}/> </div>
			</Tilt>
		</div>)
}

export default Logo;
