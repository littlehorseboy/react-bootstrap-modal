import React from 'react';
// import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Modal from '../../components/UI/Modal/Modal.jsx';
import Content from '../../components/Content/Content.jsx';

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      zIndex: 0,
    };
    this.changeModalVisible = this.changeModalVisible.bind(this);
  }

  changeModalVisible(bool) {
    if (bool) {
      this.setState({
        zIndex: this.state.zIndex + 1,
      });
    }
    this.setState({
      open: bool,
    });
  }

  render() {
    return (
      <div>
        <Button variant="primary" size="sm" onClick={() => { this.changeModalVisible(true); }}>
          Another page Modal
        </Button>

        <Modal
          open={this.state.open}
          zIndex={this.state.zIndex}
          changeModalVisible={this.changeModalVisible}
          title="Another page Modal title"
          content={<Content />}
        />
      </div>
    );
  }
}

export default About;
