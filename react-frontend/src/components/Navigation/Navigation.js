import React from 'react';
import Logo from '../Logo/Logo';
import './Navigation.css';
const Navigation = ({ onRouteChange, isSignedIn, unLoadUser }) => {

return (
	<nav className="bg-black dt w-100 center" style={{display: "flex", justifyContent:"flex-end"}}>
			<Logo onRouteChange={onRouteChange}/>
		{isSignedIn?
			<p onClick={ () => {
				unLoadUser();
				onRouteChange('signin')
			              }} 
			className="f4 pointer pa0 fw6 dim no-underline white mb2 ph3">Sign Out
			</p>:<><p
				onClick={ () => onRouteChange('signin') } 
				className="f4 pointer pa0 fw6 dim no-underline white mb2 ph3">Login
				</p>
				<p
				onClick={ () => onRouteChange('register') } 
				className="f4 pointer  pa0 fw6 dim no-underline white mb2 ph3">Register
				</p></>}
	</nav>);
}
export default Navigation;