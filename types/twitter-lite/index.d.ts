// Copied from https://github.com/draftbit/twitter-lite/pull/63
/** 
 * Typings for twitter-lite 
 * 
 * @version 0.9.4
 * @author Floris de Bijl <@fdebijl>
*/

/// <reference types="node" />


declare module 'twitter-lite' {

  import { EventEmitter } from 'events';
  import * as OAuth from 'oauth-1.0a';

  interface TwitterOptions {
    /** "api" is the default (change for other subdomains) */
    subdomain?: string;
    /** version "1.1" is the default (change for other subdomains) */
    version?: string;
    /** consumer key from Twitter. */
    consumer_key: string;
    /** consumer secret from Twitter */
    consumer_secret: string;
    /** access token key from your User (oauth_token) */
    access_token_key?: OauthToken;
    /** access token secret from your User (oauth_token_secret) */
    access_token_secret?: OauthTokenSecret;
  }

  type OauthToken = string;
  type OauthTokenSecret = string;
  type AuthType = 'App' | 'User';

  interface KeySecret {
    key: string;
    secret: string;
  }

  interface AccessTokenOptions extends KeySecret {
    /** If using the OAuth web-flow, set this parameter to the value of the oauth_verifier returned in the callback URL. If you are using out-of-band OAuth, set this value to the pin-code. */
    verifier: string | number;
  }

  interface BearerResponse {
    token_type: 'bearer';
    access_token: string;
  }

  interface TokenResponse {
    oauth_token: OauthToken;
    oauth_token_secret: OauthTokenSecret;
  }

  interface AccessTokenResponse extends TokenResponse {
    user_id: number;
    screen_name: string;
  }

  interface Tweet {
    created_at: string;
    id: Number;
    id_str: string;
    text: string;
    // And so on, see https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/tweet-object
  }

  interface StatusUpdateParams {
    status: string;
    in_reply_to_status_id?: string;
    auto_populate_reply_metadata?: boolean;
    exclude_reply_user_ids?: string;
    attachment_url?: string;
    media_ids?: string;
    possibly_sensitive?: boolean;
    lat?: number;
    long?: number;
    place_id?: string;
    display_coordinates?: boolean;
    trim_user?: boolean;
    enable_dmcommands?: boolean;
    fail_dmcommands?: boolean;
    card_uri?: string;
  }

  interface StatusesUserTimelineParams {
    user_id?: string;
    screen_name?: string;
    since_id?: string;
    count?: number;
    max_id?: string;
    trim_user?: boolean;
    exclude_replies?: boolean;
    include_rts?: boolean;
  }

  class Twitter {
    #authType: AuthType;
    #url: string;
    #oauth: string;
    #config: TwitterOptions;
    #client: OAuth;
    #token: KeySecret;

    constructor(options: TwitterOptions);

    /**
     * Parse the JSON from a Response object and add the Headers under `_headers`
     */
    private static _handleResponse(response: Response): Promise<object>;

    getBearerToken(): Promise<BearerResponse>;

    /** The value you specify here will be used as the URL a user is redirected to should they approve your application's access to their account. Set this to oob for out-of-band pin mode. */
    getRequestToken(twitterCallbackUrl: string | 'oob'): Promise<TokenResponse>;

    getAccessToken(options: AccessTokenOptions): Promise<AccessTokenResponse>;

    /**
     * Construct the data and headers for an authenticated HTTP request to the Twitter API
     * @param {string} resource - the API endpoint
     */
    private _makeRequest(method: 'GET' | 'POST' | 'PUT', resource: string, parameters: object): { requestData: { url: string; method: string; }; headers: ({ Authorization: string; } | OAuth.Header); };


    /**
     * Send a GET request
     * @param {string} resource - endpoint, e.g. `followers/ids`
     * @param {object} [parameters] - optional parameters
     * @returns {Promise<object>} Promise resolving to the response from the Twitter API.
     *   The `_header` property will be set to the Response headers (useful for checking rate limits)
     */
    public get(resource: string, parameters?: object): Promise<Object>
    public get(resource: 'statuses/user_timeline', parameters: StatusesUserTimelineParams): Promise<Tweet[]>

    /**
     * Send a POST request
     * @param {string} resource - endpoint, e.g. `users/lookup`
     * @param {object} body - POST parameters object.
     *   Will be encoded appropriately (JSON or urlencoded) based on the resource
     * @returns {Promise<object>} Promise resolving to the response from the Twitter API.
     *   The `_header` property will be set to the Response headers (useful for checking rate limits)
     */
    public post(resource: string, body: object): Promise<object>
    public post(resource: 'statuses/update', body: StatusUpdateParams): Promise<Tweet>

    /**
     * Send a PUT request 
     * @param {string} resource - endpoint e.g. `direct_messages/welcome_messages/update`
     * @param {object} parameters - required or optional query parameters
     * @param {object} body - PUT request body 
     * @returns {Promise<object>} Promise resolving to the response from the Twitter API.
     */
    public put(resource: string, parameters: object, body: object): Promise<object>

    /**
     * 
     * @param {string} resource - endpoint, e.g. `statuses/filter`
     * @param {object} parameters
     * @returns {Stream}
     */
    public stream(resource: string, parameters: object): Stream;
  }
  export default Twitter;

  class Stream extends EventEmitter {
    constructor();

    parse(buffer: Buffer): void;
  }
}
