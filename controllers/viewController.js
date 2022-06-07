exports.getOverview = (req, res) => {
  res.status(200).render('city', {
    title: 'All Cities - Cities API',
  });
};
