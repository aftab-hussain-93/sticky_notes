import React, {useState,useEffect} from 'react';
import SearchBar from '../SearchBar/SearchBar';
import './NotesNav.css';

const useFetch = ()=>{
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);

	const makeCategories = (cat)=>{
		const result =  cat.map((elem)=>{
			return <p key = {elem.key} className="f5 br4 fw6 black ma0 pt1 pb1 underline-hover pointer" style={{backgroundColor:elem.color}}>{elem.name}</p>
		})
		return result
	}	

	useEffect(() => {
		const fetchDetails = () => {
	    fetch('/categories')
	    .then(res=>res.json())
	    .then(data=>{
	    	const cat = data.categories.map((elem, index)=>{
	    		return {key:index, color:elem.category_color,name:elem.category_name}
	    	})
	    	setCategories(makeCategories(cat));
	    	setLoading(false);
	    })
	};
		    fetchDetails();
		  }, []);
	 return { categories, loading };
    };


const NotesNav = ({addEmptyNote, deleteNote, getSearchText, showDelete}) => {

	const onSearchChange = (event) => {
		getSearchText(event.target.value)
	  };

	const getRelatedElement = (e)=>{
		const errMsg = document.querySelector('.errorMsg');

		if (e.relatedTarget){
			deleteNote()
		}else{			
			errMsg.textContent="No note is selected";
			setTimeout(() => {
				        errMsg.textContent=null;
				    },2000
				);
		}
		e.currentTarget.blur();
	}

	const { categories, loading } = useFetch();

	return (
			<nav className="stickyNav pv1" style={{display: "flex", justifyContent:"space-around"}}>
				<SearchBar onSearchChange={onSearchChange}/>
				<div>
				<div className="f5 link pointer dim br-pill ph3 pv2 mb2 mr3 dib white bg-mid-gray" 
					onClick={() => addEmptyNote()}>
					Add Note
				</div>
					<div 
						onFocus={getRelatedElement}
						tabIndex="1" 
						className="f5 link pointer dim br-pill ph3 pv2 mb2 mr3 dib white bg-mid-gray" 
						>Delete Note
					</div>
				<div className="f5 dropdown pointer link br-pill ph3 pv2 mb2 dib white bg-mid-gray" 
					onClick={()=>{console.log("Category change clicked")}}><span>Category</span>
					<div className="f5 br-pill ba0 ma0 dropdown-content">
						{categories}
					</div>
				</div>
				</div>
			</nav>);
}

export default NotesNav;