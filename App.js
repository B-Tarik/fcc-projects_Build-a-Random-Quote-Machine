import React, { Component } from "react";

import './app.scss';

class App extends Component {
  state = {
    quotes: [],
    randomQuote: '',
    tweet: '',
    image: '',
    index: 0
  }
  

  componentDidMount() {
    const quotes = 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json';
   
    fetch(quotes)
      .then(data => data.json())
      .then(data => {
        const quotes = shuffle(data.quotes)
        this.setState({quotes})
        this.getRandomQuote();
      })
      .catch(console.warn);
  }


  getRandomQuote = async () => {
    const {index, quotes} = this.state;
    const randomQuote = quotes[index]
    const {quote, author} = randomQuote;
    const tweet = 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + encodeURIComponent(`"${quote}"${author}`)
    
    await this.getImage(author)
    this.setState({randomQuote, tweet, index: (index+1)%(quotes.length-1)})
    topbar.show()
  }
  
  
  getImage = async author => {
    let {image} = this.state;
    const wikiURL  = "https://en.wikipedia.org/w/api.php?action=query&formatversion=2&prop=pageimages&format=json&origin=*&titles=";
    const response = await fetch(wikiURL+author);
    const data = await response.json()
    let newImage;
    
    !data.query.pages[0].thumbnail 
      ? newImage = 'https://placeimg.com/500/680/nature'
      : newImage = data.query.pages[0].thumbnail.source.replace( /[0-9]+px/, '500px')
    
    newImage === image
      ? setTimeout(() => topbar.hide(), 200)
      : this.setState({image: newImage})
    
  }
  
  
  handleLoad = () => {
    topbar.hide();
  }

  
  render() {
    const {randomQuote, tweet, image} = this.state;
    const {quote, author} = randomQuote;
    
    return (
        <React.Fragment>
          <div className="wrapper-b" style={{backgroundImage: `url(${image})`}}></div>
          <div className="wrapper">
            <img 
              src={image} 
              alt={author}
              onLoad={this.handleLoad}
              />
            <div id="quote-box">
              <div className="buttons">
                <a className="button" id="tweet-quote" title="Tweet this quote!" target="_blank" href={tweet}>
                  <i className="fa fa-twitter"></i>
                </a>
                <button className="button" onClick={this.getRandomQuote} id="new-quote">New quote</button>
              </div>
              <div className="quote-author">
                - <a href={`http://www.google.com/search?q=${author}`} target="_blank"><span id="author">{author}</span></a>
              </div>
              <div className="quote-text">
                <i className="fa fa-quote-left"> </i><span id="text">{quote}</span>
              </div>
            </div>
          </div>
        </React.Fragment>
    )
  }
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

export default App;
