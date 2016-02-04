# Specification for d3.timeSeries()

- d3.**timeSeries**()

  Create a new time series module with default configurations

- **timeSeries**(*selection*)

  Apply the time series to a selection. The selection must be a `div` element with an array of time objects bound to it. An example might look like:
  ```
  var selection = d3.append('div')
    .datum(someData);
    
  timeSeries(selection);
  ```
  ...which is exactly the same as
  ```
  d3.append('div')
    .datum(someData)
    .call(timeSeries);
  ```

