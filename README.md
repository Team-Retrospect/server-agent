# retrospect-server-agent

Retrospect Server Agent is a node.js package for auto instrumenting a Node application and for providing custom baggage from the frontend events to the backend traces.

Follow the installation and setup for each service in your application.
<br>

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/). Installation is done using the [npm install command](https://docs.npmjs.com/downloading-and-installing-packages-locally):

```
$ npm install retrospect-server-agent
```

<br>

## Configuring Backend Tracing

1.  Import this package into the main file that handles your service startup with the following:

       ```js
        const customBaggage = require("retrospect-server-agent");
       ```

    <br>

2.  Load this package as middleware:

    ```js
    app.use(customBaggage);
    ```

    - Important Note: You may load this middleware after loading `app.use(cors())` but it must be loaded before your application routes.

    - Example:

      ```js
      const cors = require("cors");
      const express = require("express");
      const app = express();

      const customBaggage = require("retrospect-server-agent");

      app.use(cors());

      app.use(customBaggage);

      const port = 3000;

      app.get("/", function (req, res, next) {
        //
      });

      //....
      ```

      <br>

3.  Edit the `config.json` file inside `retrospect-server-agent` package folder in `node_modules`.

    ### Configuration Options

    - `serviceName`: adds the name of your service that this package is tracing.

    - `dbOptions`: configuration settings for auto instrumenting available databases.

      - `mongodb`: set to `true` if your service uses `mongodb` which will enable instrumentation on mongodb queries. Otherwise set it to `false`.

      - `redis`: set to `true` if your service uses `redis` which will enable instrumentation on redis queries. Otherwise set it to `false`.

    - `endpoint`: configures the backend tracing data to be sent to a backend which is provided by [Retrospect](https://github.com/Team-Retrospect/retrospect-api).

      - This api collects and transforms traces before storing them in Cassandra (also provided by Retrospect through a docker compose file). By default this api is listening on port 80.

      <br>

    ### Configuration Steps

    - Edit the `serviceName` property to contain the name of your service.

    - For each property in the `dbOptions` object, change the value to `true` if your service queries the listed database.

    - Edit the `endpoint` property to contain the location of the [Retrospect api](https://github.com/Team-Retrospect/retrospect-api).

      <br>

    ### Example of `config.js` using a domain as a endpoint

    ```json
    {
      "serviceName": "payment-service",
      "dbOptions": {
        "mongodb": true,
        "redis": false
      },
      "endpoint": "http://myapi.com"
    }
    ```

      <br>

    ### Example of `config.js` using an endpoint in docker locally

    ```json
    {
      "serviceName": "payment-service",
      "dbOptions": {
        "mongodb": true,
        "redis": false
      },
      "endpoint": "http://localhost"
    }
    ```

    <br>

4.  Update the `start` script in your service `package.json` file by appending the name of your service startup file.

       ```json
          "start": "node -r retrospect-server-agent/tracing.js nameOfYourStartupFile.js"
       ```

    <br>

5.  Start your application by calling the `start` script.
