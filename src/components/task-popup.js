import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { ro } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { SketchPicker, ChromePicker } from 'react-color';
import reactCSS from 'reactcss'
import { Editor } from "react-draft-wysiwyg";
import { EditorState,
    Modifier,
    convertToRaw,
    ContentState,
    convertFromHTML,
    DefaultDraftBlockRenderMap } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import {bootstrap, Popover} from 'bootstrap';

registerLocale("ro", ro);



const TaskPopup = props => {
    // const [backgroundColor, setBackgroundColor] = useState("#AEB8C2");
    // const [backgroundSelectedColor, setBackgroundSelectedColor] = useState("");
    // const [progressColor, setProgressColor] = useState("#8282F5");
    const [displayBgColorPicker, setDisplayBgColorPicker] = useState(false);
    const [displayPgColorPicker, setDisplayPgColorPicker] = useState(false);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    // const [progressSelectedColor, setProgressSelectedColor] = useState("");
    const [edit, setEdit] = useState(false);
    const popoverRef = useRef();
    useEffect(() => {
        if (popoverRef.current !== null ){
        var popover = new Popover(popoverRef.current, {
            content: 
            "Proiect - Grup de activitati.\n"+
            "Task - Activitate derulata in timpul proiectului.\n"+ 
            "Reper de referinta (milestone) - Este un eveniment intermediar important care survine in cursul realizarii unei activitati, asociat cu obtinerea unui rezultat important sau cu o analiza de stadiu.",
            trigger: 'hover',
            placement: 'right',
        })
    }
    })

    const onChange = (dates) => {
        const [start, end] = dates;
        props.setStartDate(start);
        props.setEndDate(end);
      };
     const handleBgClick = () => {
        setDisplayBgColorPicker(!displayBgColorPicker);
      };
      const handlePgClick = () => {
        setDisplayPgColorPicker(!displayPgColorPicker);
      };
     const handleBgClose = () => {
       setDisplayBgColorPicker(false);
      };
      const handlePgClose = () => {
        setDisplayPgColorPicker(false);
    };
    

      const handleEditorStateChange = (editorState) => {
        const currentContent = editorState.getCurrentContent();
        const contentRaw = convertToRaw(currentContent);
        const value =  draftToHtml(contentRaw);
        console.log(value)
        //setEditorState(value)
    };

    return (
        <div>
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
            Adauga
            </button>
            
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
           
            <div className="modal-dialog" role="document">
                <div className="modal-content container-fluid">
                <div className="modal-header">
                    {/* Titlul taskului */}
                   {edit ? (<h5 className="modal-title" id="exampleModalLabel">Editeaza</h5>) : (<h5 className="modal-title" id="exampleModalLabel">Adauga un task</h5>)} 
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                
                <div className="modal-body">
                <div className="container">
                    {/* <div > */}
                        {props.submitted ? (
                        <h4>Taskul a fost adaugat cu succes!</h4>
                        ) : (
                        <div className="row align-items-start">
                        <div className="col-sm-8">
                            <div className="form-group">
                                {/* <label>Titlu</label> */}
                                <input type="text" className="form-control" id="title" aria-describedby="title" onChange={props.handleInputChange} placeholder="Titlu" name="title" />
                            </div>
                            <div className="form-group description">
                                {/* <label >Descriere</label> */}
                                { edit ? 
                                (<Editor editorState={editorState}
                                onEditorStateChange={handleEditorStateChange}/>)
                                :
                                (<textarea className="form-control" placeholder="Descriere" name="description" onChange={props.handleInputChange} />)
                                } 
                            </div>
                            <label className="mt-2">Activitate</label>
                                <div className="mt-2">
                                </div>

                        </div>
                        
                        <div className="col-sm-4">
                        <div>
                            <div className="form-group">
                                <label>Interval</label>
                                <DatePicker
                                className="form-control"
                                selectsRange={true}
                                startDate={props.startDate}
                                endDate={props.endDate}
                                onChange={onChange}
                                dateFormat="d MMMM yyyy "
                                shouldCloseOnSelect={false}
                                name="dateRange"
                                locale="ro"
                                withPortal
                                />
                                <div>
                                    <label className="form-label">Progres {props.task.progress}%</label>
                                    <input type="range" className="form-range" id="progress" min="0" max="100" name="progress" step="5" onChange={props.handleInputChange} value={props.task.progress}></input>
                                </div>
                            {/* <div> */}
                                <label className="form-label">Tip</label> 
                                <div>
                                <button className="btn btn-primary" ref={popoverRef}>
                                    Ajutor
                                </button>
                                </div>
                                 <div> 
                                    <select className="form-control" id="type" name="type" onChange={props.handleInputChange} >
                                        <option value="project">Proiect</option>
                                        <option value="task">Task</option>
                                        <option value="milestone">Reper</option> 
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Status</label> 
                                    <select className="form-control" id="status" name="status" onChange={props.handleInputChange} >
                                        <option value="todo">In asteptare</option>
                                        <option value="doing">In lucru</option>
                                        <option value="Done">Finalizat</option> 
                                    </select>
                                </div>
                                <div>
                                    {/* Pune proiectele si taskurile celelalte */}
                                    <label className="form-label"> Depinde de:  </label>
                                    <select className="form-control" id="dependencies" name="dependencies" onChange={props.handleInputChange} >
                                        <option value=""></option>
                                        <option value="Task 0">Task 0</option>
                                    </select>
                                </div>  
                                <div>
                                    <p>Selecteaza o culoare de fundal</p>
                                    <div className="swatch"  onClick={ handleBgClick }>
                                        <div className="bgcolor" style={{backgroundColor: props.task.backgroundColor}}/>
                                        </div>
                                        { displayBgColorPicker ? <div className="popoverColorPicker" >
                                        <div className="cover" onClick={handleBgClose }/>
                                        <SketchPicker color={props.task.backgroundColor} onChange={props.handleBackgroundChange } />
                                        </div> : null 
                                        }
                                    </div>
                                    <p>Selecteaza o culoare pentru a indica progresul taskului</p> 
                                    <div className="swatch" onClick={handlePgClick}>
                                        <div className="progresscolor" style={{backgroundColor: props.task.progressColor}}/>
                                        </div>
                                        { displayPgColorPicker ? <div className="popoverColorPicker" >
                                        <div className="cover" onClick={ handlePgClose}/>
                                        <SketchPicker color={props.task.progressColor} onChange={props.handleProgressChange }/> 
                                        </div> : null 
                                        }
                                </div> 
                                
                             <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Renunta</button>
                            {props.task.title !== "" ? 
                                <button onClick={props.saveTask} className="btn btn-success" >
                                Submit
                                </button>
                                :  
                                <button onClick={props.saveTask} className="btn btn-success" disabled >
                                Submit
                                </button>
                            }
                            </div> 
                        </div>
                        </div>
                        </div>
                        )}
                    {/* </div> */}
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
    )
}


export default TaskPopup;