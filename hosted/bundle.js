'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
      categories: ['paycheck', 'cash']
    };
    _this.categoryTypes = {
      income: ['paycheck', 'cash'],
      bill: ['rent', 'utilities'],
      expense: ['food', 'entertainment']
    };
    _this.handleInputChange = _this.handleInputChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.updateCategories = _this.updateCategories.bind(_this);
    return _this;
  }

  _createClass(TransactionForm, [{
    key: 'handleInputChange',
    value: function handleInputChange(event) {
      var target = event.target;
      var value = target.type === 'checkbox' ? target.checked : target.value;
      var name = target.name;

      this.setState(_defineProperty({}, name, value));
    }
  }, {
    key: 'updateCategories',
    value: function updateCategories(e) {
      var newCategories = this.categoryTypes.income;
      switch (e.target.value) {
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
        categories: newCategories });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
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
          React.createElement(
            'label',
            { htmlFor: 'category' },
            'Transaction Type'
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
          React.createElement(
            'label',
            { htmlFor: 'amount' },
            '$ Amount'
          ),
          React.createElement('input', {
            type: 'number',
            id: 'transactionAmount',
            onChange: this.handleInputChange,
            value: this.state.amount,
            name: 'amount'
          }),
          React.createElement('input', { type: 'hidden', name: '_csrf', value: this.props.csrf }),
          React.createElement('input', { className: 'addTransactionSubmit', type: 'submit', value: 'Add Transaction' })
        )
      );
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      e.preventDefault();

      //error check

      sendAjax('POST', $("#transactionForm").attr("action"), $("#transactionForm").serialize(), function () {
        getAllTransactions();
      });

      return false;
    }
  }]);

  return TransactionForm;
}(React.Component);

;

var TransactionList = function (_React$Component2) {
  _inherits(TransactionList, _React$Component2);

  function TransactionList(props) {
    _classCallCheck(this, TransactionList);

    return _possibleConstructorReturn(this, (TransactionList.__proto__ || Object.getPrototypeOf(TransactionList)).call(this, props));
  }

  _createClass(TransactionList, [{
    key: 'render',
    value: function render() {
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

      var transactionNodes = this.props.transactions.map(function (t) {
        return React.createElement(
          'div',
          { key: t._id, className: 'transaction' },
          React.createElement(
            'h3',
            { className: 'transactionName' },
            'Name: ',
            t.name
          ),
          React.createElement(
            'p',
            { className: 'transactionAmount' },
            '$: ',
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
    value: function addTransactions() {
      var total = 0;
      this.props.transactions.map(function (t) {
        if (t.type == 'income') total += t.amount;else total -= t.amount;
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
          'Capital : ',
          this.addTransactions()
        )
      );
    }
  }]);

  return CapitalView;
}(React.Component);

;

var ExpenseChartView = function (_React$Component4) {
  _inherits(ExpenseChartView, _React$Component4);

  function ExpenseChartView(props) {
    _classCallCheck(this, ExpenseChartView);

    return _possibleConstructorReturn(this, (ExpenseChartView.__proto__ || Object.getPrototypeOf(ExpenseChartView)).call(this, props));
  }

  _createClass(ExpenseChartView, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var canvas = this.refs.canvas;
      canvas.height = 300;
      canvas.width = 300;
      var ctx = canvas.getContext("2d");
      var img = this.refs.image;
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        ctx.font = "40px Courier";
        ctx.fillText("Hello World", 0, 20);
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement('canvas', { ref: 'canvas', width: 640, height: 425 }),
        React.createElement('img', { ref: 'image', src: 'https://www.craftycookingmama.com/wp-content/uploads/2017/12/070.jpg', className: 'hidden' })
      );
    }
  }]);

  return ExpenseChartView;
}(React.Component);

;

var getAllTransactions = function getAllTransactions() {
  sendAjax('GET', '/getTransactions', null, function (data) {
    ReactDOM.render(React.createElement(TransactionList, { transactions: data.transactions }), document.querySelector("#transactionList"));

    ReactDOM.render(React.createElement(CapitalView, { transactions: data.transactions }), document.querySelector("#capitalView"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(TransactionForm, { csrf: csrf }), document.querySelector("#addTransaction"));

  ReactDOM.render(React.createElement(TransactionList, { transactions: [] }), document.querySelector("#transactionList"));

  ReactDOM.render(React.createElement(CapitalView, { transactions: [] }), document.querySelector("#capitalView"));

  ReactDOM.render(React.createElement(ExpenseChartView, null), document.querySelector("#expenseChartView"));

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
