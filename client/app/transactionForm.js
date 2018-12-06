const TRANSACTIONS = {
  income: ['paycheck', 'cash'],
  bill: ['rent', 'utilities'],
  expense: ['food', 'entertainment', 'shopping'],
};

const COLORS = [
  "#E94848",
  "#99E948",
  "#48E9E9",
  "#9948E9"
];

class TransactionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      amount: 0,
      type: "income",
      category: '', 
      categories: TRANSACTIONS.income,
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
    let newCategories = TRANSACTIONS.income;
    switch(e.target.value){
      case 'income':
        newCategories = TRANSACTIONS.income;
        break;
      case 'bill':
        newCategories = TRANSACTIONS.bill;
        break;
      case 'expense':
        newCategories = TRANSACTIONS.expense;
        break;
    }

    this.setState({
      type: e.target.value, 
      categories: newCategories});
  };
  
  render() { return ( <div className="col">
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

      <br />

			<label htmlFor="type">
        Transaction Type
      </label>
			<select id="transactionType" value={this.state.type} onChange={this.updateCategories} name="type">
        <option value="income">Income</option>
        <option value="bill">Bill</option>
        <option value="expense">Expense</option>
      </select>

      <br />

			<label htmlFor="category">
        Transaction Type
      </label>
			<select id="transactionCategory" value={this.state.category} onChange={this.handleInputChange} name="category">
        {this.state.categories.map(function(category){
          return (<option value={category}>{category.charAt(0).toUpperCase()}{category.slice(1)}</option>);
        })}        
      </select>
      
      <br />

      <label htmlFor="amount">
        Amount
      </label>
			<input
        type="number"
        id="transactionAmount"
        onChange={this.handleInputChange}
				value={this.state.amount}
				name="amount"
      />

      <br />

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

class CapitalView extends React.Component {
  constructor(props) {
    super(props);
    this.addTransactions = this.addTransactions.bind(this);
  };

  addTransactions() {
    let total = 0;
    this.props.transactions.forEach(t => {
      if (t.type == 'income')
        total+=t.amount;
      else
        total-=t.amount;
    });
    return total;
  };

  render() { 
    return (
      <div>
        <h1>Capital : {this.addTransactions()}</h1>    
      </div>
    );
  };
};

class ExpenseChartView extends React.Component{
  constructor(props) {
    super(props);

    this.drawPieSlice = this.drawPieSlice.bind(this);
    this.getDataPercentages = this.getDataPercentages.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.drawPercent = this.drawPercent.bind(this);
  };  

  // https://blog.lavrton.com/using-react-with-html5-canvas-871d07d8d753
  // react with html5 canvas
  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  // https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
  // for drawing to a canvas in react
  updateCanvas() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");

    const data = this.getDataPercentages();
    let total = 0;
    let startAngle = -0.5 * Math.PI;

    //get total expenses
    TRANSACTIONS.expense.forEach(category => {
      total += data[category];
    });
    
    let colorIndex = 0;

    //color in the slices of the pie
    TRANSACTIONS.expense.forEach(category => {
      const percentage = data[category] / total;
      const rads = percentage * 2 * Math.PI;
      this.drawPieSlice (ctx, 150, 150, 140, startAngle, startAngle + rads, COLORS[colorIndex]);
      this.drawPercent(ctx, startAngle + (0.5 * rads), Math.round(percentage*100));
      colorIndex++;
      if (colorIndex >= COLORS.length)
        colorIndex = 0;
      startAngle += rads;
    });

    this.drawPieSlice (ctx, 150, 150, 50, 0, 2 * Math.PI, 'white');
  }

  // https://code.tutsplus.com/tutorials/how-to-draw-a-pie-chart-and-doughnut-chart-using-javascript-and-html5-canvas--cms-27197
  // for drawing a pie chart with canvas
  drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color ){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
  }

  drawPercent(ctx, middleAngle, percentage) {
    ctx.save();
    var x = 100 * Math.cos(middleAngle) + 130;
    var y = 100 * Math.sin(middleAngle) + 160;
    ctx.fillStyle = "White";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(`${percentage}%`, x, y);
    ctx.restore();
  }

  getDataPercentages(){
    let data = [];
    TRANSACTIONS.expense.forEach(category => {
      data[category] = 0;
    });
    this.props.transactions.forEach(t => {      
      if (t.type == 'expense'){        
        data[t.category] += t.amount;
      }
    });
    return data;
  }

  render() {
    return(
      <div>
        <canvas ref="canvas" width={300} height={300} />
        <img ref="image" src="https://www.craftycookingmama.com/wp-content/uploads/2017/12/070.jpg" className="hidden"/>
      </div>
    );
  };
};

const getAllTransactions = () => {
  sendAjax('GET', '/getTransactions', null, (data) => {

    ReactDOM.render(
      <TransactionList transactions={data.transactions} />,
      document.querySelector("#transactionList")
    );

    ReactDOM.render(
      <CapitalView transactions={data.transactions} />,
      document.querySelector("#capitalView")
    );

    ReactDOM.render(
      <ExpenseChartView transactions={data.transactions} />,
      document.querySelector("#expenseChartView")
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

  ReactDOM.render(
    <CapitalView transactions={[]} />,
    document.querySelector("#capitalView")
  );

  ReactDOM.render(
    <ExpenseChartView transactions={[]}/>,
    document.querySelector("#expenseChartView")
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
