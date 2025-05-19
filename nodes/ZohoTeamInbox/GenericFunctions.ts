import {
	IExecuteFunctions,
	IHookFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	JsonObject,
	IHttpRequestMethods,
	IRequestOptions,
	NodeOperationError,
	NodeApiError
} from 'n8n-workflow';
import {
	ZohoTeamInboxOAuth2ApiCredentials,
	LoadedLayoutsWorkspace,
	LoadedLayoutsTeam,
	LoadedLayoutsinbox,
	LoadedLayoutsFrom,
	LoadedLayoutsAssignee
} from './type'

export function throwOnErrorStatus(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	responseData: {
		error?: { error_description?: string },
		status?: { code: number };
	}
): void {
	const errorCode = responseData.status?.code;
	const errorDescription = responseData.error?.error_description;

	if ( errorCode !== 200 && (errorCode || errorDescription)) {
		const fullMessage = errorCode ? `${errorCode}: ${errorDescription ?? 'Zoho TeamInbox Internal error'}` : errorDescription ?? 'Zoho TeamInbox Internal error';
		throw new NodeOperationError(this.getNode(), fullMessage);
	}
}

export async function zohoteaminboxApiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	uri?: string,
) {
	const { oauthTokenData } = await this.getCredentials<ZohoTeamInboxOAuth2ApiCredentials>('zohoTeamInboxOAuth2Api');
	const options: IRequestOptions = {
		body: body,
		method,
		qs,
		uri: `https://teaminbox.${getDomain(oauthTokenData.api_domain)}/${endpoint}`,
		json: true,
	};
	if (!Object.keys(body).length) {
		delete options.body;
	}

	if (!Object.keys(qs).length) {
		delete options.qs;
	}
	try {
		const responseData = await this.helpers.requestOAuth2?.call(this, 'zohoTeamInboxOAuth2Api', options);
		if (responseData === undefined) return [];
	    throwOnErrorStatus.call(this, responseData as IDataObject);
		return responseData;
	} catch (error) {
		const args = error ? {
			message: error.error?.error?.error_description ?? 'The Zoho TeamInbox API returned an error',
			description: error.error?.status?.description ?? 'No additional information provided.',
		} : undefined;
		throw new NodeApiError(this.getNode(), error as JsonObject, args);
	}
}

export async function getPicklistWorkspaceOptions(
	this: ILoadOptionsFunctions,
) {
	const responseData = (await zohoteaminboxApiRequest.call(
		this,
		'GET',
		'api/v1/workspaces',
		{}
	)) as LoadedLayoutsWorkspace;

	const pickListOptions = responseData.data


	if (!pickListOptions) return [];

	return pickListOptions.map((option) => ({
		name: option.name,
		value: option.soid,
	}));
}

export async function getPicklistTeamOptions(
	this: ILoadOptionsFunctions,
	targetField: string
) {
	const responseData = (await zohoteaminboxApiRequest.call(
		this,
		'GET',
		`api/v1/workspaces/${targetField}/teams`,
		{}
	)) as LoadedLayoutsTeam;

	const pickListOptions = responseData.data

	if (!pickListOptions) return [];

	return (pickListOptions as any[]).filter(option => option.team_type === "2").map(option => ({
        name: option.name,
        value: option.team_id,
    }));
}
export async function getPicklistInboxOptions(
	this: ILoadOptionsFunctions,
	workspace: string,
	team: string
) {
	const responseData = (await zohoteaminboxApiRequest.call(
		this,
		'GET',
		`api/workspaces/${workspace}/teams/${team}/inbox`,
		{}
	)) as LoadedLayoutsinbox;

	const pickListOptions = responseData.data
	

	if (!pickListOptions) return [];

	return pickListOptions.map((option) => ({
		name: option.name,
		value: option.id,
	}));
}	
export async function getPicklistFromOptions(
	this: ILoadOptionsFunctions,
	workspace: string,
) {
	const responseData = (await zohoteaminboxApiRequest.call(
		this,
		'GET',
		`api/workspaces/${workspace}/channel/outgoing`,
		{}
	)) as LoadedLayoutsFrom;

	const pickListOptions = responseData.data.outgoing_channels


	if (!pickListOptions) return [];

	return pickListOptions.map((option) => ({
		name: option.name,
		value: option.source,
	}));
}
export async function getPicklistAssigneeOptions(
	this: ILoadOptionsFunctions,
	workspace: string,
	team: string
) {
	const responseData = (await zohoteaminboxApiRequest.call(
		this,
		'GET',
		`api/workspaces/${workspace}/teams/${team}/users`,
		{}
	)) as LoadedLayoutsAssignee;

	const pickListOptions = responseData.data


	if (!pickListOptions) return [];

	return pickListOptions.map((option) => ({
		name: option.name,
		value: option.zuid,
	}));
}

export function getDomain(domain: string): string | undefined {
    const value: { [key: string]: string } = {
        ".com": "zoho.com",
        ".eu": "zoho.eu",
        ".com.cn": "zoho.com.cn",
        ".com.au": "zoho.com.au",
        ".in": "zoho.in",
        ".ca": "zohocloud.ca",
        ".sa": "zoho.sa",
        ".jp": "zoho.jp"
    };
    const suffixes = new Set(Object.keys(value));
    for (const key of suffixes) {
        if (domain.endsWith(key)) {
            return value[key];
        }
    }
    return undefined;
}	
  