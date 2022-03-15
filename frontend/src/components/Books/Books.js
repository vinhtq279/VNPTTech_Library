import React from 'react';
import './Books.css';

class Books extends React.Component {
    
    state = {
        header: <thead id="header">
                    <tr>
                        <th scope="col">Tên sách</th>
                        <th scope="col">Tác giả</th>
                        <th scope="col">Giới thiệu</th>
                        <th scope="col">Bìa</th>
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
			    console.log(document.getElementById("bpp").value);
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
			<select id="bpp" onChange={this.ComponentDidMount}>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="1000">All</option>
			</select>
            	</div>
        );
    }

}

export default Books;
