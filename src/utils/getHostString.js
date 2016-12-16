export default (port, ip) => {
  if (!ip || ['127.0.0.1', '0.0.0.0', 'localhost'].indexOf(ip) > -1) {
    if (port === 80) {
      return 'localhost';
    } else {
      return 'localhost:' + port;
    }
  } else if (port === 80) {
    return ip;
  } else {
    return ip + ':' + port;
  }
};
