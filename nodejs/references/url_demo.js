const url = require("url")

const myUrl = new URL("https://www.youtube.com/watch?v=fBNz5xF-Kx4");

// serialized url
console.log(myUrl.href)
console.log(myUrl.toString())

// host 
console.log(myUrl.host);
// host name (does not get port)
console.log(myUrl.hostname);

// path name
console.log(myUrl.pathname)

// serialized query
console.log(myUrl.search)
// params obj
console.log(myUrl.searchParams)
// add params
myUrl.searchParams.append("abc", "123")
console.log(myUrl.searchParams)

myUrl.searchParams.forEach((value, name) => console.log(`${name}: ${value}`))