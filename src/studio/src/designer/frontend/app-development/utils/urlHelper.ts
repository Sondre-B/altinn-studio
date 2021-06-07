const {
  location, org, repo,
} = window as Window as IAltinnWindow;
const { origin } = location;

export const repoStatusUrl = `${origin}/designerapi/Repository/RepoStatus?org=${org}&repository=${repo}`;
export const releasesPostUrl = `${origin}/designer/api/v1/${org}/${repo}/releases`;
export const releasesGetUrl = `${releasesPostUrl}?sortBy=created&sortDirection=Descending`;
export const languageUrl = `${origin}/designerapi/Language/GetLanguageAsJSON`;
export const orgsListUrl = 'https://altinncdn.no/orgs/altinn-orgs.json';

export const getReleaseBuildPipelineLink = (buildId: string) => `https://dev.azure.com/brreg/altinn-studio/_build/results?buildId=${buildId}`;

export const getGitCommitLink = (commitId: string) => `${origin}/repos/${org}/${repo}/commit/${commitId}`;

export const getAzureDevopsBuildResultUrl = (buildId: string | number): string => {
  return `https://dev.azure.com/brreg/altinn-studio/_build/results?buildId=${buildId}`;
};

export const getEnvironmentsConfigUrl = (): string => {
  return 'https://altinncdn.no/config/environments.json';
};

export const getAppDeploymentsUrl = () => {
  return `${origin}/designer/api/v1/${org}/${repo}/Deployments`;
};

export const getFetchDataModelUrl = (modelName: string) => {
  return `${origin}/designer/api/${org}/${repo}/datamodels/GetDatamodel?modelName=${encodeURIComponent(modelName)}`;
};

export const getSaveDataModelUrl = (modelName: string) => {
  return `${origin}/designer/api/${org}/${repo}/datamodels/UpdateDatamodel?modelName=${encodeURIComponent(modelName)}`;
};

export const getDeleteDataModelUrl = (modelName: string) => {
  return `${origin}/designer/api/${org}/${repo}/datamodels/DeleteDatamodel?modelName=${encodeURIComponent(modelName)}`;
};

export const getFetchDeployPermissionsUrl = () => {
  return `${origin}/designer/api/v1/${org}/${repo}/deployments/permissions`;
};

export const getRemainingSessionTimeUrl = () => {
  return `${origin}/designer/api/v1/session/remaining`;
};

export const getKeepAliveUrl = () => {
  return `${origin}/designer/api/v1/session/keepalive`;
};

export const getGiteaSignOutUrl = () => {
  return `${origin}/repos/user/logout`;
};

export const getStudioSignOutUrl = () => {
  return `${origin}/Home/Logout`;
};
