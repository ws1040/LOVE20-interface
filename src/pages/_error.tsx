import * as Sentry from '@sentry/nextjs';
import Error from 'next/error';
import type { NextPageContext } from 'next';

type ErrorProps = { statusCode: number };

const CustomErrorComponent = (props: ErrorProps) => {
  return <Error statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext): Promise<ErrorProps> => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData);

  // This will contain the status code of the response
  return (await Error.getInitialProps(contextData)) as ErrorProps;
};

export default CustomErrorComponent;
