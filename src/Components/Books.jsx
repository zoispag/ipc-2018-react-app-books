import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

export class Books extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      books: [],
      inputContent: "",
      selectedBook: null
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios.get("http://localhost:5000/books")
      .then(({data}) => this.setState({ books: data }))
      .catch(e => console.error(e));
  };

  add = (title) => {
    axios.post('http://localhost:5000/books', { id: undefined, title: title, category: 'web'})
      .then(_ => { this.refreshList(); this.setState({ inputContent: ""}); })
      .catch(e => console.error(e));
  };

  remove = (bookId) => {
    axios.delete(`http://localhost:5000/books/${bookId}`)
      .then(_ => { this.refreshList(); this.setState({ selectedBook: null }); })
      .catch(e => console.error(e));
  };

  render() {
    return (
      <div>
        <h2>My Library</h2>
        <div>
          <label>Book's title:</label>
          <input
            type="text"
            value={this.state.inputContent}
            onChange={(e) => this.setState({inputContent: e.target.value})}
          />
          <button onClick={() => this.add(this.state.inputContent)}>
            Add
          </button>
        </div>
        <br />
        <hr />
        <ul className="books">
          {this.state.books.map(book => (
            <li
              key={book.id}
              className={this.state.selectedBook && this.state.selectedBook.id === book.id && 'selected'}
            >
              <span className="badge">{book.id}</span>
              <span className="bookName" onClick={() => this.setState({ selectedBook: book })}>{book.title}</span>
              <button
                className="delete"
                onClick={() => this.remove(book.id)}
              >&times;
              </button>
            </li>
          ))}
        </ul>

        {this.state.selectedBook &&
        <div>
          <h2>
            {this.state.selectedBook.title} is my favorite book
          </h2>
          <Link to={`/detail/${this.state.selectedBook.id}`}>View details</Link>
        </div>
        }
      </div>
    );
  }
}
