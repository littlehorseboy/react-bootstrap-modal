import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { ThemeProvider } from 'react-jss';
import Modal from './Modal.jsx';

test('Modal component renders correctly', () => {
  // 自定義一個 theme
  const theme = {
    shadows: [],
  };
  theme.shadows[5] = '1px';

  const wrapper = mount(
    <ThemeProvider theme={theme}>
      <Modal
        open={true}
        zIndex={1}
        changeModalVisible={() => {}}
        title="TEST"
        content={<div>TEST</div>}
        position={{ top: '250px', left: '250px' }}
      />
    </ThemeProvider>,
  );
  const wrapperJson = toJSON(wrapper);

  expect(wrapperJson).toMatchSnapshot();
});
