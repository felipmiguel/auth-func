import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {DefaultAzureCredential} from "@azure/identity"
import { SecretClient } from "@azure/keyvault-secrets";

const credential = new DefaultAzureCredential();

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    const secretClient = new SecretClient("https://kv4funcs.vault.azure.net/", credential);
    const secret =await secretClient.getSecret("secret1");
    const token = await credential.getToken('https://vault.azure.net/.default');
    
    let responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    responseMessage = responseMessage + " This is a secret retrieved from Key Vault. " + secret.name + "=" + secret.value + "\n token: \n" + token.token;
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };

};

export default httpTrigger;