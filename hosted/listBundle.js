"use strict";

var DrinkList = function DrinkList(props) {
  console.dir(props);
  if (props.drinks.length === 0) {
    return React.createElement(
      "div",
      { className: "drinkList" },
      React.createElement(
        "h3",
        { className: "emptyDrink" },
        "No Drinks yet"
      )
    );
  }

  var ingredientNode = function ingredientNode(drink) {
    var ingredients = [];
    for (var i = 0; i < drink.ingredients.length; i++) {
      ingredients.push(React.createElement(
        "div",
        { className: "drinkIngredient" },
        React.createElement(
          "p",
          null,
          drink.ingredients[i].oz,
          " Oz of ",
          drink.ingredients[i].name
        )
      ));
    }
    return ingredients;
  };

  var drinkNodes = props.drinks.map(function (drink) {
    return React.createElement(
      "div",
      { key: drink._id, className: "drink" },
      React.createElement(
        "h3",
        { className: "drinkName" },
        "Name: ",
        drink.name
      ),
      React.createElement(
        "h4",
        { className: "drinkBase" },
        "Base Ingredient: ",
        drink.baseIngredient
      ),
      ingredientNode(drink)
    );
  });

  return React.createElement(
    "div",
    { className: "drinkList" },
    drinkNodes
  );
};

var loadDrinksFromServer = function loadDrinksFromServer() {
  sendAjax('GET', '/getAllDrinks', null, function (data) {
    ReactDOM.render(React.createElement(DrinkList, { drinks: data.drinks }), document.querySelector("#allDrinks"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(DrinkList, { drinks: [] }), document.querySelector("#allDrinks"));

  loadDrinksFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
