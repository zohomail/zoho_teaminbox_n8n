import { isINodeProperties, type INodeProperties } from 'n8n-workflow';

export const messageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		required: true,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['message'],
			},
		},
		options: [
			{
				name: 'Send Email',
				value: 'sendemail',
				description: 'Create and send a new email.',
				action: 'Send Email',
			},
		],
		default: 'sendemail',
	},
];

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		required: true,
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Create Contact',
				value: 'createcontact',
				description: 'Creates a new contact',
				action: 'Create Contact',
			},
		],
		default: 'createcontact',
	},
];

export const  messageActionFields: INodeProperties[] = [
	{
		displayName: 'Organization',
		name: 'workspaceid',
		type: 'options',
		default: '',
		description: 'Select your organization in Zoho TeamInbox',
		hint: 'Select your organization in Zoho TeamInbox',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListWorkspace',
        },
		required: true,
	},
	{
		displayName: 'Team',
		name: 'teamid',
		type: 'options',
		default: '',
		description: 'Select your team',
		hint: 'Select your team',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListTeam',
			loadOptionsDependsOn: ['workspaceid']
        },
		required: true,
	},
	{
		displayName: 'Inbox',
		name: 'channelid',
		type: 'options',
		default: '',
		description: 'Select the inbox you want to send the email from',
		hint: 'Select the inbox you want to send the email from',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListInbox',
			loadOptionsDependsOn: ['teamid']
        },
		required: true,
	},
	{
		displayName: 'From',
		name: 'formaddress',
		type: 'options',
		default: '',
		description: 'Select the From address',
		hint: 'Select the From address',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListFrom',
			loadOptionsDependsOn: ['workspaceid']
        },
		required: true,
	},
	{
		displayName: 'To',
		name: 'toaddress',
		type: 'string',
		default: '',
		description: 'Enter To addresses, separated by commas.',
		hint: 'Enter To addresses, separated by commas.',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail'],
			},
		},
		required: true,
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		default: '',
		description: 'Enter the subject line',
		hint: 'Enter the subject line',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail'],
			},
		},
		required: true,
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		default: '',
		description: 'Enter the email content',
		hint: 'Enter the email content',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail'],
			},
		},
		required: true,
	},
	{
		displayName: 'CC',
		name: 'ccaddress',
		type: 'string',
		default: '',
		description: 'Enter CC addresses, separated by commas.',
		hint: 'Enter CC addresses, separated by commas.',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail'],
			},
		},
	},
	{
		displayName: 'BCC',
		name: 'bccaddress',
		type: 'string',
		default: '',
		description: 'Enter BCC addresses, separated by commas.',
		hint: 'Enter BCC addresses, separated by commas.',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendemail'],
			},
		},
	},
];

export const  contactActionFields: INodeProperties[] = [
	{
		displayName: 'Organization',
		name: 'workspaceid',
		type: 'options',
		default: '',
		description: 'Select your organization in Zoho TeamInbox',
		hint: 'Select your organization in Zoho TeamInbox',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['createcontact'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListWorkspace',
        },
		required: true,
	},
	{
		displayName: 'Team',
		name: 'teamid',
		type: 'options',
		default: '',
		description: 'Select your team',
		hint: 'Select your team',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['createcontact'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListTeam',
			loadOptionsDependsOn: ['workspaceid']
        },
		required: true,
	},
	{
		displayName: 'Contact Name',
		name: 'contactname',
		type: 'string',
		default: '',
		description: 'Enter the contact name',
		hint: 'Enter the contact name',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['createcontact'],
			},
		},
		required: true,
	},
	{
		displayName: 'Email Address',
		name: 'emailaddress',
		type: 'string',
		default: '',
		description: 'Enter the contact email address',
		hint: 'Enter the contact email address',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['createcontact'],
			},
		},
		required: true,
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'Enter a description',
		hint: 'Enter a description',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['createcontact'],
			},
		},
	},
	{
		displayName: 'Mobile Number',
		name: 'mobilenumber',
		type: 'string',
		default: '',
		description: 'Enter the contact phone number',
		hint: 'Enter the contact phone number',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['createcontact'],
			},
		},
	},
];

export const messageTriggerFields: INodeProperties[] = [
	{
		displayName: 'Organization',
		name: 'workspaceid',
		type: 'options',
		default: '',
		description: 'Select your organization in Zoho TeamInbox ',
		hint: 'Select your organization in Zoho TeamInbox ',
		displayOptions: {
			show: {
				tiggermessage: ['newmessage'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListWorkspace',
        },
		required: true,
	},
	{
		displayName: 'Team',
		name: 'teamid',
		type: 'options',
		default: '',
		description: 'Select your team',
		hint: 'Select your team',
		displayOptions: {
			show: {
				tiggermessage: ['newmessage'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListTeam',
			loadOptionsDependsOn: ['workspaceid']
        },
		required: true,
	},
	{
		displayName: 'Inbox',
		name: 'channelid',
		type: 'options',
		default: '',
		description: 'Select the inbox you want to create the rule in ',
		hint: 'Select the inbox you want to create the rule in ',
		displayOptions: {
			show: {
				tiggermessage: ['newmessage'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListInbox',
			loadOptionsDependsOn: ['teamid']
        },
		required: true,
	},
	{
		displayName: 'Event',
		name: 'event',
		type: 'multiOptions',
		default: [],
		description: 'Select the event that should trigger the zap',
		hint: 'Select the event that should trigger the zap',
		displayOptions: {
			show: {
				tiggermessage: ['newmessage'],
			},
		},
		options: [
			{
				name: 'Outbound message',
				value: "2",
			},
			{
				name: 'Outbound reply',
				value: "3",
			},
			{
				name: 'Inbound message',
				value: "5",
			},
			{
				name: 'Inbound reply',
				value: "6",
			}
		],
		required: true,
	},
	{
		displayName: 'Matching Condition',
		name: 'matching',
		type: 'options',
		default: "2",
		description: 'Select the matching condition ',
		hint: 'Select the matching condition ',
		displayOptions: {
			show: {
				tiggermessage: ['newmessage'],
			},
		},
		options: [
			{
				name: 'OR',
				value: "1",
			},
			{
				name: 'AND',
				value: "2",
			},
		],
	},
	{
		displayName: 'Assignee',
		name: 'assignee',
		type: 'options',
		default: '',
		description: 'Select the assignee',
		hint: 'Select the assignee',
		displayOptions: {
			show: {
				tiggermessage: ['newmessage'],
			},
		},
		typeOptions: {
            loadOptionsMethod: 'getListAssignee',
			loadOptionsDependsOn: ['teamid']
        },
	},
	{
		displayName: 'From',
		name: 'from',
		type: 'string',
		default: '',
		description: 'Enter the From address',
		hint: 'Enter the From address ',
		displayOptions: {
			show: {
				tiggermessage: ['newmessage'],
			},
		},
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'string',
		default: '',
		description: 'Enter the To address',
		hint: 'Enter the To address',
		displayOptions: {
			show: {
				tiggermessage: ['newmessage'],
			},
		},
	},
	{
		displayName: 'CC',
		name: 'cc',
		type: 'string',
		default: '',
		description: 'Enter the CC address',
		hint: 'Enter the CC address',
		displayOptions: {
			show: {
				tiggermessage: ['newmessage'],
			},
		},
	},
    {
		displayName: 'Subject contains',
		name: 'subject',
		type: 'string',
		default: '',
		description: 'Enter the subject line',
		hint: 'Enter the subject line',
		displayOptions: {
			show: {
				tiggermessage: ['newmessage'],
			},
		},
	},
	{
		displayName: 'Message body contains',
		name: 'messagebody',
		type: 'string',
		default: '',
		description: 'Enter the email content',
		hint: 'Enter the email content',
		displayOptions: {
			show: {
				tiggermessage: ['newmessage'],
			},
		},
	},
	{
		displayName: 'Rule Name',
		name: 'rulename',
		type: 'string',
		default: 'N8N Integration',
		description: 'Enter a name for the rule',
		hint: 'Enter a name for the rule ',
		displayOptions: {
			show: {
				tiggermessage: ['newmessage'],
			},
		},
	},
];