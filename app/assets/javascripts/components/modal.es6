class Modal extends React.Component {
  constructor(props) {
    super(props)

    this.dismiss = this.dismiss.bind(this);
  }

  render() {
    return (
      <div className="my-modal">
        <div className="content-outer" ref="contentOuter" onClick={this.dismiss}>
        <div className="content-inner">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

  dismiss(event) {
    if (event.target === this.refs.contentOuter) {
      Modal.hide();
    }
  }
}

Object.assign(Modal, {
  hide() {
    ReactDOM.unmountComponentAtNode(this.div);
    this.div.remove();
  },

  show(content) {
    this.div = document.createElement("div");

    ReactDOM.render(
      <Modal>{content}</Modal>,
      this.div
    );

    document.body.appendChild(this.div);
  }
});
