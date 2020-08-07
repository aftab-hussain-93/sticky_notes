import React, {Component} from 'react';
import ContentEditable from "react-contenteditable";
import './Notes.css';

class Notes extends Component {
	
	constructor(props){
		super(props)
		this.myRef = React.createRef();
		this.state = {
			text:props.text,
			edited: null,
			isNew: props.isNew,
			note_id: this.props.note_id,
			selected: false,
			displayId: this.props.displayId,
			deleted: false,
			due_date:null
			// color:props.color
		}
	}

	setReminderTime = (reminderTime) =>{
		this.setState({due_date:reminderTime},()=>{return true});
	}

	setAsEdited = () => {
		this.setState({edited:true},()=>{return true});
	}

	setAsDelete = () => {
		this.setState({deleted:true},()=>{return true});
	}

	handleChange = evt => {
	    this.setState({ text: evt.target.value, edited:true });
	  };

	resetState = () =>{
		return {edited:false, isNew:false}
	}

	saveChanges = () => {
	//Send a put/post request to the database to update/create a note
	const {edited, isNew, text, note_id, deleted, due_date } = this.state;
			if(isNew && (!deleted)){
				// Post request for creation
				fetch(`/api/notes/create?token=${this.props.token}`,
				{
					method:'post',
					headers:{
								'Content-Type':'application/json',
								'Accept': 'application/json'
							},
					body: JSON.stringify({
						text:text,
						category_id: 1,
						due_date:due_date
					})
				})
				.then(res=>res.json())
				.then(data=>{console.log(data)});
				this.setState(this.resetState());
				return;
			}
			else if(edited && (!deleted)){
				// Put request to update the data
				fetch(`/api/notes/update?token=${this.props.token}`,
				{
					method:'put',
					headers:{
								'Content-Type':'application/json',
								'Accept': 'application/json'
							},
					body: JSON.stringify({
						text:text,
						note_id: note_id,
						due_date:due_date
				})
				})
				.then(res=>res.json())
				.then(data=>{console.log(data)});
				this.setState(this.resetState());
		}
	}

  	setSelected() {
  		this.setState({selected:true})
  		this.myRef.current.classList.remove("bg-light-green");
  		this.myRef.current.classList.add("bg-washed-yellow");
  		const {selectedNote} = this.props;
  		selectedNote(this)
  	}

  	setBlur() {
  		this.setState({selected:false})
  		this.myRef.current.classList.remove("bg-washed-yellow");
  		this.myRef.current.classList.add("bg-light-green");
  	}

	render() {
		return (
		<div 
		className="w-20-l w-100-ns w-100-m pointer h4 tc bg-light-green br3 pa2 ma2 bw2 shadow-5" 
		ref={this.myRef} 
		tabIndex="1" 
		onBlur={()=>{this.setBlur()}} 
		onFocus={()=>{this.setSelected()}}>
			<ContentEditable
			  className="note_text"
              innerRef={this.contentEditable}
              html={this.state.text} // innerHTML of the editable div
              disabled={false}       // use true to disable editing
              onChange={this.handleChange} // handle innerHTML change
            />
		</div>);
	};
}

export default Notes;