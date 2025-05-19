import {
    IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	INodeType,
	INodeTypeDescription,
    IWebhookResponseData,   
} from 'n8n-workflow';

import {
    getPicklistWorkspaceOptions,
    getPicklistTeamOptions,
    getPicklistInboxOptions,
    getPicklistAssigneeOptions,
    zohoteaminboxApiRequest
} from './GenericFunctions';

import {
    messageTriggerFields
} from './descriptions';

import {  NodeConnectionType } from 'n8n-workflow';

export class ZohoTeamInboxTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zoho TeamInbox Trigger',
		name: 'zohoTeamInboxTrigger',
		icon: 'file:ZohoTeamInbox.png',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when Zoho TeamInbox rules occur',
		defaults: {
			name: 'Zoho TeamInbox Trigger',
		},
		credentials: [
			{
				name: 'zohoTeamInboxOAuth2Api',
				required: true,
			},
		],
		inputs: [],
		outputs: [NodeConnectionType.Main],
        webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
        properties: [
			{
				displayName: 'Trigger On',
				name: 'tiggermessage',
				type: 'options',
				default: '',
				required: true,
				options: [
					{
						name: 'New Message',
						value: 'newmessage',
						description: 'Triggers when a new message is received or sent that matches given conditions.',
					},
                ]
			},
            ...messageTriggerFields
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
            async getListAssignee(this: ILoadOptionsFunctions) {
				const workspace = this.getCurrentNodeParameter('workspaceid') as string;
                const team = this.getCurrentNodeParameter('teamid') as string;
				return await getPicklistAssigneeOptions.call(this, workspace.toString(), team.toString());
			},
        }
    };
    webhookMethods = {
        default: {
            async checkExists(this: IHookFunctions): Promise<boolean> {
                const webhookUrl = this.getNodeWebhookUrl('default');
                const webhookData = this.getWorkflowStaticData('node');
                const workspace = this.getNodeParameter('workspaceid');
                const team = this.getNodeParameter('teamid');

                const endpoint = `api/workspaces/${workspace}/teams/${team}/rules`;
                const collection = await zohoteaminboxApiRequest.call(this, 'GET', endpoint, {}, {});
                for (const rule of collection.data) {
                    for (const action of rule.actions) {
                        if (action.type === "11" && action.value === webhookUrl) {
                            webhookData.webhookURI = action.value;
                            return true;
                        }
                    }
                }
                return false;
            },	
            async create(this: IHookFunctions): Promise<boolean> {
                const webhookData = this.getWorkflowStaticData('node');
                const webhookUrl = this.getNodeWebhookUrl('default');
        
                const body: IDataObject = {
                    actions: '[{ "type": "11", "value": "' + webhookUrl +'"}]',
                    events: this.getNodeParameter('event'),
                    matching: this.getNodeParameter('matching'),
                    rule_name: this.getNodeParameter('rulename'),
                    status: 'ENABLED'
                }
                var conditionArray = [
                    {"type":"100", "op":"1", "value": this.getNodeParameter('channelid')}
                ]
                
                if (this.getNodeParameter('assignee') !== '' && this.getNodeParameter('assignee') !== undefined && this.getNodeParameter('assignee') !== null){
                    conditionArray.push({"type":"101", "op":"1", "value": this.getNodeParameter('assignee')});
                }
                if (this.getNodeParameter('from') !== '' && this.getNodeParameter('from') !== undefined && this.getNodeParameter('from') !== null){
                    conditionArray.push({"type":"102", "op":"2", "value": this.getNodeParameter('from')});
                }
                if (this.getNodeParameter('to') !== '' && this.getNodeParameter('to') !== undefined && this.getNodeParameter('to') !== null){
                    conditionArray.push({"type":"103", "op":"2", "value": this.getNodeParameter('to')});
                }
                if (this.getNodeParameter('cc') !== '' && this.getNodeParameter('cc') !== undefined && this.getNodeParameter('cc') !== null){
                    conditionArray.push({"type":"104", "op":"2", "value": this.getNodeParameter('cc')});
                }
                if (this.getNodeParameter('subject') !== '' && this.getNodeParameter('subject') !== undefined && this.getNodeParameter('subject') !== null){
                    conditionArray.push({"type":"106", "op":"2", "value": this.getNodeParameter('subject')});
                }
                if (this.getNodeParameter('messagebody') !== '' && this.getNodeParameter('messagebody') !== undefined && this.getNodeParameter('messagebody') !== null){
                    conditionArray.push({"type":"107", "op":"2", "value": this.getNodeParameter('messagebody')});
                }
                body.conditions = JSON.stringify(conditionArray)
                 
                const endpoint = `api/workspaces/${this.getNodeParameter('workspaceid')}/teams/${this.getNodeParameter('teamid')}/rules`;
                const responseData = await zohoteaminboxApiRequest.call(this, 'POST', endpoint, body,{});

                if (responseData.data === undefined || responseData?.data?.ruleId === undefined) {
                    return false;
                }
                webhookData.webhookURI = responseData.data.ruleId;
                return true;
            },

            async delete(this: IHookFunctions): Promise<boolean> {
                const webhookData = this.getWorkflowStaticData('node');
                const workspace = this.getNodeParameter('workspaceid');
                const team = this.getNodeParameter('teamid');

                if (webhookData.webhookURI !== undefined) {
                    try {
						const endpoint = `api/workspaces/${workspace}/teams/${team}/rules/${webhookData.webhookURI}`
                        await zohoteaminboxApiRequest.call(this, 'DELETE', endpoint, {}, {});
                    } catch (error) {
                        return false;
                    }
                    delete webhookData.webhookURI;
                }
                return true;
            },
        },
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const bodyData = this.getBodyData();
        return {
            workflowData: [this.helpers.returnJsonArray(bodyData)],
        };
    }

}