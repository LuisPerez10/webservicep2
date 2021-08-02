const { WebhookClient } = require('dialogflow-fulfillment');
const { respuestaDiagnostico } = require('../class/diagnostico');


const webhook = async(req, res = response) => {

    const agent = new WebhookClient({ request: req, response: res });

    console.log('webhook ok');


    console.log(agent.action);
    console.log(agent.contexts);
    var data = req.body;

    const MIN_SEQUENCE_LENGTH = 10;

    function s_autotest(agent) {
        let dfRequest = req.body;
        let isSlotFilling = !dfRequest.queryResult.allRequiredParamsPresent;
        if (!isSlotFilling) {


            let parameters = dfRequest.queryResult.parameters;

            let mensaje = respuestaDiagnostico(parameters);
            sendSSML(req, res, mensaje);

        }
        // sendSSML(req, res, "volvamos")

    }









    function s_quence(agent) {
        let dfRequest = req.body;
        let action = dfRequest.queryResult.action;
        switch (action) {
            case 'handle-sequence':
                handleSequence(dfRequest, res);
                break;
            case 'validate-sequence':
                validateSequence(dfRequest, res);
                break;
            default:
                res.json({
                    fulfillmentText: `Webhook for action "${action}" not implemented.`
                });
        }
    }


    function sendSSML(request, response, ssml) {
        // ssml = `<speak>${ssml}</speak>`;
        ssml = `${ssml}`;

        response.json({
            fulfillmentText: ssml
        });
        // }
    }


    function getOutputContext(request, name) {
        return request.queryResult.outputContexts.find(
            context => context.name.endsWith(`/contexts/${name}`)
        );
    }

    function handleSequence(request, response) {
        let parameters = request.queryResult.parameters;
        let isSlotFilling = !request.queryResult.allRequiredParamsPresent;
        let isEditing = getOutputContext(request, 'editing-sequence');
        console.log(request.queryResult.action + ': ' + JSON.stringify(parameters));

        if (isSlotFilling) {
            // Prompt the user for the sequence
            console.log('Entro isLotfilling', isSlotFilling);
            // let verbatim = `<prosody rate="slow"><say-as interpret-as="verbatim">${parameters.existing_sequence}</say-as></prosody>`;
            let verbatim = `${parameters.existing_sequence}`;

            if (!parameters.existing_sequence && !parameters.new_sequence) {
                // Initial prompt
                response.json({
                    // fulfillmentText: "What is your sequence? Please pause after a few characters so I can confirm as we go."
                    fulfillmentText: "¿Cuál es tu secuencia? Haga una pausa después de algunos caracteres para que pueda confirmar a medida que avanzamos."
                });
            } else if (!isEditing) {
                // Confirm what the system heard with the user. We customize the response
                // according to how many sequences we've heard to make the prompts less
                // verbose.
                if (!parameters.previous_sequence) {
                    // after the first input
                    sendSSML(request, response,
                        `Di "no" para corregirme en cualquier momento. De lo contrario, lo que viene después ${verbatim}`);
                } else if (parameters.existing_sequence.length < MIN_SEQUENCE_LENGTH) {
                    // we know there are more characters to go
                    // sabemos que hay más personajes por recorrer
                    sendSSML(request, response,
                        `${verbatim} ¿Que sigue?`);
                } else {
                    // podríamos tener todo lo que necesitamos
                    sendSSML(request, response,
                        `${verbatim} ¿Que sigue? O di "eso es todo".`);
                }
            } else {
                // User just said "no"
                sendSSML(request, response,
                    `Intentemoslo de nuevo. Que viene despuesLet's try again. What comes after ${verbatim}`);
            }
        } else {
            // Slot filling is complete.

            // Construct the full sequence.
            let sequence = (parameters.existing_sequence || '') + (parameters.new_sequence || '');

            // Trigger the follow up event to get back into slot filling for the
            // next sequence.
            console.log('continue-sequence');
            console.log(sequence);
            response.json({
                followupEventInput: {
                    name: 'continue-sequence',
                    parameters: {
                        existing_sequence: sequence,
                        previous_sequence: parameters.existing_sequence || ''
                    }
                }
            });

        }
    }

    function validateSequence(request, response) {
        let parameters = request.queryResult.parameters;
        // TODO: add logic to validate the sequence and customize your response
        let verbatim = `<say-as interpret-as="verbatim">${parameters.sequence}</say-as>`;
        sendSSML(request, response, `Thank you. Your sequence is ${verbatim}`);
    }



    let intentMap = new Map();
    intentMap.set('Sequence', s_quence);
    intentMap.set('Sequence-Edit', s_quence);
    intentMap.set('Sequence-Done', s_quence);
    intentMap.set('autotest', s_autotest);
    intentMap.set('autotest_fn', s_autotest);

    agent.handleRequest(intentMap);
}

module.exports = {
    webhook
}