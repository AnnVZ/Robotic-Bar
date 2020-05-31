function createDiv(i, j, h2content, p, label) {
    let div = document.createElement('div');
    if (i == j) {
        div.className = 'catalogue_item';
    } else {
        div.className = 'catalogue_item not_first_item';
    }
    let description = document.createElement('div');
    description.className = 'catalogue_item_description';
    div.appendChild(description);
    let h2 = document.createElement('h2');
    h2.id = 'p' + i;
    h2.textContent = h2content;
    description.appendChild(h2);
    if (p != null) {
        p.id = 'sub' + i;
        description.appendChild(p);
    }
    if (label != null) {
        div.appendChild(label);
    }
    return div;
}

async function createCatalogItem(i, json, isIngredient) {
    let p = document.createElement('p');
    let content = '';
    if (isIngredient) {
        content += 'Available amount: ';
        let role = getUserRole();
        if (role == 'bartender') {
            content += json['barCount'];
        } else if (role == 'storekeeper') {
            content += json['storeCount'];
        } else {
            content += 0;
        }
    } else {
        let responceJSON = await getJSON(
            'http://robotbar.azurewebsites.net/api/product?name=' + json['name']
        );
        if (responceJSON == 500) {
        } else if (responceJSON != null) {
            for (let j = 0; j < responceJSON.length - 1; ++j) {
                content += responceJSON[j]['name'] + ', ';
            }
            content += responceJSON[responceJSON.length - 1]['name'];
        }
    }
    p.textContent = content;
    let label = null;
    if (getUserRole() == 'user' || isIngredient) {
        label = document.createElement('label');
        label.className = 'add_item_check';
        let input = document.createElement('input');
        input.className = 'number';
        input.type = 'number';
        input.name = 'type' + i;
        input.id = i;
        input.placeholder = '0';
        input.min = '0';
        input.addEventListener('input', function () {
            changeCartState('p' + i, i);
        });
        label.appendChild(input);
    }
    return createDiv(i, 0, json['name'], p, label);
}

async function createOrderListItemU(i, orderId, value, len) {
    let status = value[0];
    let products = value[1];
    let counts = value[2];
    // let num = i + 1;
    // let content = '#' + num + ' ';
    let content = '• ';
    for (let j = 0; j < products.length - 1; ++j) {
        content += products[j] + ' ' + counts[j] + ', ';
    }
    content += products[products.length - 1] + ' ' + counts[products.length - 1];
    let label = document.createElement('label');
    label.className = 'order_status';
    if (status == false) {
        label.textContent = 'In progress';
    } else {
        label.textContent = 'Completed';
    }
    return createDiv(i, len - 1, content, null, label);
}

async function createOrderListItemB(i, orderId, value, len) {
    let status = value[1];
    let products = value[2];
    let counts = value[3];
    // let num = i + 1;
    // let content = '#' + num + ' ';
    let h2Content = '• ';
    for (let j = 0; j < products.length - 1; ++j) {
        h2Content += products[j] + ' ' + counts[j] + ', ';
    }
    h2Content += products[products.length - 1] + ' ' + counts[products.length - 1];
    let p = document.createElement('p');
    let ingredients = new Map();
    for (let j = 0; j < products.length; ++j) {
        let responceJSON = await getJSON(
            'http://robotbar.azurewebsites.net/api/product?name=' + products[j]
        );
        if (responceJSON == 500) {
        } else if (responceJSON != null) {
            for (let k = 0; k < responceJSON.length; ++k) {
                let ingName = responceJSON[k]['name'];
                let ingCount = ingredients.get(ingName);
                if (ingCount == undefined) {
                    ingredients.set(ingName, counts[j]);
                } else {
                    ingredients.set(ingName, ingCount + counts[j]);
                }
            }
        }
    }
    let pContent = '';
    let j = 0;
    for (var [name, count] of ingredients) {
        if (j == ingredients.size - 1) {
            pContent += name + ' ' + count;
        } else {
            pContent += name + ' ' + count + ', ';
        }
        ++j;
    }
    p.textContent = pContent;
    let label = document.createElement('label');
    if (status == false) {
        label.className = 'order_status underline';
        label.textContent = 'Serve';
        label.id = orderId;
        label.onclick = function () {
            serveUser(orderId);
        };
    } else {
        label.className = 'order_status';
        label.textContent = 'Completed';
    }
    return createDiv(i, len - 1, h2Content, p, label);
}

function changeCartState(productId, amountInputId) {
    let item = document.getElementById(productId).textContent;
    let amount = document.getElementById(amountInputId).value;
    let div = document.getElementById('your_list_item_' + amountInputId);
    if (amount == 0) {
        if (div != null) {
            div.remove();
        }
        if (document.getElementById('your_list').childElementCount == 1) {
            document.getElementById('content').style.display = 'block';
        }
    } else {
        if (div != null) {
            document.getElementById('amount_' + amountInputId).textContent = amount;
        } else {
            div = document.createElement('div');
            div.className = 'your_list_item';
            div.textContent = item;
            div.id = 'your_list_item_' + amountInputId;

            let p = document.createElement('p');
            p.className = 'amount';
            p.textContent = amount;
            p.id = 'amount_' + amountInputId;
            div.appendChild(p);
            document.getElementById('your_list').appendChild(div);
            document.getElementById('content').style.display = 'none';
        }
    }
}
