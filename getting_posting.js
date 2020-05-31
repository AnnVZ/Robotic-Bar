async function getJSON(url) {
  let response = await fetch(url);
  if (response.ok) {
    let json = await response.json();
    return json;
  } else {
    if (response.status == 500) {
      alert(response.statusText);
      return 500;
    }
    return null;
  }
}

async function serveUser(orderId) {
  document.getElementById(orderId).innerHTML = '<div class="submit_loader"></div>';
  let responce = await fetch(
    'http://robotbarwrite.azurewebsites.net/api/order/' + orderId + '?',
    {
      method: 'POST'
    }
  );
  if (responce.ok) {
    document.getElementById(orderId).innerHTML = 'Completed';
    document.getElementById(orderId).className = 'order_status';
  } else {
    document.getElementById(orderId).innerHTML = 'Serve';
    if (responce.status == 400) {
      setTimeout(() => alert('Lack of ingredients'), 50);
    } else {
      setTimeout(() => alert('Error'), 50);
    }
  }
}

let amountStrings, amountStringsId; 

async function orderProduct(i, isUser, orderId, name, amount, login) {
  let orderItem;
  if (isUser) {
    orderItem = {
      "orderId": orderId,
      "productName": name,
      "productCount": Number(amount),
      "userLogin": login
    };
  } else {
    orderItem = {
      "ingredientName": name,
      "ingredientCount": Number(amount)
    };
  }
  let responce;
  if (isUser) {
    responce = await fetch(
      'http://robotbarwrite.azurewebsites.net/api/makeOrder',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderItem)
      }
    );
  } else {
    responce = await fetch(
      'http://robotbarwrite.azurewebsites.net/api/updateingredientsfromstore',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderItem)
      }
    );
    if (responce.ok) {
      amountStringsId.push('sub' + i);
      amountStrings.push(amount);
    }
  }
  return responce.ok;
}

async function handleOrder(isUser) {
  let orderId = uuidv4();
  let n = document.getElementById('scroll').childElementCount;
  let empty = true;
  let login = getCookie('login');
  document.getElementById('order_loader').style.display = 'block';
  document.getElementById('order_button').value = '';
  amountStringsId = [];
  amountStrings = [];

  let promiseArray = new Array();
  for (let i = 0; i < n - 1; ++i) {
    let name = document.getElementById('p' + i).textContent;
    let amount = document.getElementById(i).value;
    if (amount > 0) {
      empty = false;
      if (isUser) {
        promiseArray.push(orderProduct(i, isUser, orderId, name, amount, login, empty, amountStrings, amountStringsId));
      } else {
        promiseArray.push(orderProduct(i, isUser, orderId, name, amount, null, empty, amountStrings, amountStringsId));
      }
    }
  }
  let ok = await Promise.all(promiseArray);
  document.getElementById('order_loader').style.display = 'none';
  document.getElementById('order_button').value = 'Order';
  if (empty) {
    setTimeout(() => alert('Your list is empty'), 50);
  } else {
    if (!ok.includes(false)) {
      setTimeout(() => alert('Ordered'), 50);
      document.getElementById('content').style.display = 'block';
      document.getElementById('your_list').innerHTML = '<p id="content">empty</p>';
      for (let i = 0; i < n - 1; ++i) {
        document.getElementById(i).value = '';
      }
      for (let i = 0; i < amountStringsId.length; ++i) {
        let p = document.getElementById(amountStringsId[i]);
        let value = Number(p.textContent.substr(18)) + Number(amountStrings[i]);
        p.textContent = 'Available amount: ' + value;
      }
    } else {
      setTimeout(() => alert('Error'), 50);
    }
  }
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}