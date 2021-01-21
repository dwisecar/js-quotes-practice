//DATA
function fetchQuotes(){
    clearQuotes()
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(res => res.json())
    .then(quotes => quotes.forEach(quote => renderQuote(quote)))
}

function postNewQuote(quote){
    debugger
    fetch(`http://localhost:3000/quotes/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(quote)
    })
    .then(res => res.json())
    .then(quote => renderQuote(quote))
}

//DOM
function renderQuote(quote){
    
    //create elements 
    const li = document.createElement('li')
    const blockQuote = document.createElement('blockquote')
    const p = document.createElement('p')
    const footer = document.createElement('footer')
    const br = document.createElement('br')
    const likeBtn = document.createElement('button')
    const span = document.createElement('span')
    const deleteBtn = document.createElement('button')

    //set classes
    li.className = 'quote-card'
    blockQuote.className = 'blockquote'
    p.className = 'mb-0'
    footer.className = 'blockquote-footer'
    likeBtn.className = 'btn-success'
    deleteBtn.className = 'btn-danger'

    //set values
    li.id = quote.id
    p.textContent = quote.quote
    footer.textContent = quote.author
    likeBtn.textContent = 'Likes: '
    span.textContent = quote.likes.length
    deleteBtn.textContent = 'Delete'

    //add listeners
    likeBtn.addEventListener('click', () => handleLike(quote))
    deleteBtn.addEventListener('click', () => handleDelete(quote))

    //append elements
    likeBtn.append(span)
    blockQuote.append(p, footer, br, likeBtn, deleteBtn)
    li.appendChild(blockQuote)
    const ul = document.getElementById('quote-list')
    ul.append(li)

}

//Handlers
function handleLike(quote){
    fetch(`http://localhost:3000/likes/?quoteId=${quote.id}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({quoteId: quote.id})
    })
    .then(res => res.json())
    .then(() => fetchQuotes())
}

function handleDelete(quote){
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(quote)
    })
    .then(res => res.json())
    .then(() => fetchQuotes())
}

function handleSubmit(e){
    e.preventDefault()
    const quote = {
        quote: e.target.quote.value,
        author: e.target.author.value,
        likes: []
    }
    postNewQuote(quote)
    e.target.reset()
}

//Listeners
function addNewQuoteListeners() {
    const form = document.getElementById('new-quote-form')
    form.addEventListener('submit', handleSubmit)
}

function clearQuotes(){
    const ul = document.getElementById('quote-list')
    while (ul.firstElementChild) {
        ul.firstElementChild.remove()
    }
}

//On Page load
fetchQuotes()
addNewQuoteListeners()