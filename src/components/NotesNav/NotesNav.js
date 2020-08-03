import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import './NotesNav.css';

const NotesNav = ({addEmptyNote, deleteNote, getSearchText}) => {	

	const onSearchChange = (event) => {
		getSearchText(event.target.value)
	  };

	return (
			<nav className="stickyNav bg-black pv1" style={{display: "flex", justifyContent:"space-around"}}>
				<div>
				<div className="f6 link pointer dim br-pill ph3 pv2 mb2 mr3 dib white bg-mid-gray" 
					onClick={() => addEmptyNote()}>
					Add Note
				</div>
				<div className="f6 link pointer dim br-pill ph3 pv2 mb2 mr3 dib white bg-mid-gray" 
					onClick={() => deleteNote()}>Delete Note
				</div>
				<div className="f6 link pointer dim br-pill ph3 pv2 mb2 dib white bg-mid-gray" 
					onClick={()=>{console.log("Category change clicked")}}>Category
				</div>
				</div>
				<SearchBar onSearchChange={onSearchChange}/>
			</nav>);
}

export default NotesNav;