import React from 'react';
import Notes from '../Notes/Notes';
import NotesNav from '../NotesNav/NotesNav';
import './NotesList.css';
import uuid from 'react-uuid'

class NotesList extends React.Component{

	constructor(props){
		super(props)
		this.references = {};
		this.dateTime = null;
		this.state = {
			all_notes:[],
			selected_note_id:null,
			search_text:'',
			token:null
		}
	}

	getOrCreateRef(id) {
		/*
		Making references for all notes displayed in the list
		*/
	    if (!this.references.hasOwnProperty(id)) {
	        this.references[id] = React.createRef();
	    }
	    return this.references[id];
	}

	componentDidMount(){
		if(this.props.user){
			const { name, token } = this.props.user;
			this.setState({token:token ,name:name })
			fetch(`/api/notes/${name}?token=${token}`,{
				method:'post'
			})
			.then(res=>res.json())
			.then(data=>{
				const all_notes = data.notes.map((note, idx)=>{
					return {index:idx, isNew:false, note:note}
				})
				this.setState({all_notes:all_notes})
				});
		}
	}

	componentWillUnmount(){
		if(this.props.user){
			this.saveAllNotes()
		}
	}

	saveAllNotes(){
		/*
		Save all the notes in the list
		*/
		const { all_notes } = this.state

		all_notes.forEach((note)=>{
			this.getOrCreateRef(note.index).current.saveChanges()
		})
	}

	addEmptyNote(){
		/*
		Called when Add Note button is clicked.
		*/
		const {all_notes} = this.state;
		const note = {index:uuid(), isNew:true, note:{note_text: "Enter text here", due_date: null}}

		all_notes.push(note)
		this.setState({all_notes:all_notes});
	}

	addReminder(reminderTime){
		let { all_notes, selected_note_id, token } = this.state
		const errMsg = document.querySelector('.errorMsg');
		const successMsg = document.querySelector('.successMsg');

		if(typeof selected_note_id !== 'undefined'){
			// Deleting from the UI
			const reminder_note = all_notes.filter((note)=>{
				return note.index === selected_note_id
			})
			
			if(reminder_note[0].isNew){
					this.getOrCreateRef(selected_note_id).current.setReminderTime(reminderTime)
				}
			else{
				this.getOrCreateRef(selected_note_id).current.setAsEdited()
				this.getOrCreateRef(selected_note_id).current.setReminderTime(reminderTime)
			}
		}
		else
		{
			alert("no note selected")
		}
	}

	deleteNote(){
	/*
	Deletes the note from UI first and then from the database if it is present in it.
	*/	
		let { all_notes, selected_note_id, token } = this.state
		const errMsg = document.querySelector('.errorMsg');
		const successMsg = document.querySelector('.successMsg');

		if(typeof selected_note_id !== 'undefined'){
			// Deleting from the UI
			const delete_note = all_notes.filter((note)=>{
				return note.index === selected_note_id
			})
			this.getOrCreateRef(selected_note_id).current.setAsDelete()

			const new_notes = all_notes.filter((note)=>{
				return note.index !== selected_note_id
			})
			setTimeout(()=>{
				this.setState({all_notes:new_notes})
			}, 500)

			if(delete_note[0].isNew){
				return
			}else{
			//Deleting from the database
			fetch(`/api/notes/delete?token=${token}`,{
				method:'post',
				headers: {'Content-Type':'application/json'},
				body:JSON.stringify({
					note_id:delete_note[0].note.id
				})
			})
			.then(res=>res.json())
			.then(data=>{
				if("error" in data){
					errMsg.textContent=data.error;
					successMsg.textContent=null;
				}
				else{
					successMsg.textContent = "Note deleted!";
					errMsg.textContent=null;
				}
				setTimeout(() => {
				        successMsg.textContent=null;
				        errMsg.textContent=null;
				    },3000
				);
			})
			}			
		}
		else
		{
			alert("no note selected")
		}
		this.setState({selected_note_id:null})			
	}	

	selectedNote(note){
		/*
		Method to denote the selected note
		*/
		const { displayId } = note.state;
		this.setState({selected_note_id:displayId , showDelete:true})
	}

	getSearchText(text){
		/*
		The text in the search box
		*/
		this.setState({search_text : text})
	}

	renderedNotes() {
		const {all_notes, search_text} = this.state;		
		const filtered_notes = all_notes.filter((note)=>      
			{
				return note.note.note_text.replace(/<[^>]+>/g, '')
        		.toLowerCase()
        		.includes(search_text.toLowerCase().trim());
        		});

		let render_list = filtered_notes.map((note)=>{
			let  isNew, note_id, key;
			const text = note.note.note_text;
			const displayId = note.index;
			if(typeof note.note.id ==="undefined"){
				key = note.index;
				note_id = null;
				isNew = true;
			}else{
				key = note.note.public_key;
				note_id = note.note.id;
				isNew = false;
			}
			return <Notes 
				token = {this.state.token}
				ref = {this.getOrCreateRef(displayId)}
				selectedNote={this.selectedNote.bind(this)} 
				displayId={displayId} 
				note_id={note_id} 
				key={key} 
				isNew = {isNew}
				text={text}/>	
		})
		return render_list;
		}

	render(){
		const all_notes = this.renderedNotes();
		return (
			<>
				<NotesNav 
						dateTime = {this.dateTime}
						addReminder={this.addReminder.bind(this)}
						addEmptyNote={this.addEmptyNote.bind(this)}  
						deleteNote={this.deleteNote.bind(this)}
						getSearchText={this.getSearchText.bind(this)}/>
					<p className="errorMsg"></p>
				    <p className="successMsg"></p>
					<div className="allNotes">
						{all_notes}
					</div>
			</>);
	}
}


export default NotesList;