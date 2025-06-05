export function addToCart(item: any, quantity: number) {
    item.quantity = quantity;
    var list;
    if (localStorage.getItem('cart') == null) {
        list = [item];
    } else {
        list = JSON.parse(localStorage.getItem('cart') || '[]');
        // alert(JSON.stringify(list));
        let ok = true;
        // for (let x of list) {
        //     if (x.product_Id == item.product_Id) {
        //         // alert("This product is already in your cart!");
        //         x.quantity += quantity;
        //         ok = false;
        //         break;
        //     }
        // }
        if (ok) {
            list.push(item);
        }
    }
    localStorage.setItem('cart', JSON.stringify(list));
    
    console.log(list)
}