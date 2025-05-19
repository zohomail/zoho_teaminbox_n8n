
export type ZohoTeamInboxOAuth2ApiCredentials = {
	oauthTokenData: {
		api_domain: string;
	};
};
export type LoadedLayoutsWorkspace = {
	data: Array<{
		name: string;
		soid: string;
	}>;
};
export type LoadedLayoutsTeam = {
	data: Array<{
        name: string,
        team_id: string
    }>;
};
export type LoadedLayoutsinbox = {
    data: Array<{
        name: string,
        id: string
    }>;
}
export type LoadedLayoutsFrom = {
    data: {
        outgoing_channels: Array<{
            name: string,
            source: string
       }>;
    }
}
export type LoadedLayoutsAssignee = {
    data: Array<{
        name: string,
        zuid: string
    }>;
}