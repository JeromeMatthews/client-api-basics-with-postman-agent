const catchAsync = (fn) => (req, res, next) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
module.exports = catchAsync;
