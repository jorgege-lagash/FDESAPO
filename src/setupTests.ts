import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fetchMock from 'jest-fetch-mock';
declare var global: any;
declare var document: any;

Enzyme.configure({ adapter: new Adapter() });
global.fetch = fetchMock;
document.fetch = fetchMock;
