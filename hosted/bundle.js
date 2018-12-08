'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// list of all categories for each type of transaction
var TRANSACTIONS = {
  income: ['paycheck', 'cash', 'bonus', 'reimbursement'],
  bill: ['rent', 'utilities', 'internet', 'phone'],
  expense: ['food', 'entertainment', 'shopping', 'groceries', 'personal care', 'other']
};

// list of colors for pie chart
var COLORS = ["#E94848", "#99E948", "#48E9E9", "#9948E9", "#E98548", "#4891E9", "#48E9A4"];

// form to submit a transaction

var TransactionForm = function (_React$Component) {
  _inherits(TransactionForm, _React$Component);

  function TransactionForm(props) {
    _classCallCheck(this, TransactionForm);

    var _this = _possibleConstructorReturn(this, (TransactionForm.__proto__ || Object.getPrototypeOf(TransactionForm)).call(this, props));

    _this.state = {
      name: '',
      amount: 0,
      type: "income",
      category: '',
      categories: TRANSACTIONS.income
    };
    _this.handleInputChange = _this.handleInputChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.updateCategories = _this.updateCategories.bind(_this);
    return _this;
  }

  _createClass(TransactionForm, [{
    key: 'handleInputChange',


    // update field to match input
    value: function handleInputChange(event) {
      var target = event.target;
      var value = target.type === 'checkbox' ? target.checked : target.value;
      var name = target.name;

      this.setState(_defineProperty({}, name, value));
    }
  }, {
    key: 'updateCategories',


    // update the list of categories in the dropdown
    value: function updateCategories(e) {
      var newCategories = TRANSACTIONS.income;
      switch (e.target.value) {
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
        categories: newCategories
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'col' },
        React.createElement(
          'form',
          { id: 'transactionForm', onSubmit: this.handleSubmit },
          React.createElement(
            'label',
            { htmlFor: 'name' },
            'Transaction Name'
          ),
          React.createElement('input', {
            type: 'text',
            id: 'transactionName',
            onChange: this.handleInputChange,
            value: this.state.name,
            name: 'name'
          }),
          React.createElement('br', null),
          React.createElement(
            'label',
            { htmlFor: 'type' },
            'Transaction Type'
          ),
          React.createElement(
            'select',
            { id: 'transactionType', value: this.state.type, onChange: this.updateCategories, name: 'type' },
            React.createElement(
              'option',
              { value: 'income' },
              'Income'
            ),
            React.createElement(
              'option',
              { value: 'bill' },
              'Bill'
            ),
            React.createElement(
              'option',
              { value: 'expense' },
              'Expense'
            )
          ),
          React.createElement('br', null),
          React.createElement(
            'label',
            { htmlFor: 'category' },
            'Category'
          ),
          React.createElement(
            'select',
            { id: 'transactionCategory', value: this.state.category, onChange: this.handleInputChange, name: 'category' },
            this.state.categories.map(function (category) {
              return React.createElement(
                'option',
                { value: category },
                category.charAt(0).toUpperCase(),
                category.slice(1)
              );
            })
          ),
          React.createElement('br', null),
          React.createElement(
            'label',
            { htmlFor: 'amount' },
            'Amount'
          ),
          React.createElement('input', {
            type: 'number',
            id: 'transactionAmount',
            onChange: this.handleInputChange,
            value: this.state.amount,
            name: 'amount'
          }),
          React.createElement('br', null),
          React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
          React.createElement('input', { className: 'addTransactionSubmit', type: 'submit', value: 'Add Transaction' })
        )
      );
    }
  }, {
    key: 'handleSubmit',


    // submit a post requiest to add the transaction
    value: function handleSubmit(e) {
      e.preventDefault();

      this.setState({
        name: '',
        amount: 0
      });

      sendAjax('POST', $("#transactionForm").attr("action"), $("#transactionForm").serialize(), function () {
        getAllTransactions();
      });

      return false;
    }
  }]);

  return TransactionForm;
}(React.Component);

;

// list of all transactions

var TransactionList = function (_React$Component2) {
  _inherits(TransactionList, _React$Component2);

  function TransactionList(props) {
    _classCallCheck(this, TransactionList);

    return _possibleConstructorReturn(this, (TransactionList.__proto__ || Object.getPrototypeOf(TransactionList)).call(this, props));
  }

  _createClass(TransactionList, [{
    key: 'render',
    value: function render() {
      // if there are no transactions
      if (this.props.transactions.length === 0) {
        return React.createElement(
          'div',
          { className: 'transactionList' },
          React.createElement(
            'h1',
            null,
            'All Transactions'
          ),
          React.createElement(
            'h3',
            { className: 'emptyTransaction' },
            'No transactions yet'
          )
        );
      }

      // get a list of all transactions
      var transactionNodes = this.props.transactions.map(function (t) {
        return React.createElement(
          'div',
          { key: t._id, className: 'transaction col' },
          React.createElement(
            'h3',
            { className: 'transactionName' },
            'Name: ',
            t.name
          ),
          React.createElement(
            'p',
            { className: 'transactionAmount' },
            'Amount: $',
            t.amount
          ),
          React.createElement(
            'p',
            { className: 'transactionType' },
            'Type: ',
            t.type
          ),
          React.createElement(
            'p',
            { className: 'transactionCategory' },
            'Category: ',
            t.category
          )
        );
      });

      return React.createElement(
        'div',
        { className: 'transactionList' },
        React.createElement(
          'h1',
          null,
          'All Transactions'
        ),
        transactionNodes
      );
    }
  }]);

  return TransactionList;
}(React.Component);

;

// view of current balance

var CapitalView = function (_React$Component3) {
  _inherits(CapitalView, _React$Component3);

  function CapitalView(props) {
    _classCallCheck(this, CapitalView);

    var _this3 = _possibleConstructorReturn(this, (CapitalView.__proto__ || Object.getPrototypeOf(CapitalView)).call(this, props));

    _this3.addTransactions = _this3.addTransactions.bind(_this3);
    return _this3;
  }

  _createClass(CapitalView, [{
    key: 'addTransactions',


    // add up all transactions
    value: function addTransactions() {
      var total = 0;
      this.props.transactions.forEach(function (t) {
        // if it is income add to the total
        if (t.type == 'income') total += t.amount;
        // else, it was spent and subtract it
        else total -= t.amount;
      });
      return total;
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          null,
          'Current Balance: $',
          this.addTransactions()
        )
      );
    }
  }]);

  return CapitalView;
}(React.Component);

;

// pie chart of expenses

var ExpenseChartView = function (_React$Component4) {
  _inherits(ExpenseChartView, _React$Component4);

  function ExpenseChartView(props) {
    _classCallCheck(this, ExpenseChartView);

    var _this4 = _possibleConstructorReturn(this, (ExpenseChartView.__proto__ || Object.getPrototypeOf(ExpenseChartView)).call(this, props));

    _this4.drawPieSlice = _this4.drawPieSlice.bind(_this4);
    _this4.getDataPercentages = _this4.getDataPercentages.bind(_this4);
    _this4.updateCanvas = _this4.updateCanvas.bind(_this4);
    _this4.drawPercent = _this4.drawPercent.bind(_this4);
    _this4.drawKey = _this4.drawKey.bind(_this4);
    return _this4;
  }

  _createClass(ExpenseChartView, [{
    key: 'componentDidMount',


    // https://blog.lavrton.com/using-react-with-html5-canvas-871d07d8d753
    // react with html5 canvas
    value: function componentDidMount() {
      this.updateCanvas();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.updateCanvas();
    }

    // https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
    // for drawing to a canvas in react
    // draw the canves

  }, {
    key: 'updateCanvas',
    value: function updateCanvas() {
      var _this5 = this;

      var canvas = this.refs.canvas;
      var ctx = canvas.getContext("2d");

      // fill the background with white for a new draw
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 300, 475);

      // key value array of spending per expense category
      var data = this.getDataPercentages();
      // total expenses
      var total = 0;
      // start at the top of the pie chart
      var startAngle = -0.5 * Math.PI;

      // get total expenses
      TRANSACTIONS.expense.forEach(function (category) {
        total += data[category];
      });

      // index in color array
      var colorIndex = 0;

      //dray gray background, so if there are no expenses there is a black circle
      this.drawPieSlice(ctx, 150, 150, 140, 0, 2 * Math.PI, 'lightgray');

      //color in the slices of the pie
      TRANSACTIONS.expense.forEach(function (category) {
        // get percentage
        var percentage = data[category] / total;
        // get percent of circle
        var rads = percentage * 2 * Math.PI;
        // draw the slice
        _this5.drawPieSlice(ctx, 150, 150, 140, startAngle, startAngle + rads, COLORS[colorIndex]);
        // draw the percent text on the slick
        _this5.drawPercent(ctx, startAngle + 0.5 * rads, Math.round(percentage * 100));
        // draw the labe in the key
        _this5.drawKey(ctx, colorIndex, category);
        // increment color index
        colorIndex++;
        // move the starting angle
        startAngle += rads;
      });

      //draw white circle to make the chart a donut
      this.drawPieSlice(ctx, 150, 150, 50, 0, 2 * Math.PI, 'white');
    }

    // https://code.tutsplus.com/tutorials/how-to-draw-a-pie-chart-and-doughnut-chart-using-javascript-and-html5-canvas--cms-27197
    // for drawing a pie chart with canvas
    // draw a slick of the pie chart

  }, {
    key: 'drawPieSlice',
    value: function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      // draw an arc
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // draw a label in the key

  }, {
    key: 'drawKey',
    value: function drawKey(ctx, colorIndex, label) {
      ctx.save();
      ctx.fillStyle = COLORS[colorIndex];
      var x = 10;
      // hight is based on where it is in the list
      // color index increments, so it moves down
      var y = 300 + colorIndex * 30;
      // draw a rect of the color, that matches the slice color
      ctx.fillRect(x, y, 20, 20);
      ctx.fillStyle = "black";
      ctx.font = "bold 15px sans-serif";
      // write the category name in the key
      ctx.fillText('' + label.charAt(0).toUpperCase() + label.slice(1), x + 25, y + 15);
      ctx.restore();
    }

    // draws the percentage on the pie slice

  }, {
    key: 'drawPercent',
    value: function drawPercent(ctx, middleAngle, percentage) {
      // only draw if percentage is > 5
      // b/c the slice has to be big enough
      if (percentage >= 5) {
        ctx.save();
        // radius of 100
        // center is 150
        // offest for x is -20
        // offset for y is +10
        // this centers it to the slice, compensating for text size
        var x = 100 * Math.cos(middleAngle) + 130;
        var y = 100 * Math.sin(middleAngle) + 160;
        ctx.fillStyle = "White";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(percentage + '%', x, y);
        ctx.restore();
      }
    }

    // get a list of the amount per expense category

  }, {
    key: 'getDataPercentages',
    value: function getDataPercentages() {
      var data = [];
      // fill data with 0, per category
      TRANSACTIONS.expense.forEach(function (category) {
        data[category] = 0;
      });
      // add amount to each category in data
      this.props.transactions.forEach(function (t) {
        if (t.type == 'expense') {
          data[t.category] += t.amount;
        }
      });
      return data;
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          null,
          'Expenses Ratio'
        ),
        React.createElement('canvas', { ref: 'canvas', width: 300, height: 475 })
      );
    }
  }]);

  return ExpenseChartView;
}(React.Component);

;

// bars to compair income vs spending

var SpendingBar = function (_React$Component5) {
  _inherits(SpendingBar, _React$Component5);

  function SpendingBar(props) {
    _classCallCheck(this, SpendingBar);

    return _possibleConstructorReturn(this, (SpendingBar.__proto__ || Object.getPrototypeOf(SpendingBar)).call(this, props));
  }

  _createClass(SpendingBar, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateCanvas();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.updateCanvas();
    }
  }, {
    key: 'updateCanvas',
    value: function updateCanvas() {
      var incomeTotal = 0;
      var spendingTotal = 0;
      // add income and bill/expense to their totals
      this.props.transactions.forEach(function (t) {
        if (t.type == 'income') incomeTotal += t.amount;else spendingTotal += t.amount;
      });

      var canvas = this.refs.canvas;
      var ctx = canvas.getContext("2d");

      // get which one is bigger to determine what is viewed
      // in proportion to the other one
      var biggerTotal = incomeTotal > spendingTotal ? incomeTotal : spendingTotal;

      // draw the bg
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 300, 50);
      // draw 2 blank bars
      ctx.fillStyle = "lightgray";
      ctx.fillRect(0, 0, 200, 20);
      ctx.fillRect(0, 30, 200, 20);
      // income color is green
      ctx.fillStyle = "#99E948";
      //draw income bar in proportion to the bigger total
      ctx.fillRect(0, 0, incomeTotal / biggerTotal * 200, 20);
      // spending color is red
      ctx.fillStyle = "#E94848";
      //draw spending bar in proportion to the bigger total
      ctx.fillRect(0, 30, spendingTotal / biggerTotal * 200, 20);
      // write text
      ctx.fillStyle = "black";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText('Earned: $' + incomeTotal, 205, 15);
      ctx.fillText('Spent: $' + spendingTotal, 205, 45);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement('canvas', { ref: 'canvas', width: 300, height: 50 })
      );
    }
  }]);

  return SpendingBar;
}(React.Component);

var getAllTransactions = function getAllTransactions() {
  sendAjax('GET', '/getTransactions', null, function (data) {

    ReactDOM.render(React.createElement(TransactionList, { transactions: data.transactions }), document.querySelector("#transactionList"));

    ReactDOM.render(React.createElement(CapitalView, { transactions: data.transactions }), document.querySelector("#capitalView"));

    ReactDOM.render(React.createElement(ExpenseChartView, { transactions: data.transactions }), document.querySelector("#expenseChartView"));

    ReactDOM.render(React.createElement(SpendingBar, { transactions: data.transactions }), document.querySelector("#spendingBar"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(TransactionForm, { csrf: csrf }), document.querySelector("#addTransaction"));

  ReactDOM.render(React.createElement(TransactionList, { transactions: [] }), document.querySelector("#transactionList"));

  ReactDOM.render(React.createElement(CapitalView, { transactions: [] }), document.querySelector("#capitalView"));

  ReactDOM.render(React.createElement(ExpenseChartView, { transactions: [] }), document.querySelector("#expenseChartView"));

  ReactDOM.render(React.createElement(SpendingBar, { transactions: [] }), document.querySelector("#spendingBar"));

  getAllTransactions();
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
};

var redirect = function redirect(response) {
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
