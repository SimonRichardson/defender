# Defender

### Defending inputs across the land.

![](https://raw.github.com/fantasyland/fantasy-land/master/logo.png)

* * *

#### Demo

Example of sort code validation in different guises using [defender](http://simonrichardson.github.io/defender/)

* * *

#### Soothsayer

The Soothsayer is interlinked to the Fortune teller, but the basic
idea is that you create a Soothsayer and give it a pattern that 
can be parsed and replaced by other things (RegExp, DOM elements).

The Soothsayer is not restricted by the bounds of the validator,
just what you pass in for the look up of the pattern. If nothing
is found an error is thrown.

To help with this we have Runes, which make it easier to work with
Regular Expressions.

* * *

##### Example

The following example creates a Soothsayer and generates a possible
future of regular expressions.

```javascript
var pattern = IO(function() {
  return '##-##-##';
});
var sayer = soothsayer({
    '#': /^[0-9]/,
    '-': /^-/
})(pattern);
```

* * *

#### Guardian

The Guardians job in the flow is to remove any items from the input
that you don't want to be validated by the Defender. In turn
guarding the Defender.

It's a simple premise of using a regular expression to attempt to
normalise the user input as much as possible, such as trimming 
the white space front and back or removing comments.

* * *

##### Example

The following example creates a Guardian which will guard against
white space.

```javascript
var guard = guardian(/^\s/);
```

* * *

#### Defender

The Defenders job is go through the Soothsayers runes and check
the input against those runes. The result is either a failure or
a success.

If the result is a failure a stack trace of where the input failed
is passed back along with the position. This should make it easier
to see what failed and where.

* * *

##### Example

The following example creates a Defender that when called uses
the Guardian to guard the input.

```javascript
var defend = defender(sayer);
defend(guard(io));
```

* * *

#### Fortune Teller

The Fortune Teller job is to decipher what the input field could
possibly look like on key down, before the text has been entered.
From there it should be possible to pipe this into the Defenders
to then work out if a input is permitted. 

The role of a Fortune Teller is highly specialized and because of
this a lot more information is required to do the job at hand.

* * *

##### Example

The following uses a value of the current input field, it then
grabs what the event is along with any key information (unicode
characters etc...) and then finally the selection upon where the
new character needs to be added, removed etc.

```javascript
fortune(value)(fromEvent(e), selection);
```
