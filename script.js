const urlApiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemToCart() {
  const itemId = getSkuFromProductItem(this.parentElement);
  const itemApiUrl = `https://api.mercadolibre.com/items/${itemId}`;
  
  fetch(itemApiUrl)
    .then((response) => response.json())
    .then(({ title, price }) => {
      const item = document.querySelector('.cart__items');
      const itemInfo = {
        sku: itemId,
        name: title,
        salePrice: price,
      };

      item.appendChild(createCartItemElement(itemInfo));
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addItemToCart);

  return section;
}

async function verifyFetch(url) {
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
    return fetch(url)
      .then((response) => response.json())
      .then((endpointReturnedObject) => endpointReturnedObject);
  }
  throw new Error('Endpoint inexistente');
}

async function createProductsList(url) {
  const appendProduct = ({ id, title, thumbnail }) => {
    const productInfo = {
      sku: id,
      name: title,
      image: thumbnail,
    };
    const productsList = document.querySelector('.items');
    const product = createProductItemElement(productInfo);
    productsList.appendChild(product);
  };

  await verifyFetch(url)
    .then((object) => object.results.forEach(appendProduct))
    .catch((error) => error);
}

window.onload = () => {
  createProductsList(urlApiMercadoLivre);
};
