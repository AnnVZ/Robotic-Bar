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
    setTimeout(() => alert('Responce error'), 50);
  }
}

async function handleOrder(isUser) {
  let n = document.getElementById('scroll').childElementCount;
  let empty = true;
  let order = [];
  let login = getCookie('login');
  for (let i = 0; i < n - 1; ++i) {
    let name = document.getElementById('p' + i).textContent;
    let amount = document.getElementById(i).value;
    if (amount > 0) {
      if (isUser) {
        order.push(
          {
            "productName": name,
            "productCount": Number(amount),
            "userLogin": login
          }
        );
      } else {
        order.push(
          {
            "productName": name,
            "productCount": Number(amount)
          }
        );
      }
      empty = false;
    }
  }
  if (empty) {
    alert('Your list is empty');
  } else {
    document.getElementById('order_loader').style.display = 'block';
    document.getElementById('order_button').value = '';
    let responce;
    if (isUser) {
      responce = await fetch(
        'http://robotbarwrite.azurewebsites.net/api/makeOrder',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(order)
        }
      );
    } else {
      //posting data
      // let responce = await fetch(
      //   'http://robotbarwrite.azurewebsites.net/api/makeOrder',
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify(order)
      //   }
      // );
    }
    document.getElementById('order_loader').style.display = 'none';
    document.getElementById('order_button').value = 'Order';
    if (responce.ok) {
      setTimeout(() => alert('Ordered'), 50);
      document.getElementById('content').style.display = 'block';
      document.getElementById('your_list').innerHTML = '<p id="content">empty</p>';
      for (let i = 0; i < document.getElementById('scroll').childElementCount - 1; ++i) {
        document.getElementById(i).value = '';
      }
      if (!isUser) {
        // 
        // increase products amount without redirect
        // 
      }
    } else {
      setTimeout(() => alert('Responce error'), 50);
    }
  }
}
