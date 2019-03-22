import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { ThemeProvider } from 'react-jss';
import Modal from './Modal.jsx';

describe('Modal.jsx', () => {
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
        content={<div>This is content.</div>}
        position={{ top: '250px', left: '250px' }}
      />
    </ThemeProvider>,
  );

  test('Modal component renders correctly', () => {
    const wrapperJson = toJSON(wrapper);
    expect(wrapperJson).toMatchSnapshot();
  });

  test('Modal => .modal-title textContent is `TEST`', () => {
    expect(wrapper.find('.modal-title').text()).toBe('TEST');
  });

  test('Modal => .modal-body innerHTML is `<div>This is content.</div>`', () => {
    expect(wrapper.find('.modal-body').children().html()).toBe('<div>This is content.</div>');
  });

  test('Modal => .modal-dialog not has class `hidden`', () => {
    expect(wrapper.find('.modal-dialog').hasClass('hidden')).toBeFalsy();
  });

  test('Modal => .modal-dialog has class `hidden`', () => {
    wrapper.setProps({
      children: <Modal
        open={false}
        zIndex={1}
        changeModalVisible={() => {}}
        title="TEST"
        content={<div>This is content.</div>}
        position={{ top: '250px', left: '250px' }}
      />,
    });

    expect(wrapper.find('.modal-dialog').hasClass('hidden')).toBeTruthy();
  });
});
