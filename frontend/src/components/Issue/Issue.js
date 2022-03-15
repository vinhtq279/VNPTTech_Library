import React from 'react';
import './Issue.css';
import Cookies from 'js-cookie';

class Books extends React.Component {
    
    state = {
        header: <thead id="header">
                    <tr>
                        <th scope="col">Book Name</th>
                        <th scope="col">Author</th>
                        <th scope="col">Introduction</th>
                        <th scope="col">Image</th>
			<th scope="col"></th>
                    </tr>
                </thead>,
        books: []
    };

    async componentDidMount() {
        await fetch("/api/getBooks")
            .then(res => res.json())
            .then(books => {
                books.map(
                    el => {
                        console.log(`el.count is: ${el.count}`);
                        if(el.count > 0) {
                            this.setState({
                                books: [...this.state.books, 
                                    <tr key={el.id}>
                                        <td>{el.name.toUpperCase()}</td>
                                        <td>{el.author}</td>
                                        <td>{el.introduction}</td>
                                        <td><img src={el.image} alt="No"/></td>
					<td><button className="btn btn-primary" onClick={() => this.issueIt(el)}>Issue</button></td>
                                    </tr>]
                            })
                        }
                        return el;
                    })
            });
    }

    issueIt = el => {
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

    render() {
        return (
            <div id='issue' className="text-center">
		Books You Can Borrow
                <table id="results" className="table table-hover">
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
