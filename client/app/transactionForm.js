// list of all categories for each type of transaction
const TRANSACTIONS = {
  income: ['paycheck', 'cash', 'bonus', 'reimbursement'],
  bill: ['rent', 'utilities', 'internet', 'phone'],
  expense: ['food', 'entertainment', 'shopping', 'groceries', 'personal care', 'other'],
};

// list of colors for pie chart
const COLORS = [
  "#E94848",
  "#99E948",
  "#48E9E9",
  "#9948E9",
  "#E98548",
  "#4891E9",
  "#48E9A4"
];

// form to submit a transaction
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

  // update field to match input
	handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  // update the list of categories in the dropdown
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
      categories: newCategories,
    });
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
        Category
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
  
  // submit a post requiest to add the transaction
  handleSubmit(e) {
    e.preventDefault();

    this.setState({
      name: '', 
      amount: 0,
    });
    
    sendAjax('POST', $("#transactionForm").attr("action"), $("#transactionForm").serialize(), function() {
      getAllTransactions();
    });
  
    return false;
  };
};

// list of all transactions
class TransactionList extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {
    // if there are no transactions
    if (this.props.transactions.length === 0) {
      return (
        <div className="transactionList">
          <h1>All Transactions</h1>
          <h3 className="emptyTransaction">No transactions yet</h3>
        </div>
      );
    }

    // get a list of all transactions
    const transactionNodes = this.props.transactions.map(function(t){
      return (<div key={t._id} className="transaction col">        
        <h3 className="transactionName">Name: {t.name}</h3>
        <p className="transactionAmount">Amount: ${t.amount}</p>
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

// view of current balance
class CapitalView extends React.Component {
  constructor(props) {
    super(props);
    this.addTransactions = this.addTransactions.bind(this);
  };

  // add up all transactions
  addTransactions() {
    let total = 0;
    this.props.transactions.forEach(t => {
      // if it is income add to the total
      if (t.type == 'income')
        total+=t.amount;
      // else, it was spent and subtract it
      else
        total-=t.amount;
    });
    return total;
  };

  render() { 
    return (
      <div>
        <h1>Current Balance: ${this.addTransactions()}</h1>    
      </div>
    );
  };
};

// pie chart of expenses
class ExpenseChartView extends React.Component{
  constructor(props) {
    super(props);

    this.drawPieSlice = this.drawPieSlice.bind(this);
    this.getDataPercentages = this.getDataPercentages.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.drawPercent = this.drawPercent.bind(this);
    this.drawKey = this.drawKey.bind(this);
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
  // draw the canves
  updateCanvas() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");

    // fill the background with white for a new draw
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,300,475);

    // key value array of spending per expense category
    const data = this.getDataPercentages();
    // total expenses
    let total = 0;
    // start at the top of the pie chart
    let startAngle = -0.5 * Math.PI;

    // get total expenses
    TRANSACTIONS.expense.forEach(category => {
      total += data[category];
    });
    
    // index in color array
    let colorIndex = 0;

    //dray gray background, so if there are no expenses there is a black circle
    this.drawPieSlice (ctx, 150, 150, 140, 0, 2 * Math.PI, 'lightgray');

    //color in the slices of the pie
    TRANSACTIONS.expense.forEach(category => {
      // get percentage
      const percentage = data[category] / total;
      // get percent of circle
      const rads = percentage * 2 * Math.PI;
      // draw the slice
      this.drawPieSlice (ctx, 150, 150, 140, startAngle, startAngle + rads, COLORS[colorIndex]);
      // draw the percent text on the slick
      this.drawPercent(ctx, startAngle + (0.5 * rads), Math.round(percentage*100));
      // draw the labe in the key
      this.drawKey(ctx, colorIndex, category);
      // increment color index
      colorIndex++;
      // move the starting angle
      startAngle += rads;
    });

    //draw white circle to make the chart a donut
    this.drawPieSlice (ctx, 150, 150, 50, 0, 2 * Math.PI, 'white');
  }

  // https://code.tutsplus.com/tutorials/how-to-draw-a-pie-chart-and-doughnut-chart-using-javascript-and-html5-canvas--cms-27197
  // for drawing a pie chart with canvas
  // draw a slick of the pie chart
  drawPieSlice(ctx,centerX, centerY, radius, startAngle, endAngle, color ){
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    // draw an arc
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // draw a label in the key
  drawKey(ctx, colorIndex, label){
    ctx.save();
    ctx.fillStyle = COLORS[colorIndex];
    const x = 10;
    // hight is based on where it is in the list
    // color index increments, so it moves down
    const y = 300 + (colorIndex * 30);
    // draw a rect of the color, that matches the slice color
    ctx.fillRect(x, y, 20, 20); 
    ctx.fillStyle = "black";
    ctx.font = "bold 15px sans-serif";
    // write the category name in the key
    ctx.fillText(`${label.charAt(0).toUpperCase()}${label.slice(1)}`, x + 25, y + 15);
    ctx.restore();
  }

  // draws the percentage on the pie slice
  drawPercent(ctx, middleAngle, percentage) {
    // only draw if percentage is > 5
    // b/c the slice has to be big enough
    if(percentage >= 5) {
      ctx.save();
      // radius of 100
      // center is 150
      // offest for x is -20
      // offset for y is +10
      // this centers it to the slice, compensating for text size
      const x = 100 * Math.cos(middleAngle) + 130;
      const y = 100 * Math.sin(middleAngle) + 160;
      ctx.fillStyle = "White";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(`${percentage}%`, x, y);
      ctx.restore();
    }
  }

  // get a list of the amount per expense category
  getDataPercentages(){
    let data = [];
    // fill data with 0, per category
    TRANSACTIONS.expense.forEach(category => {
      data[category] = 0;
    });
    // add amount to each category in data
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
        <h1>Expenses Ratio</h1>
        <canvas ref="canvas" width={300} height={475} />        
      </div>
    );
  };
};

// bars to compair income vs spending
class SpendingBar extends React.Component{
  constructor(props) {
    super(props);
  };  

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  updateCanvas() {
    let incomeTotal = 0;
    let spendingTotal = 0;
    // add income and bill/expense to their totals
    this.props.transactions.forEach(t =>{
      if (t.type == 'income')
        incomeTotal += t.amount;
      else
        spendingTotal += t.amount;
    });

    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");

    // get which one is bigger to determine what is viewed
    // in proportion to the other one
    let biggerTotal = incomeTotal > spendingTotal ? incomeTotal : spendingTotal;

    // draw the bg
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,300,50);
    // draw 2 blank bars
    ctx.fillStyle = "lightgray";
    ctx.fillRect(0, 0, 200, 20);
    ctx.fillRect(0, 30, 200, 20);
    // income color is green
    ctx.fillStyle = "#99E948";
    //draw income bar in proportion to the bigger total
    ctx.fillRect(0, 0, (incomeTotal/biggerTotal) * 200, 20);
    // spending color is red
    ctx.fillStyle = "#E94848";
    //draw spending bar in proportion to the bigger total
    ctx.fillRect(0, 30, (spendingTotal/biggerTotal) * 200, 20);
    // write text
    ctx.fillStyle = "black";
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(`Earned: $${incomeTotal}`, 205, 15);
    ctx.fillText(`Spent: $${spendingTotal}`, 205, 45);
  }

  render() {
    return(
      <div>
        <canvas ref="canvas" width={300} height={50} />        
      </div>
    );
  };
}

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

    ReactDOM.render(
      <SpendingBar transactions={data.transactions}/>,
      document.querySelector("#spendingBar")
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

  ReactDOM.render(
    <SpendingBar transactions={[]}/>,
    document.querySelector("#spendingBar")
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
