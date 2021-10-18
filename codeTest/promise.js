
Promise.resolve()
.then(function(data) {
    a()
    return 123
})
.then(function(data) {
  console.log('carry on');
});

setTimeout(() => { console.log(123) }, 2000);