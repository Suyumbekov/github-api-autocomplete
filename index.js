let search = document.querySelector(".search");
let recommend = document.querySelector(".recommend");
let result = document.querySelector(".result");

let recArr = [];

async function getRepos() {
  let q = document.querySelector("input").value;

  let response = await fetch(
    "https://api.github.com/search/repositories" + "?q=" + q
  );
  return await response.json();
}

const debounce = (fn, debounceTime = 0) => {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    return new Promise((resolve, reject) => {
      timeout = setTimeout(() => {
        fn.apply(this, args).then(resolve).catch(reject);
      }, debounceTime);
    });
  };
};
const repoFetch = debounce(getRepos, 500);

search.addEventListener("input", async (e) => {
  let recs = document.querySelectorAll("h3");
  recs.forEach((el) => el.remove());
  recArr = [];
  repoFetch().then((res) => {
    let i = 0;
    for (let repo of res.items) {
      if (i === 5) break;
      let h3 = document.createElement("h3");
      h3.textContent = repo.name;
      recommend.append(h3);
      recArr.push({
        name: repo.name,
        owner: repo.owner.login,
        stars: repo.stargazers_count,
      });
      i++;
    }
  });
});

recommend.addEventListener("click", (e) => {
  let recs = document.querySelectorAll("h3");
  recs.forEach((el) => el.remove());
  document.querySelector("input").value = "";
  let target = e.target.textContent;
  let arr = recArr.filter((item) => item.name === target);

  let item = document.createElement("div");
  item.classList.add("item");
  let div = document.createElement("div");
  let btn = document.createElement("button");
  btn.classList.add("x");
  Object.entries(arr[0]).forEach(([key, value]) => {
    const p = document.createElement("p");
    p.textContent = `${key}: ${value}`;
    div.appendChild(p);
  });
  item.append(div);
  item.append(btn);
  result.append(item);
});

result.addEventListener("click", (e) => {
  if (e.target.tagName !== "BUTTON") return;

  result.removeChild(e.target.parentNode);
});
