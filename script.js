const books = [
  {id:1,title:"Маленькая жизнь",author:"Ханья Янагихара",genre:"Роман",price:8900,isbn:"9781447294832",symbol:"✳",bg:"#d8c4aa",ink:"#293a32",accent:"#a96848"},
  {id:2,title:"Нормальные люди",author:"Салли Руни",genre:"Роман",price:5400,isbn:"9780571334650",symbol:"○",bg:"#c8d8cd",ink:"#234435",accent:"#e5b486"},
  {id:3,title:"Дом, в котором…",author:"Мариам Петросян",genre:"Фэнтези",price:7600,isbn:"9785864717683",symbol:"⌂",bg:"#c2c5b3",ink:"#343d36",accent:"#85896c"},
  {id:4,title:"Море спокойствия",author:"Эмили Сент-Джон Мандел",genre:"Фантастика",price:6100,isbn:"9780593321447",symbol:"☼",bg:"#b7c9c9",ink:"#203b43",accent:"#e1c99c"},
  {id:5,title:"Клара и Солнце",author:"Кадзуо Исигуро",genre:"Фантастика",price:4900,isbn:"9780571364870",symbol:"☀",bg:"#e2cc9f",ink:"#59472d",accent:"#d58f55"},
  {id:6,title:"Тонкое искусство пофигизма",author:"Марк Мэнсон",genre:"Нон-фикшн",price:4300,isbn:"9780062457714",symbol:"✦",bg:"#d7b78e",ink:"#513d2c",accent:"#f0d9b5"},
  {id:7,title:"Sapiens. Краткая история человечества",author:"Юваль Ной Харари",genre:"Нон-фикшн",price:7200,isbn:"9780062316097",symbol:"◉",bg:"#9fbbb5",ink:"#1f3937",accent:"#d5c494"},
  {id:8,title:"Щегол",author:"Донна Тартт",genre:"Роман",price:8200,isbn:"9780316055437",symbol:"✿",bg:"#ba896f",ink:"#3e2925",accent:"#e4c69b"},
  {id:9,title:"Цветы для Элджернона",author:"Дэниел Киз",genre:"Фантастика",price:3900,isbn:"9780156030304",symbol:"✿",bg:"#ddd4c3",ink:"#4a5140",accent:"#a8b47b"},
  {id:10,title:"Книжный вор",author:"Маркус Зусак",genre:"Роман",price:5600,isbn:"9780375842207",symbol:"⌑",bg:"#b8a69b",ink:"#403b37",accent:"#d5c3a8"},
  {id:11,title:"Человек в поисках смысла",author:"Виктор Франкл",genre:"Нон-фикшн",price:3500,isbn:"9780807014295",symbol:"✧",bg:"#c5b99e",ink:"#4b4435",accent:"#e3dccb"},
  {id:12,title:"Понедельник начинается в субботу",author:"Аркадий и Борис Стругацкие",genre:"Фантастика",price:4100,isbn:"9785041166181",symbol:"☾",bg:"#a7b5a0",ink:"#293b31",accent:"#d9c48e"},
  {id:13,title:"Вино из одуванчиков",author:"Рэй Брэдбери",genre:"Классика",price:3200,isbn:"9780380977260",symbol:"❋",bg:"#e2d1a4",ink:"#51462b",accent:"#d7844c"},
  {id:14,title:"Сто лет одиночества",author:"Габриэль Гарсиа Маркес",genre:"Классика",price:4700,isbn:"9780060883287",symbol:"❀",bg:"#b5c6b0",ink:"#304631",accent:"#dfbc80"},
  {id:15,title:"Убить пересмешника",author:"Харпер Ли",genre:"Классика",price:3600,isbn:"9780060935467",symbol:"⌁",bg:"#c7b8a9",ink:"#443b35",accent:"#87927a"}
];

const STORAGE_KEY = "list-bookstore-cart-v1";
const money = new Intl.NumberFormat("ru-KZ", {style:"currency",currency:"KZT",maximumFractionDigits:0});
const grid = document.querySelector("#book-grid");
const searchInput = document.querySelector("#search-input");
const genreFilter = document.querySelector("#genre-filter");
const sortSelect = document.querySelector("#sort-select");
const cartItems = document.querySelector("#cart-items");
const emptyCart = document.querySelector("#cart-empty");
const toast = document.querySelector("#toast");
let cart = loadCart();
let toastTimer;

function loadCart(){
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter(item => books.some(book => book.id === Number(item.id)) && Number(item.quantity) > 0)
      .map(item => ({id:Number(item.id),quantity:Math.floor(Number(item.quantity))}));
  } catch { return []; }
}
function saveCart(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); }
function bookById(id){ return books.find(book => book.id === id); }
function coverStyle(book){ return `--cover-bg:${book.bg};--cover-ink:${book.ink};--cover-accent:${book.accent}`; }

function fillGenres(){
  [...new Set(books.map(book => book.genre))].sort((a,b) => a.localeCompare(b,"ru")).forEach(genre => {
    const option = document.createElement("option"); option.value = genre; option.textContent = genre; genreFilter.append(option);
  });
}
function getVisibleBooks(){
  const query = searchInput.value.trim().toLocaleLowerCase("ru");
  let result = books.filter(book => {
    const matchesText = `${book.title} ${book.author}`.toLocaleLowerCase("ru").includes(query);
    return matchesText && (genreFilter.value === "all" || book.genre === genreFilter.value);
  });
  if (sortSelect.value === "asc") result.sort((a,b) => a.price-b.price);
  if (sortSelect.value === "desc") result.sort((a,b) => b.price-a.price);
  return result;
}
function renderBooks(){
  const visible = getVisibleBooks();
  document.querySelector("#catalog-total").textContent = visible.length;
  if (!visible.length){ grid.innerHTML = '<p class="empty-results">Ничего не нашлось. Попробуйте другой запрос.</p>'; return; }
  grid.innerHTML = visible.map(book => `
    <article class="book-card">
      <div class="cover" style="${coverStyle(book)}" role="img" aria-label="Обложка книги «${book.title}»">
        <img class="cover-photo" src="covers/book-${String(book.id).padStart(2,"0")}.jpg" alt="Фото книг для «${book.title}»" loading="lazy" onload="this.parentElement.classList.add('has-photo')" onerror="this.remove()">
        <span class="cover-label">Лист · избранное</span><span class="cover-art" data-symbol="${book.symbol}"></span>
        <span class="cover-title">${book.title}</span><span class="cover-author">${book.author}</span>
      </div>
      <div class="book-info"><h3 class="book-title">${book.title}</h3><p class="book-author">${book.author}</p>
        <div class="book-meta"><span class="genre-tag">${book.genre}</span><span class="book-price">${money.format(book.price)}</span></div>
        <button class="add-button" type="button" data-add="${book.id}">Добавить в корзину <span aria-hidden="true">+</span></button>
      </div>
    </article>`).join("");
}
function addToCart(id){
  const line = cart.find(item => item.id === id);
  if (line) line.quantity += 1; else cart.push({id,quantity:1});
  saveCart(); renderCart(); showToast(`«${bookById(id).title}» добавлена в корзину`);
}
function changeQuantity(id,delta){
  const line = cart.find(item => item.id === id); if (!line) return;
  line.quantity += delta;
  if (line.quantity <= 0) cart = cart.filter(item => item.id !== id);
  saveCart(); renderCart();
}
function removeFromCart(id){ cart = cart.filter(item => item.id !== id); saveCart(); renderCart(); }
function renderCart(){
  const quantity = cart.reduce((sum,item) => sum + item.quantity,0);
  const total = cart.reduce((sum,item) => sum + bookById(item.id).price*item.quantity,0);
  document.querySelector("#header-cart-count").textContent = quantity;
  document.querySelector("#cart-count").textContent = quantity;
  document.querySelector("#cart-total").textContent = money.format(total);
  emptyCart.hidden = cart.length > 0;
  cartItems.innerHTML = cart.map(item => {
    const book = bookById(item.id);
    return `<div class="cart-line"><div class="mini-cover" style="${coverStyle(book)}" aria-hidden="true">${book.symbol}</div>
      <div class="cart-line-main"><h4 class="cart-line-title">${book.title}</h4><p class="cart-line-author">${book.author}</p>
        <div class="quantity"><button type="button" data-change="${book.id}" data-delta="-1" aria-label="Уменьшить количество: ${book.title}">−</button><span>${item.quantity}</span><button type="button" data-change="${book.id}" data-delta="1" aria-label="Увеличить количество: ${book.title}">+</button><button type="button" class="remove-button" data-remove="${book.id}">Удалить</button></div>
      </div><span class="cart-line-price">${money.format(book.price*item.quantity)}</span></div>`;
  }).join("");
}
function showToast(message){
  toast.textContent = message; toast.classList.add("show"); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"),2200);
}

grid.addEventListener("click",event => { const button = event.target.closest("[data-add]"); if (button) addToCart(Number(button.dataset.add)); });
cartItems.addEventListener("click",event => {
  const change = event.target.closest("[data-change]"); const remove = event.target.closest("[data-remove]");
  if (change) changeQuantity(Number(change.dataset.change),Number(change.dataset.delta));
  if (remove) removeFromCart(Number(remove.dataset.remove));
});
searchInput.addEventListener("input",renderBooks);
genreFilter.addEventListener("change",renderBooks);
sortSelect.addEventListener("change",renderBooks);
document.addEventListener("keydown",event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchInput.focus(); }
  if (event.key === "Escape" && document.activeElement === searchInput) { searchInput.value = ""; renderBooks(); searchInput.blur(); }
});

fillGenres(); renderBooks(); renderCart();
