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
      category: ''
    };
    _this.handleInputChange = _this.handleInputChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
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
            { id: 'transactionType', value: this.state.type, onChange: this.handleChange, name: 'type' },
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
            { id: 'transactionCategory', value: this.state.category, onChange: this.handleChange, name: 'category' },
            React.createElement(TransactionCategoryOptions, { type: this.state.type })
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
        loadDrinksFromServer();
      });

      return false;
    }
  }]);

  return TransactionForm;
}(React.Component);

;

var TransactionCategoryOptions = function (_React$Component2) {
  _inherits(TransactionCategoryOptions, _React$Component2);

  function TransactionCategoryOptions(props) {
    _classCallCheck(this, TransactionCategoryOptions);

    return _possibleConstructorReturn(this, (TransactionCategoryOptions.__proto__ || Object.getPrototypeOf(TransactionCategoryOptions)).call(this, props));
  }

  _createClass(TransactionCategoryOptions, [{
    key: 'render',
    value: function render() {
      switch (this.props.type) {
        case "income":
          return React.createElement(
            'div',
            null,
            React.createElement(
              'option',
              { value: 'paycheck' },
              'Paycheck'
            ),
            React.createElement(
              'option',
              { value: 'cash' },
              'Cash'
            )
          );
          break;
        case "bill":
          return React.createElement(
            'div',
            null,
            React.createElement(
              'option',
              { value: 'rent' },
              'Rent'
            ),
            React.createElement(
              'option',
              { value: 'utilities' },
              'Utilities'
            )
          );
          break;
        case "expense":
          return React.createElement(
            'div',
            null,
            React.createElement(
              'option',
              { value: 'food' },
              'Food'
            ),
            React.createElement(
              'option',
              { value: 'entertainment' },
              'Entertainment'
            )
          );
          break;
        default:
          return React.createElement(
            'div',
            null,
            React.createElement(
              'option',
              { value: '?' },
              '?'
            )
          );
          break;
      };
    }
  }]);

  return TransactionCategoryOptions;
}(React.Component);

;

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(TransactionForm, { csrf: csrf }), document.querySelector("#addTransaction"));
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
