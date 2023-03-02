import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import './index.scss';


const lightColorSchema = {
  primaryBgColor: "#FFFFFF",
  secondaryBgColor: "#EEEEEE",
  textColor: "#000000"
};

const darkColorSchema = {
  primaryBgColor: "#000000",
  secondaryBgColor: "#222222",
  textColor: "#FFFFFF"
};

class QuoteBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      quotes: [
        {
          text: "Loading quotes...",
          author: "The developer"
        }
      ],
      lightColorSchema: true
    };

    this.getQuote = this.getQuote.bind(this);
    this.fetchQuotes = this.fetchQuotes.bind(this);
  }

  fetchQuotes() {
    fetch("https://type.fit/api/quotes")
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        this.setState({
          quotes: data,
          current: 0
        });
      })
      .catch((error) => {
        console.log("Unexpected error: ", error);
      });
  }

  getQuote() {
    if (this.state.current + 1 >= this.state.quotes.length) {
      this.setState({ current: 0 });
    } else {
      // console.log("next quote " + this.state.current);
      this.setState((prevState) => ({ current: prevState.current + 1 }));
    }
  }

  componentDidMount() {
    this.fetchQuotes();
  }

  render() {
    // console.log("render props ", this.props);
    const text = this.state.quotes[this.state.current].text;
    const author = this.state.quotes[this.state.current].author;
    const renderText = text && text.length > 0 ? text : "Unknown text.";
    const renderAuthor =
      author && author.length > 0 ? author : "Unknown author";
    const colorSchema = this.props.lightColorSchema
      ? lightColorSchema
      : darkColorSchema;
    return (
      <div
        id="quote-box-wrapper"
        style={{ backgroundColor: colorSchema.primaryBgColor }}
      >
        <button
          id="change-schema"
          className="btn btn-primary"
          onClick={this.props.toggleColorSchema}
          style={{
            color: colorSchema.textColor,
            background: colorSchema.secondaryBgColor,
            borderColor: colorSchema.secondaryBgColor
          }}
        >
          <i
            className={
              this.props.lightColorSchema
                ? "fa-solid fa-sun fa-xl"
                : "fa-solid fa-moon fa-xl"
            }
          ></i>
        </button>
        <div
          id="quote-box"
          className="card container-md"
          style={{
            backgroundColor: colorSchema.secondaryBgColor,
            color: colorSchema.textColor
          }}
        >
          <div className="card-body">
            <blockquote className="blockquote container-xl mb-2">
              <p
                id="text"
                className="mb-3"
                style={{ color: colorSchema.textColor }}
              >
                <i className="fa-sharp fa-solid fa-quote-left fa-xs"></i>{" "}
                {renderText}{" "}
                <i className="fa-sharp fa-solid fa-quote-right fa-xs"></i>
              </p>
              <footer
                id="author"
                className="blockquote-footer"
                style={{ color: colorSchema.textColor }}
              >
                {renderAuthor}
              </footer>
            </blockquote>
          </div>
          <div id="quote-box-footer" className="m-1">
            <div id="social-wrapper">
              <a
                id="tweet-quote"
                className="btn btn-link"
                href="https://twitter.com/intent/tweet"
                target="_top"
                style={{
                  color: colorSchema.textColor,
                  background: colorSchema.primaryBgColor,
                  borderColor: colorSchema.primaryBgColor
                }}
              >
                <i className="fa-brands fa-twitter" />
              </a>
            </div>
            <div id="submit-wrapper">
              <button
                id="new-quote"
                className="btn btn-primary"
                onClick={this.getQuote}
                style={{
                  color: colorSchema.textColor,
                  background: colorSchema.primaryBgColor,
                  borderColor: colorSchema.primaryBgColor
                }}
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const TOGGLE = "TOGGLE";

function toggleSchema() {
  return { type: TOGGLE };
}

function settingsReducer(state = true, action) {
  switch (action.type) {
    case TOGGLE:
      return !state;
      break;
    default:
      return state;
      break;
  }
}

const store = createStore(settingsReducer);

function mapStateToProps(state) {
  return { lightColorSchema: state };
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleColorSchema: () => {
      dispatch(toggleSchema())
    }
  }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(QuoteBox)
class AppWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <Container />
      </Provider>
    );
  }
}

render(<AppWrapper />, document.getElementById("root"));