import React, {useState, useEffect} from 'react';
import SearchBar from '../SearchBar/SearchBar';
import DateTimePicker from 'react-datetime-picker';
import './NotesNav.css';

const useFetch = ()=>{
	const [categories, setCategories] = useState([]);
	const listCategories = (cat)=>{
		const result =  cat.map((elem)=>{
			return <p 
			key = {elem.key} 
			className="f5 br4 fw6 black ma0 pt1 pb1 underline-hover pointer" 
			style={{backgroundColor:elem.color}}>{elem.name}</p>
		})
		return result
	}	

	useEffect(() => {
		const fetchDetails = () => {
	    fetch('/api/categories')
	    .then(res=>res.json())
	    .then(data=>{
	    	const cat = data.categories.map((elem, index)=>{
	    		return {key:index, color:elem.category_color,name:elem.category_name}
	    	})
	    	setCategories(listCategories(cat));
	    })
	};
		    fetchDetails();
		  }, []);
	 return { categories };
    };

const NotesNav = ({addEmptyNote, deleteNote, getSearchText, addReminder, dateTime }) => {
	const [startDate, setDate] = useState(new Date());

	const handleChange = date => {
		setDate(date)
	}

	const onSearchChange = (event) => {
		getSearchText(event.target.value)
	}

	const getRelatedElement = (...args)=>{
		const errMsg = document.querySelector('.errorMsg');
		let e, func, parameter, rest;
		if(args.length === 2){
			[e, func] = args
		}
		else if(args.length > 2){
			[e, func, parameter, ...rest] = args
		}
		else{
			return;
		}
			if (e.relatedTarget){
				parameter?func(parameter):func()
			}
			else{			
				errMsg.textContent="No note is selected";
				setTimeout(() => {
					        errMsg.textContent=null;
					    },2000
				);
			}
			e.currentTarget.blur();
	}

	const { categories } = useFetch();

	return (
			<nav className="stickyNav pv1" style={{display: "flex", flexWrap: "wrap" ,justifyContent:"space-around"}}>
				<SearchBar onSearchChange={onSearchChange}/>
				<div>
					<div className="f5 link pointer br-pill fw5 grow ph3 pv2 mb2 mr3 dib white bg-mid-gray" 
						onClick={() => addEmptyNote()}>
						Add Note
					</div>
					<div 
						onFocus={e=>{getRelatedElement(e,deleteNote)}}
						tabIndex="1" 
						className="delBtn f5 link pointer br-pill fw5 grow ph3 pv2 mb2 mr3 dib white bg-mid-gray" 
						>Delete Note
					</div>
					<div 
						onFocus={e=>{
							getRelatedElement(e,addReminder,startDate)
						}}
						tabIndex="1" 
						className="remBtn f5 link pointer br-pill fw5 grow ph3 pv2 mb2 mr3 dib white bg-mid-gray" 
						>Add Reminder
					</div>
					<DateTimePicker
					  className="mr2"
				      onChange={handleChange}
				      value={startDate}
				    />
					<div className="f5 pointer link fw5 grow br-pill ph3 pv2 mb2 dib white bg-mid-gray dropdown" 
							onFocus={getRelatedElement}><span>Category</span>
						<div className="f5 br-pill ba0 ma0 dropdown-content">
							{categories}
						</div>
					</div>
				</div>
			</nav>);
}

export default NotesNav;