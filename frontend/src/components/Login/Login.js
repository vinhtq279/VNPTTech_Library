import React from 'react';
import './Login.css';

class Login extends React.Component {
    
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
            <div id='login'>
                <span id="heading">LOGIN</span>
		<form>
			<input type="text" placeholder="...@vnpt-technology.vn" />
			<input type="password" />
			<button type="submit">Login</button>
		</form>
            </div>
        );
    }

}

export default Login;
