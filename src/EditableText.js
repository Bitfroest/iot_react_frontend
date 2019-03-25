import React, { Component } from 'react';
import { throttle, debounce } from "throttle-debounce";


/**
* A component to generate a simple bootstrap styled form element input field.
* It is possible to show a label, errors, small text,
* @prop {string} id An id to set for the id in the rendered input element
* @prop {string} error An error message which is going to be displayed underneath the input field.
* @prop {string} label A label which is going to be displayed above the input field to describe it.
* @prop {string} append An append to the input field.
* @prop {string} prepend A prepend to the input field.
* @prop {string} placeholder A placeholder for the input field.
* @prop {string} inputType The input type (e.g. number, textarea) of the input field.
* @prop {string} rows Number of rows if input type is "textarea"
* @prop {string} step Attribute step of input field if input type is "number"
* @prop {string} small A small text underneath the input field.
* @prop {string} autocompleteArray A list of possible suggestions for the input field.
* @prop {function} onChanges Function wich triggers the autocomplete.
* @example
* <EditableText
*       label='Label Text'
*       id={'edit_id_' + this.props.id}
*       placeholder={this.state.placeholder.name}
*       value={this.state.data.name}
*       onChanges={(newValue) => this.handleChanges("name", newValue)}
* />
*/
export default class EditableText extends React.Component{
    /**
    * @param {Object} state The state of EditableText
    * @param {Boolean} state.hasFocus Test
    */
    constructor(props) {
        super(props);
        this.state = {
            hasFocus: false,
            value: "",
            q: "",
            p : []
        }
        this.autocompleteSearchDebounced = (q) => debounce(500, this.autocompleteSearch(q));
        this.autocompleteSearchThrottled = (q) => throttle(500, this.autocompleteSearch(q));
    };
    /**
    * sets the event target value to the current query string q and triggers either throttled or debounced autocompletion by the length of q
    * @param {object} event the event variable handed in by the change of an input field
    */
    changeQuery(event){
        this.setState({ q: event.target.value }, () => {
            const q = this.state.q;
            if (q.length < 5) {
                this.autocompleteSearchThrottled(this.state.q);
            } else {
                this.autocompleteSearchDebounced(this.state.q);
            }
        });
    };
    /**
    * searches all possibilities of q in the passed array by props.autocompleteArray
    * @param {string} q
    * @param {array<string>} props.autocompleteArray the array to search in
    */
    autocompleteSearch(q){
        if (!this.props.autocompleteArray){
            return;
        }
        this.state.p = [];
        console.log("autocomplete");
        for (var j=0; j<this.props.autocompleteArray.length; j++) {
            if (this.props.autocompleteArray[j].substr(0, q.length).toUpperCase() == q.toUpperCase()){
                this.state.p.push(this.props.autocompleteArray[j]);
            }
        }
        this.setState({ p: this.state.p });
    }
    handleInputChange(event) {
        const target = event.target;

        this.setState({
            value: target.value
        });
        this.changeQuery(event);
    }
    componentDidMount(){
        this.setState({value: this.props.value, q: this.props.value});
    }
    componentDidUpdate(prevProps, prevState){
        if (this.props.value !== prevProps.value) {
            this.setState({value: this.props.value, q: this.props.value});
        }
    }
    saveChanges(){
        this.props.onChanges(this.state.value);
    }
    onBlur(e) {
        // Firefox issue
        // https://tirdadc.github.io/blog/2015/06/11/react-dot-js-firefox-issue-with-onblur/
        if (e.nativeEvent.explicitOriginalTarget &&
            e.nativeEvent.explicitOriginalTarget == e.nativeEvent.originalTarget) {
                return;
        }
        this.setState({hasFocus: false});
        if (this.state.p.length > 0 && this.state.hasFocus){

        }else{
            this.saveChanges();
        }

    }
    onFocus(e) {
        this.setState({hasFocus: true});
    }

    render(){
        return (
            <div className="dropdown form-group">
                { this.props.label && this.props.id && <label for={this.props.id}>{this.props.label}</label>}
                <div className="input-group">
                    { this.props.prepend &&
                        <div className="input-group-prepend">
                            <span class="input-group-text" id={this.props.id + '_help'}>{this.props.prepend}</span>
                        </div>
                    }
                    { this.returnInput(this.props.inputType) }
                    { this.props.autocompleteArray &&
                        <div className="dropdown-menu" style={this.state.p.length > 0 && this.state.hasFocus ? {display: "block"} : {}} >
                            {this.state.p.map((node, index) =>
                                <a className="dropdown-item" key={index} onClick={ (e) => {e.preventDefault(); this.props.onChanges(node); } } href="#">{node}</a>
                            )}
                        </div>
                    }
                    { this.props.append &&
                        <div className="input-group-append">
                            <span class="input-group-text" id={this.props.id  + '_help'}>{this.props.append}</span>
                        </div>
                    }
                    {this.props.error &&
                        <div className="invalid-feedback">{this.props.error}</div>
                    }
                </div>
                {this.props.small && this.props.id && <small id={this.props.id + '_help'} className="form-text text-muted">{this.props.small}</small>}
            </div>
        )
    }
    returnInput(inputType){
        const animationClass = this.props.ok ? 'editable-text-animation' : '';
        const isInvalidClass = this.props.error ? " is-invalid" : "";

        if(inputType === "textarea"){
            return <textarea
                        rows={this.props.rows}
                        className={"form-control editable-array " + animationClass + isInvalidClass}
                        onBlur={(e) => this.onBlur(e)} onFocus={(e) => this.onFocus(e)}
                        value={this.state.value}
                        onChange={(e) => this.handleInputChange(e)}
                    />
        }else if(inputType === "number"){
            return <input
                        placeholder={this.props.placeholder}
                        id={this.props.id}
                        aria-describedby={this.props.id  + '_help'}
                        className={"form-control editable-array " + animationClass + isInvalidClass}
                        type="number"
                        step={this.props.step}
                        onBlur={(e) => this.onBlur(e)} onFocus={(e) => this.onFocus(e)}
                        value={this.state.value}
                        onChange={(e) => this.handleInputChange(e)}
                        onKeyPress={ (e) => e.key === "Enter" && this.saveChanges()}
                    />
        }else{
            return <input
                        placeholder={this.props.placeholder}
                        id={this.props.id}
                        aria-describedby={this.props.id + '_help'}
                        className={"form-control editable-array " + animationClass + isInvalidClass}
                        onBlur={(e) => this.onBlur(e)}
                        onFocus={(e) => this.onFocus(e)}
                        value={this.state.value}
                        onChange={(e) => this.handleInputChange(e)}
                        onKeyPress={ (e) => e.key === "Enter" && this.saveChanges()}
                    />
        }
    }
}
