# IO^2 for browser JavaScript

## IO Monad for browser JavaScript

Separate pure and impure functions in JavaScript.

### Usage

Just include `lib/io-square-browser.js` in your script tag. Global `IO` is available in
your JS.

### Example

```javascript
/*
   Problem:
   Validate Email entered by user. Post valid email as JSON to server.
   Handle network error. Verify response from server. Do next ...
*/

// Pure Function to validate emails. Returns email, or null if invalid.
const validateEmail = email => {
  if (email.length > 3 && /^[\w\.-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
    return email
  } else {
    alert('Invalid Email Address')
    return null
  }
}

// Function given email, returns a new IO object that posts to the server. In case of
// IO error, error message is alerted.
const postEmail = email => {
  emailInput.disabled = true
  return IO.postJSON('/apply', {email: email})
    .error(e => alert(e.message))
}

// Returns null if error in response. Or the email.

const verifyEmailResponse = (email, resp) => {
  if (resp.error) {
    emailInput.disabled = false
    alert(resp.message)
    return null
  } else {
    return email
  }
}

// This is the main IO Object created.
// Listens to the change event of the email input element.
// Calls verify email and rejects if invalid email
// Binds this IO to another IO object returned by postEmail.
// Rejects if verifyEmailRespons returns null
// Finally always call 'then' to actvate the IO Object
IO.change(emailInput)
  .reject(verifyEmail)
  .bind(postEmail)
  .reject(verifyEmailResponse)
  .then(email => {
    emailView.style.display = 'none'
    codeView.style.display = 'block'
    infoText.textContent = email
  })


```

### Available methods

#### Static Methods for creating IO Objects

    IO.click(DOMElement)

Returns an IO object for the `click` Event. Methods of the IO Object will be called with the Event Object.

    IO.change(DOMElement)

Returns an IO object for the `change` Event. Methods of the IO Object will be called with `event.target.value`.

    IO.get(url)

Returns an IO object for the get request. The value propagated is `responseText`.

    IO.getJSON(url)

Returns an IO object for the get request. The value propagated is JavaScript Object.

    IO.getBlob(url)

Returns an IO object for the get request. The value propagated is JavaScript Blob Object.

    IO.postJSON(url, obj)

Returns an IO object for the post request. The value propagated is JavaScript Object.

#### Instance methods on IO Objects

    ioObject.error(error -> DoSomething)

To stop propagation on IO Error use `error`. The error handler is called when the IO Event results in an instance of `Error` rather tha a value.

    ioObject.reject(val -> null or Val)

To stop propagation of the value use `reject`.

    ioObject.map(val -> NewVal)

To convert the propagated value to a new value, use `map`.

    ioObject.bind(val -> new IOObject)

Bind the current IO Object to a new IO Object. After the bind, the values propagated are the value of the original IOObject, and the new IOObject.

    ioObject.then(val -> Finally do something)

`then` must be the final call. The function passed to `then` will not return anything.

#### Note:

If you want to propagate more than one value, just return an Array of values from your pure function. The next pure function called will be called with multiple arguments.

#### Create your own IO Objects

To create your own IO Objects, follow [IO-Square](https://github.com/santoshrajan/io-square)

