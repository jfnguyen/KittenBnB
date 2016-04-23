class AboutModal extends React.Component {
  render() {
    return (
      <div>
        <div className="my-modal-header">
          <h1>About Kittenbnb</h1>
        </div>

        <div className="my-modal-body">
          <p>
            Thanks for trying out Kittenbnb! Kittenbnb is a project
            written in Ruby, Rails, ES6, and React by Josephn Nguyen. Some
            features of Kittenbnb haven't been built yet, which is
            you may see this message. For instance, while you can search
            and view listings, you can't currently book them.
          </p>

          <p>
            I'm particular proud of how closely I was able to emulate the
            real Airbnb website's design. I did all the CSS styling by
            hand and did not use a CSS framework like Bootstrap.
          </p>

          <p>
            Kittenbnb is written in ES6. I'm happy with how much cleaner
            it is to write code in ES6. I have used Babel to convert ES6
            so it can be run in current browsers.
          </p>

          <p>
            I was glad to use React for this project; React made it much simpler
            to quickly build out the very interactive featureset of Kittenbnb. I
            used Redux as a Flux framework.
          </p>

          <p>
            Features I am particular proud of include:
          </p>

          <ul>
            <li>Getting the daterangepicker and nouislider plugins to work with React</li>
            <li>Building the listing carousel on the search page.</li>
            <li>Using Google static maps and canvas to randomly create new listings but ensure these are not palced on water</li>
            <li>Styling the Google Maps markers and using Maps from React.</li>
          </ul>
        </div>
      </div>
    );
  }
}

Object.assign(AboutModal, {
  hide() {
    Modal.hide();
  },

  show() {
    Modal.show(<AboutModal />);
  }
});
