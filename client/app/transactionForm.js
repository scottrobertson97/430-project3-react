class TransactionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      amount: 0,
      type: "income",
      category: '', 
      categories: ['paycheck', 'cash'],
    };
    this.categoryTypes = {
      income: ['paycheck', 'cash'],
      bill: ['rent', 'utilities'],
      expense: ['food', 'entertainment'],
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateCategories = this.updateCategories.bind(this);
	};

	handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  updateCategories(e){
    let newCategories = this.categoryTypes.income;
    switch(e.target.value){
      case 'income':
        newCategories = this.categoryTypes.income;
        break;
      case 'bill':
        newCategories = this.categoryTypes.bill;
        break;
      case 'expense':
        newCategories = this.categoryTypes.expense;
        break;
    }

    this.setState({
      type: e.target.value, 
      categories: newCategories});
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
			<select id="transactionType" value={this.state.type} onChange={this.updateCategories} name="type">
        <option value="income">Income</option>
        <option value="bill">Bill</option>
        <option value="expense">Expense</option>
      </select>

			<label htmlFor="category">
        Transaction Type
      </label>
			<select id="transactionCategory" value={this.state.category} onChange={this.handleInputChange} name="category">
        {this.state.categories.map(function(category){
          return (<option value={category}>{category.charAt(0).toUpperCase()}{category.slice(1)}</option>);
        })}        
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
      <input className="addTransactionSubmit" type="submit" value="Add Transaction"/>
    </form>
  </div>);};
  
  handleSubmit(e) {
    e.preventDefault();

    //error check
    
    sendAjax('POST', $("#transactionForm").attr("action"), $("#transactionForm").serialize(), function() {
      getAllTransactions();
    });
  
    return false;
  };
};

class TransactionList extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    if (this.props.transactions.length === 0) {
      return (
        <div className="transactionList">
          <h1>All Transactions</h1>
          <h3 className="emptyTransaction">No transactions yet</h3>
        </div>
      );
    }

    const transactionNodes = this.props.transactions.map(function(t){
      return (<div key={t._id} className="transaction">        
        <h3 className="transactionName">Name: {t.name}</h3>
        <p className="transactionAmount">$: {t.amount}</p>
        <p className="transactionType">Type: {t.type}</p>  
        <p className="transactionCategory">Category: {t.category}</p>  
      </div>);
    });

    return (<div className="transactionList">
      <h1>All Transactions</h1>
      {transactionNodes}
    </div>); 
  };
};

const getAllTransactions = () => {
  sendAjax('GET', '/getTransactions', null, (data) => {
    ReactDOM.render(
      <TransactionList transactions={data.transactions} />,
      document.querySelector("#transactionList")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <TransactionForm csrf={csrf}/>,
    document.querySelector("#addTransaction")
  );

  ReactDOM.render(
    <TransactionList transactions={[]} />,
    document.querySelector("#transactionList")
  );

  getAllTransactions();
};

const getToken = () =>{
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});
