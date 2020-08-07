import React from 'react';

const SearchBar = ({onSearchChange}) =>{
	return (
			<input 
				className = "f6 link br-pill ph3 pv2 mb2"
				type = "search" 
				placeholder = "Search" 
				onChange={onSearchChange}
			/>);
}

export default SearchBar;