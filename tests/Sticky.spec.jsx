import { createEvent, fireEvent, render } from '@testing-library/react';
import { mount } from 'enzyme';
import { spyElementPrototypes } from 'rc-util/lib/test/domHook';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
import Table from '../src';
import { safeAct } from './utils';

describe('Table.Sticky', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  it('Sticky Header', async () => {
    const col1 = { dataIndex: 'light', width: 100 };
    const col2 = { dataIndex: 'bamboo', width: 200 };

    const TableDemo = props => {
      return (
        <div
          style={{
            height: 10000,
          }}
        >
          <Table
            columns={[col1, col2]}
            data={[{ light: 'bamboo', bamboo: 'light', key: 1 }]}
            sticky
            {...props}
          />
        </div>
      );
    };
    const wrapper = mount(<TableDemo />);

    expect(wrapper.find('.rc-table-header').last().prop('style')).toEqual({
      overflow: 'hidden',
      top: 0,
    });

    expect(wrapper.find('.rc-table-header').last().prop('className')).toBe(
      'rc-table-header rc-table-sticky-holder',
    );

    await safeAct(wrapper, () => {
      wrapper.setProps({
        sticky: {
          offsetHeader: 10,
        },
      });
    });

    expect(wrapper.find('.rc-table-header').last().prop('style')).toEqual({
      overflow: 'hidden',
      top: 10,
    });

    vi.useRealTimers();
  });

  it('Sticky scroll', async () => {
    window.pageYOffset = 900;
    document.documentElement.scrollTop = 200;
    let scrollLeft = 100;
    const domSpy = spyElementPrototypes(HTMLDivElement, {
      scrollLeft: {
        get: () => scrollLeft,
        set: left => {
          scrollLeft = left;
        },
      },
      scrollTop: {
        get: () => 100,
      },
      scrollWidth: {
        get: () => 200,
      },
      clientWidth: {
        get: () => 100,
      },
      offsetHeight: {
        get: () => 100,
      },
    });

    const col1 = { dataIndex: 'light', width: 1000 };
    const col2 = { dataIndex: 'bamboo', width: 2000 };
    const { container, unmount } = render(
      <Table
        columns={[col1, col2]}
        data={[
          { light: 'bamboo', bamboo: 'light', key: 1 },
          { light: 'bamboo', bamboo: 'light', key: 2 },
          { light: 'bamboo', bamboo: 'light', key: 3 },
          { light: 'bamboo', bamboo: 'light', key: 4 },
          { light: 'bamboo', bamboo: 'light', key: 6 },
          { light: 'bamboo', bamboo: 'light', key: 7 },
          { light: 'bamboo', bamboo: 'light', key: 8 },
          { light: 'bamboo', bamboo: 'light', key: 9 },
          { light: 'bamboo', bamboo: 'light', key: 10 },
          { light: 'bamboo', bamboo: 'light', key: 11 },
          { light: 'bamboo', bamboo: 'light', key: 12 },
          { light: 'bamboo', bamboo: 'light', key: 13 },
          { light: 'bamboo', bamboo: 'light', key: 15 },
          { light: 'bamboo', bamboo: 'light', key: 16 },
          { light: 'bamboo', bamboo: 'light', key: 17 },
          { light: 'bamboo', bamboo: 'light', key: 18 },
          { light: 'bamboo', bamboo: 'light', key: 19 },
          { light: 'bamboo', bamboo: 'light', key: 20 },
          { light: 'bamboo', bamboo: 'light', key: 21 },
          { light: 'bamboo', bamboo: 'light', key: 22 },
          { light: 'bamboo', bamboo: 'light', key: 23 },
          { light: 'bamboo', bamboo: 'light', key: 24 },
          { light: 'bamboo', bamboo: 'light', key: 25 },
          { light: 'bamboo', bamboo: 'light', key: 26 },
        ]}
        scroll={{
          x: 10000,
        }}
        sticky
      />,
    );

    await act(() => {
      vi.runAllTimers();
    });

    expect(container.querySelector('.rc-table-sticky-scroll')).toBeTruthy();

    const oldInnerHeight = global.innerHeight;
    const resizeEvent = new Event('resize');

    global.innerHeight = 10000;

    await act(() => {
      global.dispatchEvent(resizeEvent);
      vi.runAllTimers();
    });

    expect(container.querySelector('.rc-table-sticky-scroll')).toBeNull();

    await act(() => {
      global.innerHeight = oldInnerHeight;
      global.dispatchEvent(resizeEvent);
      vi.runAllTimers();
    });

    const mockFn = vi.fn();
    const node = container.querySelector('.rc-table-sticky-scroll-bar');
    const event = createEvent.mouseDown(node, { clientX: 0 });
    event.preventDefault = mockFn;
    fireEvent(node, event);

    expect(mockFn).toHaveBeenCalledTimes(1);

    expect(container.querySelector('.rc-table-sticky-scroll-bar-active')).toBeTruthy();

    await act(() => {
      fireEvent.mouseMove(container, {
        buttons: 1,
        clientX: 50,
      });
      vi.runAllTimers();
    });

    expect(container.querySelector('.rc-table-sticky-scroll-bar').style).toContain({
      width: '50px',
      transform: 'translate3d(50.5px, 0, 0)',
    });

    await act(() => {
      fireEvent.mouseMove(container, {
        buttons: 1,
        clientX: -50,
      });
      vi.runAllTimers();
    });

    expect(container.querySelector('.rc-table-sticky-scroll-bar').style).toContain({
      width: '50px',
      transform: 'translate3d(0px, 0, 0)',
    });

    await act(() => {
      fireEvent.mouseMove(container, {
        buttons: 0,
        clientX: -50,
      });
      vi.runAllTimers();
    });

    expect(container.querySelector('.rc-table-sticky-scroll-bar-active')).toBeFalsy();

    fireEvent.mouseUp(container);

    unmount();

    window.pageYOffset = 0;
    mockFn.mockRestore();
    domSpy.mockRestore();
    vi.useRealTimers();
  });

  it('Sticky Header with border classname', async () => {
    const TableDemo = props => {
      return (
        <div
          style={{
            height: 10000,
          }}
        >
          <Table
            columns={[
              { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
              { title: 'title2', dataIndex: 'b', key: 'b' },
              { title: 'title3', dataIndex: 'c', key: 'c' },
              { title: 'title4', dataIndex: 'd', key: 'd', width: 100, fixed: 'right' },
            ]}
            data={[
              { a: '123', b: 'xxxxxxxx', c: 3, d: 'hehe', key: '1' },
              { a: 'cdd', b: 'edd12221', c: 3, d: 'haha', key: '2' },
            ]}
            sticky
            scroll={{
              x: 10000,
            }}
            {...props}
          />
        </div>
      );
    };
    const wrapper = mount(<TableDemo />);
    await safeAct(wrapper);
    expect(
      wrapper.find('.rc-table-cell-fix-right-first.rc-table-cell-fix-sticky').prop('style'),
    ).toEqual({
      position: 'sticky',
      right: 0,
    });
    expect(wrapper.find('.rc-table-cell-fix-sticky')).not.toBe(undefined);

    vi.useRealTimers();
  });

  it('Sticky Header with scroll-y', async () => {
    const TableDemo = props => {
      return (
        <div
          style={{
            height: 10000,
          }}
        >
          <Table
            columns={[
              { title: 'title1', dataIndex: 'a', key: 'a', width: 100, fixed: 'left' },
              { title: 'title2', dataIndex: 'b', key: 'b' },
              { title: 'title3', dataIndex: 'c', key: 'c' },
              { title: 'title4', dataIndex: 'd', key: 'd', width: 100, fixed: 'right' },
            ]}
            data={[
              { a: '123', b: 'xxxxxxxx', c: 3, d: 'hehe', key: '1' },
              { a: 'cdd', b: 'edd12221', c: 3, d: 'haha', key: '2' },
            ]}
            sticky
            scroll={{
              x: 10000,
              y: 10,
            }}
            {...props}
          />
        </div>
      );
    };
    const { container } = render(<TableDemo />);

    await act(() => {
      vi.runAllTimers();
    });

    expect(
      container.querySelector('.rc-table-cell-fix-right-first.rc-table-cell-fix-sticky').style,
    ).toContain({
      position: 'sticky',
      right: '0px',
    });

    vi.useRealTimers();
  });

  it('Sticky scroll with getContainer', async () => {
    window.pageYOffset = 900;
    document.documentElement.scrollTop = 200;
    const ol = document.createElement('ol');
    ol.style = 'height: 500px;overflow: scroll';
    document.body.appendChild(ol);

    let scrollLeft = 100;
    const domSpy = spyElementPrototypes(HTMLDivElement, {
      scrollLeft: {
        get: () => scrollLeft,
        set: left => {
          scrollLeft = left;
        },
      },
      scrollTop: {
        get: () => 100,
      },
      scrollWidth: {
        get: () => 200,
      },
      clientWidth: {
        get: () => 100,
      },
      offsetHeight: {
        get: () => 1000,
      },
    });

    const sectionSpy = spyElementPrototypes(HTMLOListElement, {
      scrollLeft: {
        get: () => scrollLeft,
        set: left => {
          scrollLeft = left;
        },
      },
      scrollTop: {
        get: () => 100,
      },
      scrollWidth: {
        get: () => 200,
      },
      clientWidth: {
        get: () => 100,
      },
      clientHeight: {
        get: () => 500,
      },
      offsetHeight: {
        get: () => 100,
      },
    });

    const col1 = { dataIndex: 'light', width: 1000 };
    const col2 = { dataIndex: 'bamboo', width: 2000 };
    const { container, unmount } = render(
      <Table
        columns={[col1, col2]}
        data={[
          { light: 'bamboo', bamboo: 'light', key: 1 },
          { light: 'bamboo', bamboo: 'light', key: 2 },
          { light: 'bamboo', bamboo: 'light', key: 3 },
          { light: 'bamboo', bamboo: 'light', key: 4 },
          { light: 'bamboo', bamboo: 'light', key: 6 },
          { light: 'bamboo', bamboo: 'light', key: 7 },
          { light: 'bamboo', bamboo: 'light', key: 8 },
          { light: 'bamboo', bamboo: 'light', key: 9 },
          { light: 'bamboo', bamboo: 'light', key: 10 },
          { light: 'bamboo', bamboo: 'light', key: 11 },
          { light: 'bamboo', bamboo: 'light', key: 12 },
          { light: 'bamboo', bamboo: 'light', key: 13 },
          { light: 'bamboo', bamboo: 'light', key: 15 },
          { light: 'bamboo', bamboo: 'light', key: 16 },
          { light: 'bamboo', bamboo: 'light', key: 17 },
          { light: 'bamboo', bamboo: 'light', key: 18 },
          { light: 'bamboo', bamboo: 'light', key: 19 },
          { light: 'bamboo', bamboo: 'light', key: 20 },
          { light: 'bamboo', bamboo: 'light', key: 21 },
          { light: 'bamboo', bamboo: 'light', key: 22 },
          { light: 'bamboo', bamboo: 'light', key: 23 },
          { light: 'bamboo', bamboo: 'light', key: 24 },
          { light: 'bamboo', bamboo: 'light', key: 25 },
          { light: 'bamboo', bamboo: 'light', key: 26 },
        ]}
        scroll={{
          x: 10000,
        }}
        sticky={{
          getContainer: () => ol,
        }}
      />,
      {
        container: ol,
      },
    );

    await act(() => {
      vi.runAllTimers();
    });

    expect(container.querySelector('.rc-table-sticky-scroll')).toBeTruthy();
    expect(container.querySelector('.rc-table-sticky-scroll-bar')).toBeTruthy();
    expect(container.querySelector('.rc-table-sticky-scroll-bar').style).toContain({
      width: '50px',
      transform: 'translate3d(50px, 0, 0)',
    });

    const mockFn = vi.fn();
    const node = container.querySelector('.rc-table-sticky-scroll-bar');
    const event = createEvent.mouseDown(node, { clientX: 0 });
    event.preventDefault = mockFn;
    fireEvent(node, event);

    expect(mockFn).toHaveBeenCalledTimes(1);

    await act(() => {
      fireEvent.mouseMove(container, {
        buttons: 1,
        clientX: 50,
      });
      vi.runAllTimers();
    });

    expect(container.querySelector('.rc-table-sticky-scroll-bar').style).toContain({
      width: '50px',
      transform: 'translate3d(50.5px, 0, 0)',
    });

    unmount();

    window.pageYOffset = 0;
    domSpy.mockRestore();
    sectionSpy.mockRestore();
    mockFn.mockRestore();
    vi.useRealTimers();
  });
});
