/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // 向 Unsplash API 发出请求
        $.ajax({
            url: `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                Authorization: 'Authorization: Client-ID cc8222233f4e1acb6c37601a93b7239f9a7e23860dea5a85e104de56d45dc004'
            }
        }).done(addImage);

        // 向纽约时报 API 发出请求
        $.ajax({
            url: `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=gA7DJr5jOLAQdVw6gufsMKVfAQb0lfCb`
        }).done(addArticles);
    });

    function addImage(images) {
        let htmlContent = '';

        if (images && images.results && images.results[0]) {
            const firstImage = images.results[0];
            htmlContent = `<figure>
                    <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                    <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                </figure>`;
        } else {
            htmlContent = '<div class="error-no-image">No images available</div>';
        };

        responseContainer.insertAdjacentHTML('beforeend', htmlContent); // 将图片或错误信息添加到网页，作为指定元素的第一个子元素
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
})();
