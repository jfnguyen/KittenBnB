class NumGuestsSelect extends React.Component {
  render() {
    let nums = [2, 3, 4, 5, 6];

    return (
      <select name={this.props.name}
              className={this.props.className}
              key="numGuestsSelect"
              onChange={this.props.onChange}
              value={this.props.value}>
        <option value="1">1 Guest</option>
        { nums.map(i => <option key={i} value={i}>{i} Guests</option>) }
      </select>
    );
  }
}

NumGuestsSelect.propTypes = {
  className: React.PropTypes.string,
  name: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired,
  value: React.PropTypes.number.isRequired,
};