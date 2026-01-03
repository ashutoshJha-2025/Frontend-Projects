const input = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');

function toggleClearButton() {
    clearBtn.style.display = input.value ? 'block' : 'none';
}

function clearInput() {
    input.value = '';
    toggleClearButton();
    input.focus();
}
const searchBtn = document.querySelector('.search-button');
searchBtn.addEventListener('click', function () {
    const query = input.value.trim();
    if (query) {
        fetchNews(query);
    }
});
document.querySelectorAll('.categories').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.categories').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        fetchNews(this.textContent.trim());

    });
});



const API_KEY = "2dcc666a830d4560a28591a7f629b607";
const url = "https://newsapi.org/v2/everything?q=";
window.addEventListener('load', () => fetchNews("India"));

async function fetchNews(query) {
    const fromDate = document.getElementById("fromDate")?.value;
    const toDate = document.getElementById("toDate")?.value;
    let apiUrl = `${url}${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${API_KEY}`;
    if (fromDate) apiUrl += `&from=${fromDate}`;
    if (toDate) apiUrl += `&to=${toDate}`;

    try {
        const res = await fetch(apiUrl);
        const data = await res.json().catch(() => null);

        if (!res.ok) {
            console.error("NewsAPI returned an error", res.status, data);
            showErrorOnPage(data?.message || `Request failed: ${res.status}`);
            return;
        }

        if (!data || !Array.isArray(data.articles)) {
            console.error("No articles in response", data);
            showErrorOnPage("No articles returned by the API.");
            return;
        }

        console.log(data.articles);
        bindData(data.articles);
    } catch (err) {
        console.error("Network or unexpected error while fetching news:", err);
        showErrorOnPage("Network error — check console for details.");
    }
}

function showErrorOnPage(msg) {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = `<div class="error">Error: ${msg}</div>`;
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cardsContainer");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach(article => {
        if (!article.urlToImage) {
            return;
        }

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });

    function fillDataInCard(cardClone, article) {
        const newsImg = cardClone.getElementById('news-image');
        const newsTitle = cardClone.getElementById('news-title');
        const newsSrc = cardClone.getElementById('news-source');
        const newsDesc = cardClone.getElementById("news-desc");

        newsImg.src = article.urlToImage;
        newsTitle.innerHTML = article.title;
        newsDesc.innerHTML = article.description;

        const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            timeZone: "Asia/Jakarta"
        });

        newsSrc.innerHTML = `${article.source.name} &middot; ${date}`;

        const srcBtn = cardClone.getElementById("src-link");
        srcBtn.addEventListener('click', function () {
            window.open(article.url, '_blank');
        });

        const shareBtn = cardClone.getElementById("share-btn");
        shareBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const copyLinkDiv = document.querySelector('.link-box');
            const copySpan = copyLinkDiv.querySelector('p');
            copySpan.innerHTML = article.url;
            copyLinkDiv.style.display = 'block';
            const rect = shareBtn.getBoundingClientRect();
            copyLinkDiv.style.position = 'fixed';
            copyLinkDiv.style.top = (rect.top - copyLinkDiv.offsetHeight - 10) + 'px';
            copyLinkDiv.style.left = (rect.left) + 'px';

            setTimeout(() => {
                copyLinkDiv.style.display = 'none';
            }, 7000);
        });
    }
}

const msgAdmin = document.getElementById("admin-btn");
const msgNotification = document.getElementById("notify-btn");
const msg = document.querySelector(".msg");
const msgClose = document.querySelector("#msg-close");

msgNotification.addEventListener('click', () => {
    const edit = document.getElementById("editable").innerHTML = "Notification";
    msg.classList.add("show-msg");
    setTimeout(() => {
        msg.classList.remove("show-msg");
    }, 1500);
});

msgAdmin.addEventListener('click', () => {
    const edit = document.getElementById("editable").innerHTML = "User accounts";
    msg.classList.add("show-msg");
    setTimeout(() => {
        msg.classList.remove("show-msg");
    }, 1500);
});

msgClose.addEventListener('click', () => {
    msg.classList.remove("show-msg");
});