import React from 'react';
import Logo from '../Logo/Logo';

const Navigation = ({ onRouteChange, isSignedIn, unLoadUser }) => {	
	return (
		<nav className="dt w-100 mw8 center" style={{display: "flex", justifyContent:"flex-end"}}>
			<Logo onRouteChange={onRouteChange}/>
			{isSignedIn?
		<p onClick={ () => {
			unLoadUser();
			onRouteChange('home')
		              } } 
		className="f6 fw4 hover-white no-underline white-70 dn dib-ns pv2 ph3">Sign Out
		</p>:<><p
			onClick={ () => onRouteChange('signin') } 
			className="f6 fw4 hover-white no-underline white-70 dn dib-ns pv2 ph3">Login
			</p>
			<p
			onClick={ () => onRouteChange('register') } 
			className="f4 lh-copy link dim pointer white pa3 pt0">Register
			</p></>}
		</nav>);
}

export default Navigation;

