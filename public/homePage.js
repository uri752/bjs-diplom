'use strict'

const logoutButton = new LogoutButton();

logoutButton.action = () => ApiConnector.logout( 
    (response) => {
        if (response.success) {
            location.reload()
        }
    });

ApiConnector.current(
    (response) => {
        if (response.success) {        
            ProfileWidget.showProfile(response.data);
        }
    });

const ratesBoard = new RatesBoard();

function getRatesBoard() {
    console.log("set interval");
    ApiConnector.getStocks(
    (response) => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
            //console.log(response.data);
            //for (var key in response.data) {
              //console.log(`${key} = ${response.data[key]}`)
              //console.log(key);              
            //}
        }
    }    
    );
}

setInterval(getRatesBoard, 1000);

const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = (data) => (
        ApiConnector.addMoney(data, 
            
            (response) => {
                //console.log(response);                
                if (response.success) {
                    ProfileWidget.showProfile(response.data);
                    moneyManager.setMessage(response.success,'Успешный перевод');
                } else {
                    moneyManager.setMessage(response.success, response.error);
                }

            }

            )
        );

moneyManager.conversionMoneyCallback = (data) => (
    ApiConnector.convertMoney(data, 
        
        (response) => {
            //console.log(response);
            if (response.success) {
                ProfileWidget.showProfile(response.data);
                moneyManager.setMessage(response.success, 'Успешная конвертация')
            } else {
                moneyManager.setMessage(response.success, response.error);
            }
        }

        )
    )

moneyManager.sendMoneyCallback = (data) => (
    ApiConnector.transferMoney(data, 
        
        (response) => {
            console.log(response);
            if (response.success) {
                ProfileWidget.showProfile(response.data);
                moneyManager.setMessage(response.success, 'Успешная отправка денег');
            } else {
                moneyManager.setMessage(response.success, response.error);
            }

        }

        )    
    )    

const favoritesWidget = new FavoritesWidget();    
ApiConnector.getFavorites((response) => 
    {
        console.log(response)
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(response.success, 'Успешное получение списка избранного');
        } else {
            moneyManager.setMessage(response.success, response.error);
        }
    }
);

favoritesWidget.addUserCallback = (data) => ApiConnector.addUserToFavorites(data, 
    
    (response) => {
        //console.log(response)
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(response.success, 'Успешное добавление в список избранного');
        } else {
            moneyManager.setMessage(response.success, response.error);
        }

    }
    
    )

favoritesWidget.removeUserCallback = (data) =>  ApiConnector.removeUserFromFavorites(data, 
    
    (response) => {
        console.log(response);
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(response.success, 'Успешное удаление из списка избранного');
        } else {
            moneyManager.setMessage(response.success, response.error);
        }
    }
    
    )