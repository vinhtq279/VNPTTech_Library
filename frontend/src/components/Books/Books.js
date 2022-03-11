import React from 'react';
import './Books.css';

class Books extends React.Component {
    
    state = {
        header: <thead id="header">
                    <tr>
                        <th scope="col">Book Name</th>
                        <th scope="col">Author</th>
                        <th scope="col">Introduction</th>
                        <th scope="col">Image</th>
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
                                    </tr>]
                            })
                        }
                        return el;
                    })
            });
    }

    render() {
        return (
            <div id='books'>
                <span id="heading">AVAILABLE BOOKS</span>
                <table id="results" className="table text-center table-hover">
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
