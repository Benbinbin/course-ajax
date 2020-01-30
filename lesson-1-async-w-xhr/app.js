(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText; //设置搜索核心词
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // 向 Unsplash API 发出请求
        const imgRequest = new XMLHttpRequest();
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        imgRequest.setRequestHeader('Authorization', 'Client-ID cc8222233f4e1acb6c37601a93b7239f9a7e23860dea5a85e104de56d45dc004'); // 在 HTTP 请求头部信息中添加 Access Key
        imgRequest.onload = addImage;

        imgRequest.send();

        // 向纽约时报 API 发出请求
        const articleRequest = new XMLHttpRequest();
        articleRequest.open('GET', `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=gA7DJr5jOLAQdVw6gufsMKVfAQb0lfCb`);
        articleRequest.onload = addArticles;

        articleRequest.send();
    });

    // 添加图片和摄影者名称或将错误信息到网页上
    function addImage() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if (data && data.results && data.results[0]) {
            const firstImage = data.results[0];
            htmlContent = `<figure>
                    <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                    <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                </figure>`;
        } else {
            htmlContent = '<div class="error-no-image">No images available</div>';
        };

        responseContainer.insertAdjacentHTML('beforeend', htmlContent); // 将图片或错误信息添加到网页，作为指定元素的第一个子元素
    };

    // 添加文字(列表）到网页上
    function addArticles() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if (data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
                    <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                    <p>${article.snippet}</p>
                </li>`).join('') +'</ul>';
        } else {
            htmlContent = '<div class="error-no-article>No articles available</div>';
        };

        responseContainer.insertAdjacentHTML('afterend', htmlContent);
    };
})();
