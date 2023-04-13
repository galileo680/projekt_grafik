exports.getIndex = (req, res, next) => {
  res.render('schedule/index', {
    pageTitle: 'Grafik',
  });
};
