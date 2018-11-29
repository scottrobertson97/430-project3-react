const handleDrink = (e) => {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if($("#drinkName").val() == '' || $("#baseIngredient").val() == ''){
    handleError("All fields are required.");
    return false;
  }

  /*
  need to get data from the from correctly
  */
  sendAjax('POST', $("#drinkForm").attr("action"), $("#drinkForm").serialize(), function() {
    loadDrinksFromServer();
  });

  return false;
};

const DrinkForm = (props) => {
  return (
    <div>
    <form id="drinkForm"
      onSubmit={handleDrink}
      name="drinkForm"
      action="/maker"
      method="POST"
      className="drinkForm"
    >
      <label htmlFor="name">Name: </label>
      <input id="drinkName" type="text" name="name" placeholder="Drink Name"/>
      <br />
      <label htmlFor="baseIngredient">Base: </label>
      <select id="baseIngredient" name="baseIngredient">
        <option value="other">Other</option>
        <option value="vodka">Vodka</option>
        <option value="gin">Gin</option>
        <option value="rum">Rum</option>
        <option value="whiskey">Whiskey</option>
        <option value="tequila">Tequila</option>
      </select>
      <br />
      <label htmlFor="ingredientOz">Oz: </label>
        <input id="ingredientOz" type="number" name="ingredientOz" min="0" max="5" step="0.25"/>
        <label htmlFor="ingredientName">Ingredient: </label>
        <input id="ingredientName" type="text" name="ingredientName" />
        <br />
        <label htmlFor="ingredientOz">Oz: </label>
        <input id="ingredientOz" type="number" name="ingredientOz" min="0" max="5" step="0.25"/>
        <label htmlFor="ingredientName">Ingredient: </label>
        <input id="ingredientName" type="text" name="ingredientName" />
        <br />
        <label htmlFor="ingredientOz">Oz: </label>
        <input id="ingredientOz" type="number" name="ingredientOz" min="0" max="5" step="0.25"/>
        <label htmlFor="ingredientName">Ingredient: </label>
        <input id="ingredientName" type="text" name="ingredientName" />
        <br />
        <label htmlFor="ingredientOz">Oz: </label>
        <input id="ingredientOz" type="number" name="ingredientOz" min="0" max="5" step="0.25"/>
        <label htmlFor="ingredientName">Ingredient: </label>
        <input id="ingredientName" type="text" name="ingredientName" />

      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input className="makeDrinkSubmit" type="submit" value="Add Drink"/>
    </form>
    </div>
  );
};

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
  sendAjax('GET', '/getDrinks', null, (data) => {
    ReactDOM.render(
      <DrinkList drinks={data.drinks} />,
      document.querySelector("#drinks")
    );
  });
};

const setup = function(csrf) {

  ReactDOM.render(
    <DrinkForm csrf={csrf}/>,
    document.querySelector("#makeDrinks")
  );

  ReactDOM.render(
    <DrinkList drinks={[]} />,
    document.querySelector("#drinks")
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
