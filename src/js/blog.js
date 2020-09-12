fetch('http://example.com/posts.json')
  .then((response) => response.json())
  .then((data) => console.log(data));
