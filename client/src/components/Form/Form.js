import React, {useState, useEffect} from 'react';
import {Button, Paper, TextField, Typography} from "@material-ui/core";
import FileBase from "react-file-base64";
import useStyles from './styles';
import {useDispatch} from "react-redux";
import {createPost, updatePost} from "../../actions/posts";
import {useSelector} from "react-redux";
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import {v4 as uuidv4} from 'uuid';

const Form = ({currentId, setCurrentId}) => {
	const [postData, setPostData] = useState({
		creator: '',
		title: '',
		ingredient: [],
		instruction: [],
		selectedFile: ''
	});
	const [ingredientInput, setIngredientInput] = useState([{
		id: uuidv4(), ingredient: ''
	}]);
	const [instructionInput, setInstructionInput] = useState([{
		id: uuidv4(), instruction: ''
	}]);
	const post = useSelector((state) => currentId ? state.posts.find((p) => p._id === currentId) : null);
	const classes = useStyles();
	const dispatch = useDispatch();

	useEffect(() => {
		if (post) {
			setPostData(post);
			// console.log(ingredientInput);
			// setIngredientInput(post.ingredient);
			// setInstructionInput(post.instruction);
		};
	}, [post])


	const handleSubmit = (e) => {
		e.preventDefault();

		if (currentId) {
			dispatch(updatePost(currentId, postData));
		} else {
			dispatch(createPost(postData));
			// console.log(postData);
		}
		clear();
	}

	const clear = () => {
		setCurrentId(null);
		setPostData({
			creator: '',
			title: '',
			ingredient: [],
			instruction: [],
			selectedFile: ''
		});
		setIngredientInput([{
			id: uuidv4(), ingredient: ''
		}])
		setInstructionInput([{
			id: uuidv4(), instruction: ''
		}])
	}

	const handleAddIngredientField = () => {
		setIngredientInput([...ingredientInput, {id: uuidv4(), ingredient: ''}])
	};

	const handleRemoveIngredientField = (id) => {
		const values = [...ingredientInput];
		values.splice(values.findIndex(value => value.id === id), 1);
		setIngredientInput(values);
	};

	const handleAddInstructionField = () => {
		setInstructionInput([...instructionInput, {id: uuidv4(), instruction: ''}]);
	}

	const handleRemoveInstructionField = (id) => {
		const values = [...instructionInput];
		values.splice(values.findIndex(value => value.id === id), 1);
		setInstructionInput(values);
	};

	const handleIngredientChangeInput = (id, event) => {
		const newIngredientInputFields = ingredientInput.map(i => {
			if (id === i.id) {
				i[event.target.name] = event.target.value;
			}
			return i;
		})
		setIngredientInput(newIngredientInputFields);
		setPostData({...postData, ingredient: ingredientInput.map(u=> {
				return u.ingredient
			})});
		// console.log(postData);
	};

	const handleInstructionChangeInput = (id, event) => {
		const newInstructionInputFields = instructionInput.map(i => {
			if (id === i.id) {
				i[event.target.name] = event.target.value;
			}
			// console.log(i.instruction);
			return i;
		})
		setInstructionInput(newInstructionInputFields);
		setPostData({...postData, instruction: instructionInput.map(u=> {
				return u.instruction
			})});
		// console.log(postData);
		// instructionInput.map((u)=> console.log(u.instruction));
	};


	return (
		<Paper className={classes.paper}>
			<form autoComplete="off"
			      noValidate
			      className={`${classes.root} ${classes.form}`}
			      onSubmit={handleSubmit}>
				<Typography variant="h6">
					{currentId ? 'Editing' : 'Creating'} a Recipe
				</Typography>
				<TextField name="creator"
				           variant="outlined"
				           label="Creator"
				           fullWidth
				           value={postData.creator}
				           onChange={(e) => setPostData({...postData, creator: e.target.value})}/>
				<TextField name="title"
				           variant="outlined"
				           label="Title"
				           fullWidth
				           value={postData.title}
				           onChange={(e) => setPostData({...postData, title: e.target.value})}/>
				{ingredientInput.map(inputField => (
					<div key={inputField.id}>
						<TextField name="ingredient"
						           variant="outlined"
						           label="Ingredient"
						           fullWidth
						           value={inputField.ingredient}
						           onChange={(e) => handleIngredientChangeInput(inputField.id, e)}/>
						<TextField name="amount"
						           variant="outlined"
						           label="Amount"
						           fullWidth
						           value={inputField.ingredient}
						           onChange={(e) => handleIngredientChangeInput(inputField.id, e)}/>
						<IconButton disabled={ingredientInput.length === 1}
						            onClick={() => handleRemoveIngredientField(inputField.id)}>
							<RemoveIcon/>
						</IconButton>
						<IconButton onClick={handleAddIngredientField}>
							<AddIcon/>
						</IconButton>
					</div>
				))}
				{instructionInput.map(inputField => (
					<div key={inputField.id}>
						<TextField name="instruction"
						           variant="outlined"
						           label="Instruction"
						           fullWidth
						           value={inputField.instruction}
						           onChange={(e) => handleInstructionChangeInput(inputField.id, e)}/>
						<IconButton disabled={instructionInput.length === 1}
						            onClick={() => handleRemoveInstructionField(inputField.id)}>
							<RemoveIcon/>
						</IconButton>
						<IconButton onClick={handleAddInstructionField}>
							<AddIcon/>
						</IconButton>
					</div>
				))}
				{/*<TextField name="ingredient"*/}
				{/*           variant="outlined"*/}
				{/*           label="List of ingredients"*/}
				{/*           fullWidth*/}
				{/*           value={postData.ingredient}*/}
				{/*           onChange={(e) => setPostData({...postData, ingredient: e.target.value})}/>*/}
				{/*<TextField name="instruction"*/}
				{/*           variant="outlined"*/}
				{/*           label="instruction"*/}
				{/*           fullWidth*/}
				{/*           value={postData.instruction}*/}
				{/*           onChange={(e) => setPostData({...postData, instruction: e.target.value.split(',')})}/>*/}
				<div className={classes.fileInput}>
					<FileBase type="file"
					          multiple={false}
					          onDone={({base64}) => setPostData({...postData, selectedFile: base64})}/>
				</div>
				<Button className={classes.buttonSubmit}
				        variant="contained"
				        color="primary"
				        size="large"
				        type="submit"
				        fullWidth>
					Submit
				</Button>
				<Button variant="contained"
				        color="secondary"
				        size="small"
				        onClick={clear}
				        fullWidth>
					Clear
				</Button>
			</form>
		</Paper>
	);
};

export default Form;