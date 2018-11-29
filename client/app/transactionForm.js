class TransactionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      amount: 0,
      type: "income",
      category: '', 
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	};

	handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };
  
  render() { return ( <div>
    <form id="transactionForm" onSubmit={this.handleSubmit}>
      <label htmlFor="name">
        Transaction Name
      </label>
      <input
        type="text"
        id="transactionName"
        onChange={this.handleInputChange}
				value={this.state.name}
				name="name"
      />

			<label htmlFor="type">
        Transaction Type
      </label>
			<select id="transactionType" value={this.state.type} onChange={this.handleChange} name="type">
        <option value="income">Income</option>
        <option value="bill">Bill</option>
        <option value="expense">Expense</option>
      </select>

			<label htmlFor="category">
        Transaction Type
      </label>
			<select id="transactionCategory" value={this.state.category} onChange={this.handleChange} name="category">
        <TransactionCategoryOptions type={this.state.type}/>
      </select>

      <label htmlFor="amount">
        $ Amount
      </label>
			<input
        type="number"
        id="transactionAmount"
        onChange={this.handleInputChange}
				value={this.state.amount}
				name="amount"
      />

      <input type="hidden" name="_csrf" value={this.props.csrf}/>
    </form>
  </div>);};
  
  handleSubmit(e) {
    e.preventDefault();

    //error check
    
    sendAjax('POST', $("#transactionForm").attr("action"), $("#transactionForm").serialize(), function() {
      loadDrinksFromServer();
    });
  
    return false;
  };
};

class TransactionCategoryOptions extends React.Component {
  constructor(props) {
    super(props);
  };
  render() {
    switch (this.props.type) {
      case "income":
        return (<div>
          <option value="paycheck">Paycheck</option>
          <option value="cash">Cash</option>
        </div>);
        break;
      case "bill":
        return (<div>
          <option value="rent">Rent</option>
          <option value="utilities">Utilities</option>
        </div>);
        break;
      case "expense":
        return (<div>
          <option value="food">Food</option>
          <option value="entertainment">Entertainment</option>
        </div>);
        break;
      default:
        return (<div>
          <option value="?">?</option>
        </div>);
        break;
    };
  };
};

const setup = function(csrf) {
  ReactDOM.render(
    <TransactionForm csrf={csrf}/>,
    document.querySelector("#addTransaction")
  );
};

const getToken = () =>{
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
