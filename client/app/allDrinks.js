const DrinkList = function(props) {
  console.dir(props);
  if(props.drinks.length === 0) {
    return (
      <div className="drinkList">
        <h3 className="emptyDrink">No Drinks yet</h3>
      </div>
    );
  }

  const ingredientNode = (drink) => {
    let ingredients = [];
    for (let i = 0; i < drink.ingredients.length; i++) {
      ingredients.push(
        <div className="drinkIngredient">
          <p>{drink.ingredients[i].oz} Oz of {drink.ingredients[i].name}</p>
        </div>);
    }
    return ingredients;
  }

  const drinkNodes = props.drinks.map(function(drink) {
    return (
      <div key={drink._id} className="drink">        
        <h3 className="drinkName">Name: {drink.name}</h3>
        <h4 className="drinkBase">Base Ingredient: {drink.baseIngredient}</h4>
        {ingredientNode(drink)}
      </div>
    );
  });

  return (
    <div className="drinkList">
      {drinkNodes}
    </div>
  );
};

const loadDrinksFromServer = () => {
  sendAjax('GET', '/getAllDrinks', null, (data) => {
    ReactDOM.render(
      <DrinkList drinks={data.drinks} />,
      document.querySelector("#allDrinks")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <DrinkList drinks={[]} />,
    document.querySelector("#allDrinks")
  );

  loadDrinksFromServer();
};

const getToken = () =>{
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
