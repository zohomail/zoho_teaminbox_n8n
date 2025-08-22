import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ZohoTeamInboxOAuth2Api implements ICredentialType {
	name = 'zohoTeamInboxOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Zoho TeamInbox OAuth2 API';

	documentationUrl = 'https://www.zoho.com/teaminbox/help/integration-with-n8n.html';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'options',
			options: [
				{
					name: 'AU - https://accounts.zoho.com.au/oauth/v2/auth',
					value: 'https://accounts.zoho.com.au/oauth/v2/auth'
				},
				{
					name: 'CN - https://accounts.zoho.com.cn/oauth/v2/auth',
					value: 'https://accounts.zoho.com.cn/oauth/v2/auth'
				},
				{
					name: 'EU - https://accounts.zoho.eu/oauth/v2/auth',
					value: 'https://accounts.zoho.eu/oauth/v2/auth'
				},
				{
					name: 'IN - https://accounts.zoho.in/oauth/v2/auth',
					value: 'https://accounts.zoho.in/oauth/v2/auth'
				},
				{
					name: 'US - https://accounts.zoho.com/oauth/v2/auth',
					value: 'https://accounts.zoho.com/oauth/v2/auth'
				},
				{
					name: 'CA - https://accounts.zohocloud.ca/oauth/v2/auth',
					value: 'https://accounts.zohocloud.ca/oauth/v2/auth'
				},
				{
					name: 'SA - https://accounts.zoho.sa/oauth/v2/auth',
					value: 'https://accounts.zoho.sa/oauth/v2/auth'
				},
				{
					name: 'JP - https://accounts.zoho.jp/oauth/v2/auth',
					value: 'https://accounts.zoho.jp/oauth/v2/auth',
				}
			],
			default: 'https://accounts.zoho.com/oauth/v2/auth',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'options',
			options: [
				{
					name: 'AU - https://accounts.zoho.com.au/oauth/v2/token',
					value: 'https://accounts.zoho.com.au/oauth/v2/token'
				},
				{
					name: 'CN - https://accounts.zoho.com.cn/oauth/v2/token',
					value: 'https://accounts.zoho.com.cn/oauth/v2/token'
				},
				{
					name: 'EU - https://accounts.zoho.eu/oauth/v2/token',
					value: 'https://accounts.zoho.eu/oauth/v2/token'
				},
				{
					name: 'IN - https://accounts.zoho.in/oauth/v2/token',
					value: 'https://accounts.zoho.in/oauth/v2/token'
				},
				{
					name: 'US - https://accounts.zoho.com/oauth/v2/token',
					value: 'https://accounts.zoho.com/oauth/v2/token'
				},
				{
					name: 'CA - https://accounts.zohocloud.ca/oauth/v2/token',
					value: 'https://accounts.zohocloud.ca/oauth/v2/token'
				},
				{
					name: 'SA - https://accounts.zoho.sa/oauth/v2/token',
					value: 'https://accounts.zoho.sa/oauth/v2/token'
				},
				{
					name: 'JP - https://accounts.zoho.jp/oauth/v2/token',
					value: 'https://accounts.zoho.jp/oauth/v2/token',
				}
			],
			default: 'https://accounts.zoho.com/oauth/v2/token',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'TeamInbox.workspace.ALL,TeamInbox.workspace.team.ALL,TeamInbox.workspace.channel.ALL,TeamInbox.workspace.conversation.ALL',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: 'access_type=offline',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
	];
}
