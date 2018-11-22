// users.test.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import jest from 'jest';
import BarChart from './components/d3/BarChart/BarChart';

jest.mock('BarChart');

BarChart.render.mockResolvedValue(null);
