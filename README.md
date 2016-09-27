# IO^2 for browser JavaScript

## IO Monad for browser JavaScript

Separate pure and inpure functions in JavaScript.

### Usage

Just include `lib/io-square-browser.js` in your script tag.

### Example

```javascript
/* 
   Problem:
   Validate Email entered but user. Post valid email as JSON to server.
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
// Calls verify email and rects if invalid email
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