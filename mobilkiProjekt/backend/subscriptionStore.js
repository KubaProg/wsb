let lastSubscription = null;

module.exports = {
  getSubscription: () => lastSubscription,
  setSubscription: (sub) => {
    lastSubscription = sub;
  }
};
