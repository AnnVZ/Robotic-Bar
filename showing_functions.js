function showMenu() {
  let role = getUserRole();
  if (role == 'none') {
    document.getElementById('log_out').style.display = 'none';
  } else {
    document.getElementById('log_in').style.display = 'none';
  }
  if (role == 'none') {
    document.getElementById('user_orders').style.display = 'none';
    document.getElementById('ingredients').style.display = 'none';
    document.getElementById('bar_orders').style.display = 'none';
  } else if (role == 'user') {
    document.getElementById('ingredients').style.display = 'none';
    document.getElementById('bar_orders').style.display = 'none';
  } else {
    document.getElementById('user_orders').style.display = 'none';
    if (role == 'bartender') {
    } else {
      document.getElementById('bar_orders').style.display = 'none';
    }
  }
  document.getElementById('menu').style.display = 'block';
}

function showUserInfo() {
  let role = getUserRole();
  if (role != 'none') {
    document.getElementById('identificator').innerHTML =
      getCookie('name') + '<br>• ' + role + ' mode';
    document.getElementById('wrapper').style.display = 'block';
  }
}

async function showCatalog() {
  if (getUserRole() == 'user') {
    showCart();
  }
  let responceJSON = await getJSON(
    'https://robotbar.azurewebsites.net/api/products'
  );
  if (responceJSON == 500) {
    document.getElementById('loader').style.display = 'none';
  } else if (responceJSON == null) {
    alert('Error');
  } else {
    let promiseArray = new Array(responceJSON.length);
    for (let i = 0; i < responceJSON.length; ++i) {
      promiseArray[i] = createCatalogItem(i, responceJSON[i], false);
    }
    let items = await Promise.all(promiseArray);

    document.getElementById('loader').style.display = 'none';
    let scroll = document.getElementById('scroll');
    items.forEach(el => scroll.appendChild(el));
  }
}

async function showIngredients() {
  if (getUserRole() != 'bartender') {
    window.location.href = '/index.html';
  } else {
    showCart();
    let responceJSON = await getJSON(
      'https://robotbar.azurewebsites.net/api/ingredients'
    );
    if (responceJSON == 500) {
      document.getElementById('loader').style.display = 'none';
    } else if (responceJSON == null) {
      alert('Error');
    } else {
      let promiseArray = new Array(responceJSON.length);
      for (let i = 0; i < responceJSON.length; ++i) {
        promiseArray[i] = createCatalogItem(i, responceJSON[i], true);
      }
      let items = await Promise.all(promiseArray);

      document.getElementById('loader').style.display = 'none';
      let scroll = document.getElementById('scroll');
      items.forEach(el => scroll.appendChild(el));
    }
  }
}

function showCart() {
  document.getElementById('scroll').style.right = '22%';
  document.getElementById('current_order').style.display = 'block';
}

async function showOrders(isAll) {
  let role = getUserRole();
  if ((role != 'bartender' && isAll) || (role != 'user' && !isAll)) {
    window.location.href = '/index.html';
  } else {
    let responceJSON;
    if (isAll) {
      responceJSON = await getJSON(
        'http://robotbar.azurewebsites.net/api/GetAllOrders?code=alEQDKgW/FxmB284LEoFzd7s3kJkHd/5SwUvpnDeYFZeMgvlViqkhQ=='
      );
    } else {
      responceJSON = await getJSON('http://robotbar.azurewebsites.net/api/orders/' + getCookie('login'));
    }
    if (responceJSON == 500) {
      document.getElementById('loader').style.display = 'none';
    } else if (responceJSON == null) {
      alert('Error');
    } else {
      let orders;
      if (isAll) {
        orders = mapAllUsersOrders(responceJSON);
      } else {
        orders = mapUserOrders(responceJSON);
      }
      let promiseArray = new Array(orders.size);
      let i = 0;
      for (var [orderId, value] of orders) {
        if (isAll) {
          promiseArray[i] = createOrderListItemB(i, orderId, value, orders.size);
        } else {
          promiseArray[i] = createOrderListItemU(i, orderId, value, orders.size);
        }
        ++i;
      }
      let items = await Promise.all(promiseArray);
      document.getElementById('loader').style.display = 'none';
      let scroll = document.getElementById('scroll');
      for (i = items.length - 1; i >= 0; --i) {
        scroll.appendChild(items[i]);
      }
    }
  }
}