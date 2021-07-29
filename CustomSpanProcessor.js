const { propagation } = require("@opentelemetry/api");
const { BatchSpanProcessor } = require("@opentelemetry/tracing");

class CustomSpanProcessor extends BatchSpanProcessor {
  onStart(span, context) {
    let baggage = propagation.getBaggage(context);

    if (baggage) {
      baggage.getAllEntries().forEach(entry => {
        span.setAttribute(entry[0], entry[1].value);
      })
    }
  }
}

module.exports = CustomSpanProcessor;