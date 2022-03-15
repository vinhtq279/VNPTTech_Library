import React from 'react';
import './Issue.css';

class IssuedBook extends React.Component {
    
    state = {
        header: <thead></thead>,
        books: [],
        name: ''
    };

//    fetchData = () => {
      async componentDidMount() {
//        var sid = document.getElementById('sid').value;
        this.setState({header: <thead id="header">
                        <tr>
                            <th scope="col">Book Name</th>
			    <th scope="col">Employee</th>
                            <th scope="col">Author</th>
                            <th scope="col">Issue Date</th>
                            <th scope="col">Return Deadline</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>,
            books: []});

        fetch(`/api/getIssuing`)
            .then(res => res.json())
            .then(books => {
                if(books.length > 0) {
                    this.setState({...this.state, name: `Books Issued By ${books[0].sname}`});
                    books.forEach(
                        el => this.setState({
                            books: [...this.state.books, 
                                    <tr key={el.id}>
                                        <td>{el.name.toUpperCase()}</td>
					<td>{el.uid}</td>
                                        <td>{el.author}</td>
                                        <td>{el.date}</td>
                                        <td>{el.deadline}</td>
                                        <td><button className="btn btn-primary" onClick={() => this.issueIt(el)}>Accept</button></td>
                                    </tr>]
                        }))
                }
                else{
                    this.setState({header: []});
                    this.setState({...this.state, name: "No Request to Issue Book"});
                }
                });
    }

   issueIt = el => {
        fetch('/api/borrowed', {
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
            <div id='return' className="text-center">
                <div>
                </div><br/>
                {this.state.name}
                <table id="rResults" className="table table-hover">
                    {this.state.header}
                    <tbody>
                        {this.state.books}
                    </tbody>
                </table>
            </div>
        );
    }

}

export default IssuedBook;
