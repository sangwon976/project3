const API_KEY = `97cd2766b2cf4ccea6fe68b00ca4027a`;
let newsList = [];
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) => menu.addEventListener("click", (event) => getNewsByCategory(event)));

let url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async () => {
  try {
    url.searchParams.set("page", page); // => &page=page
    url.searchParams.set("pageSize", pageSize);
    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 200) {
      if (data.articles.length === 0) {
        throw new Error("No result for this search");
      }
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else {
      paginationRender();
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
  getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`);
  getNews();
};

const getNewsByKeyword = async () => {
  console.log("keyword");
  const keyword = document.getElementById("search-input").value;
  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`);
  getNews();
};

const render = () => {
  const newsHTML = newsList
    .map(
      (news) => `
  <div class="row news">
          <div class="col-lg-4">
          <img class="news-img-size" src="${
            news.urlToImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
          }"/>
          </div>
          <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>${
              news.description == null || news.description == ""
                ? "내용없음"
                : news.description.length > 200
                ? news.description.substring(0, 200) + "..."
                : news.description
            }</p>
            <div>${news.source.name} *${moment(news.publishedAt).fromNow()}</div>
          </div>
  </div>`
    )
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
  </div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

const paginationRender = () => {
  let paginationHTML = ``;
  // totalResult
  // page
  // pageSize
  // groupSize
  // totalPages
  const totalPages = Math.ceil(totalResults / pageSize);
  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  // lastPage
  let lastPage = pageGroup * groupSize;
  // 마지막 페이지 그룹이 그룹사이즈보다 작다? lastpage = totalpage
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  // firstPate
  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  if (firstPage >= 6) {
    paginationHTML = `
  <li class="page-item" onclick="moveToPage(1)">
  <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
  </li>
  <li class="page-item" onclick="moveToPage(${page - 1})"><a class="page-link" href="#">&lt;</a></li>`;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`;
  }
  if (lastPage < totalPages) {
    paginationHTML += `
  <li class="page-item" onclick="moveToPage(${page + 1})"><a class="page-link" href="#">&gt;</a></li>
  <li class="page-item" onclick="moveToPage(${totalPages})">
  <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
  </li>
  `;
  }
  document.querySelector(".pagination").innerHTML = paginationHTML;
  //<nav aria-label="Page navigation example">
  //<ul class="pagination">
  //<li class="page-item"><a class="page-link" href="#">Previous</a></li>
  //<li class="page-item"><a class="page-link" href="#">1</a></li>
  //<li class="page-item"><a class="page-link" href="#">2</a></li>
  //<li class="page-item"><a class="page-link" href="#">3</a></li>
  //<li class="page-item"><a class="page-link" href="#">Next</a></li>
  //</ul>
  //</nav>
};

const moveToPage = (pageNum) => {
  console.log("movetopage", pageNum);
  page = pageNum;
  getNews();
};

getLatestNews();
