

document.addEventListener('DOMContentLoaded', function(){

    const quoteList = document.querySelector('ul#quote-list')
    const newQuoteForm = document.querySelector('form#new-quote-form') 
    const toggleSortButton = document.querySelector('button#toggle-sort')

    showQuotesById() 

    function showQuotesById(){
        fetch("http://localhost:3000/quotes?_embed=likes")
        .then(res => res.json())
        .then( quotes => {
            console.log(quotes)
            quotes.forEach(quote => {
                addQuote(quote) 
            })
        })
    }

    newQuoteForm.addEventListener('submit', function(){
        event.preventDefault()
        const newQuoteWords = document.querySelector('input#new-quote').value 
        const newQuoteAuthor = document.querySelector('input#author').value
        const configObj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                quote: newQuoteWords,
                author: newQuoteAuthor,
                likes: [] 
            })
        }
        fetch("http://localhost:3000/quotes", configObj) 
        .then(res => res.json())
        .then (newQuote => {
            addQuote(newQuote)  
            newQuoteForm.reset()
        })
    }) 

    function addQuote(quote){
        console.log(quote) 
        const quoteItem = document.createElement('li')
        quoteItem.className = 'quote-card' 
        const blockQuote = document.createElement('blockquote')

        const quoteWords = document.createElement('p')
        quoteWords.innerText = quote.quote  
        quoteWords.class = 'mb-' + quote.id  

        const quoteAuthor = document.createElement('footer')
        quoteAuthor.className = 'blockquote-footer'  
        quoteAuthor.innerText = quote.author

        const likeButton = document.createElement('button')
        likeButton.className = 'btn-success' 
        fetch(`http://localhost:3000/quotes/${quote.id}/likes`) 
        .then(res => res.json())
        .then(likesToDisplay => {
            likeButton.innerHTML = `Likes: <span>${likesToDisplay.length}</span>`
        })

        likeButton.addEventListener('click', function(){
            const likedQuoteId = parseInt(quote.id) 
            const currentLikes = parseInt(event.target.innerText.split(" ")[1])
            console.log(currentLikes)  
            const configObj = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }, 
                body: JSON.stringify({
                    quoteId: likedQuoteId, 
                    createdAt: Date.now() 
                })
            }
            fetch("http://localhost:3000/likes", configObj)
            .then(res => res.json())
            .then( newLike => {
                likeButton.innerHTML = `Likes: <span>${currentLikes + 1}</span>` 
            }) 
        })

        const deleteButton = document.createElement('button')
        deleteButton.className = 'btn-danger'
        deleteButton.innerText = 'Delete' 

        deleteButton.addEventListener('click', function(){
            const blockToDelete = event.target.parentNode.parentNode 
            const configObj = {
                method: 'DELETE' 
            } 
            fetch("http://localhost:3000/quotes/" + quote.id, configObj)
            .then(() => {
                blockToDelete.remove() 
            })
        })

        blockQuote.append(quoteWords, quoteAuthor, likeButton, deleteButton) 
        quoteItem.append(blockQuote)
        quoteList.append(quoteItem)  
    }

    toggleSortButton.addEventListener('click', function(){
        if (event.target.innerText = "Sort By Author"){
            quoteList.innerHTML = "" 
            fetch("http://localhost:3000/quotes?_sort=author")
            .then(res => res.json()) 
            .then( quotes => {
                console.log(quotes)
                quotes.forEach(quote => {
                    addQuote(quote) 
                    })
            })
        event.target.innerText = "Sort By ID" 
        }else{
            quoteList.innerHTML = "" 
            showQuotesById
            event.target.innerText = "Sort By Author" 
        }
    })

})