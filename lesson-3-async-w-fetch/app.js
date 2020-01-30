(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // fetch photo from unsplash
        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID cc8222233f4e1acb6c37601a93b7239f9a7e23860dea5a85e104de56d45dc004'
            }
        })
        .then(response => response.json()) // 使用返回的response
        .then(addImage)
        .catch(e => requestError(e, 'image'));

        // fetch articles from NYT
        fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=gA7DJr5jOLAQdVw6gufsMKVfAQb0lfCb`)
        .then(response => response.json()) // 使用返回的response
        .then(addArticles)
        .catch(e => requestError(e, 'articles'));
    });

    function addImage(data) {
        let htmlContent = '';
        const firstImage = data.results[0];

        if (firstImage) {
            htmlContent = `<figure>
                <img src="${firstImage.urls.small}" alt="${searchedForText}">
                <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
            </figure>`;
        } else {
            htmlContent = 'Unfortunately, no image was returned for your search.'
        }

        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    };

    function addArticles(articles) {
        let htmlContent = '';

        if (articles.response && articles.response.docs && articles.response.docs.length > 1) {
            htmlContent = '<ul>' + articles.response.docs.map(article => `<li class="article">
                    <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                    <p>${article.snippet}</p>
                </li>`).join('') +'</ul>';
        } else {
            htmlContent = '<div class="error-no-article>No articles available</div>';
        };

        responseContainer.insertAdjacentHTML('afterend', htmlContent);
    };

    function requestError(e, part) {
        console.log(e);
        responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
    }
})();
