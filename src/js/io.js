export function registerLoadMoreObserver(callback) {
  const onEntry = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
      }
    });
  };

  const options = {
    // rootMargin: '0px',
  };

  const loadMoreObserver = new IntersectionObserver(onEntry, options);
  return loadMoreObserver;
}
