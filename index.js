const { trace, context, propagation } = require('@opentelemetry/api');

function customBaggage(req, res, next) {
  let headers = req.headers;
  let chapterId = headers['x-chapter-id'];
  let sessionId = headers['x-session-id'];
  let userId = headers['x-user-id'];
  let triggerRoute = headers['x-triggerroute'];
  let requestData = headers['x-requestdata'];

  let currentSpan = trace.getSpan(context.active());
  currentSpan.setAttribute('frontendChapter', chapterId);
  currentSpan.setAttribute('frontendSession', sessionId);
  currentSpan.setAttribute('frontendUser', userId);
  currentSpan.setAttribute('triggerRoute', triggerRoute);
  currentSpan.setAttribute('requestData', requestData);

  const baggage =
    propagation.getBaggage(context.active()) || propagation.createBaggage();

  const updatedBaggage = baggage
    .setEntry('frontendChapter', { value: chapterId })
    .setEntry('frontendSession', { value: sessionId })
    .setEntry('frontendUser', { value: userId })
    .setEntry('triggerRoute', { value: triggerRoute })
    .setEntry('requestData', { value: requestData });

  const newContext = propagation.setBaggage(context.active(), updatedBaggage);
  context.with(newContext, next);
}

module.exports = customBaggage;