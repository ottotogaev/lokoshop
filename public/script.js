const toCurrency = price => {
  return new Intl.NumberFormat('en-US', {
    currency: 'usd',
    style: 'currency'
  }).format(price)
}

const toDate = date => {
  return new Intl.DateTimeFormat('uz', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(date))
}

document.querySelectorAll('.date').forEach(node => {
  node.textContent = toDate(node.textContent);
})


document.querySelectorAll('.price').forEach(node => {
  node.textContent = toCurrency(node.textContent);
});

const $card = document.querySelector('#card');
if ($card) {
  $card.addEventListener('click', event => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id;
      const csrf = event.target.dataset.csrf
      // console.log(id);
      fetch('/card/remove/' + id, {
          method: 'delete',
          headers: {
            "X-XSRF-TOKEN": csrf
          }
        }).then(res => res.json())
        .then(card => {
          if (card.products.length) {          
            const mapHtml = card.products.map(c => {
              return `
            <tr>
              <td>${c.title}</td>
              <td>${c.count}</td>
              <td>
                <button class="btn btn-small js-remove" data-id="${c.id}">Удалить</button>
              </td>
            </tr>
            `
            }).join('');
            $card.querySelector('tbody').innerHTML = mapHtml;
            $card.querySelector('.price').textContent = toCurrency(card.price);
          } else {
            $card.innerHTML = '<h1>Корзина Пуста</h1>'
          }
        })
    }
  })
}

M.Tabs.init(document.querySelectorAll('.tabs'));