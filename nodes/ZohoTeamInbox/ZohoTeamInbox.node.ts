import {
	type IExecuteFunctions,
	type IDataObject,
	type ILoadOptionsFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

import {
    messageOperations,
    contactOperations,
    messageActionFields,
    contactActionFields
} from './descriptions';

import {
	getPicklistWorkspaceOptions,
    getPicklistTeamOptions,
    getPicklistInboxOptions,
    getPicklistFromOptions,
    zohoteaminboxApiRequest
} from './GenericFunctions';

export class ZohoTeamInbox implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zoho TeamInbox',
		name: 'zohoTeamInbox',
		icon: 'file:ZohoTeamInbox.png',
		group: ['transform'],
		subtitle: '={{$parameter["operation"]}}',
		version: 1,
		description: 'Consume Zoho TeamInbox API',
		defaults: {
			name: 'Zoho TeamInbox',
		},
		usableAsTool: true,
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'zohoTeamInboxOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
                required: true,
				options: [
					{
						name: 'Message',
						value: 'message',
					},
                    {
                        name: 'Contact',
                        value: 'contact'
                    },
				],
				default: 'message',
			},
            ...messageOperations,
            ...messageActionFields,
            ...contactOperations,
            ...contactActionFields
        ],
	};
    methods = {
		loadOptions: {
            async getListWorkspace(this: ILoadOptionsFunctions) {
				return await getPicklistWorkspaceOptions.call(this);
			},
            async getListTeam(this: ILoadOptionsFunctions) {
				const workspace = this.getCurrentNodeParameter('workspaceid') as string;
				return await getPicklistTeamOptions.call(this, workspace.toString());
			},
            async getListInbox(this: ILoadOptionsFunctions) {
				const workspace = this.getCurrentNodeParameter('workspaceid') as string;
                const team = this.getCurrentNodeParameter('teamid') as string;
				return await getPicklistInboxOptions.call(this, workspace.toString(), team.toString());
			},
            async getListFrom(this: ILoadOptionsFunctions) {
				const workspace = this.getCurrentNodeParameter('workspaceid') as string;
				return await getPicklistFromOptions.call(this, workspace.toString());
			},
        }
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		let responseData;

		for (let i = 0; i < items.length; i++) {

			try {
				if (resource === 'message') {
					// **********************************************************************
					//                                Message
					// **********************************************************************

					if (operation === 'sendemail') {
						// ----------------------------------------
						//             event: Send Mail
						// ----------------------------------------

                        const body: IDataObject = {
							fromAddress: this.getNodeParameter('formaddress', i),
                            toAddress: this.getNodeParameter('toaddress', i),
                            subject: this.getNodeParameter('subject',i),
							entity_type: "1",
                            encoding: "UTF-8",
                            mailFormat: "2",
                            archive: false
						};
                        if (this.getNodeParameter('content', i) !== '' && this.getNodeParameter('content', i) !== undefined && this.getNodeParameter('content', i) !== null){
                            body.text = this.getNodeParameter('content', i)
                        }
                        if (this.getNodeParameter('ccaddress', i) !== '' && this.getNodeParameter('ccaddress', i) !== undefined && this.getNodeParameter('ccaddress', i) !== null){
                            body.ccAddress = this.getNodeParameter('ccaddress',i);
                        }
                        if (this.getNodeParameter('bccaddress', i) !== '' && this.getNodeParameter('bccaddress', i) !== undefined && this.getNodeParameter('bccaddress', i) !== null){
                            body.bccAddress = this.getNodeParameter('bccaddress', i);
                        }
                        responseData = await zohoteaminboxApiRequest.call(this, 'POST', `api/v1/workspaces/${this.getNodeParameter('workspaceid', i)}/teams/${this.getNodeParameter('teamid', i)}/channels/${this.getNodeParameter('channelid', i)}/compose/mail`,body ,{});
						responseData = responseData.data;
                    }
                } 
                else if (resource === 'contact') {
                    // **********************************************************************
					//                                Contact
					// **********************************************************************

					if (operation === 'createcontact') {
						// ----------------------------------------
						//             event: Create Contact
						// ----------------------------------------
                        const body: IDataObject = {
							name: this.getNodeParameter('contactname', i),
                            email_id: this.getNodeParameter('emailaddress', i),
						};
                        if (this.getNodeParameter('description', i) !== '' && this.getNodeParameter('description', i) !== undefined && this.getNodeParameter('description', i) !== null){
                            body.description = this.getNodeParameter('description',i);
                        }
                        if (this.getNodeParameter('mobilenumber', i) !== '' && this.getNodeParameter('mobilenumber', i) !== undefined && this.getNodeParameter('mobilenumber', i) !== null){
                            body.mobile = this.getNodeParameter('mobilenumber', i);
                        }
                        responseData = await zohoteaminboxApiRequest.call(this, 'POST', `api/workspaces/${this.getNodeParameter('workspaceid', i)}/teams/${this.getNodeParameter('teamid', i)}/contacts`,body ,{});
						responseData = responseData.data;
                    }
                }	
            }
			catch (error) {
				if (this.continueOnFail()) {
                    returnData.push({ error: error.error_description, json: {} });
                    continue;
                }
                throw error;
            }
			const executionData = this.helpers.constructExecutionMetaData(
		        this.helpers.returnJsonArray(responseData as IDataObject),
		        { itemData: { item: i } }, );
	            returnData.push(...executionData);
		}
		return [returnData];          
    }
}