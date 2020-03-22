'use strict'
//Выход из личного кабинета
const lodoutButton = new LogoutButton();

lodoutButton.action = function() {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        }
    });
};

//Получение информации о пользователе
function getCurrentUser() {
    ApiConnector.current(response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
        }
    });
};
getCurrentUser();

//Получение текущих курсов валюты
const rateBoard= new RatesBoard();
function getExchangeRates() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            rateBoard.clearTable();
            rateBoard.fillTable(response.data);
        }
    }) ;
};
getExchangeRates();
setInterval(getExchangeRates, 60000);

//Операции с деньгами
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            moneyManager.setMessage(false, 'Успешное пополнении баланса');
            ProfileWidget.showProfile(response.data);
        } else {
            moneyManager.setMessage(true, 'Ошибка при пополнении баланса');
        }
    });
};

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            moneyManager.setMessage(false, 'Успешное конвертирование валюты');
            ProfileWidget.showProfile(response.data);
        } else {
            moneyManager.setMessage(true, 'Ошибка при конвертировании валюты');
        }
    });
};

moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            moneyManager.setMessage(false, 'Успешный перевод валют');
            ProfileWidget.showProfile(response.data);
        } else {
            moneyManager.setMessage(true, 'Ошибка при переводе валют');
        }
        console.log(response.data)
    });
};

//Работа с избранным
const favoritWidget = new FavoritesWidget();
function getListFavorires() {
    ApiConnector.getFavorites(response => {
        if (response.success) {
            favoritWidget.clearTable();
            favoritWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
        }
    });
};
getListFavorires();

function updateListFavorires(data) {
    favoritWidget.clearTable();
    favoritWidget.fillTable(data);
    moneyManager.updateUsersList(data);
}

favoritWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favoritWidget.setMessage(false, 'Успешное добавление пользователя');
            updateListFavorires(response.data);
        } else {
            favoritWidget.setMessage(true, 'Ошибка добавления пользователя');
        }
    });
};

favoritWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            favoritWidget.setMessage(false, 'Успешное удаление пользователя');
            updateListFavorires(response.data);
        } else {
            favoritWidget.setMessage(true, 'Ошибка удаления пользователя');
        }
    });
};