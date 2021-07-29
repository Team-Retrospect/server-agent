# retrospect-server-agent

Retrospect Server Agent is a node.js package for auto instrumenting a Node application and for providing custom baggage from the frontend events to the backend tracing.

Follow the installation and setup for each service in your application.

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/). Installation is done using the [npm install command](https://docs.npmjs.com/downloading-and-installing-packages-locally):

```
$ npm install retrospect-server-agent
```

<br>

## Configuring Backend Tracing

1.  Import this package into the main file that handles your service startup with the following:

    ```js
    const customBaggage = require("[our package name]");
    ```

2.  Load this package as middleware:

    ```js
    app.use(customBaggage);
    ```

    - Important Note: You may load this middleware after loading `app.use(cors()` and `app.use(express.json())` middleware but it must be before laoding your application routes.

    - Example:

      ```js
      const cors = require("cors");
      const express = require("express");
      const app = express();

      const customBaggage = require("[add our package name here]");

      app.use(cors());

      app.use(customBaggage);

      const port = 3000;

      app.get("/", function (req, res, next) {
        //
      });

      //....
      ```

      <br>

3.  Edit the `config.json` file inside `[add package name here]` package folder in `node_modules`.

    ### Configuration Options

    - `serviceName`: adds the name of your service to tracing data.

    - `rootEntryPoint`:

    - `dbOptions`: configuration settings for auto instrumenting available databases.

      - `mongodb`: set to `true` if your service uses `mongodb` which will enable instrumentation on mongodb queries. Otherwise set it to `false`.

      - `redis`: set to `true` if your service uses `mongodb` which will enable instrumentation on redis queries. Otherwise set it to `false`.

    - `endpoint`: configures the backend tracing data to be sent to a backend that is provided by `[add our group backend name here and link to docker compose repo]`

    <br>

    ### Configuration Steps

    - Edit the `serviceName` property to contain the name of your service.

    - Edit the `rootEntryPoint` property to contain the name of your service startup file.

    - For each property in the `dbOptions` object, change the value to `true` if your service queries the listed database.

    - Edit the `endpoint` property to contain the name of the `[add group name and link here]` UI backend. Leave the provided port `80` in the value.

    <br>

    ### Example of `config.js` using a domain as a endpoint

    ```json
    {
      "serviceName": "payment-server",
      "rootEntryPoint": "index.js",
      "dbOptions": {
        "mongodb": true,
        "redis": false
      },
      "endpoint": "https://myawesomeapp.com:80"
    }
    ```

    <br>

    ### Example of `config.js` using docker locally

    ```json
    {
      "serviceName": "payment-server",
      "rootEntryPoint": "index.js",
      "dbOptions": {
        "mongodb": true,
        "redis": false
      },
      "endpoint": "http://localhost:80"
    }
    ```

4.  Update the `trace` script in service `package.json` file by appending the name of your service startup file.

    ```json
      "trace": "node -r textrix-server/tracing.js nameOfYourStartupFile.js"
    ```

5.  Start your application by calling the `trace` script.

<br>

## FAQ

<br>

## License
