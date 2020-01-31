# FTR Assessment

## Part 1

#### Running the app
```npm install```

Install all dependencies

```npm run build```

Generate .js files to be executed

```npm start```

Run the application

#### Technical decisions
- app was built with boilerplate project I found on [GitHub](https://github.com/jsynowiec/node-typescript-boilerplate)
- I'm leveraging `readline` to handle inputs in the console
- `bignumber.js` was pulled in to make working with potentially large numbers easier
- Testing was done using Jest

#### Notes
- Went with a console app as this seemed like the most straight forward approach
- Numbers are tracked in a "map" with the key being the number and the value being the frequency
- They're sorted on the fly using `.sorted`, so this does the job but could be improved
- Fibonacci logic is just a calculation executed on each input
- Worth noting that there is no input validation so the app could certainly be abused

## Part 2

#### 1. How would you implement new UI? What would need restructured?
Perhaps I would make a web app, likely leveraging Create React App since that's one of my comfort zones.
 I think a lot of the underlying logic would stay the same, I'd just need to switch out the way in
 which the user is entering values.
 
 - Text fields to accept user input
 - No more `readline` or `process.exit`
 - `console.log` is replaced with state updates in the UI (perhaps something like a fade in/out of the values to represent updates) 

#### 2. What steps would you take to make the app "production ready"?
Certainly would need to have input validation that prevents abuse. I don't check that values are actually numbers before using them.
Also, everything here is being done in memory, so there are opportunities to persist the app state in a database to prevent data loss.
I'd also suggest calculating all of the Fib numbers ahead of time and comparing user input without needing to evaluate it each time.
A simple map would make that a constant time look-up. 

#### 3. Thoughts on this coding test? Suggestions?
I thought it was actually really interesting and not what I expected at all! I'm glad I picked a console app as it's not something I
would typically get to work with. There were a few interesting problems in here and I think the spec forces you to really pay
attention and make sure you're catching all of the details.

Nothing in particular that I'd like to see changed - I can see why you'd use this to assess candidates.