import React, { useState } from 'react';
import './search.css';

class IssueButton extends React.Component {
	constructor(props){
		super(props);
	};

	state = {bgColor: "green"};

	render(){
		return <button onClick={this.props.onclick} style={{backgroundColor: this.state.bgColor}}>Issue</button>;
	}
}

class Books extends React.Component {
    
    state = {
        header: <thead></thead>,
        books: [],
        name: '',
	bgColor: "green"
    };

    changeColor(){
	this.setState({bgColor: "red"});
    };

    fetchData = () => {
        var id = document.getElementById('id').value;
        this.setState({header: <thead id="header">
                        <tr>
                            <th scope="col">Book Name</th>
                            <th scope="col">Author</th>
                            <th scope="col">Introduction</th>
			    <th scope="col">Image</th>
			    <th scope="col"></th>
                        </tr>
                    </thead>,
            books: []});

        fetch(`/api/employees/${id}`)
            .then(res => res.json())
            .then(student => {
                if(student.length > 0) {
                    this.setState({...this.state, name: `Books You Are Searching`});
                    student.forEach(
                        (el) => {
				if (el.count > 0){
					this.setState({
						books: [...this.state.books, 
                                    		<tr key={el.id}>
                                        	<td>{el.name}</td>
	                                        <td>{el.author}</td>
        	                                <td>{el.introduction}</td>
						<td><img src={el.image} alt="No" />=</td>
						<td><button className="btn btn-primary" onClick={() => this.issueIt(el)}>Issue</button></td>
                	                    </tr>]
					})
				}else{
					this.setState({
						books: [...this.state.books, 
						<tr key={el.id}>
                                                <td>{el.name}</td>
                                                <td>{el.author}</td>
                                                <td>{el.introduction}</td>
                                                <td><img src={el.image} alt="No" />=</td>
                                                <td><button className="btn btn-primary" style={{backgroundColor: this.state.bgColor}}>Issued</button></td>
                                	    </tr>]
                                        })
				}
			})
                }
                else{
                    this.setState({header: []});
                    this.setState({...this.state, name: "No One Have Issued This Book"});
                }
                });
    }

    issueIt = el => {
	this.setState({bgColor: "red"});
        fetch('/api/borrow', {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    ...el,
                    sid: 'anything'
                })
           });
           /*.then(res => {
                fetch('/api/borrowed')
                .then(res => res.json())
                .then(e => console.log(e));
           });*/
    } 

    returnIt = el => {
        fetch('/api/return', {
                method: 'post',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    ...el,
                    sid: parseInt(document.getElementById('sid').value)
                })
           });

    }

    render() {
        return (
            <div id='search' className="text-center">
                <div>
                    <input className="form-control sel"  placeholder="Enter Book Name" id="id" min="1"></input>
                    <button className="btn btn-success" onClick={this.fetchData}>Submit</button>
                </div><br/>
                {this.state.name}
                <table id="sResults" className="table table-hover">
                    {this.state.header}
                    <tbody>
                        {this.state.books}
                    </tbody>
                </table>
            </div>
        );
    }

}

export default Books;
