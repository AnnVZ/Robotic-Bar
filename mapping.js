function mapUserOrders(json) {
    let orders = new Map();
    for (let i = 0; i < json.length; ++i) {
        let orderId = json[i]['orderId'];
        let order = orders.get(orderId);
        if (order == undefined) {
            orders.set(orderId, [
                json[i]['orderStatus'],
                [json[i]['productName']],
                [json[i]['productCount']]
            ]);
        } else {
            order[1].push(json[i]['productName']);
            order[2].push(json[i]['productCount']);
            orders.set(orderId, order);
        }
    }
    return orders;
}

function mapAllUsersOrders(json) {
    let orders = new Map();
    for (let i = 0; i < json.length; ++i) {
        let orderId = json[i]['orderId'];
        let order = orders.get(orderId);
        if (order == undefined) {
            orders.set(orderId, [
                json[i]['userId'],
                json[i]['orderStatus'],
                [json[i]['productName']],
                [json[i]['productCount']]
            ]);
        } else {
            order[2].push(json[i]['productName']);
            order[3].push(json[i]['productCount']);
            orders.set(orderId, order);
        }
    }
    return orders;
}