// Get Quotes From API
const quoteContainer = document.getElementById('quote-container'); 
const quoteSpanTag = document.getElementById('quote');
const authorSpanTag = document.getElementById('author');
const newQuoteBtn = document.getElementById('new-quote');
const twitterBtn = document.getElementById('twitter');
const loader = document.getElementById('loader');

let apiQuotes = [];

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function hideLoadingSpinner() {
    if (!loader.hidden) {
        loader.hidden = true;
        quoteContainer.hidden = false;
    }
}

function getNewQuote() {
    showLoadingSpinner();
    
    let quote = apiQuotes[Math.floor(Math.random()*apiQuotes.length)];
    
    // Reduce font size for long quotes.
    if (quote.text.length>84) {
        quoteSpanTag.classList.add('long-quote');
    } else {
        quoteSpanTag.classList.remove('long-quote');
    }

    quoteSpanTag.textContent = quote.text;
    
    let author = quote.author;
    if (author==null) {
        author = "Anonymous"
    }    
    authorSpanTag.textContent = author;

    hideLoadingSpinner();
}

async function retrieveAllQuotes() {
    showLoadingSpinner();
    const apiUrl = "https://type.fit/api/quotes";
    try {
        const response = await fetch(apiUrl);
        apiQuotes = await response.json();
    } catch (error) { 
        // Use local quotes instead
        console.log("There was an error retrieving quotes from external API.\nWe will use the local quote repository.");

        import("./quotes.js")
            .then(module => {
                apiQuotes = module.localQuotes;
            })
            .catch(err => {
                console.log("Error while loading quotes.js module\n"+err);
            });
    }
    getNewQuote();
    hideLoadingSpinner();
}

function tweetQuote() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteSpanTag.textContent} - ${authorSpanTag.textContent}`;
    window.open(twitterUrl,'_blank');
}

// Event listeners
newQuoteBtn.addEventListener('click', getNewQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
retrieveAllQuotes(); 
