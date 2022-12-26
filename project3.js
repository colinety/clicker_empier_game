const config = {
    initial_form: document.getElementById("initial_form"),
    main_page: document.getElementById("main_page"),
}

class User{
    constructor(name, age, days, money, items){
        this.name = name;
        this.age = age;
        this.days = days;
        this.money = money;
        this.click_count = 0;
        this.income_per_click = 25;
        this.income_per_sec = 0;
        this.stock = 0;
        this.items = items;
    }
}

class Items{
    constructor(name, type, cur_amount, max_amount, per_money, per_rate, price, url){
        this.name = name;
        this.type = type;
        this.cur_amount = cur_amount;
        this.max_amount = max_amount;
        this.per_money = per_money;
        this.per_rate = per_rate;
        this.price = price;
        this.url = url;
    }
}

class Show{
    static create_initial_form(){
        let container = document.createElement("div");
        container.classList.add("vh-100", "d-flex", "justify-content-center", "align-items-center");
        container.innerHTML =
        `
        <div class="bg-white text-center p-4">
            <h1 class="pb-3">Clicker Empire Game</h1>
            <form>
                <div class="pb-3">
                    <div class="col requierd">
                        <input class="form-control" type="text" placeholder="Enter your name" required>
                    </div>
                </div>
            </form>
            <div class="d-flex justify-content-between">
                <div class="col-6 p-2">
                    <button id="login" type="submit" class="btn btn-outline-primary col-12">Login</button>
                </div>
                <div class="col-6 p-2">
                    <button id="new" type="submit" class="btn btn-primary col-12">New</button>
                </div>
            </div>
        </div>
        `

        return config.initial_form.append(container);
    }

    static create_main_page(user){
        let container = document.createElement("div");
        container.innerHTML =
        `
        <div class="d-flex justify-content-center vh-100 bg-success">
            <div class="p-2 d-flex">
                <div id="burger_status" class="bg-dark p-2">
                </div>
                <div class="col-8">
                    <div id="user_info" class="p-1 bg-success">
                    </div>
                    <div id="display_items" class="bg-dark m-2 p-1 flow_height">
                    </div>
                    <div class="d-flex justify-content-end mt-2">
                        <div id="reset" class="border p-2 m-2 hover">
                            <i class="fas fa-undo fa-2x text-white"></i>
                        </div>
                        <div id="save" class="border p-2 m-2 hover">
                            <i class="fas fa-save fa-2x text-white"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        container.querySelectorAll("#burger_status")[0].append(Show.create_burger_status(user));
        container.querySelectorAll("#user_info")[0].append(Show.create_user_info(user));
        container.querySelectorAll("#display_items")[0].append(Show.create_item_page(user));

        let reset_btn = container.querySelectorAll("#reset")[0];
        reset_btn.addEventListener("click", function(){
            GameManager.reset_all_data(user);
        });

        let save_btn = container.querySelectorAll("#save")[0];
        save_btn.addEventListener("click", function(){
            GameManager.save_user_data(user);
            GameManager.stop_timer();
            GameManager.initialize_page();
        });

        return container;
    }

    static create_burger_status(user){
        let container = document.createElement("div");
        container.innerHTML =
        `
        <div class="bg-success text-white text-center">
            <h3>${user.click_count} Burgers</h3>
            <p class="p-1">￥${user.income_per_click} /Click</p>
        </div>
        <div class="p-2 pt-5 d-flex justify-content-center hover">
            <img id="burger" class="py-2 img-fluid" src="https://cdn.pixabay.com/photo/2014/04/02/17/00/burger-307648_960_720.png" width=80%>
        </div>
        `
        let burger_click = container.querySelectorAll("#burger")[0];
        burger_click.addEventListener("click", function(){
            GameManager.update_by_click_burger(user);
        });

        return container;
    }

    static create_user_info(user){
        let container = document.createElement("div");
        container.classList.add("d-flex", "flex-wrap");
        container.innerHTML =
        `
        <div class="d-flex flex-wrap justify-content-center bg-dark col-12 m-1">
            <div class="bg-success text-white text-center col-5 m-1">
                <p>${user.name}</p>
            </div>
            <div class="bg-success text-white text-center col-5 m-1">
                <p>${user.age} years old</p>
            </div>
            <div class="bg-success text-white text-center col-5 m-1">
                <p>${user.days} days</p>
            </div>
            <div class="bg-success text-white text-center col-5 m-1">
                <p>${user.money}</p>
            </div>
        </div>
        `
        return container;
    }

    static create_item_page(user){
        let container = document.createElement("div");
        container.classList.add("overflow-auto")
        for(let i = 0; i < user.items.length; i++){
            container.innerHTML +=
            `
            <div class="d-flex text-white align-items-center m-1 select_item col-12">
                <div class="col-2">                    
                    <img class="img-fluid d-flex flex-wrap" src="${user.items[i].url}">
                </div>
                <div class="col-10 p-3">
                    <div class="d-flex justify-content-between">
                        <h4>${user.items[i].name}</h4>
                        <h4>${user.items[i].cur_amount}</h4>
                    </div>
                    <div class="d-flex justify-content-between">
                        <p>￥${user.items[i].price}</p>
                        <p class="text-dark">￥${Show.display_item_income(user.items[i], user.items[i].type)}</p>
                    </div>
                </div>
            </div>
            `
        }
        let select = container.querySelectorAll(".select_item");
        for(let i = 0; i < select.length; i++){
            select[i].addEventListener("click", function(){
                config.main_page.querySelectorAll("#display_items")[0].innerHTML = '';
                config.main_page.querySelectorAll("#display_items")[0].append(Show.create_purchase_page(user, i));
            });
        }

        return container;
    }

    static create_purchase_page(user, index){
        let container = document.createElement("div");
        container.innerHTML =
        `
        <div class="bg-success p-2 m-1 text-white">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h4>${user.items[index].name}</h4>
                    <p>Max purchases: ${Show.display_max_purchase(user.items[index].max_amount)}</p>
                    <p>Price: ￥${user.items[index].price}</p>
                    <p>Get ￥${Show.display_item_income(user.items[index], user.items[index].type)}</p>
                </div>
                <div class="p-2 d-flex justify-content-end">
                    <img class="img-fluid" src="${user.items[index].url}" width=50%>
                </div>
            </div>
            <p>How many would you like to buy?</p>
            <input type="number" placeholder="0" class="col-12">
            <p id="total_price" class="text-right">Total: ￥0</p>
            <div class="d-flex justify-content-between pb-3">
                <button id="back" class="btn btn-outline-primary col-5 bg-white">Go Back</buttone>
                <button id="purchase" class="btn btn-primary col-5">Purchase</buttone>
            </div>
        </div>
        `
        let input_count = container.querySelectorAll("input")[0];
        input_count.addEventListener("input", function(){
            container.querySelectorAll("#total_price")[0].innerHTML =
            `
            total: ￥${GameManager.get_total_price(user.items[index], input_count.value)}
            `
        });

        let back_btn = container.querySelectorAll("#back")[0];
        back_btn.addEventListener("click", function(){
            Show.update_main_page(user);
        });

        let purchase_btn = container.querySelectorAll("#purchase")[0];
        purchase_btn.addEventListener("click", function(){
            GameManager.purchase_items(user, index, input_count.value);
            Show.update_main_page(user);
        });

        return container;
    }

    static display_max_purchase(max_amount){
        if(max_amount == -1){
            return "∞";
        }else{
            return max_amount;
        }
    }

    static display_item_income(item, type){
        if(type == "ability"){
            return item.per_money + " /click";
        }else if(type == "investment"){
            return item.per_rate + " /sec";
        }else{
            return item.per_money + " /sec";
        }
    }

    static update_main_page(user){
        config.main_page.innerHTML = '';
        config.main_page.append(Show.create_main_page(user));
    }

    static update_burger_page(user){
        let burger_status = config.main_page.querySelectorAll("#burger_status")[0];
        burger_status.innerHTML = '';
        burger_status.append(Show.create_burger_status(user));
    }

    static update_user_info(user){
        let user_info = config.main_page.querySelectorAll("#user_info")[0];
        user_info.innerHTML = '';
        user_info.append(Show.create_user_info(user));
    }
}

class GameManager{
    timer;

    static start_game(){
        Show.create_initial_form();
        let new_btn = config.initial_form.querySelectorAll("#new")[0];
        new_btn.addEventListener("click", function(){
            let user_name = config.initial_form.querySelectorAll("input")[0].value;
            let user = GameManager.create_initial_user_account(user_name);
            if(user == null){
                alert("Not input your name!");
            }else{
                GameManager.move_initial_to_main(user);
            }
        });

        let login_btn = config.initial_form.querySelectorAll("#login")[0];
        login_btn.addEventListener("click", function(){
            let user_name = config.initial_form.querySelectorAll("input")[0].value;
            let user = GameManager.get_user_data(user_name);
            if(user == null){
                alert("There is no data!");
            }else{
                GameManager.move_initial_to_main(user);
            }
        });
    }

    static move_initial_to_main(user){
        config.initial_form.classList.add("d-none");
        config.main_page.append(Show.create_main_page(user));
        GameManager.start_timer(user);
    }

    static create_initial_user_account(user_name){
        let items_list = [
            new Items("Flip machine", "ability", 0, 500, 25, 0, 15000, "https://cdn.pixabay.com/photo/2019/06/30/20/09/grill-4308709_960_720.png"),
            new Items("ETF Stock", "investment", 0, -1, 0, 0.1, 300000, "https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png"),
            new Items("ETF Bonds", "investment", 0, -1, 0, 0.07, 300000, "https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png"),
            new Items("Lemonade Stand", "realState", 0, 1000, 30, 0, 30000, "https://cdn.pixabay.com/photo/2012/04/15/20/36/juice-35236_960_720.png"),
            new Items("Ice Cream Truck", "realState", 0, 500, 120, 0, 100000, "https://cdn.pixabay.com/photo/2020/01/30/12/37/ice-cream-4805333_960_720.png"),
            new Items("House", "realState", 0, 100, 32000, 0, 20000000, "https://cdn.pixabay.com/photo/2016/03/31/18/42/home-1294564_960_720.png"),
            new Items("TownHouse", "realState", 0, 100, 64000, 0, 40000000, "https://cdn.pixabay.com/photo/2019/06/15/22/30/modern-house-4276598_960_720.png"),
            new Items("Mansion", "realState", 0, 20, 500000, 0, 250000000, "https://cdn.pixabay.com/photo/2017/10/30/20/52/condominium-2903520_960_720.png"),
            new Items("Industrial Space", "realState", 0, 10, 2200000, 0, 1000000000, "https://cdn.pixabay.com/photo/2012/05/07/17/35/factory-48781_960_720.png"),
            new Items("Hotel Skyscraper", "realState", 0, 5, 25000000, 0, 10000000000, "https://cdn.pixabay.com/photo/2012/05/07/18/03/skyscrapers-48853_960_720.png"),
            new Items("Bullet-Speed Sky Railway", "realState", 0, 1, 30000000000, 0, 10000000000000, "https://cdn.pixabay.com/photo/2013/07/13/10/21/train-157027_960_720.png")   
        ]

        return new User(user_name, 20, 0, 50000, items_list);
    }

    static start_timer(user){
        GameManager.timer = setInterval(function(){
            user.days++;
            user.money += user.income_per_sec;
            if(user.days % 365 == 0){
                user.age++;
                Show.update_user_info(user);
            }else{
                Show.update_user_info(user);
            }
        }, 1000);
    }

    static stop_timer(){
        clearInterval(GameManager.timer);
    }

    static purchase_items(user, index, count){
        if(count <= 0 || count % 1 != 0){
            alert("Invalid Number!");
        }else if(GameManager.get_total_price(user.items[index], count) > user.money){
            alert("You don't have enough money!");
        }else if(user.items[index].cur_amount + count > user.items[index].max_amount && user.items[index].type != "investment"){
            alert("You can't buy anymore!");
        }else{
            user.money -= GameManager.get_total_price(user.items[index], count);
            user.items[index].cur_amount += Number(count);
            if(user.items[index].name == "ETF Stock"){
                user.stock += GameManager.get_total_price(user.items[index], count);
                user.items[index].price = GameManager.calculate_ETF_Stock_price(user.items[index], count);
                GameManager.update_user_income(user, user.items[index], count);
            }else if(user.items[index].name == "ETF Bonds"){
                user.stock += GameManager.get_total_price(user.items[index], count);
                GameManager.update_user_income(user, user.items[index], count);
            }else{
                GameManager.update_user_income(user, user.items[index], count);
            }
        }
    }

    static update_by_click_burger(user){
        user.click_count++;
        user.money += user.income_per_click;
        Show.update_burger_page(user);
        Show.update_user_info(user);
    }

    static get_total_price(item, count){
        let total = 0;
        count = Number(count);
        if(item.name == "ETF Stock"){
            for(let i = 0; i < count; i++){
                total += parseInt(item.price * Math.pow(1 + item.per_rate, i));
            }
            return total;
        }else if(count > 0 && count % 1 == 0){
            return total += item.price * count;
        }else{
            return total;
        }
    }

    static calculate_ETF_Stock_price(item, count){
        return parseInt(item.price * Math.pow(1 + item.per_rate, count));
    }

    static update_user_income(user, items, count){
        count = Number(count);
        if(items.type == "ability"){
            user.income_per_click += items.per_money * count;
        }else if(items.type == "investment"){
            user.income_per_sec += user.stock * items.per_rate;
        }else if(items.type == "realState"){
            user.income_per_sec += items.per_money * count;
        }
    }

    static reset_all_data(user){
        if(window.confirm("Reset All Data?")){
            let user_name = user.name;
            user = GameManager.create_initial_user_account(user_name);
            GameManager.stop_timer();
            Show.update_main_page(user);
            GameManager.start_timer(user);
        }
    }

    static save_user_data(user){
        localStorage.setItem(user.name, JSON.stringify(user));
        alert("Saved your data. Please put the same name when you login.");
    }

    static get_user_data(user_name){
        return JSON.parse(localStorage.getItem(user_name));
    }

    static initialize_page(){
        config.initial_form.classList.remove("d-none");
        config.initial_form.innerHTML = '';
        config.main_page.innerHTML = '';
        GameManager.start_game();
    }
}

GameManager.start_game();