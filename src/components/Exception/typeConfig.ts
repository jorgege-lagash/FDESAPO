import notFound from '../../assets/error/error404.svg';
import forbidden from '../../assets/error/forbidden.svg';
import serverError from '../../assets/error/server-error.svg';
const config = {
  403: {
    desc: '抱歉，你无权访问该页面',
    img: forbidden,
    title: '403',
  },
  404: {
    desc: '抱歉，你访问的页面不存在',
    img: notFound,
    title: '404',
  },
  500: {
    desc: '抱歉，服务器出错了',
    img: serverError,
    title: '500',
  },
};

export default config;
