import type { GatsbyConfig } from "gatsby"

/* eslint-disable */

const assert = require('assert');
const appConfig = require('./appConfig');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
 });
/* require('dotenv').config(); */

const getEnv = (env: { [x: string]: any; }, key: string | number) => {
  assert(
    env[key],
    `Please add the value for ${key} in your environment variables.`,
  );

  return env[key];
};

const { theme, spreadsheetLink, ...siteMetadata } = appConfig;

//const spreadsheetId =
//  spreadsheetLink.split('/')[spreadsheetLink.split('/').length - 2];

// Extract spreadsheet ID from the URL
const extractSpreadsheetId = (url: string): string => {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : '';
};

const spreadsheetId = process.env.SPREADSHEET_ID || extractSpreadsheetId(spreadsheetLink);

// Debug logging
//console.log('=== GATSBY CONFIG DEBUG ===');
//console.log('Spreadsheet Link:', spreadsheetLink);
//console.log('Extracted Spreadsheet ID:', spreadsheetId);
//console.log('Environment SPREADSHEET_ID:', process.env.SPREADSHEET_ID);
//console.log('Google API Key present:', !!process.env.GOOGLE_API_KEY);
//console.log('Google API Key (first 10 chars):', process.env.GOOGLE_API_KEY?.substring(0, 10));
//console.log('============================');

const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: `https://calendar.venehindustrial.site`,
    title: appConfig.title,
    subTitle: appConfig.subTitle,
    formLink: appConfig.formLink,
    limitMonthInTheFuture: appConfig.limitMonthInTheFuture,
    // Add any other fields you might need
    spreadsheetLink: appConfig.spreadsheetLink,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    `gatsby-plugin-typescript`,
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-source-google-spreadsheets',
      options: {
        //spreadsheetId: process.env.SPREADSHEET_ID,
        spreadsheetId,
        apiKey: process.env.GOOGLE_API_KEY,
        // Add additional options for better debugging
        worksheetTitle: 'Sheet1',   // Specify the worksheet name if known
        typePrefix: 'GoogleEvents', // This will create allGoogleEventsSheet
        downloadImages: false,      // Disable image download for faster builds
        credentials: {
          type: 'service_account',
          project_id: getEnv(process.env, 'PROJECT_ID'),
          private_key_id: getEnv(process.env, 'PRIVATE_KEY_ID'),
          private_key: getEnv(process.env, 'PRIVATE_KEY').replace(
            /(\\r)|(\\n)/g,
            '\n',
          ),
          client_email: getEnv(process.env, 'CLIENT_EMAIL'),
          client_id: '',
          auth_uri: 'https://accounts.google.com/o/oauth2/auth',
          token_uri: 'https://oauth2.googleapis.com/token',
          auth_provider_x509_cert_url:
            'https://www.googleapis.com/oauth2/v1/certs',
          client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${getEnv(
            process.env,
            'CLIENT_EMAIL',
          )}`,
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/media`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'gatsby-starter-event-calendar',
        short_name: 'starter-calendar',
        start_url: '/',
        background_color: theme.background,
        theme_color: theme.brand,
        display: 'minimal-ui',
        icon: 'media/icon.svg',
      },
    },
  ],
}

export default config
