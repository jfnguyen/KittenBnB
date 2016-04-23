class Modal extends React.Component {
  render() {
    return (
        <div className="my-modal">
          <div className="content">
        <h3>HELLO!</h3>
        </div>
        </div>
    )
  }
}

function activateModal() {
  let div = document.createElement("div");

  ReactDOM.render(
    <Modal />,
    div
  );

  document.body.appendChild(div);
}
